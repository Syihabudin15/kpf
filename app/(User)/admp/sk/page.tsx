import { handleRoute } from "@/components/utils/menuUtils";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

const AdmpSK = dynamic(() => import("@/components/views/Admp/AdmpSK"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export const metadata: Metadata = {
  title: "ADMP SK",
};

export default async function page() {
  await handleRoute("/admp/sk");
  return (
    <div className="bg-white shadow ">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-md">ADMP SK</h1>
        <div className="text-xs">Data administrasi perkantoran (SK)</div>
      </div>
      <div className="overflow-auto">
        <AdmpSK />
      </div>
    </div>
  );
}
