import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import styles from "./CTA.module.scss";
import { DEFAULT_ANIMATION } from "../utils/animation";
import { CTAPropsType } from "./types";

const Button = dynamic(() => import("../button"));

export default function CTA({ handleSave }: CTAPropsType) {
  return (
    <div className={styles.cta}>
      <AnimatePresence>
        {!!handleSave && (
          <motion.div {...DEFAULT_ANIMATION}>
            <Button className="save">Save changes</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
