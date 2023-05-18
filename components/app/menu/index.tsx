import { MenuPropsTypes } from "./types";
import styles from "./menu.module.scss";
import dynamic from "next/dynamic";
import Link from "next/link";

const Button = dynamic(() => import("../../button"));
const Icon = dynamic(() => import("../../icon"));

export default function Menu({ appId, active }: MenuPropsTypes) {
  return (
    <div className={styles.menu}>
      <Button className={active === "roles" ? "active" : ""}>
        <Link href={`/app/${appId}/roles`}>
          <Icon cType="roles" /> Roles
        </Link>
      </Button>
      <Button className={active === "permissions" ? "active" : ""}>
        <Link href={`/app/${appId}/permissions`}>
          <Icon cType="permissions" /> Permissions
        </Link>
      </Button>
      <Button className={active === "settings" ? "active" : ""}>
        <Link href={`/app/${appId}/settings`}>
          <Icon cType="gear" /> Settings
        </Link>
      </Button>
    </div>
  );
}
