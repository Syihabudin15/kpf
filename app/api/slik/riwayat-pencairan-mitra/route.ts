import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { daysInMonth } from "@/components/utils/inputUtils";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const name = req.nextUrl.searchParams.get("name");
  const year = req.nextUrl.searchParams.get("year") || new Date().getFullYear();
  const skip = (page - 1) * 20;
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  if (!user) {
    return NextResponse.json({ data: [], total: 0 }, { status: 200 });
  }

  let result: DataDataPengajuan[] = [];

  if (name) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        bankId: user.bank_id,
        status_pencairan: "TRANSFER",
        DataPembiayaan: {
          OR: [{ name: { contains: name } }, { nopen: { contains: name } }],
        },
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
        DataPencairan: true,
        PenyerahanBerkas: true,
        PenyerahanJaminan: true,
      },
      skip: skip,
      take: 20,
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        bankId: user.bank_id,
        status_pencairan: "TRANSFER",

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
        DataPencairan: true,
        PenyerahanBerkas: true,
        PenyerahanJaminan: true,
      },
      skip: skip,
      take: 20,
    });
  }

  const total = await prisma.dataPengajuan.count({
    where: {
      status_pencairan: "TRANSFER",
      bankId: user.bank_id,
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
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
};
