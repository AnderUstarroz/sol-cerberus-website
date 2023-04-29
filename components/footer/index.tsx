import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import styles from "./Footer.module.scss";
import { FooterPropsType } from "./types";

const Icon = dynamic(() => import("../icon"));
const animation = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 },
};

export default function Footer({ className }: FooterPropsType) {
  return (
    <motion.footer
      className={`${styles.footer}${className ? ` ${className}` : ""}`}
    >
      <div>
        <motion.a href="/" title="Homepage" {...animation}>
          Sol Cerberus
        </motion.a>

        <div className={styles.icons}>
          <motion.a
            title="Sol Cerberus in Twitter"
            href={process.env.NEXT_PUBLIC_TWITTER}
            target="_blank"
            {...animation}
          >
            <Icon cType="twitter" height={12} width={12} />
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
}
