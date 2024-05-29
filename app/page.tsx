import { getMaintenance } from "@/components/utils/getMaintenance";
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
  const maintenance = await getMaintenance("/");

  if (session && !maintenance) {
    redirect("/dashboard");
  }
  return <Login maintenance={maintenance?.is_maintenance || false} />;
}
