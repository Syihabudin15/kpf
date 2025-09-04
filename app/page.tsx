import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const metadata: Metadata = {
  title: "SISTEM INFORMASI PENSIUNAN",
};

const Login = dynamic(() => import("@/components/views/login/Login"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default async function page() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }
  return <Login maintenance={false} />;
}
