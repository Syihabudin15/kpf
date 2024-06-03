import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
export const dynamic = "force-dynamic";

export const DELETE = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const berkas = await tx.penyerahanBerkas.update({
        where: { id: data.id },
        data: {
          is_active: false,
        },
      });
      await tx.dataPengajuan.updateMany({
        where: {
          penyerahanBerkasId: data.id,
        },
        data: {
          penyerahanBerkasId: null,
        },
      });
      return berkas;
    });

    return NextResponse.json(
      { msg: "Berhasil hapus penyerahan berkas" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
};
