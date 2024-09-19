import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Laba Rugi",
};

const LabaRugi = dynamic(
  () => import("@/components/views/administasi/LabaRugi"),
  {
    loading: () => <LoadingOutlined />,
    ssr: false,
  }
);

export default async function page() {
  // handleRoute("/laporan-administasi/laba-rugi");
  return (
    <div className="bg-white shadow">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-md">LAPORAN LABA RUGI</h1>
      </div>
      <div className="p-1">
        <LabaRugi />
      </div>
    </div>
  );
}
