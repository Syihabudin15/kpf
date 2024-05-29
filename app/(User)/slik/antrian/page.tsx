import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Antrian Slik",
};

const AntrianSlik = dynamic(
  () => import("@/components/views/slik/AntrianSlik"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/slik/antrian");

  return (
    <section className="rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          ANTRIAN PENGAJUAN SLIK
        </h1>
        <p className="text-gray-300 text-xs">Data antrian pengajuan slik</p>
      </div>
      <AntrianSlik />
    </section>
  );
}
