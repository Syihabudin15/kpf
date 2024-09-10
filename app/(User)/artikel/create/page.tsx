import { Metadata } from "next";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Data Artikel",
};

const CreateArtikel = dynamic(
  () => import("@/components/views/artikel/CreateArticle"),
  {
    loading: () => <LoadingOutlined />,
    ssr: false,
  }
);

export default async function page() {
  return (
    <div className="bg-white shadow">
      <div className="p-0">
        <CreateArtikel />
      </div>
    </div>
  );
}
