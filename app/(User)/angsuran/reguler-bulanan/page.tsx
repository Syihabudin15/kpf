import { handleRoute } from "@/components/utils/menuUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Belum Bayar",
};

const RegulerBulanan = dynamic(
  () => import("@/components/views/Angsuran/RegulerBulanan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/angsuran/reguler-bulanan");
  return (
    <div className="bg-white shadow ">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
        style={{ zIndex: 10 }}
      >
        <h1 className="font-bold text-md">ANGSURAN NON-FLASH BULANAN</h1>
        <div className="text-xs">
          Data angsuran non-flash bulan{" "}
          {new Date().toLocaleString("id-ID", {
            month: "long",
          })}
        </div>
      </div>
      <div className="overflow-auto">
        <RegulerBulanan />
      </div>
    </div>
  );
}
