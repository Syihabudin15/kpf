import { getServerSession } from "next-auth";
import prisma from "../prisma";
// import { MenuItem, menus } from "./menu/daftarMenu";
import { redirect } from "next/navigation";
import { MenuItem, menusV2 } from "./menu/daftarMenuV2";

export const handleRoute = async (path: string) => {
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!user) return redirect("/");
  let currMenu: MenuItem[] = [];

  menusV2.forEach((menu) => {
    if (!menu.child && menu.url === path) return currMenu.push(menu);
    if (menu && menu.child) {
      const filter = menu.child?.filter((c) => c.url === path);
      if (filter.length !== 0) return currMenu.push(filter[0]);
    }
  });
  if (!currMenu[0].role.includes(user.role) && currMenu[0].role !== "ALL") {
    return redirect("/");
  }
};
