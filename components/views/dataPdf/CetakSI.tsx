"use client";
import { DataDataPencairan } from "@/components/utils/Interfaces";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import SIBprBNM from "./SIBprBNM";

const SIBprSip = dynamic(() => import("@/components/views/dataPdf/SIBprSIP"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});
const SIBprDassa = dynamic(() => import("@/components/views/dataPdf/SIBprDs"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});
const SIBprBBS = dynamic(() => import("@/components/views/dataPdf/SIBprBBS"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});
const SIBprBds = dynamic(() => import("@/components/views/dataPdf/SIBprBds"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function CetakSI({ data }: { data: DataDataPencairan }) {
  return (
    <>
      {["BPR NBP 29", "BPR SIP"].includes(data.Bank.kode || "") && (
        <SIBprSip data={data} />
      )}
      {data.Bank.kode === "BPR BBS" && <SIBprBBS data={data} />}
      {data.Bank.kode === "BPR DASSA" && <SIBprDassa data={data} />}
      {data.Bank.kode === "BPR BDS" && <SIBprBds data={data} />}
      {/* {data.Bank.kode === "BPR SIP" && <SIBprSip data={data} />} */}
      {data.Bank.kode === "BPR BNM" && <SIBprBNM data={data} />}
      {data.Bank.kode === "KOPJASFAS" ||
        (data.Bank.kode === "KPF" && <SIBprBNM data={data} />)}
    </>
  );
}
