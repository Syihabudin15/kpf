import { flagging } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const name = req.nextUrl.searchParams.get("name");
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;
  let result: flagging[] = [];

  if (name) {
    result = <any>await prisma.flagging.findMany({
      where: {
        OR: [
          { nama_penerima: { contains: name } },
          { notas: { contains: name } },
          { alamat_cabang: { contains: name } },
          { kantor_cabang: { contains: name } },
          { alamatrumah: { contains: name } },
        ],
      },
      skip: skip,
      take: pageSize,
    });
  } else {
    result = <any>await prisma.flagging.findMany({
      skip: skip,
      take: pageSize,
    });
  }
  const total = await prisma.flagging.count();

  return NextResponse.json(
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
};
