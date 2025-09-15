import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const sumdan = req.nextUrl.searchParams.get("sumdan");

  const find = await prisma.dataPengajuan.count({
    where: {
      is_active: true,
      status_pencairan: "TRANSFER",
      Bank: {
        kode: sumdan,
      },
    },
  });
  return NextResponse.json(
    {
      data: find
        .toString()
        .padStart(find.toString().length > 3 ? find.toString().length : 3, "0"),
    },
    { status: 200 }
  );
};
