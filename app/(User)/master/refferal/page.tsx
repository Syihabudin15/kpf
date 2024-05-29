import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Refferal",
};

const RefferalView = dynamic(
  () => import("@/components/views/master/refferal/Refferal"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/master/refferal");

  return (
    <div className="bg-white shadow">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-sm">DATA REFFERAL</h1>
        <div className="text-xs">Manajemen data refferal</div>
      </div>
      <div className="p-2">
        <RefferalView />
      </div>
    </div>
  );
}
