import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { BankWithDataPengajuan } from "@/components/utils/Interfaces";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    let result: BankWithDataPengajuan[] = <any>await prisma.bank.findMany({
      include: {
        DataPengajuan: {
          where: {
            AND: [
              { status_approval: "SETUJU" },
              // { BerkasPengajuan: { berkas_akad: { not: null } } },
              { is_active: true },
              { is_cetak: false },
            ],
          },
          include: {
            DataPembiayaan: {
              include: {
                Produk: true,
                JenisPembiayaan: true,
                Refferal: true,
                User: {
                  include: {
                    UnitCabang: { include: { UnitPelayanan: true } },
                  },
                },
              },
            },
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
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            BerkasPengajuan: true,
            Bank: true,
          },
        },
      },
    });
    return NextResponse.json(
      result.filter((r) => r.DataPengajuan.length > 0),
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

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  if (data.pengajuans.length == 0)
    return NextResponse.json(
      { msg: "Mohon isi data terlebih dahulu!" },
      { status: 400 }
    );
  try {
    const result = await prisma.$transaction(async (tx) => {
      const find = await prisma.dataPengajuan.findFirst({
        where: { id: data.pengajuans[0] },
      });
      const createPencairan = await tx.dataPencairan.create({
        data: {
          tanggal_cetak: data.tanggal_cetak
            ? new Date(data.tanggal_cetak)
            : new Date(),
          nomor_surat: data.nomor_surat,
          bankId: find?.bankId,
        },
      });
      for (let i = 0; i < data.pengajuans.length; i++) {
        await tx.dataPengajuan.update({
          where: {
            id: data.pengajuans[i],
          },
          data: {
            dataPencairanId: createPencairan.id,
            is_cetak: true,
          },
        });
      }
      return createPencairan;
    });
    return NextResponse.json({ msg: "Cetak surat berhasil" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
};
