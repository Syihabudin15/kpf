import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/components/prisma";
import Logout from "@/components/views/Logout";
import MobileMenuVer2 from "@/components/utils/menu/MobileMenuVer2";
// import NotifVer2 from "@/components/utils/menu/NotifVer2";
import MenuWrapper from "@/components/utils/menu/MenuWrapper";
import { IUserNotif, Notif } from "@/components/v1/INotif";

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
                process.env.NEXT_PUBLIC_APP_NAME_HEADER || "SI KREDIT PENSIUNAN"
              ).toUpperCase()}
            </span>
          </div>
          <div className="hidden md:flex md:items-center gap-2">
            {/* <NotifVer2 role={user?.role || "MARKETING"} /> */}
            <Notif user={user as IUserNotif} />
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
        <MenuWrapper user={user} />
        <div
          style={{
            flex: 2,
            height: "86vh",
            overflow: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

// "use client";

// import {
//   DoubleLeftOutlined,
//   DoubleRightOutlined,
//   MenuOutlined,
// } from "@ant-design/icons";
// import { Button, Layout, Menu } from "antd";
// import { useState } from "react";
// const { Header, Content, Sider } = Layout;

// export default function Page({ children }: { children: React.ReactNode }) {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Sider
//         collapsed={collapsed}
//         collapsedWidth={window && window.innerWidth > 600 ? 80 : 0}
//         theme="light"
//         hidden={window && window.innerWidth < 600}
//       >
//         <div className={` flex gap-4 items-center bg-green-500 p-2`}>
//           <img
//             src="/default_profile.png"
//             width={50}
//             className={`border rounded-full border-gray-50 ${collapsed ? "hidden" : ""}`}
//           />
//           <div className="flex flex-col text-white">
//             <div className={`font-bold ${collapsed ? "hidden" : ""}`}>
//               Fullname
//             </div>
//             <div className={`text-xs italic ${collapsed ? "hidden" : ""}`}>
//               IT / PUSAT / JABAR
//             </div>
//             <div
//               className={`text-xs italic flex ${collapsed ? "justify-center" : "justify-between"}`}
//             >
//               <div className={`${collapsed ? "hidden" : ""}`}>Role</div>
//               <Button
//                 icon={
//                   collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />
//                 }
//                 size="small"
//                 type="primary"
//                 onClick={() => setCollapsed(!collapsed)}
//               ></Button>
//             </div>
//           </div>
//         </div>
//         <Menu />
//       </Sider>
//       <Layout>
//         <Header
//           style={{
//             padding: "0px 10px",
//             height: 45,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             background: "#fff",
//           }}
//         >
//           <p>SIPP</p>
//           <Button icon={<MenuOutlined />}></Button>
//         </Header>
//         <Content
//           style={{ margin: "5px 5px", height: "90vh", overflow: "auto" }}
//         >
//           <div
//             style={{
//               minHeight: 360,
//             }}
//           >
//             {children}
//           </div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }
