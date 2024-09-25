import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const nopen = req.nextUrl.searchParams.get("nopen");
  if (!nopen) {
    return NextResponse.json({ msg: "Mohon masukan nopen" }, { status: 400 });
  }
  const find = await prisma.flagging.findFirst({
    where: {
      notas: nopen,
    },
  });
  if (!find) {
    return NextResponse.json(
      { msg: "Nopen tidak ditemukan di database" },
      { status: 404 }
    );
  }
  return NextResponse.json({ data: find }, { status: 200 });
};
