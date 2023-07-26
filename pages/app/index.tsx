import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Head from "next/head";
import { startTransition, useEffect, useState } from "react";
import styles from "../../styles/Apps.module.scss";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_ANIMATION } from "../../components/utils/animation";
import { SolCerberus, SolCerberusTypes, short_key } from "sol-cerberus-js";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Tooltip } from "react-tooltip";
import { AppError, validateInput } from "../../components/validation/app";
import { flashMsg } from "../../components/utils/helpers";
import { NewAPPType, NewAPPErrorType } from "../../types/app";
import Link from "next/link";

const ConnectWallet = dynamic(() => import("../../components/connect-wallet"));
const Spinner = dynamic(() => import("../../components/spinner"));
const Button = dynamic(() => import("../../components/button"));
const Modal = dynamic(() => import("../../components/modal"));
const Icon = dynamic(() => import("../../components/icon"));
const Input = dynamic(() => import("../../components/input"));

export default function Apps({ router }) {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState<boolean>(true);
  const [apps, setApps] = useState<
    anchor.IdlAccounts<SolCerberusTypes>["app"][]
  >([]);
  const [newApp, setNewApp] = useState<NewAPPType>({
    name: "",
    recovery: null,
    cached: true,
  });
  const [newAppErrors, setNewAppErrors] = useState<NewAPPErrorType>({});
  const [solCerberus, setSolCerberus] = useState<SolCerberus | null>(null);
  const [modals, setModals] = useState({
    new_app: false,
  });

  const clearStates = () => {
    if (solCerberus) solCerberus.disconnect(); // Remove Websockets listeners
    startTransition(() => {
      setSolCerberus(null);
      setApps([]);
    });
  };

  const validateField = (key: string, value: any): boolean => {
    try {
      validateInput(key, value);
      return true;
    } catch (error) {
      if (error instanceof AppError) {
        setNewAppErrors({ ...newAppErrors, [error.code]: error.message });
        flashMsg(error.message, "error", 3500);
      }
    }
    return false;
  };
  const handleUpdateNewApp = (key: string, value: any) => {
    delete newAppErrors[key];
    setNewAppErrors(newAppErrors);
    setNewApp({ ...newApp, [key]: value });
  };

  const loadApps = async (pubkey: PublicKey) => {
    const myApps = (
      await solCerberus.program.account.app.all([
        {
          memcmp: {
            offset: 40, // Authority Starting byte (First bytes 0-7: account discriminator, bytes 8-39 = APP ID)
            bytes: pubkey.toBase58(), // base58 encoded string
          },
        },
      ])
    ).map((row) => row.account);
    startTransition(() => {
      setApps(myApps);
      setLoading(false);
    });
  };

  const handleSave = async () => {
    // Exit if there are existing errors:
    if (!!Object.keys(newAppErrors).length) return;
    // Validate fields:
    for (const [key, value] of Object.entries(newApp)) {
      if (!validateField(key, value)) return;
    }
    setLoading(true);
    try {
      await solCerberus.initializeApp(
        newApp.name,
        newApp.recovery ? newApp.recovery : null,
        {
          cached: newApp.cached,
        }
      );
    } catch (e) {
      console.error(e);
    }
    startTransition(() => {
      setModals({ ...modals, new_app: false });
      setLoading(false);
    });
  };

  // STEP 1: Init
  useEffect(() => {
    if (!publicKey) {
      // Clear all data when user's wallet has been disconnected
      return clearStates();
    }
    if (solCerberus) return;
    setSolCerberus(new SolCerberus(connection, wallet));
    return () => clearStates();
  }, [publicKey]);

  // STEP 2: load APPs
  useEffect(() => {
    if (!solCerberus) return;
    loadApps(publicKey);

    // Add listener to refresh list of apps whenever they change
    const appListener = solCerberus.program.addEventListener(
      "AppChanged",
      async (event, slot) => {
        if (event.authority.toBase58() === publicKey.toBase58()) {
          startTransition(() => setLoading(true));
          loadApps(publicKey);
        }
      }
    );
    return () => {
      solCerberus.program.removeEventListener(appListener);
    };
  }, [solCerberus]);

  return (
    <>
      <Head>
        <title>Sol Cerberus Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Sol Cerberus dashboard for managing the permissions of your Solana DAPPs"
        />
      </Head>
      {!publicKey ? (
        <ConnectWallet />
      ) : (
        <AnimatePresence>
          {loading ? (
            <motion.div
              key={"spinner"}
              className={styles.loading}
              {...DEFAULT_ANIMATION}
            >
              <Spinner />
            </motion.div>
          ) : (
            <motion.div
              key={"content"}
              className={`page ${styles.container}`}
              {...DEFAULT_ANIMATION}
            >
              <h1>Sol Cerberus APPs</h1>
              <p className="txtCenter">
                The APPs contain the permissions and roles associated to your
                Solana programs.
              </p>
              <section className="apps">
                {!!apps.length && (
                  <ul className={`${apps.length === 1 ? "centered" : ""}`}>
                    {apps.map((app, k: number) => (
                      <li key={`app${k}`}>
                        <h3>{app.name}</h3>
                        <div className="desc">
                          <div>
                            <div>APP ID:</div>
                            <div>Cached:</div>
                            <div>Recovery wallet:</div>
                          </div>
                          <div>
                            <div
                              className="copy"
                              title="Copy APP ID"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  app.id.toBase58()
                                );
                                flashMsg("APP ID copied", "info", 2000);
                              }}
                            >
                              {short_key(app.id.toBase58())}
                            </div>
                            <div>{app.cached ? "Yes" : "No"}</div>
                            <div>
                              {app.recovery
                                ? short_key(app.recovery)
                                : "Not defined"}
                            </div>
                          </div>
                        </div>
                        <Button className="button1">
                          <Link href={`/app/${app.id.toBase58()}/roles`}>
                            Manage
                          </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <Button
                className="button1 new-app"
                onClick={() => setModals({ ...modals, new_app: true })}
              >
                CREATE NEW APP
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <Modal modalId={"new_app"} modals={modals} setIsOpen={setModals}>
        <div className={styles.modal}>
          <h3>Create New APP</h3>
          {loading ? (
            <motion.div
              key={"spinner"}
              className={styles.loading}
              {...DEFAULT_ANIMATION}
            >
              <Spinner />
            </motion.div>
          ) : (
            <fieldset>
              <div className="mb-med">
                <label className="overlap fullWidth">
                  <Input
                    className={`fullWidth${
                      newAppErrors.hasOwnProperty("name") ? " error" : ""
                    }`}
                    value={newApp.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleUpdateNewApp("name", e.target.value)
                    }
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                      validateField("name", e.target.value)
                    }
                    maxLength={16}
                  />
                  <span>Name</span>
                  <em
                    data-tooltip-id="modal-tooltip"
                    data-tooltip-content="Enter a name to identify your project, e.g. myproject.com"
                  >
                    <Icon cType="info" className="icon1" />
                  </em>
                </label>
              </div>
              <div className="mb-med">
                <label className="overlap fullWidth">
                  <Input
                    className={`fullWidth${
                      newAppErrors.hasOwnProperty("recovery") ? " error" : ""
                    }`}
                    value={newApp.recovery ? newApp.recovery : ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleUpdateNewApp("recovery", e.target.value)
                    }
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                      validateField("recovery", e.target.value)
                    }
                    maxLength={44}
                  />
                  <span>Recovery wallet</span>
                  <em
                    data-tooltip-id="modal-tooltip"
                    data-tooltip-content="Recovery Wallet enables the Authority to be changed in the event of a loss"
                  >
                    <Icon cType="info" className="icon1" />
                  </em>
                </label>
              </div>
              <div className="aligned centered">
                <Button
                  className="button2"
                  onClick={() => setModals({ ...modals, new_app: false })}
                >
                  Cancel
                </Button>
                <Button onClick={() => handleSave()}>Accept</Button>
              </div>
            </fieldset>
          )}
          <Tooltip id="modal-tooltip" />
        </div>
      </Modal>
    </>
  );
}
