import React from "react";
import styles from "./Modal.module.scss";
import dynamic from "next/dynamic";
import ReactModal from "react-modal";

const Icon = dynamic(() => import("../icon"));
const Button = dynamic(() => import("../button"));
ReactModal.setAppElement("#__next");

const Modal = (props: any) => {
  return (
    <ReactModal
      className={props.className ? props.className : styles.modal}
      isOpen={props.modals[props.modalId]}
      onAfterOpen={() => (document.body.style.overflow = "hidden")}
      onAfterClose={() => (document.body.style.overflow = "unset")}
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
      }}
      onRequestClose={() => props.setIsOpen(false)}
      {...props}
    >
      <div className={`cubHeader ${styles.modHead}`}>
        <Button cType="transparent" onClick={() => props.setIsOpen(false)}>
          <Icon cType="close" className="icon3" />
        </Button>
      </div>
      <div className={styles.modBody}>{props.children}</div>
    </ReactModal>
  );
};

export default Modal;
