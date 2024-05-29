"use client";
import React, { createContext, useEffect, useState } from "react";
interface countNotif {
  slik: number;
  verifikasi: number;
  checker: number;
  maker: number;
  si: number;
  approval: number;
  cair: number;
  getNotifFunction: Function;
}
export const notifContext = createContext<countNotif>({
  slik: 0,
  verifikasi: 0,
  checker: 0,
  maker: 0,
  approval: 0,
  si: 0,
  cair: 0,
  getNotifFunction: async () => {
    const res = await fetch("/api/notif");
    const { verifikasi, slik, checker, maker, si, approval, cair } =
      await res.json();
    return { verifikasi, slik, checker, maker, si, approval, cair };
  },
});
const getNotif = async () => {
  const res = await fetch("/api/notif");
  const { verifikasi, slik, checker, maker, si, approval, cair } =
    await res.json();
  return { verifikasi, slik, checker, maker, si, approval, cair };
};
export default function NotifContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<countNotif>();

  const getData = async () => {
    const { verifikasi, slik, checker, maker, si, approval, cair } =
      await getNotif();
    setData({
      verifikasi,
      slik,
      checker,
      maker,
      si,
      approval,
      cair,
      getNotifFunction: getData,
    });
  };

  useEffect(() => {
    (async () => {
      await getData();
      setInterval(async () => {
        await getData();
      }, 600000);
    })();
  }, []);

  return (
    <notifContext.Provider
      value={{
        verifikasi: data?.verifikasi || 0,
        slik: data?.slik || 0,
        checker: data?.checker || 0,
        maker: data?.maker || 0,
        si: data?.si || 0,
        approval: data?.approval || 0,
        cair: data?.cair || 0,
        getNotifFunction: getData,
      }}
    >
      {children}
    </notifContext.Provider>
  );
}
