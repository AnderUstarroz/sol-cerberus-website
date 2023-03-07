import styles from "./Layout.module.scss";
import Headroom from "react-headroom";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const MobileNav = dynamic(() => import("../mobile_nav"));
const Nav = dynamic(() => import("../nav"));

export default function Layout({ children }: any) {
  return (
    <>
      <Headroom className={styles.HeadRoom}>
        <motion.header>
          <Nav />
          <MobileNav />
        </motion.header>
      </Headroom>
      <main>{children}</main>
    </>
  );
}
