import Head from "next/head";
// import { ReactNode, useState } from "react";
import { siteUrl } from "../../../components/utils/url";
import styles from "../../../styles/Apps.module.scss";

export default function Apps({ router }) {
  // const [modals, setModals] = useState({
  //   main: false,
  // });

  // const [mainModal, _setMainModal] = useState<ReactNode>(null);

  // const setMainModalContent = (content: any, show = true) => {
  //   if (show) {
  //     setMainModal(content);
  //   }
  //   setModals({ ...modals, main: show });
  // };
  return (
    <>
      <Head>
        <title>Sol Cerberus RBAC APP</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Create your own role base access system for Solana"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content={siteUrl("/app")} />
        <meta property="og:url" content={siteUrl("/app")} />
        <meta name="twitter:url" content={siteUrl("/app")} />
        <meta property="og:title" content="Sol Cerberus RBAC APP" />
        <meta name="twitter:title" content="Sol Cerberus RBAC APP" />
      </Head>
      <div className={`page ${styles.container}`}>works!</div>
    </>
  );
}
