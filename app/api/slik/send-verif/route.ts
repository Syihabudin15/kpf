import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const POST = async (req: NextRequest) => {
  const { id } = await req.json();
  const find = await prisma.dataPengajuan.findFirst({ where: { id: id } });
  if (!find) {
    return NextResponse.json({ msg: "Data Not Found" }, { status: 404 });
  }
  await prisma.dataPengajuan.update({
    where: { id: id },
    data: {
      status_verifikasi: "ANTRI",
      status_slik: find.status_slik ? find.status_slik : "ANTRI",
    },
  });
  return NextResponse.json({ msg: "Berhasil" }, { status: 201 });
};
