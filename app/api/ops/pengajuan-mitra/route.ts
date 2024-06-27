import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const name = req.nextUrl.searchParams.get("name");
  const skip = (page - 1) * 20;

  let result: DataDataPengajuan[] = [];
  if (name) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_approval: "SETUJU" },
          { is_active: true },
          {
            DataPembiayaan: {
              OR: [{ name: { contains: name } }, { nopen: { contains: name } }],
            },
          },
        ],
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
      skip: skip,
      take: 20,
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: { status_approval: "SETUJU", is_active: true },
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
      skip: skip,
      take: 20,
      orderBy: { tanggal_approval: "desc" },
    });
  }
  const total = await prisma.dataPengajuan.count({
    where: { status_approval: "SETUJU", is_active: true },
  });
  return NextResponse.json(
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
};
