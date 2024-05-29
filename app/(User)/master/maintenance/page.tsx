import { handleRoute } from "@/components/utils/menuUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Maintenance",
};

const MasterMaintenance = dynamic(
  () => import("@/components/views/master/Maintenance"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  handleRoute("/master/maintenance");
  return (
    <div className="bg-white shadow">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-sm">Manage Data Maintenance</h1>
        <div className="text-xs">Manajemen data page maintenance</div>
      </div>
      <div className="p-2">
        <MasterMaintenance />
      </div>
    </div>
  );
}
