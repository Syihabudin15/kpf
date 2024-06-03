import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const data = await prisma.unitPelayanan.findMany({
    where: { is_active: true },
    include: {
      UnitCabang: {
        where: { is_active: true },
        include: {
          User: {
            where: { status_active: true },
          },
        },
      },
    },
  });
  return NextResponse.json(data, { status: 200 });
};
