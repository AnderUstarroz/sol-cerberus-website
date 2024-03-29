import * as React from "react";
import { IconType } from "../types";

function Address(props: IconType) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      viewBox="0 0 24 24"
      width={props.width ? props.width : 20}
      height={props.height ? props.height : 20}
      className={props.className ? props.className : ""}
    >
      <path
        fill={props.color ? props.color : "white"}
        d="m9.5 6.5v3h-3v-3zm1.5-1.5h-6v6h6zm-1.5 9.5v3h-3v-3zm1.5-1.5h-6v6h6zm6.5-6.5v3h-3v-3zm1.5-1.5h-6v6h6zm-6 8h1.5v1.5h-1.5zm1.5 1.5h1.5v1.5h-1.5zm1.5-1.5h1.5v1.5h-1.5zm-3 3h1.5v1.5h-1.5zm1.5 1.5h1.5v1.5h-1.5zm1.5-1.5h1.5v1.5h-1.5zm1.5-1.5h1.5v1.5h-1.5zm0 3h1.5v1.5h-1.5zm4.5-10.5h-2v-3h-3v-2h5zm0 15v-5h-2v3h-3v2zm-20 0h5v-2h-3v-3h-2zm0-20v5h2v-3h3v-2z"
      />
    </svg>
  );
}

export default Address;
