import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import { getServerSession } from "next-auth";
import prisma from "@/components/prisma";

export const metadata: Metadata = {
  title: "Monitoring",
};
const MonitoringPusat = dynamic(
  () => import("@/components/views/monitoring/MonitoringPusat"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  },
);

export default async function page() {
  await handleRoute("/monitoring/pusat");
  const sess = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: sess?.user?.email },
  });

  return (
    <section className="rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="font-semibold text-gray-200 italic">
          MONITORING PEMBIAYAAN
        </h1>
      </div>
      <MonitoringPusat role={user?.role || "MASTER"} />
    </section>
  );
}
