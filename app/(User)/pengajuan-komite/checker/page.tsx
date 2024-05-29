import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";

const AntrianChecker = dynamic(
  () => import("@/components/views/komite/AntrianChecker"),
  { loading: () => <p>Loading ...</p>, ssr: false }
);

export const metadata: Metadata = {
  title: "Pengajuan Checker",
};

export default async function page() {
  await handleRoute("/pengajuan-komite/checker");

  return (
    <section className="m-2 rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          Antrian Pengajuan Checker
        </h1>
        <p className="text-gray-300 text-xs">Data antrian pengajuan checker</p>
      </div>
      <AntrianChecker />
    </section>
  );
}
