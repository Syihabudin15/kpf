import { CopyrightCircleOutlined } from "@ant-design/icons";

import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/components/prisma";
import Logout from "@/components/views/Logout";
import MobileMenuVer2 from "@/components/utils/menu/MobileMenuVer2";
import NotifVer2 from "@/components/utils/menu/NotifVer2";
import MenuWrapper from "@/components/utils/menu/MenuWrapper";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/");
  }
  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
    include: { Bank: true, UnitCabang: { include: { UnitPelayanan: true } } },
  });
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        height: "100vh",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          className={`flex justify-between px-5 py-4 shadow items-center bg-${
            process.env.NEXT_PUBLIC_APP_BG_MENU
          } ${
            process.env.NEXT_PUBLIC_APP_BG_MENU == "white"
              ? "text-black"
              : "text-white"
          }`}
        >
          <div className="flex gap-3 items-center">
            <div>
              <img
                src={process.env.NEXT_PUBLIC_APP_LOGO}
                alt={`Logo ${process.env.NEXT_PUBLIC_APP_NAME}`}
                width={25}
                height={25}
              />
            </div>
            <span className="font-bold text-xs sm:text-sm italic">
              {(
                process.env.NEXT_PUBLIC_APP_FULL_NAME || "PENSIUNAN"
              ).toUpperCase()}
            </span>
          </div>
          <div className="hidden md:flex md:items-center gap-2">
            <NotifVer2 role={user?.role || "MARKETING"} />
            <div style={{ marginLeft: 20, color: "red" }}>
              <Logout />
            </div>
          </div>
          <div className="block md:hidden">
            <MobileMenuVer2 role={user?.role || "MARKETING"} />
          </div>
        </div>
      </div>
      <div style={{ flex: 10 }} className="flex gap-2 p-2">
        <MenuWrapper user={user}/>
        {/* <div style={{ flex: 0.6 }} className="hidden md:block">
          <div className="flex flex-col gap-2">
            <div
              className={`flex gap-4 text-xs items-center bg-${process.env.NEXT_PUBLIC_APP_BG_BIO}-500 text-white rounded p-2`}
              style={{ flex: 2 }}
            >
              <div style={{ width: 80 }}>
                <img
                  src={
                    user?.picture
                      ? user.picture
                      : "/assets/images/profile_default.svg"
                  }
                  alt=""
                />
              </div>
              <div>
                <div className="font-bold">
                  {user?.first_name.toUpperCase()}{" "}
                  {user?.last_name.toUpperCase()}
                </div>
                <div style={{ marginTop: 5 }}>
                  <span>
                    {user?.posisi || user?.role} |{" "}
                    <span className="text-xs">
                      {user?.role === "ENTRY_DATA"
                        ? user?.UnitCabang?.UnitPelayanan?.kode_area
                        : user?.unit_cabang_id
                        ? user.UnitCabang?.kode_area
                        : "PUSAT"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <ListMenuVer2 role={user?.role || "MARKETING"} open={false} />
            </div>
          </div>
        </div> */}
        <div
          style={{
            flex: 2,
            height: "80vh",
            overflow: "auto",
            // backgroundColor: "white",
          }}
        >
          {children}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: 0.8,
        }}
        className="text-xs flex font-semibold px-1 sm:px-4"
      >
        <div className="flex gap-2">
          <span>
            Copyright {new Date().getFullYear()} <CopyrightCircleOutlined />
          </span>{" "}
          <span>|</span>
          <Link href={"/dashboard"} className="text-blue-500">
            {(
              process.env.NEXT_PUBLIC_APP_FULL_NAME || "PENSIUNAN"
            ).toUpperCase()}
            .
          </Link>
          <span className="hidden md:flex">Allright Reserved</span>
        </div>
        <div className="hidden md:flex">
          Version: 1 - {process.env.NEXT_PUBLIC_APP_VER}
        </div>
      </div>
    </section>
  );
}
