import { Metadata } from "next";
import { getServerSession } from "next-auth";
import prisma from "@/components/prisma";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";


const MasterDashboard = dynamic(
  () => import("@/components/views/dahsboard/MasterDashboard"),
  { ssr: false, loading: () => <p>Loading ..</p> }
);
const DashboardMarketing = dynamic(
  () => import("@/components/views/dahsboard/DashboardMarketing"),
  { ssr: false, loading: () => <p>Loading ..</p> }
);
const DashboardEntry = dynamic(
  () => import("@/components/views/dahsboard/DashboardEntry"),
  { ssr: false, loading: () => <p>Loading ..</p> }
);
const BankDashboard = dynamic(
  () => import("@/components/views/dahsboard/BankDashboard"),
  {
    loading: () => <LoadingOutlined />,
    ssr: false,
  }
);

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function page() {
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  if (!user) redirect("/");
  
  return (
    <div>
      {user.role === "MARKETING" && <DashboardMarketing/>}
      {user.role === "ENTRY_DATA" && <DashboardEntry/>}
      {user.bank_id && <BankDashboard/>}
      {user.role === "MASTER" || user.role === "BISNIS" || user.role === "VERIFIKASI" || user.role === "OPERASIONAL" || user.role === "KEUANGAN" || user.role === "PEMBERKASAN" ? <MasterDashboard/> : ""}
    </div>
  )
}
