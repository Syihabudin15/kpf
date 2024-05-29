import { handleRoute } from "@/components/utils/menuUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Data Taspen",
};

const ExportToJson = dynamic(
  () => import("@/components/views/dataTaspen/ExportToJson"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/data-taspen");
  return (
    <div className="bg-white shadow ">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
        style={{ zIndex: 10 }}
      >
        <h1 className="font-bold text-md">DATA TASPEN</h1>
        <div className="text-xs">Manajemen database taspen</div>
      </div>
      <div className="overflow-auto">
        <ExportToJson />
      </div>
    </div>
  );
}
