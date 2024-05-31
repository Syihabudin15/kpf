import React from "react";
import { CopyrightCircleOutlined, EditFilled } from "@ant-design/icons";
import { getServerSession } from "next-auth";
import Logout from "./Logout";
import prisma from "../prisma";
import Link from "next/link";
import ListMenuVer2 from "../utils/menu/ListMenuVer2";
import MobileMenuVer2 from "../utils/menu/MobileMenuVer2";
import NotifVer2 from "../utils/menu/NotifVer2";

export default async function MenuVer({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
    include: { UnitCabang: true },
  });

  return (
    <div>
      <div className="flex justify-between px-5 py-4 shadow items-center bg-white border-b">
        <div className="flex gap-3 items-center">
          <div>
            <img
              src={process.env.NEXTAUTH_PUBLIC_APP_LOGO}
              alt={"Logo " + process.env.NEXTAUTH_PUBLIC_APP_NAME}
              width={25}
              height={25}
            />
          </div>
          <span className="font-bold text-sm italic">
            {process.env.NEXTAUTH_PUBLIC_APP_NAME}
          </span>
        </div>
        <div className="hidden md:flex gap-2">
          <NotifVer2 role={user?.role || "MARKETING"} />
          <div style={{ marginLeft: 20, color: "red" }}>
            <Logout />
          </div>
        </div>
        <div className="mobile-ver2">
          <MobileMenuVer2 role={user?.role || "MARKETING"} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }} className="sm:p-3">
        <div style={{ flex: 0.6 }} className="childWrap windows-ver2">
          <div className="flex gap-4 text-xs items-center bg-gray-800 text-white rounded p-2">
            <div style={{ width: 80 }}>
              <img
                src={user?.picture || "/assets/images/profile_default.svg"}
                alt="User Picture"
              />
            </div>
            <div>
              <div className="font-bold">
                {user?.first_name.toUpperCase()} {user?.last_name.toUpperCase()}
              </div>
              <div style={{ marginTop: 5 }}>
                <span>
                  {user?.role} | {user?.UnitCabang && user.UnitCabang.name}{" "}
                  <EditFilled /> Edit
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <ListMenuVer2 role={user?.role || "MARKETING"} open={false}/>
          </div>
        </div>
        <div style={{ flex: 2 }} className="childWrap">
          {children}
        </div>
      </div>
      <footer className="flex justify-between items-center py-3 px-3 bg-white">
        <div className="flex gap-10">
          <span className="font-semibold text-xs">
            Copyright {new Date().getFullYear()} <CopyrightCircleOutlined /> |{" "}
            <Link href={"/"} className="text-blue-700">
              {process.env.NEXTAUTH_PUBLIC_APP_NAME}
            </Link>{" "}
            .
          </span>
          <span className="font-semibold text-xs">Allright Reserved</span>
        </div>
        <div className="footer-ver">
          <span className="font-semibold text-xs">
            Version: 1 - {process.env.NEXTAUTH_PUBLIC_APP_VER}
          </span>
        </div>
      </footer>
    </div>
  );
}
