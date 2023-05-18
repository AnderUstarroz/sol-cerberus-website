import Head from "next/head";
// import { ReactNode, useState } from "react";
import styles from "../../../styles/Apps.module.scss";
import dynamic from "next/dynamic";
import { ReactNode, startTransition, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SolCerberus, SolCerberusTypes } from "sol-cerberus-js";
import * as anchor from "@project-serum/anchor";
import { get_provider } from "../../../components/utils/sol-cerberus-app";
import { PublicKey } from "@solana/web3.js";

const Button = dynamic(() => import("../../../components/button"));
const Modal = dynamic(() => import("../../../components/modal"));
const Menu = dynamic(() => import("../../../components/app/menu"));
const Breadcrumbs = dynamic(
  () => import("../../../components/app/breadcrumbs")
);

export default function Roles({ router }) {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [modals, setModals] = useState({
    main: false,
  });
  const [mainModal, setMainModal] = useState<ReactNode>(null);
  const [txStack, setTxStack] = useState<any>([]);
  const [solCerberus, setSolCerberus] = useState<SolCerberus | null>(null);
  const [roles, setRoles] =
    useState<anchor.IdlAccounts<SolCerberusTypes>["role"][]>(null);

  const [_, __, appId, section] = router.asPath.split("/");

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
      setRoles([]);
      setTxStack([]);
    });
  };

  // STEP 1: Init
  useEffect(() => {
    if (!publicKey) {
      // Clear all data when user's wallet has been disconnected
      if (solCerberus) {
        clearStates();
      }
      return;
    }
    if (solCerberus) return;

    setSolCerberus(
      new SolCerberus(new PublicKey(appId), get_provider(connection, wallet))
    );
  }, [publicKey]);

  // STEP 2: Load
  useEffect(() => {
    if (!publicKey) {
      // Clear all data when user's wallet has been disconnected
      if (solCerberus) {
        clearStates();
      }
      return;
    }
    if (solCerberus) return;
    setSolCerberus(
      new SolCerberus(new PublicKey(appId), get_provider(connection, wallet))
    );
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
      </div>
    </>
  );
}
