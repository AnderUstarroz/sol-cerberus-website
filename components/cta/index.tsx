import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import styles from "./CTA.module.scss";
import { DEFAULT_ANIMATION } from "../utils/animation";
import { CTAPropsType } from "./types";

const Button = dynamic(() => import("../button"));

export default function CTA({ handleSave }: CTAPropsType) {
  return (
    <motion.div className={styles.cta} {...DEFAULT_ANIMATION}>
      <motion.div>
        <Button className="save">Save changes</Button>
      </motion.div>
    </motion.div>
  );
}
