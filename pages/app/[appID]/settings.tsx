import Head from "next/head";
// import { ReactNode, useState } from "react";
import styles from "../../../styles/Settings.module.scss";
import dynamic from "next/dynamic";
import { startTransition, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  SolCerberus,
  SolCerberusTypes,
  rolesGroupedBy,
  shortKey,
} from "sol-cerberus-js";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { AnimatePresence, motion } from "framer-motion";
import { DEFAULT_ANIMATION } from "../../../components/utils/animation";
import { flashMsg } from "../../../components/utils/helpers";
import { AppError, validateInput } from "../../../components/validation/app";
import { Tooltip } from "react-tooltip";

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

export default function Settings({ cluster, router }) {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState<boolean>(true);
  const [solCerberus, setSolCerberus] = useState<SolCerberus | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean | null>(null);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [app, setApp] = useState<
    anchor.IdlAccounts<SolCerberusTypes>["app"] | null
  >(null);
  const [appErrors, setAppErrors] = useState<{ [k: string]: string }>({});
  const [modals, setModals] = useState({
    delete: false,
  });

  const section = router.asPath.split("/").pop();
  const validateField = (key: string, value: any): boolean => {
    try {
      validateInput(key, value);
      return true;
    } catch (error) {
      if (error instanceof AppError) {
        setAppErrors({ ...appErrors, [error.code]: error.message });
        flashMsg(error.message, "error", 3500);
      }
    }
    return false;
  };

  const handleUpdateApp = (key: string, value: any) => {
    delete appErrors[key];
    startTransition(() => {
      setAppErrors(appErrors);
      setApp({ ...app, [key]: value });
      if (!isModified) {
        setIsModified(true);
      }
    });
  };

  const handleSave = async () => {
    if (!solCerberus) return;
    let params = app;
    for (const field of ["name", "cached", "authority", "recovery"]) {
      if (!validateField(field, params[field])) {
        return;
      }
    }
    if (typeof params.authority === "string") {
      params.authority = new PublicKey(params.authority);
    }
    params.recovery = !params.recovery
      ? null
      : typeof params.recovery === "string"
      ? new PublicKey(params.recovery)
      : params.recovery;

    try {
      startTransition(() => setLoading(true));
      await solCerberus.updateApp(params.name, params.recovery, {
        cached: params.cached,
        confirmOptions: { commitment: "processed" },
      });

      startTransition(() => {
        flashMsg("Changes saved in the Blockchain", "success");
        setIsModified(false);
      });
    } catch (e) {
      flashMsg("Transaction failed! The changes could not be saved :(");
      console.error(e);
    }
    startTransition(() => setLoading(false));
  };

  const handleDeleteApp = async () => {
    try {
      startTransition(() => setLoading(true));
      await solCerberus.deleteApp({
        confirmOptions: { commitment: "confirmed" },
      });
      window.location.href = "/app/";
    } catch (e) {
      console.error(e);
      startTransition(() => setLoading(false));
    }
  };

  const handleCancel = async () => {
    const appData = await solCerberus.getAppData();
    startTransition(() => {
      setApp(appData);
      setIsModified(false);
    });
  };

  const showDeleteModal = () => {
    startTransition(() => {
      setAppErrors({});
      setModals({ ...modals, delete: true });
    });
  };

  const clearStates = () => {
    if (solCerberus) {
      startTransition(() => {
        solCerberus.disconnect(); // Remove Websockets listeners
        setSolCerberus(null);
      });
    }
  };

  const appIsEmpty = async (sc) => {
    let empty = !Object.keys(await sc.getPermissions()).length;
    empty = empty
      ? !(await sc.fetchAllRoles({ groupBy: rolesGroupedBy.None })).length
      : false;
    startTransition(() => {
      setIsEmpty(empty);
    });
  };

  // STEP 1: Init Sol Cerberus and permissions
  useEffect(() => {
    if (!router.isReady) return;
    if (!publicKey) {
      // Clear all data if user's wallet has been disconnected
      return clearStates();
    }
    let sc = null;
    if (solCerberus) return;
    (async () => {
      sc = new SolCerberus(connection, wallet, {
        appId: new PublicKey(router.query.appID),
      });
      const appData = await sc.getAppData();
      if (!appData) {
        return router.push(
          `/app/?error=APP ${shortKey(
            router.query.appID
          )} not found on ${cluster}`
        );
      }
      startTransition(() => {
        setLoading(false);
        setSolCerberus(sc);
        setApp(appData);
      });
      appIsEmpty(sc); // Empty APPs can be deleted
    })();

    // Cleanup SolCerberus
    return () => clearStates();
  }, [publicKey, router.isReady]);

  return (
    <>
      <Head>
        <title>Sol Cerberus APP settings</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={`Sol Cerberus APP ${section}`} />
      </Head>
      <div className={`page ${styles.container}`}>
        {!!router.query.appID && (
          <Breadcrumbs appId={router.query.appID} section={section} />
        )}
        {!!router.query.appID && (
          <Menu appId={router.query.appID} active={section} />
        )}
        <section>
          <fieldset>
            <AnimatePresence>
              {loading && <Spinner />}
              {!loading && !!app && (
                <motion.div key="form" {...DEFAULT_ANIMATION}>
                  <h3 className="aligned">
                    APP ID:{" "}
                    <Button
                      className="aligned gap5"
                      cType="transparent"
                      title="Copy APP ID"
                      onClick={() => {
                        navigator.clipboard.writeText(app.id.toBase58());
                        flashMsg("APP ID copied", "info", 2000);
                      }}
                    >
                      <Icon cType="address" /> {shortKey(app.id.toBase58())}
                    </Button>
                  </h3>
                  <div className="aligned">
                    <label className="overlap">
                      <Input
                        type="text"
                        name="name"
                        maxLength={16}
                        className={
                          appErrors.hasOwnProperty("name") ? "error" : null
                        }
                        value={app.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleUpdateApp("name", e.target.value)
                        }
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                          validateField("name", app.name)
                        }
                      />
                      <span>Name</span>
                      <Icon
                        cType="info"
                        className="icon1"
                        data-tooltip-id="main-tooltip"
                        data-tooltip-content="Label to identify the APP."
                        data-tooltip-place="top"
                      />
                    </label>
                    <label
                      className={"aligned gap5"}
                      onClick={() => handleUpdateApp("cached", !app.cached)}
                    >
                      <Checkbox
                        id="useCustomRole"
                        name="useCustomRole"
                        value={app.cached}
                      />
                      Cached
                      <Icon
                        cType="info"
                        className="icon1"
                        data-tooltip-id="main-tooltip"
                        data-tooltip-html="Permissions and Roles will be cached<br />on the client side (recommended)."
                      />
                    </label>
                  </div>

                  <h4>Security</h4>
                  <div className="aligned mobileCols">
                    <label className="overlap fullCol">
                      <Input
                        type="text"
                        name="authority"
                        className={`fullWidth ${
                          appErrors.authority ? "error" : ""
                        }`}
                        value={app.authority}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleUpdateApp("authority", e.target.value)
                        }
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                          validateField("authority", app.authority)
                        }
                      />
                      <span>Authority</span>
                      <Icon
                        cType="info"
                        className="icon1"
                        data-tooltip-id="main-tooltip"
                        data-tooltip-html="The admin wallet with full<br />privileges for managing the APP."
                      />
                    </label>
                    <label className="overlap fullCol">
                      <Input
                        type="text"
                        name="recovery"
                        className={`fullWidth ${
                          appErrors.recovery ? "error" : ""
                        }`}
                        value={app.recovery ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleUpdateApp("recovery", e.target.value)
                        }
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                          validateField("recovery", app.recovery)
                        }
                      />
                      <span>Recovery</span>
                      <Icon
                        cType="info"
                        className="icon1"
                        data-tooltip-id="main-tooltip"
                        data-tooltip-html="Backup wallet allowed to change<br /> the APP Authority in case the<br /> original is lost or stolen."
                      />
                    </label>
                  </div>
                  <AnimatePresence>
                    {isEmpty !== null && (
                      <motion.div className="buttons" {...DEFAULT_ANIMATION}>
                        <span
                          data-tooltip-id="main-tooltip"
                          data-tooltip-html={
                            isEmpty
                              ? null
                              : "The APP cannot be deleted <br />because is not empty. All<br /><strong>Roles</strong> and <strong>Permissions</strong><br />must be deleted first."
                          }
                          data-tooltip-variant="error"
                        >
                          <Button
                            className={"button2"}
                            onClick={() => showDeleteModal()}
                            disabled={!isEmpty}
                          >
                            Delete
                          </Button>
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
            <Tooltip id="main-tooltip" place="left" />
          </fieldset>
        </section>
      </div>
      {!!app && (
        <Modal
          className={styles.wideModal}
          modalId={"delete"}
          modals={modals}
          setIsOpen={setModals}
        >
          <>
            <h3>Delete APP</h3>
            <p className="mb-big">
              Deleting the APP "<strong>{app.name}</strong>" is permanent and
              cannot be undone. Are you sure you want to continue?
            </p>
            <div className="aligned end">
              <Button
                className={"button2"}
                onClick={() => handleDeleteApp()}
                disabled={!!Object.keys(appErrors).length}
              >
                Delete
              </Button>
              <Button
                className="button1"
                onClick={() => setModals({ ...modals, delete: false })}
              >
                Cancel
              </Button>
            </div>
          </>
          <Tooltip id="modal-tooltip" />
        </Modal>
      )}
      <AnimatePresence>
        {isModified && !loading && (
          <CTA
            handleSave={handleSave}
            handleCancel={isModified && handleCancel}
          />
        )}
      </AnimatePresence>
    </>
  );
}
