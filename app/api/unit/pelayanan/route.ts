import { UnitPelayanan } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const nama = req.nextUrl.searchParams.get("nama");

  let result: UnitPelayanan[] = [];
  if (nama) {
    result = <any>await prisma.unitPelayanan.findMany({
      where: {
        is_active: true,
        name: { contains: nama },
      },
    });
  } else {
    result = <any>await prisma.unitPelayanan.findMany({
      where: {
        is_active: true,
      },
    });
  }
  return NextResponse.json({ result }, { status: 200 });
};
