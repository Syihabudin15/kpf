"use client";

import { Role } from "@prisma/client";
import { Menu } from "antd";
import { menusV2 } from "./daftarMenuV2";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ListMenuVer2({
  role,
  open,
}: {
  role: Role;
  open: boolean;
}) {
  const pathname = usePathname();
  // const [result, setResult] = useState<Menus[]>([]);
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
        items={menusV2.map((menu) => {
          const child =
            menu.child &&
            menu.child?.map((child) => {
              return {
                label: (
                  <Link
                    className={`text-sm ${
                      pathname === child.url ? "text-blue-500" : "text-gray-800"
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
        })}
      />
    </div>
  );
}
