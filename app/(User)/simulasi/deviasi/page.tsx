import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Simulasi Dev",
};

const NewSimulation = dynamic(
  () => import("@/components/views/simulasi/NewSimulation"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  return (
    <>
      <NewSimulation is_deviasi={true} />
    </>
  );
}
