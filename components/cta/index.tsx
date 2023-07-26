import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import styles from "./CTA.module.scss";
import { DEFAULT_ANIMATION } from "../utils/animation";
import { CTAPropsType } from "./types";
import Link from "next/link";

const Button = dynamic(() => import("../button"));
const Icon = dynamic(() => import("../icon"));

export default function CTA({ handleSave, handleCancel }: CTAPropsType) {
  return (
    <motion.div className={styles.cta} {...DEFAULT_ANIMATION}>
      <Link href={"/app"}>
        <Icon cType="chevron" direction="left" /> Back
      </Link>
      <div className="right aligned">
        {!!handleCancel && (
          <Button className="button1" onClick={() => handleCancel()}>
            Cancel
          </Button>
        )}
        {!!handleSave && (
          <Button className="button5 pulsar" onClick={() => handleSave()}>
            Save changes
          </Button>
        )}
      </div>
    </motion.div>
  );
}
