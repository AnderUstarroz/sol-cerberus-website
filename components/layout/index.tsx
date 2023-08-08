import styles from "./Layout.module.scss";
import Headroom from "react-headroom";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { LayoutPropsType } from "./types";

const MobileNav = dynamic(() => import("../mobile_nav"));
const Nav = dynamic(() => import("../nav"));
const Network = dynamic(() => import("../network"), {
  ssr: false,
});
const Footer = dynamic(() => import("../footer"));

export default function Layout({
  cluster,
  setCluster,
  router,
  children,
}: LayoutPropsType) {
  return (
    <>
      <Headroom className={styles.HeadRoom}>
        <motion.header>
          <Nav />
          <Network cluster={cluster} setCluster={setCluster} router={router} />
          <MobileNav />
        </motion.header>
      </Headroom>
      <main>{children}</main>
      {router.pathname.slice(0, 13) !== "/app/[appID]/" && <Footer />}
    </>
  );
}
