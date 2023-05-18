import styles from "./Layout.module.scss";
import Headroom from "react-headroom";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const MobileNav = dynamic(() => import("../mobile_nav"));
const Nav = dynamic(() => import("../nav"));
const Footer = dynamic(() => import("../footer"));

export default function Layout({ children }: any) {
  const router = useRouter();
  return (
    <>
      <Headroom className={styles.HeadRoom}>
        <motion.header>
          <Nav />
          <MobileNav />
        </motion.header>
      </Headroom>
      <main>{children}</main>
      {router.pathname.slice(0, 13) !== "/app/[appID]/" && <Footer />}
    </>
  );
}
