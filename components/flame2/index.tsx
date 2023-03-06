import styles from "./Flame2.module.scss";
import { FlamePropsType } from "./types";

export default function Flame2({ active, children, ...props }: FlamePropsType) {
  return (
    <div
      className={`${styles.container}${active ? " activeBg" : ""}`}
      {...props}
    >
      {active ? (
        <>
          <div className={styles.flameWrapper}>
            <div className={styles.fire}>
              <div className={styles.bottom}></div>
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
            </div>
          </div>
          <svg version="1.1" style={{ display: "none" }}>
            <defs>
              <filter id="goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="10"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                  result="goo"
                />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          </svg>
          <style jsx>{`
        `}</style>
        </>
        
      ) : (
        ""
      )}
      <div className={styles.content}>
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  );
}
