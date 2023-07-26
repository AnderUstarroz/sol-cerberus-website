import Head from "next/head";
// import { ReactNode, useState } from "react";
import styles from "../../../styles/Permissions.module.scss";
import dynamic from "next/dynamic";
import { startTransition, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  CachedPermsType,
  SolCerberus,
  cacheUpdated,
  namespaces,
} from "sol-cerberus-js";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { format, addHours } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { DEFAULT_ANIMATION } from "../../../components/utils/animation";
import { flashMsg } from "../../../components/utils/helpers";
import { validateInput } from "../../../components/validation/rule";
import { Tooltip } from "react-tooltip";
import {
  ManageRuleErrorsType,
  ManageRuleType,
  Actions,
  RuleError,
  TXStackType,
} from "../../../types/permissions";
import { format_time } from "../../../components/utils/dates";

const Menu = dynamic(() => import("../../../components/app/menu"));
const Modal = dynamic(() => import("../../../components/modal"));
const Icon = dynamic(() => import("../../../components/icon"));
const CTA = dynamic(() => import("../../../components/cta"));
const Button = dynamic(() => import("../../../components/button"));
const Checkbox = dynamic(() => import("../../../components/checkbox"));
const Input = dynamic(() => import("../../../components/input"));
const Spinner = dynamic(() => import("../../../components/spinner"));
const Breadcrumbs = dynamic(
  () => import("../../../components/app/breadcrumbs")
);

const empty_rule = (): ManageRuleType => ({
  action: Actions.Create,
  namespace: namespaces.Rule,
  role: "",
  resource: "",
  permission: "",
  expiresAt: null,
  readOnlyRole: false,
  readOnlyResource: false,
  readOnlyPermission: false,
});

