import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import { getServerSession } from "next-auth";
import prisma from "@/components/prisma";

export const metadata: Metadata = {
  title: "Monitoring",
};
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

const MonitoringEntryData = dynamic(
  () => import("@/components/views/monitoring/MonitoringEntryData"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
const MonitoringPusat = dynamic(
  () => import("@/components/views/monitoring/MonitoringPusat"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/monitoring/entry-data");
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });

  return (
    <section className="rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          MONITORING PEMBIAYAAN
        </h1>
      </div>
      {user?.unit_cabang_id ? <MonitoringEntryData /> : <MonitoringPusat />}
    </section>
  );
}
