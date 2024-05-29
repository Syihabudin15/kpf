import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.berkasPengajuan.findFirst({
      where: { id: data.id },
    });
    if (!find)
      return NextResponse.json(
        { msg: "Data tidak ditemukan" },
        { status: 404 }
      );
    await prisma.berkasPengajuan.update({
      where: { id: data.id },
      data: {
        berkas_akad: data.berkas_akad,
        tanggal_akad: data.tanggal_akad,
        pelunasan: data.pelunasan,
        tanggal_pelunasan: data.tanggal_pelunasan,
        jaminan: data.jaminan,
        tanggal_jaminan: data.tanggal_jaminan,
        rekening: data.rekening,
        tanggal_rekening: data.tanggal_rekening,
        mutasi: data.mutasi,
        tanggal_mutasi: data.tanggal_mutasi,
        flagging: data.flagging,
        tanggal_flagging: data.tanggal_flagging,
        bukti_cair: data.bukti_cair,
        tanggal_bukti_cair: data.tanggal_bukti_cair,
        video_cair: data.video_cair,
        tanggal_video_cair: data.tanggal_video_cair,
        no_rekening: data.no_rekening,
        nama_bank: data.nama_bank,
        berkas_lainnya: data.berkas_lainnya,
        tanggal_berkas_lainnya: data.tanggal_berkas_lainnya,
        video_cair2: data.video_cair2,
        tanggal_video_cair2: data.tanggal_video_cair2,
        video_cair3: data.video_cair3,
        tanggal_video_cair3: data.tanggal_video_cair3,
        epotpen: data.epotpen,
        tanggal_epotpen: data.tanggal_epotpen,
      },
    });
    if (data.bukti_cair && !find.bukti_cair) {
      await prisma.dataPengajuan.updateMany({
        where: { berkasPengajuanId: data.id },
        data: {
          status_pencairan: "TRANSFER",
          tanggal_pencairan: new Date(),
        },
      });
    }
    return NextResponse.json(
      { msg: "Upload berkas berhasil" },
      { status: 200, statusText: "OK" }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "INTERNAL SERVER ERROR" }
    );
  }
};
