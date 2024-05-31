import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import prisma from "@/components/prisma";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Pembayaran Asuransi",
};

const DaftarAsuransi = dynamic(
  () => import("@/components/views/asuransi/DaftarAsuransi"),
  {
    loading: () => <LoadingOutlined />,
    ssr: false,
  }
);

export default async function page() {
  await handleRoute("/laporan-administrasi/outstanding-aktif");
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  return (
    <div className="bg-white shadow">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-md">DAFTAR PEMBAYARAN ASURANSI</h1>
      </div>
      <div className="p-2">
        <DaftarAsuransi />
      </div>
    </div>
  );
}
