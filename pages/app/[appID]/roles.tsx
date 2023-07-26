import Head from "next/head";
import styles from "../../../styles/roles.module.scss";
import dynamic from "next/dynamic";
import { startTransition, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  AddressTypeType,
  RoleType,
  SolCerberus,
  cacheUpdated,
  rolesGroupedBy,
  short_key,
} from "sol-cerberus-js";
import { get_provider } from "../../../components/utils/sol-cerberus-app";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { TXStackType } from "../../../types/permissions";
import {
  Actions,
  ManageRoleErrorsType,
  ManageRoleType,
  RoleError,
  RolesType,
} from "../../../types/roles";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { flashMsg } from "../../../components/utils/helpers";
import { validateInput } from "../../../components/validation/role";
import { DEFAULT_ANIMATION } from "../../../components/utils/animation";
import { addHours, format } from "date-fns";
import { addressTypes } from "sol-cerberus-js";
import { capitalize } from "../../../components/utils/strings";
import { format_time } from "../../../components/utils/dates";

const Button = dynamic(() => import("../../../components/button"));
const Modal = dynamic(() => import("../../../components/modal"));
const Menu = dynamic(() => import("../../../components/app/menu"));
const Icon = dynamic(() => import("../../../components/icon"));
const CTA = dynamic(() => import("../../../components/cta"));
const Input = dynamic(() => import("../../../components/input"));
const Select = dynamic(() => import("../../../components/select"));
const Checkbox = dynamic(() => import("../../../components/checkbox"));
const Spinner = dynamic(() => import("../../../components/spinner"));
const Breadcrumbs = dynamic(
  () => import("../../../components/app/breadcrumbs")
);

const empty_role = (): ManageRoleType => ({
  action: Actions.Create,
  role: "",
  address: "",
  addressType: addressTypes.Wallet,
  expiresAt: null,
  readOnlyRole: false,
  readOnlyAddressType: false,
  readOnlyAddress: false,
});

function sortRoles(roles: RoleType[]): RolesType {
  const order = ["wallet", "nft", "collection"];
  return roles
    .sort((a, b) => {
      // sort by role
      if (a.role !== b.role) {
        return a.role.localeCompare(b.role);
      }

      // if role is the same, sort by addressType
      if (a.addressType !== b.addressType) {
        return order.indexOf(a.addressType) - order.indexOf(b.addressType);
      }

      // if addressType is also the same, sort by address
      return a.address.localeCompare(b.address);
    })
    .reduce(addRole, {} as RolesType);
}

const addRole = (result, row: RoleType): RolesType => {
  if (!result[row.role]) {
    result[row.role] = {} as any;
  }
  if (!result[row.role][row.addressType]) {
    result[row.role][row.addressType] = {};
  }

  result[row.role][row.addressType][row.address] = {
    expiresAt: row.expiresAt,
  };
  return result;
};

