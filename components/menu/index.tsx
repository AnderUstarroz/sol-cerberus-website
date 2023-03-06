import { useRouter } from "next/router";
import { MenuTypes, MenuType } from "./types";
import dynamic from "next/dynamic";

const Menus: MenuTypes = {
  "/": dynamic(() => import("./home")),
  "/404": dynamic(() => import("./home")),
};
const DefaultMenu = ({ toggle }: MenuType) => {
  return <></>;
};
export default function Menu({ toggle }: MenuType) {
  const router = useRouter();
  const Menu = Menus.hasOwnProperty(router.pathname)
    ? Menus[router.pathname]
    : DefaultMenu;

  return <Menu toggle={toggle} />;
}
