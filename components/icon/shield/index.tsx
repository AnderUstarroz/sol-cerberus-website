import * as React from "react";
import { IconType } from "../types";
function Shield(props: IconType) {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : "225.000000pt"}
      height={props.height ? props.height : "225.000000pt"}
      viewBox="0 0 225.000000 225.000000"
      preserveAspectRatio="xMidYMid meet"
      className={props.className ? props.className : ""}
      onClick={props.onClick ? props.onClick : undefined}
    >
      <g
        transform="translate(0.000000,225.000000) scale(0.100000,-0.100000)"
        fill={props.color ? props.color : "var(--iconFill0)"}
        stroke="none"
      >
        <path
          d="M1040 2192 c-236 -124 -587 -222 -801 -222 -30 0 -60 -4 -66 -8 -24
-15 9 -396 53 -611 120 -578 433 -1057 861 -1314 l62 -38 92 57 c346 214 609
569 759 1024 77 232 118 468 135 773 l6 117 -46 0 c-81 0 -237 20 -354 46
-159 36 -294 84 -451 162 -74 37 -137 67 -140 68 -3 1 -52 -24 -110 -54z m192
-148 c188 -95 466 -179 653 -199 116 -12 108 -4 100 -98 -12 -146 -44 -349
-75 -471 -117 -456 -373 -850 -691 -1063 -66 -44 -68 -44 -97 -29 -52 27 -173
129 -263 222 -317 328 -495 768 -545 1346 l-6 76 48 7 c257 34 542 118 724
215 30 16 61 29 68 30 7 0 45 -16 84 -36z"
        />
        <path
          d="M1065 1879 c-126 -74 -347 -140 -522 -155 l-83 -7 0 -52 c0 -84 20
-263 41 -369 60 -301 191 -559 379 -746 79 -79 213 -180 239 -180 8 0 11 210
11 770 0 424 -3 770 -7 769 -5 0 -30 -13 -58 -30z"
        />
      </g>
    </svg>
  );
}

export default Shield;
