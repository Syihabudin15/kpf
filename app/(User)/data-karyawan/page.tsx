import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Data Karyawan",
};

const DataMarketing = dynamic(
  () => import("@/components/views/DataKaryawan/Marketing"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/data-karyawan");

  return (
    <section className="rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">DATA KARYAWAN</h1>
        <p className="text-gray-300 text-xs">Data daftar karyawan</p>
      </div>
      <DataMarketing />
    </section>
  );
}
