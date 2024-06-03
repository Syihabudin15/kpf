import { AngsuranDebitur } from "@/components/utils/Interfaces";
import { LoadingOutlined } from "@ant-design/icons";
import { JadwalAngsuran } from "@prisma/client";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const JadwalAngsuranDebitur = dynamic(
  () => import("@/components/views/Angsuran/jadwalAngsuranDebitur"),
  { ssr: false, loading: () => <LoadingOutlined/> }
);
export const metadata: Metadata = {
  title: "Jadwal Angsuran",
};

export default async function page({ params }: { params: { id: string } }) {
  return (
    <section className="m-2 rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">KARTU ANGSURAN</h1>
        <p className="text-gray-300 text-xs">Data kartu angsuran debitur</p>
      </div>
       <JadwalAngsuranDebitur id={params.id} />
    </section>
  );
}
