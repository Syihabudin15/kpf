import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Pelunasan Debitur",
};

const PelunasanDebitur = dynamic(
  () => import("@/components/views/administasi/DaftarPelunasanDebitur"),
  {
    loading: () => <LoadingOutlined />,
    ssr: false,
  }
);

export default async function page() {
  await handleRoute("/laporan-administrasi/pelunasan-debitur");
  return (
    <div className="bg-white shadow">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-md">DAFTAR PELUNASAN DEBITUR</h1>
      </div>
      <div className="p-2">
        <PelunasanDebitur />
      </div>
    </div>
  );
}
