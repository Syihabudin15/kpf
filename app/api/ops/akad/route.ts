import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { daysInMonth } from "@/components/utils/inputUtils";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const name = req.nextUrl.searchParams.get("name");
  const year =
    <any>req.nextUrl.searchParams.get("year") ??
    new Date().getFullYear().toString();
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (page - 1) * 20;
  try {
    let result: DataDataPengajuan[] = [];

    if (result && (name || year)) {
      if (name) {
        const tmp: DataDataPengajuan[] = <any>(
          await prisma.dataPengajuan.findMany({
            where: {
              AND: [
                { status_maker: "SETUJU" },
                { DataPembiayaan: { is_active: true } },
                {
                  OR: [
                    { DataPembiayaan: { name: { contains: name } } },
                    { DataPembiayaan: { nopen: { contains: name } } },
                  ],
                },
              ],
            },
            include: {
              DataPembiayaan: {
                include: {
                  Produk: { include: { Bank: true } },
                  User: {
                    include: {
                      UnitCabang: { include: { UnitPelayanan: true } },
                    },
                  },
                  JenisPembiayaan: true,
                  Refferal: true,
                },
              },
              User: {
                include: { UnitCabang: { include: { UnitPelayanan: true } } },
              },
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
              Bank: true,
            },
            take: 20,
            skip: skip,
          })
        );
        result = tmp;
      } else {
        const temp = <any>await prisma.dataPengajuan.findMany({
          where: {
            AND: [
              { status_maker: "SETUJU" },
              {
                DataPembiayaan: {
                  AND: [
                    { is_active: true },
                    {
                      created_at: {
                        gte: new Date(`${year}-01-01`),
                        lte: new Date(`${year}-12-${daysInMonth(12, year)}`),
                      },
                    },
                  ],
                },
              },
            ],
          },
          include: {
            DataPembiayaan: {
              include: {
                Produk: { include: { Bank: true } },
                User: {
                  include: { UnitCabang: { include: { UnitPelayanan: true } } },
                },
                JenisPembiayaan: true,
                Refferal: true,
              },
            },
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
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
            Bank: true,
          },
        });
        result = temp;
      }
    } else {
      const temp = <any>await prisma.dataPengajuan.findMany({
        where: {
          status_maker: "SETUJU",
          DataPembiayaan: { is_active: true },
        },
        include: {
          DataPembiayaan: {
            include: {
              Produk: { include: { Bank: true } },
              User: {
                include: { UnitCabang: { include: { UnitPelayanan: true } } },
              },
              JenisPembiayaan: true,
              Refferal: true,
            },
          },
          User: {
            include: { UnitCabang: { include: { UnitPelayanan: true } } },
          },
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
          Bank: true,
        },
        skip,
        take: 20,
      });
      result = temp;
    }
    const total = await prisma.dataPengajuan.count({
      where: { status_maker: "SETUJU", DataPembiayaan: { is_active: true } },
    });
    return NextResponse.json(
      { data: result, total: name || year ? result.length : total },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
};
