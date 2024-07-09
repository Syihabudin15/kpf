import { handleRoute } from "@/components/utils/menuUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Belum Bayar",
};

const FlashBulanan = dynamic(
  () => import("@/components/views/Angsuran/FlashBulanan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/angsuran/flash-bulanan");
  return (
    <div className="bg-white shadow ">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
        style={{ zIndex: 10 }}
      >
        <h1 className="font-bold text-md">ANGSURAN FLASH BULANAN</h1>
      </div>
      <div className="overflow-auto">
        <FlashBulanan />
      </div>
    </div>
  );
}
