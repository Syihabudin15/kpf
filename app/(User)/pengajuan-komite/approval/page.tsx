import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";

const AntrianApproval = dynamic(
  () => import("@/components/views/komite/AntrianApproval"),
  { loading: () => <p>Loading ...</p>, ssr: false }
);

export const metadata: Metadata = {
  title: "Pengajuan Komite",
};

export default async function page() {
  await handleRoute("/pengajuan-komite/approval");

  return (
    <section className="m-2 rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          ANTRIAN PENGAJUAN KOMITE
        </h1>
      </div>
      <AntrianApproval />
    </section>
  );
}
