import { handleRoute } from "@/components/utils/menuUtils";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

const MasterBank = dynamic(
  () => import("@/components/views/master/pembiayaan/masterBank"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

const MasterJenis = dynamic(
  () => import("@/components/views/master/pembiayaan/masterJenis"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

const MasterProduk = dynamic(
  () => import("@/components/views/master/pembiayaan/masterProduk"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export const metadata: Metadata = {
  title: "Master Produk",
};

export default async function page() {
  await handleRoute("/master/pembiayaan");
  return (
    <section>
      <div className="bg-white shadow">
        <div
          className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
        >
          <h1 className="font-bold text-sm">DATA SUMBER DANA</h1>
          <div className="text-xs">
            Manajemen data bank penyedia produk pembiayaan
          </div>
        </div>
        <div className="p-2">
          <MasterBank />
        </div>
      </div>
      <div className="my-2 bg-white shadow">
        <div
          className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
        >
          <h1 className="font-bold text-sm">DATA JENIS PEMBIAYAAN</h1>
          <div className="text-xs">Manajemen data jenis pembiayaan</div>
        </div>
        <div className="p-2">
          <MasterJenis />
        </div>
      </div>
      <div className="my-2 bg-white shadow">
        <div
          className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
        >
          <h1 className="font-bold text-sm">DATA PRODUK PEMBIAYAAN</h1>
          <div className="text-xs">Manajemen data produk pinjaman</div>
        </div>
        <div className="p-2">
          <MasterProduk />
        </div>
      </div>
    </section>
  );
}
