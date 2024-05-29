"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Role } from "@prisma/client";
import { Button, Drawer } from "antd";
import { useState } from "react";
import ListMenuVer2 from "./ListMenuVer2";
import Logout from "@/components/views/Logout";
import NotifVer2 from "./NotifVer2";

export default function MobileMenuVer2({ role }: { role: Role }) {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpenMenu(true)}>
        <div className="px-0">
          <MenuOutlined />
        </div>
      </Button>
      <Drawer onClose={() => setOpenMenu(false)} open={openMenu} width={"80vw"}>
        <ListMenuVer2 role={role} setOpen={setOpenMenu} />
        <div
          style={{
            display: "flex",
            marginLeft: 20,
            alignItems: "center",
            gap: 10,
          }}
        >
          <Logout />
        </div>
        <NotifVer2 role={role} />
      </Drawer>
    </div>
  );
}
