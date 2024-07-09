import { handleRoute } from "@/components/utils/menuUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "History Hapus Pengajuan",
};

const DeletedPengajuan = dynamic(
  () => import("@/components/views/deleted/DeletedPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/deleted/pengajuan");
  return (
    <div className="bg-white shadow ">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
        style={{ zIndex: 10 }}
      >
        <h1 className="font-bold text-md">RIWAYAT HAPUS PENGAJUAN</h1>
      </div>
      <div className="overflow-auto">
        <DeletedPengajuan />
      </div>
    </div>
  );
}
