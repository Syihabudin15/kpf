import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Monitoring",
};

const MonitoringMarketing = dynamic(
  () => import("@/components/views/monitoring/MonitoringMarketing"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/monitoring/marketing");

  return (
    <section className="rounded border shadow bg-white">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-2 rounded`}
      >
        <h1 className="text-1xl font-semibold text-gray-200">
          MONITORING PEMBIAYAAN
        </h1>
      </div>
      <MonitoringMarketing />
    </section>
  );
}
