import prisma from "@/components/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();
  if (!session?.user)
    return NextResponse.json({}, { status: 401, statusText: "Unauthorized" });

  const user = await prisma.user.findFirst({
    where: { id: session.user.id as string },
  });
  return NextResponse.json(user, { status: 200, statusText: "OK" });
};

export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  const user = await prisma.user.findFirst({
    where: { username: data.username },
  });
  if (user && user?.status_active === true && user.role !== "MASTER") {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        status_active: false,
      },
    });
  }
  return NextResponse.json({}, { status: 200, statusText: "OK" });
};
