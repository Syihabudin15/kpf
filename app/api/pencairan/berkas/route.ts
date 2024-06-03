import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const year =
    req.nextUrl.searchParams.get("year") ?? new Date().getFullYear().toString();
  const berkasName = req.nextUrl.searchParams.get("berkasName");
  const page = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (parseInt(page) - 1) * 20;

  let result: DataDataPengajuan[] = [];

  if (berkasName) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          {
            DataPembiayaan: {
              AND: [
                { created_at: { gte: new Date(`${year}-01-01`) } },
                { created_at: { lte: new Date(`${year}-12-29`) } },
                {
                  OR: [
                    { name: { contains: berkasName } },
                    { nopen: { contains: berkasName } },
                  ],
                },
                { is_active: true },
              ],
            },
          },
          { status_pencairan: "TRANSFER" },
        ],
      },
      include: {
        DataPembiayaan: {
          include: {
            Produk: { include: { Bank: true } },
            JenisPembiayaan: true,
            Refferal: true,
            User: {
              include: {
                UnitCabang: {
                  include: {
                    UnitPelayanan: true,
                  },
                },
              },
            },
          },
        },
        Bank: true,
        BerkasPengajuan: true,
        DataPengajuanAlamat: true,
        DataPengajuanPasangan: true,
        DataTaspen: {
          include: {
            DataKeluarga: true,
            Domisili: true,
            DataPasangan: true,
            TunjanganPotongan: true,
          },
        },
        User: {
          include: {
            UnitCabang: { include: { UnitPelayanan: true } },
          },
        },
      },
      skip: skip,
      take: 20,
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          {
            DataPembiayaan: {
              AND: [
                { created_at: { gte: new Date(`${year}-01-01`) } },
                { created_at: { lte: new Date(`${year}-12-29`) } },
                { is_active: true },
              ],
            },
          },
          { status_pencairan: "TRANSFER" },
        ],
      },
      include: {
        DataPembiayaan: {
          include: {
            Produk: { include: { Bank: true } },
            JenisPembiayaan: true,
            Refferal: true,
            User: {
              include: {
                UnitCabang: {
                  include: {
                    UnitPelayanan: true,
                  },
                },
              },
            },
          },
        },
        Bank: true,
        BerkasPengajuan: true,
        DataPengajuanAlamat: true,
        DataPengajuanPasangan: true,
        DataTaspen: {
          include: {
            DataKeluarga: true,
            Domisili: true,
            DataPasangan: true,
            TunjanganPotongan: true,
          },
        },
        User: {
          include: {
            UnitCabang: { include: { UnitPelayanan: true } },
          },
        },
      },
      skip: skip,
      take: 20,
    });
  }
  const total = await prisma.dataPengajuan.count({
    where: { DataPembiayaan: { is_active: true } },
  });
  return NextResponse.json(
    {
      data: result,
      total: berkasName ? result.length : total,
    },
    { status: 200 }
  );
};
