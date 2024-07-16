import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Data Taspen",
};

const Flagging = dynamic(() => import("@/components/views/flagging/Flagging"), {
  loading: () => <LoadingOutlined />,
  ssr: false,
});

export default async function page() {
  await handleRoute("/flagging");

  return (
    <div className="bg-white shadow">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-md">DATA TASPEN</h1>
      </div>
      <div className="p-2">
        <Flagging />
      </div>
    </div>
  );
}
