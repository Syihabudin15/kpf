import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Penerimaan Bersih",
};

const PenerimaanBersihBank = dynamic(
  () => import("@/components/views/operasionals/PenerimaanBersihBank"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
const PenerimaanBersih = dynamic(
  () => import("@/components/views/operasionals/PenerimaanBersih"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/operasional/pencairan-tahap-2");
  const sess = await getServerSession();
  if (sess?.user?.role === "BANK") {
  }

  return (
    <section className="rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          DATA PENERIMAAN BERSIH
        </h1>
      </div>
      {sess?.user?.role === "BANK" ? (
        <PenerimaanBersihBank />
      ) : (
        <PenerimaanBersih />
      )}
    </section>
  );
}
