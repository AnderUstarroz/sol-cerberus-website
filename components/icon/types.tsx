import { MouseEventHandler } from "react";

export interface IconType {
  cType: string;
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  bg?: string;
  title?: string;
  style?: { [key: string]: any };
  onClick?: MouseEventHandler<SVGSVGElement>;
  direction?: string;
  "data-tooltip-id"?: string;
  "data-tooltip-content"?: string;
}

export interface IconTypes {
  [key: string]: any;
}
