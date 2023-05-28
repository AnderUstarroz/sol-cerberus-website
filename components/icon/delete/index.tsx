import * as React from "react";
import { IconType } from "../types";
function Delete(props: IconType) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.0"
      width={props.width ? props.width : 10}
      height={props.height ? props.height : 10}
      className={props.className ? props.className : ""}
      viewBox="0 0 1280.000000 1280.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <path
          fill={props.color ? props.color : "white"}
          d="M1327 11473 l-1327 -1328 1872 -1872 1873 -1873 -1873 -1873 -1872 -1872 1327 -1328 1328 -1327 1872 1872 1873 1873 1873 -1873 1872 -1872 1328 1327 1327 1328 -1872 1872 -1873 1873 1873 1873 1872 1872 -1327 1328 -1328 1327 -1872 -1872 -1873 -1873 -1873 1873 -1872 1872 -1328 -1327z"
        />
      </g>
    </svg>
  );
}

export default Delete;
