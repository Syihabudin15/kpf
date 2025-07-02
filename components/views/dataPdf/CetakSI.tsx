"use client";
import { DataDataPencairan } from "@/components/utils/Interfaces";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import SIBprBNM from "./SIBprBNM";

const SIBprSip = dynamic(() => import("@/components/views/dataPdf/SIBprSIP"), {
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
      {data.Bank.kode === "BPR BDS" && <SIBprBds data={data} />}
      {data.Bank.kode === "BPR SIP" && <SIBprSip data={data} />}
      {data.Bank.kode === "BPR BNM" && <SIBprBNM data={data} />}
    </>
  );
}
