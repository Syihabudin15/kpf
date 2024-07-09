import { handleRoute } from "@/components/utils/menuUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Master User",
};

const MasterUser = dynamic(
  () => import("@/components/views/master/user/masterUser"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/master/user");
  return (
    <div className="bg-white shadow">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-md">DATA USER</h1>
      </div>
      <div className="p-1 overflow-auto">
        <MasterUser />
      </div>
    </div>
  );
}
