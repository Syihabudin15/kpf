"use client"

import { useState } from "react"
import ListMenuVer2 from "./ListMenuVer2"
import { MenuOutlined } from "@ant-design/icons";

export default function MenuWrapper({user}: {user: any}){
    const [collapse, setCollapse] = useState(false);

    return (
        <div style={{ width: collapse ? 100 : 350 }} className="hidden md:block">
          <div className={`flex flex-col gap-2`}>
            <div
              className={`flex gap-4 text-xs items-center bg-${process.env.NEXT_PUBLIC_APP_BG_BIO}-500 text-white rounded p-2 ${collapse && "hidden"}`}
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
                <div className={`bg-white p-1 flex ${collapse ? "justify-center" : "justify-end"}`}>
                    <button className="border px-2 py-0 rounded shadow" onClick={() => setCollapse(!collapse)}>
                        <MenuOutlined/>
                    </button>
                </div>
              <ListMenuVer2 role={user?.role || "MARKETING"} open={collapse} />
            </div>
          </div>
        </div>
    )
}