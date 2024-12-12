import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Neraca Keuangan",
};

const Neraca = dynamic(() => import("@/components/views/keuangan/Neraca"), {
  loading: () => <LoadingOutlined />,
  ssr: false,
});

export default function Page() {
  return <Neraca />;
}
