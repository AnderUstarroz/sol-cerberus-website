import Head from "next/head";
import styles from "../styles/Home.module.scss";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { DEFAULT_ANIMATION } from "../components/utils/animation";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { siteUrl } from "../components/utils/url";

// https://www.shutterstock.com/video/clip-28255210-sun-surface-solar-flares
// https://www.google.com/search?q=sun+burning+video&rlz=1C5CHFA_enES984ES984&oq=sun+burning+video&aqs=chrome..69i57j0i19i512l9.2381j0j7&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:e9eb4c89,vid:WBMl-JV0DoE

const Logo = dynamic(() => import("../components/logo"));
const Icon = dynamic(() => import("../components/icon"));
// const Input = dynamic(() => import("../components/input"));s
const Modal = dynamic(() => import("../components/modal"));
const Button = dynamic(() => import("../components/button"));
const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

export default function Home({ router }) {
  const [modals, setModals] = useState({
    main: false,
    roles: false,
    rules: false,
    resourceForm: false,
  });
  const [mainModal, _setMainModal] = useState<ReactNode>(null);

  // const setMainModalContent = (content: any, show = true) => {
  //   if (show) {
  //     setMainModal(content);
  //   }
  //   setModals({ ...modals, main: show });
  // };

  return (
    <>
      <Head>
        <title>Sol Cerberus</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="The new authority for permission management"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content={siteUrl("")} />
        <meta property="og:url" content={siteUrl("")} />
        <meta name="twitter:url" content={siteUrl("")} />
        <meta property="og:title" content="Sol Cerberus" />
        <meta name="twitter:title" content="Sol Cerberus" />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/AnderUstarroz/sol-cerberus-website/main/public/images/logo.webp"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/AnderUstarroz/sol-cerberus-website/main/public/images/logo.webp"
        />
        <meta
          name="twitter:description"
          content="The new authority for permission management"
        />
        <meta
          property="og:description"
          content="The new authority for permission management"
        />
      </Head>
      <AnimatePresence>
        <motion.div
          className={`page ${styles.container}`}
          {...DEFAULT_ANIMATION}
        >
          <Logo />
          <h1>
            <span>Sol</span> Cerberus
          </h1>
          <p>The new authority</p>
          <section>
            <div className={styles.videoWrapper}>
              <ReactPlayer
                width="100%"
                height="100%"
                heigh="auto"
                url="https://www.youtube.com/watch?v=ryE8Rhfc47I"
                controls={true}
              />
            </div>
            <h3 className="txtCenter mb-big">
              Want to see Sol Cerberus in action?
            </h3>
            <div className="aligned centered">
              <Link href="https://demo.solcerberus.com/">
                <Button className="big">View Demo</Button>
              </Link>
            </div>
          </section>
          <section>
            <div className={styles.shapeBox}>
              <div>
                <div className="">
                  <div className="txtCenter">
                    <Icon
                      cType="shield"
                      width={100}
                      height={100}
                      color="#655d5c"
                    />
                  </div>
                  <h2 className={styles.h2internal}>Armored DAPPs</h2>
                  <p className={styles.textDesc}>
                    Sol Cerberus is a fine-grained RBAC (Role-based access
                    control) system designed to enhance the security of Solana
                    Blockchain applications.
                  </p>
                </div>
                <div className="aligned centered">
                  <Link href="https://docs.solcerberus.com/">
                    <Button className="big button1">Learn more</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section>
            <h2>Wallet & NFT access out of the box</h2>
            <fieldset className={`${styles.desc} ${styles.strongW}`}>
              <p>
                Sol Cerberus includes the following built-in authentication
                methods:
              </p>
              <ul className="sqList">
                <li>
                  <strong>Wallet:</strong> Grant access to specific Wallets.
                </li>
                <li>
                  <strong>NFT:</strong> Grant access to owners of specific NFTs.
                </li>
                <li>
                  <strong>NFT collection:</strong> Grant access to owners of
                  NFTs which belong to specific collections.
                </li>
              </ul>
            </fieldset>
          </section>
        </motion.div>
      </AnimatePresence>
      <Modal modalId={"main"} modals={modals} setIsOpen={setModals}>
        {mainModal}
      </Modal>
    </>
  );
}
