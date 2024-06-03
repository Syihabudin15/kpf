import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { daysInMonth } from "@/components/utils/inputUtils";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const nama = req.nextUrl.searchParams.get("name");
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (page - 1) * 20;
  const year =
    req.nextUrl.searchParams.get("year") || new Date().getFullYear().toString();

  let result: DataDataPengajuan[] = [];

  if (nama) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        is_active: false,
        status_lunas: false,
        OR: [{ nama: { contains: nama } }, { nopen: { contains: nama } }],
      },
      skip: skip,
      take: 20,
      include: {
        DataPembiayaan: {
          include: {
            Produk: {
              include: {
                Bank: true,
              },
            },
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
        User: {
          include: {
            UnitCabang: {
              include: { UnitPelayanan: true },
            },
          },
        },
        BerkasPengajuan: true,
        Bank: true,
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
      },
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        is_active: false,
        status_lunas: false,
        DataPembiayaan: {
          created_at: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(
              `${year}-12-${daysInMonth(12, parseInt(year.toString()))}`
            ),
          },
        },
      },
      include: {
        DataPembiayaan: {
          include: {
            Produk: {
              include: { Bank: true },
            },
            JenisPembiayaan: true,
            Refferal: true,
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
          },
        },
        User: { include: { UnitCabang: { include: { UnitPelayanan: true } } } },
        BerkasPengajuan: true,
        DataTaspen: {
          include: {
            DataKeluarga: true,
            Domisili: true,
            DataPasangan: true,
            TunjanganPotongan: true,
          },
        },
        Bank: true,
        DataPengajuanAlamat: true,
        DataPengajuanPasangan: true,
      },
      skip: skip,
      take: 20,
    });
  }

  const total = await prisma.dataPengajuan.count({
    where: {
      is_active: false,
      status_lunas: false,
      DataPembiayaan: {
        created_at: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(
            `${year}-12-${daysInMonth(12, parseInt(year.toString()))}`
          ),
        },
      },
    },
  });
  return NextResponse.json(
    { data: result, total: nama ? result.length : total },
    { status: 200 }
  );
};
