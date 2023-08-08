import Link from "next/link";
import styles from "./breadcrumbs.module.scss";
import dynamic from "next/dynamic";
import { shortKey } from "sol-cerberus-js";
import { BreadcrumbsPropsType } from "./types";
import { flashMsg } from "../../utils/helpers";

const Button = dynamic(() => import("../../button"));
const Icon = dynamic(() => import("../../icon"));

export default function Breadcrumbs({ appId, section }: BreadcrumbsPropsType) {
  return (
    <div className={styles.breadcrumbs}>
      <Button>
        <Link href={"/app"}>APPs</Link>
      </Button>
      <Icon cType="chevron" direction="right" />{" "}
      <Button
        title="Copy APP ID"
        onClick={() => {
          navigator.clipboard.writeText(appId);
          flashMsg("APP ID copied!", "info", 2000);
        }}
      >
        {shortKey(appId)}
      </Button>
      <Icon cType="chevron" direction="right" /> <Button>{section}</Button>
    </div>
  );
}
