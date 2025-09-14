"use client";
import Link from "next/link";
import { UnitCabang, UnitPelayanan, User } from "@prisma/client";
import { useEffect, useState } from "react";

export const Notif = ({ user }: { user: IUserNotif }) => {
  const [data, setData] = useState({
    verif: 0,
    slik: 0,
    approval: 0,
    akad: 0,
    cetakSI: 0,
    si: 0,
  });
  const getData = async () => {
    await fetch(
      `/api/v1/notif${
        user.role === "ENTRY_DATA"
          ? "?areaId=" + user.UnitCabang.unit_pelayanan_id
          : ""
      }${user.bank_id ? "?sumdanId=" + user.bank_id : ""}`
    )
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
    setInterval(async () => {
      await getData();
    }, 60000 * 5);
  }, [user]);

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-5 md:gap-2 mt-8 md:mt-0 justify-evenly md:justify-start items-center">
      <BadgeNotif
        name="VERIFIKASI"
        link="/verifikasi/antrian"
        count={data.verif}
        hide={!["MASTER", "VERIFIKASI", "ENTRY_DATA"].includes(user.role)}
      />
      <BadgeNotif
        name="SLIK"
        link="/slik/antrian"
        count={data.slik}
        hide={!["MASTER", "BANK"].includes(user.role)}
      />
      <BadgeNotif
        name="APPROVAL"
        link="/pengajuan-komite/approval"
        count={data.approval}
        hide={!["MASTER", "APPROVAL"].includes(user.role)}
      />
      <BadgeNotif
        name="AKAD"
        link="/operasional/pengajuan-mitra"
        count={data.akad}
        hide={!["MASTER", "OPERASIONAL", "ENTRY_DATA"].includes(user.role)}
      />
      <BadgeNotif
        name="CAIR"
        link="/operasional/cetak-si"
        count={data.cetakSI}
        hide={!["MASTER", "OPERASIONAL"].includes(user.role)}
      />
      <BadgeNotif
        name="SI"
        link={user.bank_id ? "/slik/pencairan" : "/operasional/pencairan"}
        count={data.si}
        hide={!["MASTER", "OPERASIONAL", "BANK"].includes(user.role)}
      />
    </div>
  );
};
function BadgeNotif({
  name,
  link,
  count,
  hide,
}: {
  name: string;
  link: string;
  count: number | string;
  hide?: boolean;
}) {
  return (
    <Link href={link}>
      <div
        className="relative"
        style={{
          cursor: "pointer",
          fontSize: 10,
          fontWeight: "bold",
          ...(hide && { display: "none" }),
        }}
      >
        <span className="px-4 py-2 border rounded shadow bg-white text-black">
          {name}
        </span>
        <span className="badge">{count || 0}</span>
      </div>
    </Link>
  );
}

interface IUnit extends UnitCabang {
  UnitPelayanan: UnitPelayanan;
}
export interface IUserNotif extends User {
  UnitCabang: IUnit;
}
