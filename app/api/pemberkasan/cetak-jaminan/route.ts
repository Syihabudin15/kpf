import { NextRequest, NextResponse } from "next/server";

import prisma from "@/components/prisma";
import {
  BankWithDataPengajuan,
  savePencairan,
} from "@/components/utils/Interfaces";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (page - 1) * 20;
  let result: BankWithDataPengajuan[] = <any>await prisma.bank.findMany({
    where: { is_active: true },
    include: {
      DataPengajuan: {
        where: {
          status_pencairan: "TRANSFER",
          penyerahanJaminanId: null,
        },
        include: {
          DataPembiayaan: {
            include: {
              User: {
                include: { UnitCabang: { include: { UnitPelayanan: true } } },
              },
              Produk: { include: { Bank: true } },
              JenisPembiayaan: true,
              Refferal: true,
            },
          },
          User: {
            include: { UnitCabang: { include: { UnitPelayanan: true } } },
          },
          Bank: true,
          BerkasPengajuan: true,
          DataTaspen: {
            include: {
              DataKeluarga: true,
              Domisili: true,
              DataPasangan: true,
              TunjanganPotongan: true,
            },
          },
          DataPengajuanAlamat: true,
          DataPengajuanPasangan: true,
        },
        orderBy: { DataPembiayaan: { created_at: "desc" } },
      },
    },
    skip: skip,
    take: 20,
  });

  return NextResponse.json(
    {
      data: result.filter((d) => d.DataPengajuan.length !== 0),
      total: result.filter((d) => d.DataPengajuan.length !== 0).length,
    },
    { status: 200 }
  );
};

export const POST = async (req: NextRequest) => {
  const data: savePencairan = await req.json();

  if (data.pengajuans.length == 0)
    return NextResponse.json(
      { msg: "Mohon isi data terlebih dahulu!" },
      { status: 400 }
    );
  try {
    const result = await prisma.$transaction(async (tx) => {
      const createPencairan = await tx.penyerahanJaminan.create({
        data: {
          tanggal_cetak: new Date().toISOString(),
          nomor_jaminan: data.nomor_surat,
          bankId: data.id,
        },
      });

      for (let i = 0; i < data.pengajuans.length; i++) {
        await tx.dataPengajuan.update({
          where: {
            id: data.pengajuans[i],
          },
          data: {
            penyerahanJaminanId: createPencairan.id,
          },
        });
      }
      return createPencairan;
    });
    return NextResponse.json(
      { msg: "Cetak surat jaminan berhasil" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
};
