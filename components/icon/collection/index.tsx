import * as React from "react";
import { IconType } from "../types";

function Collection(props: IconType) {
  return (
    <svg
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 1000 1000"
      enableBackground="new 0 0 1000 1000"
      xmlSpace="preserve"
      width={props.width ? props.width : 20}
      height={props.height ? props.height : 20}
      className={props.className ? props.className : ""}
    >
      <g fill={props.color ? props.color : "white"}>
        <g>
          <rect x="54.5" y="143.6" width="890.9" height="44.5" />
          <path d="M10,238.5v701.2c0,3.2,2.8,5.7,6.3,5.7h967.5c3.5,0,6.2-2.6,6.2-5.7V238.5c0-3.2-2.8-5.7-6.2-5.7H16.3C12.8,232.7,10,235.3,10,238.5z M789.5,321.8c36.9,0,66.8,29.9,66.8,66.8c0,36.9-29.9,66.8-66.8,66.8c-36.9,0-66.8-29.9-66.8-66.8C722.7,351.8,752.7,321.8,789.5,321.8z M99,839l268.9-429.5c3.3-6.2,8.8-6.2,12.3-0.2l145.1,250.5c1.8,3.1,5.7,3.9,8.5,1.9l123.1-86.6c5.7-4.1,13.4-2.6,17.3,3.4l223.7,261c3.8,5.9,1,10.7-5.6,10.7H105.6C98.7,850.3,95.8,845.3,99,839z" />
          <rect x="99.1" y="54.5" width="801.8" height="44.5" />
        </g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
      </g>
    </svg>
  );
}

export default Collection;
