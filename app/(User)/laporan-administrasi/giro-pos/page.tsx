import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Giro POS",
};

const GiroPos = dynamic(
  () => import("@/components/views/administasi/GiroPos"),
  {
    loading: () => <LoadingOutlined />,
    ssr: false,
  }
);

export default async function page() {
  return (
    <div className="bg-white shadow">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-md">GIRO POS</h1>
      </div>
      <div className="p-1">
        <GiroPos />
      </div>
    </div>
  );
}
