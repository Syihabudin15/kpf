import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const result = await prisma.$transaction(async (tx) => {
      const resultData = await tx.dataPencairan.update({
        where: {
          id: data.id,
        },
        data: {
          tanggal_proses: new Date(),
          status: true,
        },
      });
      await tx.dataPengajuan.updateMany({
        where: { dataPencairanId: data.id },
        data: {
          status_pencairan: "TRANSFER",
          tanggal_pencairan: new Date(),
        },
      });
      return resultData;
    });
    return NextResponse.json(
      { msg: "Proses pencairan berhasil!" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server error!" }, { status: 500 });
  }
};
