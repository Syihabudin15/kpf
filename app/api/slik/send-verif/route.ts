import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const POST = async (req: NextRequest) => {
  const { id } = await req.json();
  await prisma.dataPengajuan.update({
    where: { id: id },
    data: {
      status_verifikasi: "ANTRI",
      status_slik: "ANTRI",
    },
  });
  return NextResponse.json({ msg: "Berhasil" }, { status: 201 });
};
