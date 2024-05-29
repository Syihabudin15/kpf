import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Simulasi",
};

const Simulasi = dynamic(
  () => import("../../../components/views/simulasi/simulasi"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  return <Simulasi />;
}
