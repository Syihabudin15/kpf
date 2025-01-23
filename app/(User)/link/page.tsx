import { handleRoute } from "@/components/utils/menuUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import prisma from "@/components/prisma";

export const metadata: Metadata = {
  title: "Sosial Link",
};

const SosialLink = dynamic(
  () => import("@/components/views/links/SosialLink"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default async function page() {
  await handleRoute("/link");
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  if (!user) redirect("/");
  return (
    <div className="bg-white shadow ">
      <div
        className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}
        style={{ zIndex: 10 }}
      >
        <h1 className="font-bold text-md">SOSIAL LINK</h1>
      </div>
      <div className="overflow-auto">
        <SosialLink role={user.role} />
      </div>
    </div>
  );
}
