import { handleRoute } from "@/components/utils/menuUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Unit Pelayanan",
};

const UnitPelayananView = dynamic(
  () => import("@/components/views/master/pelayanan/UnitPelayanan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/master/unit-pelayanan");

  return (
    <div className="bg-white shadow">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-sm">DATA AREA DAN UNIT PELAYANAN</h1>
        <div className="text-xs">Manajemen data area dan unit pelayanan</div>
      </div>
      <div className="p-2">
        <UnitPelayananView />
      </div>
    </div>
  );
}
