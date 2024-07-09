import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Cetak SI",
};

const CetakPengajuanSI = dynamic(
  () => import("@/components/views/operasionals/news/CetakPengajuanSI"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/operasional/cetak-si");

  return (
    <section className="rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          DAFTAR PENGAJUAN PENCAIRAN
        </h1>
      </div>
      <CetakPengajuanSI role="OPERASIONAL" />
    </section>
  );
}
