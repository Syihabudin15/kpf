import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Inventaris",
};

const InventarisPage = dynamic(
  () => import("@/components/views/keuangan/Inventaris"),
  {
    loading: () => <LoadingOutlined />,
    ssr: false,
  }
);

export default function Page() {
  return <InventarisPage />;
}
