import Head from "next/head";
import styles from "../styles/Home.module.scss";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { DEFAULT_ANIMATION } from "../components/utils/animation";
import { ReactNode, useState } from "react";

// https://www.shutterstock.com/video/clip-28255210-sun-surface-solar-flares
// https://www.google.com/search?q=sun+burning+video&rlz=1C5CHFA_enES984ES984&oq=sun+burning+video&aqs=chrome..69i57j0i19i512l9.2381j0j7&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:e9eb4c89,vid:WBMl-JV0DoE

const Logo = dynamic(() => import("../components/logo"));
// const Icon = dynamic(() => import("../components/icon"));
// const Input = dynamic(() => import("../components/input"));
const Modal = dynamic(() => import("../components/modal"));
// const Button = dynamic(() => import("../components/button"));

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
            <span>Sol</span> Cerberus Demo
          </h1>
          <p>The watchdog of your Solana programs</p>
          <section>
            <h2>Description</h2>
            <fieldset className={styles.desc}>
              <p>some text:</p>
              <ul className="sqList">
                <li>aaaa</li>
                <li>bbbb</li>
                <li>ccccc</li>
              </ul>
              <p>Sample text</p>
            </fieldset>
          </section>
          <section>
            <h2>Another Section</h2>
            <fieldset>
              <p>blablabla</p>
              <table>
                <thead>
                  <tr>
                    <th>a</th>
                    <th>b</th>
                    <th>c</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <motion.tr {...DEFAULT_ANIMATION}>
                    <td>
                      <strong>aaaa</strong>
                    </td>
                    <td>bbb</td>
                    <td>ccccc</td>
                    <td>dd</td>
                  </motion.tr>
                </tbody>
              </table>
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
