import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import { getServerSession } from "next-auth";
import prisma from "@/components/prisma";
import { User } from "@prisma/client";

export const metadata: Metadata = {
  title: "Daftar Nominatif",
};

const DaftarNominatif = dynamic(
  () => import("@/components/views/administasi/DaftarNominatif"),
  {
    loading: () => <LoadingOutlined />,
    ssr: false,
  }
);

export default async function page() {
  await handleRoute("/laporan-administrasi/daftar-nominatif");
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  const banks = await prisma.bank.findMany({
    where: { is_active: true },
  });
  return (
    <div className="bg-white shadow">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
      >
        <h1 className="font-bold text-md">DAFTAR NOMINATIF</h1>
      </div>
      <div className="p-2">
        <DaftarNominatif user={user as User} banks={banks || []} />
      </div>
    </div>
  );
}
