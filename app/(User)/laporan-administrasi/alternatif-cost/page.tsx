import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Alternatif Cost",
};

const AlternatifCost = dynamic(
  () => import("@/components/views/administasi/AlternatifCost"),
  {
    loading: () => <LoadingOutlined />,
    ssr: false,
  }
);

export default async function page() {
  await handleRoute("/laporan-administrasi/alternatif-cost");

  return (
    <div className="bg-white shadow">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-md">ALTERNATIF COST</h1>
        <p className="text-gray-300 text-xs">
          Rincian pengeluaran bulan{" "}
          {new Date().toLocaleString("id-ID", {
            month: "long",
          })}
        </p>
      </div>
      <div className="p-2">
        <AlternatifCost />
      </div>
    </div>
  );
}
