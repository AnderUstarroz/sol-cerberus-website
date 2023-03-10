import Head from "next/head";
import styles from "../styles/Home.module.scss";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { DEFAULT_ANIMATION } from "../components/utils/animation";
import { ReactNode, useState } from "react";
import Link from "next/link";

// https://www.shutterstock.com/video/clip-28255210-sun-surface-solar-flares
// https://www.google.com/search?q=sun+burning+video&rlz=1C5CHFA_enES984ES984&oq=sun+burning+video&aqs=chrome..69i57j0i19i512l9.2381j0j7&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:e9eb4c89,vid:WBMl-JV0DoE

const Logo = dynamic(() => import("../components/logo"));
const Icon = dynamic(() => import("../components/icon"));
// const Input = dynamic(() => import("../components/input"));s
const Modal = dynamic(() => import("../components/modal"));
const Button = dynamic(() => import("../components/button"));

export default function Home() {
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
      </Head>
      <AnimatePresence>
        <motion.div className={styles.container} {...DEFAULT_ANIMATION}>
          <Logo />
          <h1>
            <span>Sol</span> Cerberus
          </h1>
          <p>Solana's on-chain watch dog</p>
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
                With Sol Cerberus, you can effortlessly build bulletproof
                decentralized apps in Web 3.0, but also includes built-in
                authentication for added convenience:
              </p>
              <ul className="sqList">
                <li>
                  <strong>Wallet:</strong> Grant access to specific Wallet.
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
          <section>
            <h3 className="txtCenter mb-big">
              Would you like a practical example?
            </h3>
            <div className="aligned centered">
              <Link href="https://demo.solcerberus.com/">
                <Button className="big">View Demo</Button>
              </Link>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
      <Modal modalId={"main"} modals={modals} setIsOpen={setModals}>
        {mainModal}
      </Modal>
    </>
  );
}
