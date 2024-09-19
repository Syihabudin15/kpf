import { handleRoute } from "@/components/utils/menuUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Management",
};

const MutasiFlagging = dynamic(
  () => import("@/components/views/MutasiFlagging/MutasiFlagging"),
  { ssr: false, loading: () => <LoadingOutlined /> }
);

export default function page() {
  handleRoute("/mutasi-flagging");
  return (
    <div className="bg-white shadow ">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
        style={{ zIndex: 10 }}
      >
        <h1 className="font-bold text-md">MUTASI & FLAGGING</h1>
      </div>
      <div className="overflow-auto">
        <MutasiFlagging />
      </div>
    </div>
  );
}
