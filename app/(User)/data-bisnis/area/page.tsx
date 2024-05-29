import { Metadata } from "next";
import { handleRoute } from "@/components/utils/menuUtils";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Data Bisnis Area",
};

const DataBisnisArea = dynamic(
  () => import("@/components/views/data-bisnis/DataBisnisArea"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/data-bisnis/area");

  return (
    <section className="rounded border shadow bg-white">
      <DataBisnisArea />
    </section>
  );
}
