import { useRouter } from "next/router";
import { MenuTypes, MenuType } from "./types";
import dynamic from "next/dynamic";

const Menus: MenuTypes = {};

export default function Menu({ toggle }: MenuType) {
  const router = useRouter();
  const Menu = Menus.hasOwnProperty(router.pathname)
    ? Menus[router.pathname]
    : dynamic(() => import("./home"));

  return <Menu toggle={toggle} />;
}
