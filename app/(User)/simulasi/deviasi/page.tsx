import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Simulasi Dev",
};

const FinalSimulasi = dynamic(
  () => import("@/components/views/simulasi/FinalSimulasi"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  return (
    <>
      <FinalSimulasi is_deviasi={true} />
    </>
  );
}
