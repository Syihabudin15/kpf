"use client";

import { Role } from "@prisma/client";
import { Menu } from "antd";
import { Menus, menusV2 } from "./daftarMenuV2";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ListMenuVer2({
  role,
  setOpen,
}: {
  role: Role;
  setOpen?: Function;
}) {
  const pathname = usePathname();

  const menuUser: Menus[] = [];
  menusV2.forEach((item) => {
    if (item.role.includes("ALL") && !item.child) return menuUser.push(item);
    if (item.role.includes(role) && !item.child) return menuUser.push(item);
    if ((item.role.includes(role) || item.role === "ALL") && item.child) {
      const filterChild = item.child.filter(
        (child) => child.role.includes(role) || child.role === "ALL"
      );
      return menuUser.push({
        label: item.label,
        url: item.url,
        icon: item.icon,
        child: filterChild,
        role: item.role,
      });
    }
  });
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[pathname]}
      style={{ height: "65vh", overflowY: "auto" }}
      items={menuUser.map((menu) => {
        const child =
          menu.child &&
          menu.child?.map((child) => {
            return {
              label: (
                <Link
                  className={
                    pathname === child.url ? "text-blue-500" : "text-gray-800"
                  }
                  href={child.url}
                >
                  {child.label}
                </Link>
              ),
              key: child.url,
              icon: child.icon,
            };
          });
        if (child && child?.length !== 0) {
          return {
            label: (
              <span
                className={
                  child.map((an) => an.key).includes(pathname)
                    ? "text-blue-500"
                    : "text-gray-800"
                }
              >
                {menu.label}
              </span>
            ),
            key: menu.url,
            icon: menu.icon,
            children: child,
          };
        } else {
          return {
            label: (
              <Link
                className={
                  pathname === menu.url ? "text-blue-500" : "text-gray-800"
                }
                href={menu.url}
              >
                {menu.label}
              </Link>
            ),
            key: menu.url,
            icon: menu.icon,
          };
        }
      })}
    />
  );
}
