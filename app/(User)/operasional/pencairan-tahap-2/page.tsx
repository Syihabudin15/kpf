import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Penerimaan Bersih",
};

const PenerimaanBersih = dynamic(
  () => import("@/components/views/operasionals/PenerimaanBersih"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/operasional/pencairan-tahap-2");

  return (
    <section className="rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          DATA PENERIMAAN BERSIH
        </h1>
      </div>
      <PenerimaanBersih />
    </section>
  );
}
