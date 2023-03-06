import * as React from "react";
import { IconType } from "../types";
function Forbidden(props: IconType) {
  return (
    <svg
      width={props.width ? props.width : 14}
      height={props.height ? props.height : 14}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.8572 2.34313C12.3462 0.832145 10.3372 0 8.20033 0C6.06346 0 4.05449 0.832145 2.54351 2.34313C-0.575668 5.4623 -0.575716 10.5376 2.54346 13.6568C4.05444 15.1679 6.06346 16 8.20033 16C10.3372 16 12.3462 15.1679 13.8572 13.6568C16.9764 10.5376 16.9764 5.4623 13.8572 2.34313ZM12.8287 12.6283C11.5924 13.8646 9.94864 14.5455 8.20033 14.5455C6.45201 14.5455 4.80823 13.8646 3.57197 12.6283C1.01992 10.0762 1.01997 5.92373 3.57202 3.37164C4.80828 2.13537 6.45197 1.45455 8.20033 1.45455C9.94869 1.45455 11.5924 2.13537 12.8287 3.37164C15.3807 5.92369 15.3807 10.0762 12.8287 12.6283Z"
        fill={props.color ? props.color : "var(--iconFill0)"}
      />
      <path
        d="M9.22884 8L11.8001 5.4287C12.0841 5.14473 12.0841 4.68422 11.8001 4.40019C11.5161 4.11622 11.0556 4.11622 10.7716 4.40019L8.20033 6.97149L5.62904 4.40019C5.34506 4.11622 4.88455 4.11622 4.60053 4.40019C4.3165 4.68417 4.3165 5.14468 4.60053 5.4287L7.17183 8L4.60053 10.5713C4.3165 10.8553 4.3165 11.3158 4.60053 11.5998C4.74254 11.7418 4.92867 11.8128 5.11481 11.8128C5.30094 11.8128 5.48707 11.7418 5.62904 11.5998L8.20033 9.02851L10.7716 11.5998C10.9136 11.7418 11.0998 11.8128 11.2859 11.8128C11.472 11.8128 11.6581 11.7418 11.8001 11.5998C12.0842 11.3158 12.0842 10.8553 11.8001 10.5712L9.22884 8Z"
        fill={props.color ? props.color : "var(--iconFill0)"}
      />
    </svg>
  );
}

export default Forbidden;