import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
export const metadata: Metadata = {
  title: "Daftar Penyerahan Jaminan",
};

const CetakPenyerahanJaminan = dynamic(
  () => import("@/components/views/Pemberkasan/CetakPenyerahanJaminan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/pemberkasan/cetak-jaminan");

  return (
    <section className="m-2 rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          DAFTAR PENYERAHAN JAMINAN
        </h1>
      </div>
      <CetakPenyerahanJaminan />
    </section>
  );
}
