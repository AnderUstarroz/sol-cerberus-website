// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import Head from "next/head";
// import { ReactNode, useEffect, useState } from "react";
// import { siteUrl } from "../../components/utils/url";
// import styles from "../../styles/Apps.module.scss";
// import dynamic from "next/dynamic";
// import { SolCerberus } from "sol-cerberus-js";
// import { motion, AnimatePresence } from "framer-motion";
// import { DEFAULT_ANIMATION } from "../../components/utils/animation";
// import { PublicKey } from "@solana/web3.js";

// const ConnectWallet = dynamic(() => import("../../components/connect-wallet"));
// const Spinner = dynamic(() => import("../../components/spinner"));

export default function Apps({ router }) {
  // const { publicKey, wallet, sendTransaction } = useWallet();
  // const { connection } = useConnection();
  // const [loading, setLoading] = useState<boolean>(false);
  // const [modals, setModals] = useState({
  //   main: false,
  // });

  // const [mainModal, setMainModal] = useState<ReactNode>(null);

  // const setMainModalContent = (content: any, show = true) => {
  //   if (show) {
  //     setMainModal(content);
  //   }
  //   setModals({ ...modals, main: show });
  // };

  // const initAccounts = async (walletPublicKey: PublicKey) => {
  //   setLoading(true);

  //   let sc: SolCerberus;
  //   // const provider: anchor.Provider = get_provider(connection, wallet);
  //   // let scAppId: PublicKey;
  //   // let sc: SolCerberus;
  //   // let scAppPda: PublicKey;
  //   // let demoPda: PublicKey;
  //   // try {
  //   //   scAppId = new PublicKey(appIdStr);
  //   //   sc = new SolCerberus(scAppId, provider, {
  //   //     rulesChangedCallback: handleUpdatedRules,
  //   //     rolesChangedCallback: handleUpdatedRoles,
  //   //   });
  //   //   setSolCerberus(sc);
  //   //   [scAppPda, demoPda] = (
  //   //     await Promise.allSettled([sc_app_pda(scAppId), demo_pda(scAppId)])
  //   //   )
  //   //     .filter((r: any) => r.status === "fulfilled")
  //   //     .map((r: any) => r.value);
  //   // } catch (e) {
  //   //   flashMsg(`Invalid APP ID ${appIdStr}`);
  //   //   console.error(`Invalid APP ID ${appIdStr}`);
  //   //   return (window.location.href = "/");
  //   // }
  //   // const demoProg = get_demo_program(provider);
  //   // setPdas({ scAppPda: scAppPda, demoPda: demoPda });
  //   // setDemoProgram(demoProg);
  //   // setPermissions(await sc.fetchPerms());
  //   // setAllAssignedRoles(await sc.fetchAssignedRoles());
  //   // setMetaplex(new Metaplex(connection));
  //   // try {
  //   //   await refreshDemo(demoProg, demoPda);
  //   // } catch (e) {
  //   //   if (appIdStr !== myAppId(publicKey)) {
  //   //     console.error(`Invalid APP ID ${appIdStr}`);
  //   //     return (window.location.href = "/");
  //   //   }
  //   // }

  //   setLoading(false);
  // };

  // useEffect(() => {
  //   if (!publicKey) {
  //     // Clear all data when user's wallet has been disconnected
  //     return;
  //   }
  //   initAccounts(publicKey);
  // }, [publicKey]);
  // return (
  //   <>
  //     <Head>
  //       <title>Sol Cerberus APPs</title>
  //       <link rel="icon" href="/favicon.ico" />
  //       <meta
  //         name="description"
  //         content="Create your own role base access control for Solana"
  //       />
  //       <meta property="og:type" content="website" />
  //       <meta name="twitter:card" content="summary_large_image" />
  //       <meta name="twitter:domain" content={siteUrl("/app")} />
  //       <meta property="og:url" content={siteUrl("/app")} />
  //       <meta name="twitter:url" content={siteUrl("/app")} />
  //       <meta property="og:title" content="Sol Cerberus APPs" />
  //       <meta name="twitter:title" content="Sol Cerberus APPs" />
  //       <meta
  //         property="og:image"
  //         content="https://raw.githubusercontent.com/AnderUstarroz/sol-cerberus-website/main/public/images/logo.webp"
  //       />
  //       <meta
  //         name="twitter:image"
  //         content="https://raw.githubusercontent.com/AnderUstarroz/sol-cerberus-website/main/public/images/logo.webp"
  //       />
  //       <meta
  //         name="twitter:description"
  //         content="Create your own role base access control for Solana"
  //       />
  //       <meta
  //         property="og:description"
  //         content="Create your own role base access control for Solana"
  //       />
  //     </Head>
  //     {!publicKey ? (
  //       <ConnectWallet />
  //     ) : (
  //       <AnimatePresence>
  //         {loading ? (
  //           <motion.div
  //             key={"spinner"}
  //             className={styles.loading}
  //             {...DEFAULT_ANIMATION}
  //           >
  //             <Spinner />
  //           </motion.div>
  //         ) : (
  //           <motion.div
  //             key={"content"}
  //             className={`page ${styles.container}`}
  //             {...DEFAULT_ANIMATION}
  //           >
  //             <h1>My APPs</h1>
  //             <div>mickey mouse</div>
  //             <div>mickey mouse</div>
  //           </motion.div>
  //         )}
  //       </AnimatePresence>
  //     )}
  //   </>
  // );

  return <></>;
}
