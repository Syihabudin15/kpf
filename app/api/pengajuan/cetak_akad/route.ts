import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  const find = await prisma.dataPengajuan.findFirst({ where: { id: data.id } });
  if (!find) {
    return NextResponse.json(
      { msg: "Data pengajuan tidak ditemukan!" },
      { status: 404 }
    );
  }
  try {
    if (find.status_pencairan === "TRANSFER") {
      return NextResponse.json(
        { msg: "cetak berkas akad berhasil" },
        { status: 200 }
      );
    }
    await prisma.dataPengajuan.update({
      where: { id: find.id },
      data: {
        tanggal_cetak_akad: new Date(data.tanggal_cetak_akad),
        nomor_akad: data.nomor_akad,
      },
    });
    return NextResponse.json(
      { msg: "cetak berkas akad berhasil" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Gagal cetak akad. coba lagi nanti!" },
      { status: 500 }
    );
  }
};
