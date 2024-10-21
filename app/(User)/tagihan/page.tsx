import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";

export const metadata: Metadata = {
  title: `Tagihan ${moment().format("MMMM")}`,
};

const Tagihan = dynamic(() => import("@/components/views/Angsuran/Tagihan"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default async function page() {
  await handleRoute("/verifikasi/antrian");

  return (
    <section className="rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          TAGIHAN BULANAN
        </h1>
      </div>
      <Tagihan />
    </section>
  );
}
