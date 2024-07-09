import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Riwayat Pengajuan Bank",
};

const RiwayatPengajuanBank = dynamic(
  () => import("@/components/views/operasionals/news/RiwayatPengajuanBank"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/operasional/riwayat-pengajuan-bank");

  return (
    <section className="rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          RIWAYAT PENGAJUAN BANK
        </h1>
      </div>
      <RiwayatPengajuanBank role="OPERASIONAL" />
    </section>
  );
}
