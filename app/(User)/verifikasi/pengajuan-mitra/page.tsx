import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Pengajuan Mitra",
};

const DokumenPengajuanMitra = dynamic(
  () => import("@/components/views/operasionals/news/DokumenPengajuanMitra"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/verifikasi/pengajuan-mitra");

  return (
    <section className="rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          DOKUMEN PENGAJUAN MITRA
        </h1>
      </div>
      <DokumenPengajuanMitra />
    </section>
  );
}
