import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const search: string | undefined = <any>(
    req.nextUrl.searchParams.get("search")
  );
  const page: number = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;

  const find = await prisma.bank.findMany({
    where: {
      is_active: true,
      ...(search && {
        OR: [{ name: { contains: search } }, { kode: { contains: search } }],
      }),
    },
    skip: skip,
    take: pageSize,
  });
  const total = await prisma.bank.count({
    where: {
      is_active: true,
      ...(search && {
        OR: [{ name: { contains: search } }, { kode: { contains: search } }],
      }),
    },
  });
  return NextResponse.json({ data: find, total, status: 200 }, { status: 200 });
};
