"use client";
import { Role } from "@prisma/client";
import BadgeNotif from "./BadgeNotif";
import { useContext } from "react";
import { notifContext } from "@/components/NotifContext";

export default function NotifVer2({ role }: { role: Role }) {
  const notifCtx = useContext(notifContext);
  const getNotif = () => {
    if (role === Role.BANK) {
      return (
        <div className="flex flex-wrap md:flex-nowrap gap-5 md:gap-2 mt-8 md:mt-0 justify-evenly md:justify-start items-center">
          <BadgeNotif name="SLIK" link="/slik/antrian" count={notifCtx.slik} />
          <BadgeNotif name="SI" link="/slik/pencairan" count={notifCtx.si} />
        </div>
      );
    } else if (role === Role.OPERASIONAL) {
      return (
        <div className="flex flex-wrap md:flex-nowrap gap-5 md:gap-2 mt-8 md:mt-0 justify-evenly md:justify-start items-center">
          <BadgeNotif
            name="CAIR"
            link="/operasional/cetak-si"
            count={notifCtx.cair}
          />
          <BadgeNotif
            name="SI"
            link="/operasional/pencairan"
            count={notifCtx.si}
          />
        </div>
      );
    } else if (role === Role.VERIFIKASI) {
      return (
        <div className="flex flex-wrap md:flex-nowrap gap-5 md:gap-2 mt-8 md:mt-0 justify-evenly md:justify-start items-center">
          <BadgeNotif
            name="VERIFIKASI"
            link="/verifikasi/antrian"
            count={notifCtx.verifikasi}
          />
        </div>
      );
    }
    // else if (role === Role.CHECKER) {
    //   return (
    //     <div className="flex flex-wrap md:flex-nowrap gap-5 md:gap-2 mt-8 md:mt-0 justify-evenly md:justify-start items-center">
    //       <BadgeNotif
    //         name="CHECKER"
    //         link="/pengajuan-komite/checker"
    //         count={notifCtx.checker}
    //       />
    //     </div>
    //   );
    // } else if (role === Role.MAKER) {
    //   return (
    //     <div className="flex flex-wrap md:flex-nowrap gap-5 md:gap-2 mt-8 md:mt-0 justify-evenly md:justify-start items-center">
    //       <BadgeNotif
    //         name="MAKER"
    //         link="/pengajuan-komite/maker"
    //         count={notifCtx.maker}
    //       />
    //     </div>
    //   );
    // }
    else if (role === Role.APPROVAL) {
      return (
        <div className="flex flex-wrap md:flex-nowrap gap-5 md:gap-2 mt-8 md:mt-0 justify-evenly md:justify-start items-center">
          <BadgeNotif
            name="APPROVAL"
            link="/pengajuan-komite/approval"
            count={notifCtx.approval}
          />
          <BadgeNotif name="SI" link="/slik/pencairan" count={notifCtx.si} />
        </div>
      );
    } else if (role === Role.MASTER) {
      return (
        <div className="flex flex-wrap md:flex-nowrap gap-5 md:gap-2 mt-8 md:mt-0 justify-evenly md:justify-start items-center">
          <BadgeNotif
            name="VERIFIKASI"
            link="/verifikasi/antrian"
            count={notifCtx.verifikasi}
          />
          <BadgeNotif name="SLIK" link="/slik/antrian" count={notifCtx.slik} />
          {/* <BadgeNotif
            name="CHECKER"
            link="/pengajuan-komite/checker"
            count={notifCtx.checker}
          />
          <BadgeNotif
            name="MAKER"
            link="/pengajuan-komite/maker"
            count={notifCtx.maker}
          /> */}
          <BadgeNotif
            name="SI"
            link="/operasional/pencairan"
            count={notifCtx.si}
          />
          <BadgeNotif
            name="APPROVAL"
            link="/pengajuan-komite/approval"
            count={notifCtx.approval}
          />
          <BadgeNotif
            name="CAIR"
            link="/operasional/cetak-si"
            count={notifCtx.cair}
          />
        </div>
      );
    } else {
      return <></>;
    }
  };
  return <div>{getNotif()}</div>;
}
