import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

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
    await prisma.dataPengajuan.update({
      where: { id: find.id },
      data: {
        tanggal_cetak_akad: new Date(data.tanggal_cetak_akad),
        nomor_akad: data.nomor_akad,
        jenis_margin: data.jenis_margin,
      },
    });
    if (data.mg_bunga) {
      await prisma.dataPembiayaan.update({
        where: { id: find.data_pembiayaan_id },
        data: {
          mg_bunga: parseFloat(data.mg_bunga),
        },
      });
    }
    return NextResponse.json(
      { msg: "cetak berkas akad berhasil" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
};
