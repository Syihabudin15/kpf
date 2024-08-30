import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const slug = req.nextUrl.searchParams.get("slug") || "";
  const find = await prisma.giroBank.findFirst({
    where: {
      slug: slug,
    },
    include: {
      Transaction: {
        orderBy: { created_at: "desc" },
      },
    },
  });
  if (!find) {
    return NextResponse.json({ msg: "Error not found" }, { status: 404 });
  }

  return NextResponse.json({ data: find }, { status: 200 });
};
