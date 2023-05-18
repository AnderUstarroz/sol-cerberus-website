import Head from "next/head";
// import { ReactNode, useState } from "react";
import styles from "../../../styles/Permissions.module.scss";
import dynamic from "next/dynamic";
import { ReactNode, startTransition, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  CachedPermsType,
  RolesType,
  SolCerberus,
  namespaces,
} from "sol-cerberus-js";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { get_provider } from "../../../components/utils/sol-cerberus-app";
import { format, addMinutes, addHours } from "date-fns";
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

const Menu = dynamic(() => import("../../../components/app/menu"));
const Modal = dynamic(() => import("../../../components/modal"));
const Icon = dynamic(() => import("../../../components/icon"));
const CTA = dynamic(() => import("../../../components/cta"));
const Button = dynamic(() => import("../../../components/button"));
const Checkbox = dynamic(() => import("../../../components/checkbox"));
const Input = dynamic(() => import("../../../components/input"));
const Breadcrumbs = dynamic(
  () => import("../../../components/app/breadcrumbs")
);

export default function Permissions({ router }) {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [modals, setModals] = useState({
    main: false,
    rule: false,
  });
  const [mainModal, setMainModal] = useState<ReactNode>(null);
  const [txStack, setTxStack] = useState<TXStackType>({});
  const [solCerberus, setSolCerberus] = useState<SolCerberus | null>(null);
  const [rules, setRules] = useState<CachedPermsType>({});
  const [rule, setRule] = useState<ManageRuleType>({
    action: Actions.Create,
    namespace: namespaces.Rule,
    role: "",
    resource: "",
    permission: "",
    expiresAt: null,
  });
  const [ruleErrors, setRuleErrors] = useState<ManageRuleErrorsType>({});

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

  const handleSave = () => {};

  const addToStack = () => {
    for (const field of ["role", "resource", "permission", "expiresAt"]) {
      if (!validateField(field, rule[field])) {
        break;
      }
    }
    if (Object.keys(txStack).length >= 10) {
      flashMsg("Transaction stack is full", "error", 3500);
      return;
    }

    // Avoid duplicated permissions
    if (rule.action === Actions.Create && rule.hasOwnProperty(rule.namespace)) {
      for (const [role, resources] of Object.entries(rules[rule.namespace])) {
        for (const [resource, permissions] of Object.entries(resources)) {
          for (const permission of Object.keys(permissions)) {
            if (
              role === rule.role &&
              resource === rule.resource &&
              permission === rule.permission
            ) {
              flashMsg(
                "Permission already exists! Cannot create duplicated permissions",
                "error",
                3500
              );
              return;
            }
          }
        }
      }
    }

    const ruleKey = `${rule.namespace}-${rule.role}-${rule.resource}-${rule.permission}`;

    if (txStack.hasOwnProperty(ruleKey)) {
      if (
        (rule.action === Actions.Create &&
          txStack[ruleKey].type == Actions.Delete) ||
        (rule.action === Actions.Delete &&
          txStack[ruleKey].type == Actions.Create)
      ) {
        delete txStack[ruleKey];
      }
    } else {
      txStack[ruleKey] = {
        type: rule.action,
        ix: "TODOOOO",
      };
    }
  };

  const setMainModalContent = (content: any, show = true) => {
    startTransition(() => {
      if (show) {
        setMainModal(content);
      }
      setModals({ ...modals, main: show });
    });
  };

  const clearStates = () => {
    startTransition(() => {
      setSolCerberus(null);
      setRules({});
      setTxStack({});
    });
  };

  // STEP 1: Init Sol Cerberus and permissions
  useEffect(() => {
    if (!publicKey) {
      // Clear all data if user's wallet has been disconnected
      if (solCerberus) {
        clearStates();
      }
      return;
    }
    if (solCerberus) return;
    (async () => {
      const sc = new SolCerberus(
        new PublicKey(appId),
        get_provider(connection, wallet)
      );
      const allRules = await sc.fetchPerms();
      startTransition(() => {
        setSolCerberus(sc);
        setRules(allRules);
      });
    })();
  }, [publicKey]);

  // STEP 2: Load something else
  useEffect(() => {}, [solCerberus]);

  return (
    <>
      <Head>
        <title>Sol Cerberus APP {section}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={`Sol Cerberus APP ${section}`} />
      </Head>
      <div className={`page ${styles.container}`}>
        <Breadcrumbs appId={appId} section={section} />
        <Menu appId={appId} active={section} />
        <div className="newBtn">
          <Button
            className="button3"
            onClick={() =>
              startTransition(() => setModals({ ...modals, rule: true }))
            }
          >
            Create new permission
          </Button>
        </div>
        {!!Object.keys(rules).length && (
          <ul>
            <AnimatePresence>
              {Object.entries(rules[namespaces.Rule]).map(([role, resources]) =>
                Object.entries(resources).map(([resource, permissions]) =>
                  Object.entries(permissions).map(([permission, data]) => (
                    <motion.li
                      key={`${role}-${resource}-${permission}`}
                      {...DEFAULT_ANIMATION}
                    >
                      {`${role}-${resource}-${permission}`}{" "}
                      {JSON.stringify(data)}
                    </motion.li>
                  ))
                )
              )}
            </AnimatePresence>
          </ul>
        )}
      </div>
      <Modal
        className={styles.wideModal}
        modalId={"rule"}
        modals={modals}
        setIsOpen={setModals}
      >
        <>
          {/* DELETE RULE */}
          {rule.action === Actions.Delete ? (
            <>
              <h3>Delete permission</h3>
              <p>Do you really want to delete the following permission?</p>
              <div className="aligned end">
                <Button
                  className="button2"
                  onClick={() => 1}
                  disabled={!!Object.keys(ruleErrors).length}
                >
                  Delete
                </Button>
                <Button
                  className="button1"
                  onClick={() => setModals({ ...modals, rule: false })}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            /** CREATE OR UPDATE RULE */
            <>
              <h3>
                {rule.action === Actions.Create ? "Create new" : "Edit"}{" "}
                permission
              </h3>
              <p>
                {rule.action === Actions.Create
                  ? "Creates a new"
                  : "Modifies an existing"}{" "}
                permission for the corresponding <strong>Role</strong> and{" "}
                <strong>Resource</strong>:
              </p>
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
                    maxLength={16}
                  />
                  <span>Resource</span>
                  <em
                    data-tooltip-id="modal-tooltip"
                    data-tooltip-content='Resource on which the permission will have effect(supports wildcard: "*")'
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
              <div className="aligned end">
                <Button
                  onClick={() => addToStack()}
                  disabled={!!Object.keys(ruleErrors).length}
                >
                  Add
                </Button>
                <Button
                  className="button1"
                  onClick={() => setModals({ ...modals, rule: false })}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </>
        <Tooltip id="modal-tooltip" />
      </Modal>
      <CTA handleSave={Object.keys(txStack).length ? handleSave : null} />
    </>
  );
}
