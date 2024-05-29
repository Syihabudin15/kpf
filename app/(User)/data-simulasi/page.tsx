import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Data Simulasi",
};

const DataSimulasi = dynamic(
  () => import("@/components/views/simulasi/DataSimulasi"),
  {
    loading: () => <LoadingOutlined />,
    ssr: false,
  }
);

export default async function page() {
  await handleRoute("/data-simulasi");
  return (
    <div className="bg-white shadow">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-md">DATA SIMULASI</h1>
        <div className="text-xs">Manajemen data hasil pehitungan simulasi</div>
      </div>
      <div className="p-2">
        <DataSimulasi />
      </div>
    </div>
  );
}
