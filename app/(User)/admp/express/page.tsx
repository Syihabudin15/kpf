import { handleRoute } from "@/components/utils/menuUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const AdmpExpress = dynamic(
  () => import("@/components/views/Admp/AdmpExpress"),
  { ssr: false, loading: () => <LoadingOutlined /> }
);

export const metadata: Metadata = {
  title: "ADMP Express",
};

export default async function page() {
  await handleRoute("/admp/sk");
  return (
    <div className="bg-white shadow ">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-md">ADMP Express</h1>
        <div className="text-xs">Data administrasi perkantoran (Express)</div>
      </div>
      <div className="overflow-auto">
        <AdmpExpress />
      </div>
    </div>
  );
}
