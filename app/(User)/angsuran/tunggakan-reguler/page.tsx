import { handleRoute } from "@/components/utils/menuUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Tunggakan Non Flash",
};

const TunggakanReguler = dynamic(
  () => import("@/components/views/Angsuran/TunggakanReguler"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/angsuran/tunggakan-reguler");
  return (
    <div className="bg-white shadow ">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
        style={{ zIndex: 10 }}
      >
        <h1 className="font-bold text-md">TUNGGAKAN NON-FLASH</h1>
        <div className="text-xs">Data tunggakan angsuran non-flash</div>
      </div>
      <div className="overflow-auto">
        <TunggakanReguler />
      </div>
    </div>
  );
}
