import styles from "./ConnectWallet.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_ANIMATION } from "../utils/animation";
import dynamic from "next/dynamic";

const Button = dynamic(() => import("../button"));

export default function ConnectWallet() {
  return (
    <AnimatePresence>
      <motion.div
        className={`vhAligned ${styles.adminWelcome}`}
        {...DEFAULT_ANIMATION}
      >
        <div>
          <h1>Welcome</h1>
          <p>Connect your wallet to access dashboard</p>
          <Button cType="wallet" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