export default function Roles({ router }) {
  const { publicKey, wallet, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState<boolean>(true);
  const [txStack, setTxStack] = useState<TXStackType>({});
  const [expanded, setExpanded] = useState<{ [k: string]: boolean }>({});
  const [solCerberus, setSolCerberus] = useState<SolCerberus | null>(null);
  const [roles, setRoles] = useState<RolesType>(null);
  const [role, setRole] = useState<ManageRoleType>(empty_role());
  const [roleErrors, setRoleErrors] = useState<ManageRoleErrorsType>({});
  const [modals, setModals] = useState({
    role: false,
  });

  const [_, __, appId, section] = router.asPath.split("/");

  const clearStates = () => {
    startTransition(() => {
      setSolCerberus(null);
      setRoles({});
      setTxStack({});
      if (solCerberus) {
        solCerberus.destroy(); // Remove Websockets listeners
        setSolCerberus(null);
      }
    });
  };

  const validateField = (key: string, value: any): boolean => {
    try {
      validateInput(key, value);
      return true;
    } catch (error) {
      if (error instanceof RoleError) {
        setRoleErrors({ ...roleErrors, [error.code]: error.message });
        flashMsg(error.message, "error", 4500);
      }
    }
    return false;
  };

  const addToStack = async () => {
    if (!solCerberus) return;
    for (const field of ["role", "address", "addressType", "expiresAt"]) {
      if (!validateField(field, role[field])) {
        return;
      }
    }
    if (Object.keys(txStack).length >= 10) {
      flashMsg(
        "Maximum transaction stack reached! You need to save in order to be able to apply more changes.",
        "error",
        10000
      );
      return;
    }

    // Avoid duplicates
    if (role.action === Actions.Create && roles[role.role]) {
      for (let addressType of ["wallet", "nft", "collection"]) {
        if (
          roles[role.role][addressType] &&
          roles[role.role][addressType][role.address]
        ) {
          flashMsg(
            `The role "${role.role}" is already assigned to the address "${
              role.address.length > 1 ? short_key(role.address) : role.address
            }"`
          );
          return;
        }
      }
    }

    const roleKey = `${role.role}-${role.address}`;
    // Remove instruction if key already exists (means that a role has been deleted and then recreated or the other way around)
    if (txStack.hasOwnProperty(roleKey)) {
      delete txStack[roleKey];
      // Add Instruction otherwise
    } else {
      txStack[roleKey] = (await (role.action === Actions.Create
        ? solCerberus.assignRole(role.role, addressTypes.Wallet, role.address, {
            expiresAt: role.expiresAt ? new Date(role.expiresAt) : null,
            getIx: true,
          })
        : solCerberus.deleteAssignedRole(
            role.role,
            addressTypes.Wallet,
            role.address,
            { getIx: true }
          ))) as TransactionInstruction;
    }
    let displayedRoles = { ...roles };
    // Update Roles to reflect the change:
    if (role.action === Actions.Create) {
      // Add Role
      displayedRoles = addRole(displayedRoles, role);
    } else {
      // Delete Role
      delete displayedRoles[role.role][role.addressType][role.address];
    }
    // Reflect change on Roles
    startTransition(() => {
      // Expand newly created roles
      if (role.action === Actions.Create) {
        setExpanded({
          ...expanded,
          [role.role]: true,
          [`${role.role}-${role.addressType}`]: true,
        });
      }
      setRole(empty_role());
      setRoles(displayedRoles);
      setTxStack(txStack);
      setModals({ ...modals, role: false });
    });
  };

  const showRoleModal = (defaultRole: ManageRoleType) => {
    startTransition(() => {
      setRoleErrors({});
      setRole(defaultRole);
      setModals({ ...modals, role: true });
    });
  };

  const handleUpdateRole = (key: string, value: any) => {
    delete roleErrors[key];
    setRoleErrors(roleErrors);
    setRole({ ...role, [key]: value });
  };

  const handleSave = async () => {
    if (!Object.keys(txStack).length) return;
    try {
      startTransition(() => setLoading(true));
      const latestBlockHash = await connection.getLatestBlockhash();
      const tx = new Transaction(latestBlockHash);
      Object.values(txStack).map((ix: TransactionInstruction) => tx.add(ix));
      const appData = await solCerberus.getAppData();
      if (appData.cached) {
        tx.add(
          await solCerberus.program.methods
            .updateCache(cacheUpdated.Roles)
            .accounts({ app: solCerberus.appPda })
            .instruction()
        );
      }
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: await sendTransaction(tx, connection),
      });
      startTransition(() => {
        setTxStack({});
        flashMsg("Changes saved in the Blockchain", "success");
      });
    } catch (e) {
      flashMsg("Transaction failed! The changes could not be saved :(");
      console.error(e);
    }
    startTransition(() => setLoading(false));
  };
  // STEP 1: Init Sol Cerberus and roles
  useEffect(() => {
    if (!publicKey) {
      // Clear all data if user's wallet has been disconnected
      if (solCerberus) {
        clearStates();
      }
      return;
    }
    let sc = null;
    if (solCerberus) return;
    (async () => {
      sc = new SolCerberus(
        new PublicKey(appId),
        get_provider(connection, wallet),
        { permsAutoUpdate: false }
      );
      let allRoles = sortRoles(
        await sc.fetchAllRoles({ groupBy: rolesGroupedBy.None })
      );
      startTransition(() => {
        setRoles(allRoles);
        setSolCerberus(sc);
        setLoading(false);
      });
    })();

    // Cleanup SolCerberus
    return () => {
      if (sc) {
        sc.destroy(); // Remove listeners
      }
    };
  }, [publicKey]);

  return (
    <>
      <Head>
        <title>Sol Cerberus APP Roles</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Sol Cerberus APP roles" />
      </Head>
      <div className={`page ${styles.container}`}>
        <Breadcrumbs appId={appId} section={section} />
        <Menu appId={appId} active={section} />
        <div className="newBtn">
          <Button
            className="button4"
            onClick={() => showRoleModal(empty_role())}
          >
            Assign role
          </Button>
        </div>
        <section>
          {loading ? (
            <motion.div
              key={"spinner"}
              className={styles.loading}
              {...DEFAULT_ANIMATION}
            >
              <Spinner />
            </motion.div>
          ) : (
            roles &&
            !!Object.keys(roles).length && (
              <ul className="role">
                <AnimatePresence>
                  {Object.entries(roles).map(([role, addressTypes]) => (
                    <motion.li key={`role-${role}`} {...DEFAULT_ANIMATION}>
                      <h3>
                        <span
                          title="Copy role"
                          onClick={() => {
                            navigator.clipboard.writeText(role);
                            flashMsg("Role copied", "info", 2000);
                          }}
                        >
                          <em>Role</em>
                          <Icon cType="roles" />
                          <span>
                            {role} <em>({Object.keys(addressTypes).length})</em>
                          </span>
                        </span>
                        <div className="aligned">
                          <Button
                            title="Add a resource and permission to this Role"
                            className="button1 sm"
                            onClick={() =>
                              showRoleModal({
                                ...empty_role(),
                                role: role,
                                readOnlyRole: true,
                                readOnlyAddressType: false,
                              })
                            }
                          >
                            Add
                          </Button>
                          <Button
                            className="expand"
                            cType="transparent"
                            title={expanded[role] ? "Collapse" : "Expand"}
                            onClick={() =>
                              startTransition(() =>
                                setExpanded({
                                  ...expanded,
                                  [role]: !expanded[role],
                                })
                              )
                            }
                          >
                            {expanded[role] ? "-" : "+"}
                          </Button>
                        </div>
                      </h3>
                      <ul
                        className={`addressType${
                          expanded[role] ? " expanded" : ""
                        }`}
                      >
                        {Object.entries(addressTypes).map(
                          ([addressType, addresses]) => (
                            <li key={`address-type-${addressType}`}>
                              <h4>
                                <span>
                                  <em>Type</em>
                                  <Icon cType={addressType} />{" "}
                                  <span>
                                    {addressType}{" "}
                                    <em>({Object.keys(addresses).length})</em>
                                  </span>
                                </span>
                                <div className="aligned">
                                  <Button
                                    title={`Add role to a ${addressType} address`}
                                    className="button1 sm"
                                    onClick={() =>
                                      showRoleModal({
                                        ...empty_role(),
                                        role: role,
                                        addressType:
                                          addressType as AddressTypeType,
                                        readOnlyRole: true,
                                        readOnlyAddressType: true,
                                      })
                                    }
                                  >
                                    Add
                                  </Button>
                                  <Button
                                    className="expand"
                                    cType="transparent"
                                    onClick={() =>
                                      startTransition(() =>
                                        setExpanded({
                                          ...expanded,
                                          [`${role}-${addressType}`]:
                                            !expanded[`${role}-${addressType}`],
                                        })
                                      )
                                    }
                                  >
                                    {expanded[`${role}-${addressType}`]
                                      ? "-"
                                      : "+"}
                                  </Button>
                                </div>
                              </h4>
                              <ul
                                className={`address${
                                  expanded[`${role}-${addressType}`]
                                    ? " expanded"
                                    : ""
                                }`}
                              >
                                <AnimatePresence>
                                  {Object.entries(addresses).map(
                                    ([address, data]) => (
                                      <motion.li
                                        key={`address-${address}`}
                                        {...DEFAULT_ANIMATION}
                                      >
                                        <h5>
                                          <span
                                            title="Copy address"
                                            onClick={() => {
                                              navigator.clipboard.writeText(
                                                address
                                              );
                                              flashMsg(
                                                "Address copied",
                                                "info",
                                                2000
                                              );
                                            }}
                                          >
                                            <Icon cType="address" />{" "}
                                            <span>{address}</span>
                                            <em>Address</em>
                                          </span>
                                          {!!data.expiresAt &&
                                            (data.expiresAt <
                                            new Date().getTime() ? (
                                              <div
                                                className="expires aligned error"
                                                data-tooltip-id="main-tooltip"
                                                data-tooltip-content={`Expired: ${format_time(
                                                  new Date(data.expiresAt)
                                                )}`}
                                                data-tooltip-variant="error"
                                              >
                                                <Icon
                                                  cType="exclamation"
                                                  className="icon1"
                                                  width={17}
                                                  height={17}
                                                />{" "}
                                                Expired{" "}
                                              </div>
                                            ) : (
                                              <div className="expires">
                                                Expires:{" "}
                                                {format_time(
                                                  new Date(data.expiresAt)
                                                )}
                                              </div>
                                            ))}
                                        </h5>
                                        <div>
                                          <Button
                                            data-tooltip-id="main-tooltip"
                                            data-tooltip-content="Delete permission"
                                            data-tooltip-variant="error"
                                            cType="transparent"
                                            onClick={() =>
                                              showRoleModal({
                                                role: role,
                                                addressType:
                                                  addressType as AddressTypeType,
                                                address: address,
                                                action: Actions.Delete,
                                                expiresAt: null,
                                                readOnlyRole: true,
                                                readOnlyAddressType: true,
                                                readOnlyAddress: true,
                                              })
                                            }
                                          >
                                            <Icon
                                              cType="delete"
                                              className="icon2"
                                            />
                                          </Button>
                                        </div>
                                      </motion.li>
                                    )
                                  )}
                                </AnimatePresence>
                              </ul>
                            </li>
                          )
                        )}
                      </ul>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )
          )}
        </section>
      </div>
      <Modal
        className={styles.wideModal}
        modalId={"role"}
        modals={modals}
        setIsOpen={setModals}
      >
        <>
          {/* CREATE OR UPDATE ROLE */}
          <>
            <h3>
              {role.action === Actions.Create ? "Assign " : "Remove"} role
            </h3>
            {role.action === Actions.Create ? (
              <p>
                Assigns role to a <strong>Wallet</strong>, <strong>NFT</strong>{" "}
                or a <strong> NFT Collection</strong> address:
              </p>
            ) : (
              <p>
                Do you really want to remove the role from the following
                address?
              </p>
            )}

            <div className="inputs">
              <label className="overlap fullWidth">
                <Input
                  className={`fullWidth${
                    roleErrors.hasOwnProperty("role") ? " error" : ""
                  }`}
                  value={role.role}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateRole("role", e.target.value)
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    validateField("role", e.target.value)
                  }
                  readOnly={role.readOnlyRole}
                  maxLength={16}
                />
                <span>Role</span>
                <em
                  data-tooltip-id="modal-tooltip"
                  data-tooltip-content="The Role being assigned"
                >
                  <Icon cType="info" className="icon3" />
                </em>
              </label>
              <Icon cType="chevron" direction="right" />
              <Select
                className="overlap fullWidth"
                value={role.addressType}
                label="Type"
                options={Object.values(addressTypes).map((n) => ({
                  value: n,
                  label:
                    n === addressTypes.NFT ? n.toUpperCase() : capitalize(n),
                }))}
                onChange={(option: any, _) =>
                  handleUpdateRole("addressType", option?.value)
                }
                onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                  validateField("addressType", role.addressType)
                }
              />
              <Icon cType="chevron" direction="right" />
              <label className="overlap fullWidth">
                <Input
                  className={`fullWidth${
                    roleErrors.hasOwnProperty("address") ? " error" : ""
                  }`}
                  value={role.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateRole("address", e.target.value)
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    validateField("address", e.target.value)
                  }
                  readOnly={role.readOnlyAddress}
                  maxLength={44}
                />
                <span>Address</span>
                <em
                  data-tooltip-id="modal-tooltip"
                  data-tooltip-content={`The ${role.addressType} address (use wildcard "*" to apply this role to all ${role.addressType}s)`}
                >
                  <Icon cType="info" className="icon3" />
                </em>
              </label>
            </div>
            {role.action === Actions.Create && (
              <div className="aligned mb-big">
                <label
                  className="checkbox"
                  onClick={(e) =>
                    startTransition(() =>
                      setRole({
                        ...role,
                        expiresAt: role.expiresAt
                          ? null
                          : new Date(
                              addHours(new Date(), 24).setSeconds(0) // Remove seconds
                            ).getTime(),
                      })
                    )
                  }
                >
                  <Checkbox
                    id="useExpiration"
                    name="useExpiration"
                    value={!!role.expiresAt}
                  />
                  Temporary
                </label>
                <AnimatePresence>
                  {!!role.expiresAt && (
                    <motion.label
                      className="overlap fullCol"
                      {...DEFAULT_ANIMATION}
                    >
                      <Input
                        type="datetime-local"
                        name="openTime"
                        className="fullWidth"
                        min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                        style={
                          roleErrors.expiresAt
                            ? {
                                borderColor: "#BD2742",
                              }
                            : undefined
                        }
                        value={format(
                          new Date(role.expiresAt),
                          "yyyy-MM-dd'T'HH:mm"
                        )}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleUpdateRole(
                            "expiresAt",
                            new Date(
                              new Date(e.target.value).setSeconds(0) // Remove seconds
                            ).getTime()
                          )
                        }
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                          validateField("expiresAt", role.expiresAt)
                        }
                      />
                      <span>Expires</span>
                      <Button
                        cType="transparent"
                        data-tooltip-id="modal-tooltip"
                        data-tooltip-content="The permission will be effective until the provided date"
                      >
                        <Icon cType="info" className="icon3" />
                      </Button>
                    </motion.label>
                  )}
                </AnimatePresence>
              </div>
            )}
            <div className="aligned end">
              <Button
                className={role.action === Actions.Create ? "" : "button2"}
                onClick={() => addToStack()}
                disabled={!!Object.keys(roleErrors).length}
              >
                {role.action === Actions.Create ? "Add" : "Delete"}
              </Button>
              <Button
                className="button1"
                onClick={() => setModals({ ...modals, role: false })}
              >
                Cancel
              </Button>
            </div>
          </>
        </>
        <Tooltip id="modal-tooltip" />
      </Modal>
      <Tooltip id="main-tooltip" />
      <AnimatePresence>
        {!!Object.keys(txStack).length && !loading && (
          <CTA handleSave={handleSave} />
        )}
      </AnimatePresence>
    </>
  );
}
