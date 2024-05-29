import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
export const metadata: Metadata = {
  title: "Cetak Surat Berkas",
};

const CetakPenyerahanBerkas = dynamic(
  () => import("@/components/views/Pemberkasan/CetakPenyerahanBerkas"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/pemberkasan/cetak-berkas");

  return (
    <section className="m-2 rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          CETAK PENYERAHAN BERKAS
        </h1>
      </div>
      <CetakPenyerahanBerkas />
    </section>
  );
}
