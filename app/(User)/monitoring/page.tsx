import { MonitoringUI } from "@/components/v1";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import prisma from "@/components/prisma";
import { IUserNotif } from "@/components/v1/INotif";

export const metadata: Metadata = { title: "Monitoring" };

export default async function Page() {
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email || "" },
    include: { UnitCabang: { include: { UnitPelayanan: true } } },
  });
  return (
    <div>
      <MonitoringUI user={user as IUserNotif} />
    </div>
  );
}