export default function Permissions({ router }) {
  const { publicKey, wallet, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<{ [k: string]: boolean }>({});
  const [txStack, setTxStack] = useState<TXStackType>({});
  const [solCerberus, setSolCerberus] = useState<SolCerberus | null>(null);
  const [rules, setRules] = useState<CachedPermsType | null>(null);
  const [rule, setRule] = useState<ManageRuleType>(empty_rule());
  const [ruleErrors, setRuleErrors] = useState<ManageRuleErrorsType>({});
  const [modals, setModals] = useState({
    rule: false,
  });

  const [_, __, appId, section] = router.asPath.split("/");

  const validateField = (key: string, value: any): boolean => {
    try {
      validateInput(key, value);
      return true;
    } catch (error) {
      if (error instanceof RuleError) {
        setRuleErrors({ ...ruleErrors, [error.code]: error.message });
        flashMsg(error.message, "error", 3500);
      }
    }
    return false;
  };

  const handleUpdateRule = (key: string, value: any) => {
    delete ruleErrors[key];
    setRuleErrors(ruleErrors);
    setRule({ ...rule, [key]: value });
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
            .updateCache(cacheUpdated.Rules)
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

  const showRuleModal = (defaultRule: ManageRuleType) => {
    startTransition(() => {
      setRuleErrors({});
      setRule(defaultRule);
      setModals({ ...modals, rule: true });
    });
  };

  const addToStack = async () => {
    if (!solCerberus) return;
    for (const field of ["role", "resource", "permission", "expiresAt"]) {
      if (!validateField(field, rule[field])) {
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

    // Avoid duplicated permissions
    if (
      rule.action === Actions.Create &&
      rules.hasOwnProperty(rule.namespace) &&
      rules[rule.namespace].hasOwnProperty(rule.role) &&
      rules[rule.namespace][rule.role].hasOwnProperty(rule.resource) &&
      rules[rule.namespace][rule.role][rule.resource].hasOwnProperty(
        rule.permission
      )
    ) {
      flashMsg(
        "Permission already exists, cannot create duplicated permissions"
      );
      return;
    }

    const ruleKey = `${rule.namespace}-${rule.role}-${rule.resource}-${rule.permission}`;
    // Remove instruction if key already exists (means that a rule has been deleted and then recreated or the other way around)
    if (txStack.hasOwnProperty(ruleKey)) {
      delete txStack[ruleKey];
      // Add Instruction otherwise
    } else {
      txStack[ruleKey] = (await (rule.action === Actions.Create
        ? solCerberus.addRule(
            rule.role,
            rule.resource,
            rule.permission,
            rule.namespace,
            {
              expiresAt: rule.expiresAt ? new Date(rule.expiresAt) : null,
              getIx: true,
            }
          )
        : solCerberus.deleteRule(
            rule.role,
            rule.resource,
            rule.permission,
            rule.namespace,
            { getIx: true }
          ))) as TransactionInstruction;
    }

    let displayedRules = { ...rules };
    // Update Rules to reflect the change:
    if (rule.action === Actions.Create) {
      // Add Rule
      displayedRules = solCerberus.addPerm(
        rules,
        rule.namespace,
        rule.role,
        rule.resource,
        rule.permission,
        rule.expiresAt
      );
    } else {
      // Delete Rule
      delete displayedRules[rule.namespace][rule.role][rule.resource][
        rule.permission
      ];
    }
    // Reflect change on rules
    startTransition(() => {
      // Expand newly created rules
      if (rule.action === Actions.Create) {
        setExpanded({
          ...expanded,
          [rule.role]: true,
          [`${rule.role}-${rule.resource}`]: true,
        });
      }
      setRule(empty_rule());
      setRules(displayedRules);
      setTxStack(txStack);
      setModals({ ...modals, rule: false });
    });
  };

  const clearStates = () => {
    startTransition(() => {
      setRules(null);
      setTxStack({});
      if (solCerberus) {
        solCerberus.disconnect(); // Remove Websockets listeners
        setSolCerberus(null);
      }
    });
  };

  // STEP 1: Init Sol Cerberus and permissions
  useEffect(() => {
    if (!publicKey) {
      // Clear all data if user's wallet has been disconnected
      return clearStates();
    }
    let sc = null;
    if (solCerberus) return;
    (async () => {
      sc = new SolCerberus(connection, wallet, { appId: new PublicKey(appId) });
      const allRules = await sc.fetchPerms();
      startTransition(() => {
        setLoading(false);
        setSolCerberus(sc);
        setRules(allRules);
      });
    })();

    // Cleanup SolCerberus
    return () => clearStates(); // Remove listeners
  }, [publicKey]);

  return (
    <>
      <Head>
        <title>Sol Cerberus APP permissions</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={`Sol Cerberus APP ${section}`} />
      </Head>
      <div className={`page ${styles.container}`}>
        <Breadcrumbs appId={appId} section={section} />
        <Menu appId={appId} active={section} />
        <div className="newBtn">
          <Button
            className="button4"
            onClick={() => showRuleModal(empty_rule())}
          >
            New permission
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
            rules &&
            !!Object.keys(rules).length && (
              <ul className="role">
                <AnimatePresence>
                  {Object.entries(rules[namespaces.Rule]).map(
                    ([role, resources]) => (
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
                              {role} <em>({Object.keys(resources).length})</em>
                            </span>
                          </span>
                          <div className="aligned">
                            <Button
                              title="Add a resource and permission to this Role"
                              className="button1 sm"
                              onClick={() =>
                                showRuleModal({
                                  ...empty_rule(),
                                  role: role,
                                  readOnlyRole: true,
                                  readOnlyResource: false,
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
                          className={`resource${
                            expanded[role] ? " expanded" : ""
                          }`}
                        >
                          {Object.entries(resources).map(
                            ([resource, permissions]) => (
                              <li key={`resource-${resource}`}>
                                <h4>
                                  <span
                                    title="Copy resource"
                                    onClick={() => {
                                      navigator.clipboard.writeText(resource);
                                      flashMsg("Resource copied", "info", 2000);
                                    }}
                                  >
                                    <em>Resource</em>
                                    <Icon cType="resources" />{" "}
                                    <span>
                                      {resource}{" "}
                                      <em>
                                        ({Object.keys(permissions).length})
                                      </em>
                                    </span>
                                  </span>
                                  <div className="aligned">
                                    <Button
                                      title="Add a permission to this resource"
                                      className="button1 sm"
                                      onClick={() =>
                                        showRuleModal({
                                          ...empty_rule(),
                                          role: role,
                                          resource: resource,
                                          readOnlyRole: true,
                                          readOnlyResource: true,
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
                                            [`${role}-${resource}`]:
                                              !expanded[`${role}-${resource}`],
                                          })
                                        )
                                      }
                                    >
                                      {expanded[`${role}-${resource}`]
                                        ? "-"
                                        : "+"}
                                    </Button>
                                  </div>
                                </h4>
                                <ul
                                  className={`permission${
                                    expanded[`${role}-${resource}`]
                                      ? " expanded"
                                      : ""
                                  }`}
                                >
                                  <AnimatePresence>
                                    {Object.entries(permissions).map(
                                      ([permission, data]) => (
                                        <motion.li
                                          key={`permission-${permission}`}
                                          {...DEFAULT_ANIMATION}
                                        >
                                          <h5>
                                            <span
                                              title="Copy permission"
                                              onClick={() => {
                                                navigator.clipboard.writeText(
                                                  permission
                                                );
                                                flashMsg(
                                                  "Permission copied",
                                                  "info",
                                                  2000
                                                );
                                              }}
                                            >
                                              <Icon cType="permissions" />{" "}
                                              <span>{permission}</span>
                                              <em>Permission</em>
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
                                                showRuleModal({
                                                  namespace: namespaces.Rule,
                                                  role: role,
                                                  resource: resource,
                                                  permission: permission,
                                                  action: Actions.Delete,
                                                  expiresAt: null,
                                                  readOnlyRole: true,
                                                  readOnlyResource: true,
                                                  readOnlyPermission: true,
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
                    )
                  )}
                </AnimatePresence>
              </ul>
            )
          )}
        </section>
      </div>
      <Modal
        className={styles.wideModal}
        modalId={"rule"}
        modals={modals}
        setIsOpen={setModals}
      >
        <>
          {/* CREATE OR UPDATE RULE */}
          <>
            <h3>
              {rule.action === Actions.Create ? "Add new" : "Delete"} permission
            </h3>
            {rule.action === Actions.Create ? (
              <p>
                Creates a new permission within the respective{" "}
                <strong>Role</strong> and <strong>Resource</strong>:
              </p>
            ) : (
              <p>Do you really want to delete the following permission?</p>
            )}

            <div className="inputs">
              <label className="overlap fullWidth">
                <Input
                  className={`fullWidth${
                    ruleErrors.hasOwnProperty("role") ? " error" : ""
                  }`}
                  value={rule.role}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateRule("role", e.target.value)
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    validateField("role", e.target.value)
                  }
                  readOnly={rule.readOnlyRole}
                  maxLength={16}
                />
                <span>Role</span>
                <em
                  data-tooltip-id="modal-tooltip"
                  data-tooltip-content="The Role getting the permission"
                >
                  <Icon cType="info" className="icon3" />
                </em>
              </label>
              <Icon cType="chevron" direction="right" />
              <label className="overlap fullWidth">
                <Input
                  className={`fullWidth${
                    ruleErrors.hasOwnProperty("resource") ? " error" : ""
                  }`}
                  value={rule.resource}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateRule("resource", e.target.value)
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    validateField("resource", e.target.value)
                  }
                  readOnly={rule.readOnlyResource}
                  maxLength={16}
                />
                <span>Resource</span>
                <em
                  data-tooltip-id="modal-tooltip"
                  data-tooltip-content='Resource on which the permission will be applied (supports wildcard: "*")'
                >
                  <Icon cType="info" className="icon3" />
                </em>
              </label>
              <Icon cType="chevron" direction="right" />
              <label className="overlap fullWidth">
                <Input
                  className={`fullWidth${
                    ruleErrors.hasOwnProperty("permission") ? " error" : ""
                  }`}
                  value={rule.permission}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateRule("permission", e.target.value)
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    validateField("permission", e.target.value)
                  }
                  readOnly={rule.readOnlyPermission}
                  maxLength={16}
                />
                <span>Permission</span>
                <em
                  data-tooltip-id="modal-tooltip"
                  data-tooltip-content='The allowed action (supports wildcard: "*")'
                >
                  <Icon cType="info" className="icon3" />
                </em>
              </label>
            </div>
            {rule.action === Actions.Create && (
              <div className="aligned mb-big">
                <label
                  className="checkbox"
                  onClick={(e) =>
                    startTransition(() =>
                      setRule({
                        ...rule,
                        expiresAt: rule.expiresAt
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
                    value={!!rule.expiresAt}
                  />
                  Temporary
                </label>
                <AnimatePresence>
                  {!!rule.expiresAt && (
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
                          ruleErrors.expiresAt
                            ? {
                                borderColor: "#BD2742",
                              }
                            : undefined
                        }
                        value={format(
                          new Date(rule.expiresAt),
                          "yyyy-MM-dd'T'HH:mm"
                        )}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleUpdateRule(
                            "expiresAt",
                            new Date(
                              new Date(e.target.value).setSeconds(0) // Remove seconds
                            ).getTime()
                          )
                        }
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                          validateField("expiresAt", rule.expiresAt)
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
                className={rule.action === Actions.Create ? "" : "button2"}
                onClick={() => addToStack()}
                disabled={!!Object.keys(ruleErrors).length}
              >
                {rule.action === Actions.Create ? "Add" : "Delete"}
              </Button>
              <Button
                className="button1"
                onClick={() => setModals({ ...modals, rule: false })}
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
