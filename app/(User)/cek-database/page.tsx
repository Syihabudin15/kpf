import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Crosscek DB",
};

const CekDatabase = dynamic(
  () => import("../../../components/views/cekDatabase/CekDatabase"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  return <CekDatabase />;
}
