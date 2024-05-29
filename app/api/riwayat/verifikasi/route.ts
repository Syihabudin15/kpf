import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { daysInMonth } from "@/components/utils/inputUtils";
import { DataDataPengajuan } from "@/components/utils/Interfaces";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const name = req.nextUrl.searchParams.get("name");
  const year =
    req.nextUrl.searchParams.get("year") || new Date().getFullYear().toString();

  const skip = (page - 1) * 20;
  let result: DataDataPengajuan[] = [];
  if (name) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_verifikasi: { not: "ANTRI" } },
          { status_verifikasi: { not: null } },
          { is_active: true },
          {
            DataPembiayaan: {
              created_at: {
                gte: new Date(`${year}-01-01`),
                lte: new Date(
                  `${year}-12-${daysInMonth(12, parseInt(year.toString()))}`
                ),
              },
              OR: [{ name: { contains: name } }, { nopen: { contains: name } }],
            },
          },
        ],
      },
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
        AND: [
          { status_verifikasi: { not: "ANTRI" } },
          { status_verifikasi: { not: null } },
          { is_active: true },
          {
            DataPembiayaan: {
              created_at: {
                gte: new Date(`${year}-01-01`),
                lte: new Date(
                  `${year}-12-${daysInMonth(12, parseInt(year.toString()))}`
                ),
              },
            },
          },
        ],
      },
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
      skip: skip,
      take: 20,
    });
  }
  const total = await prisma.dataPengajuan.count({
    where: {
      AND: [
        { status_verifikasi: { not: "ANTRI" } },
        { status_verifikasi: { not: null } },
        { is_active: true },
        {
          DataPembiayaan: {
            created_at: {
              gte: new Date(`${year}-01-01`),
              lte: new Date(
                `${year}-12-${daysInMonth(12, parseInt(year.toString()))}`
              ),
            },
          },
        },
      ],
    },
  });
  return NextResponse.json(
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
};
