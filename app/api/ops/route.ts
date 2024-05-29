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
        berkas_akad: data.berkas_akad ? data.berkas_akad : find.berkas_akad,
        tanggal_akad: data.tanggal_akad ? data.tanggal_akad : find.tanggal_akad,
        pelunasan: data.pelunasan ? data.pelunasan : find.pelunasan,
        tanggal_pelunasan: data.tanggal_pelunasan
          ? data.tanggal_pelunasan
          : find.tanggal_pelunasan,
        jaminan: data.jaminan ? data.jaminan : find.jaminan,
        tanggal_jaminan: data.tanggal_jaminan
          ? data.tanggal_jaminan
          : find.tanggal_jaminan,
        rekening: data.rekening ? data.rekening : find.rekening,
        tanggal_rekening: data.tanggal_rekening
          ? data.tanggal_rekening
          : find.tanggal_rekening,
        mutasi: data.mutasi ? data.mutasi : find.mutasi,
        tanggal_mutasi: data.tanggal_mutasi
          ? data.tanggal_mutasi
          : find.tanggal_mutasi,
        flagging: data.flagging ? data.flagging : find.flagging,
        tanggal_flagging: data.tanggal_flagging
          ? data.tanggal_flagging
          : find.tanggal_flagging,
        bukti_cair: data.bukti_cair ? data.bukti_cair : find.bukti_cair,
        tanggal_bukti_cair: data.tanggal_bukti_cair
          ? data.tanggal_bukti_cair
          : find.tanggal_bukti_cair,
        video_cair: data.video_cair ? data.video_cair : find.video_cair,
        tanggal_video_cair: data.tanggal_video_cair
          ? data.tanggal_video_cair
          : find.tanggal_video_cair,
        no_rekening: data.no_rekening ? data.no_rekening : find.no_rekening,
        nama_bank: data.nama_bank ? data.nama_bank : find.nama_bank,
        video_cair2: data.video_cair2 ? data.video_cair2 : find.video_cair2,
        tanggal_video_cair2: data.tanggal_video_cair2,
        video_cair3: data.video_cair3 ? data.video_cair3 : find.video_cair3,
        tanggal_video_cair3: data.tanggal_video_cair3,
        berkas_lainnya: data.berkas_lainnya
          ? data.berkas_lainnya
          : find.berkas_lainnya,
        tanggal_berkas_lainnya: data.tanggal_berkas_lainnya,
        epotpen: data.epotpen ? data.epotpen : find.epotpen,
        tanggal_epotpen: data.tanggal_epotpen
          ? data.tanggal_epotpen
          : find.tanggal_epotpen,
      },
    });
    if (data.bukti_cair && !find.bukti_cair) {
      await prisma.dataPengajuan.updateMany({
        where: { berkasPengajuanId: find.id },
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
