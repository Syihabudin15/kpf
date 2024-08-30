import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

const DetailGiroPos = dynamic(
  () => import("@/components/views/administasi/DetailGiroPos"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function page({ params }: { params: { slug: string } }) {
  return <DetailGiroPos slug={params.slug || ""} />;
}
