import * as React from "react";
import { motion } from "framer-motion";
import { MenuItemType } from "./types";
import styles from "./MenuItem.module.scss";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const MenuItem = ({
  className,
  whileHover,
  whileTap,
  children,
}: MenuItemType) => {
  return (
    <motion.li
      variants={variants}
      whileHover={whileHover ? whileHover : { scale: 1.1 }}
      whileTap={whileTap ? whileTap : { scale: 0.95 }}
      className={className ? styles[className] : undefined}
    >
      {children}
    </motion.li>
  );
};

export default MenuItem;
