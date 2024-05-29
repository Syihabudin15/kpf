import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Input Pengajuan",
};

const InputSlik = dynamic(() => import("@/components/views/slik/InputSlik"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default async function page() {
  return (
    <section className="rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          INPUT PENGAJUAN PINJAMAN
        </h1>
        <p className="text-gray-300 text-xs">Data pengajuan pinjaman</p>
      </div>
      <InputSlik />
    </section>
  );
}
