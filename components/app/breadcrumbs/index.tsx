import Link from "next/link";
import styles from "./breadcrumbs.module.scss";
import dynamic from "next/dynamic";
import { short_key } from "sol-cerberus-js";
import { BreadcrumbsPropsType } from "./types";

const Button = dynamic(() => import("../../button"));
const Icon = dynamic(() => import("../../icon"));

export default function Breadcrumbs({ appId, section }: BreadcrumbsPropsType) {
  return (
    <div className={styles.breadcrumbs}>
      <Button>
        <Link href={"/app"}>APPs</Link>
      </Button>
      <Icon cType="chevron" direction="right" />{" "}
      <Button>{short_key(appId)}</Button>
      <Icon cType="chevron" direction="right" /> <Button>{section}</Button>
    </div>
  );
}
