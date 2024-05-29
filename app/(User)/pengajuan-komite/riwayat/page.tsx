import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";

const RiwayatKomite = dynamic(
  () => import("@/components/views/komite/RiwayatKomite"),
  { loading: () => <p>Loading ...</p>, ssr: false }
);

export const metadata: Metadata = {
  title: "Riwayat Pengajuan Komite",
};

export default async function page() {
  await handleRoute("/pengajuan-komite/riwayat");

  return (
    <section className="m-2 rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          RIWAYAT PENGAJUAN KOMITE
        </h1>
        <p className="text-gray-300 text-xs">Data riwayat pengajuan komite</p>
      </div>
      <RiwayatKomite />
    </section>
  );
}
