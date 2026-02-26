import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "50";
  const search = req.nextUrl.searchParams.get("search") || "";
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const find = await prisma.bank.findMany({
    where: {
      is_active: true,
      ...(search && {
        OR: [{ name: { contains: search } }, { kode: { contains: search } }],
      }),
    },
    skip: skip,
    take: parseInt(limit),
    include: {
      products: { where: { is_active: true } },
    },
  });

  const total = await prisma.bank.count({
    where: {
      is_active: true,
      ...(search && {
        OR: [{ name: { contains: search } }, { kode: { contains: search } }],
      }),
    },
  });

  return NextResponse.json({ data: find, total, msg: "OK" });
};
