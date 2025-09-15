"use client";

import { Role } from "@prisma/client";
import { Menu } from "antd";
import { Menus, menusV2 } from "./daftarMenuV2";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BankOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import { GiroPos } from "../Interfaces";

export default function ListMenuVer2({
  role,
  open,
}: {
  role: Role;
  open: boolean;
}) {
  const pathname = usePathname();
  const [result, setResult] = useState<Menus[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/administrasi/giro-pos");
      if (res.ok) {
        const dataMenu = {
          label: "Giro POS",
          url: "/laporan-administrasi/giro",
          role: ["MASTER"],
          icon: <BankOutlined />,
          child: [
            {
              label: "List Giro POS",
              url: "/laporan-administrasi/giro-pos",
              role: ["MASTER"],
              icon: <BankOutlined />,
            },
          ],
        };
        const { data } = await res.json();
        data.forEach((d: GiroPos) => {
          dataMenu.child.push({
            label: d.name,
            url: `/laporan-administrasi/bank/${d.slug}`,
            role: ["MASTER"],
            icon: <BankOutlined />,
          });
        });
        dataMenu.child.push({
          label: "Laba Rugi",
          url: `/laporan-administrasi/laba-rugi`,
          role: ["MASTER"],
          icon: <MoneyCollectOutlined />,
        });
        menusV2.push(dataMenu);
      }

      const menuUser: Menus[] = [];
      menusV2.forEach((item) => {
        if (item.role.includes("ALL") && !item.child)
          return menuUser.push(item);
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
        setResult(menuUser);
      });
    })();
  }, []);
  return (
    <div>
      <Menu
        mode="inline"
        inlineCollapsed={open}
        defaultSelectedKeys={[pathname]}
        style={{
          overflowY: "auto",
          width: "100%",
          height: open ? "80vh" : "68vh",
        }}
        items={
          result &&
          result.map((menu) => {
            const child =
              menu.child &&
              menu.child?.map((child) => {
                return {
                  label: (
                    <Link
                      className={`text-sm ${
                        pathname === child.url
                          ? "text-blue-500"
                          : "text-gray-800"
                      }`}
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
                    className={`text-sm ${
                      child.map((an) => an.key).includes(pathname)
                        ? "text-blue-500"
                        : "text-gray-800"
                    }`}
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
                    className={`text-sm ${
                      pathname === menu.url ? "text-blue-500" : "text-gray-800"
                    }`}
                    href={menu.url}
                  >
                    {menu.label}
                  </Link>
                ),
                key: menu.url,
                icon: menu.icon,
              };
            }
          })
        }
      />
    </div>
  );
}
