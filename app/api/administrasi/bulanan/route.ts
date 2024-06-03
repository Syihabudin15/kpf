import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { daysInMonth } from "@/components/utils/inputUtils";

export const GET = async (req: NextRequest) => {
  const dateTime = new Date();
  let month =
    req.nextUrl.searchParams.get("month") ||
    `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}`;

  const findPengajuan: DataDataPengajuan[] = <any>(
    await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_pencairan: "TRANSFER" },
          {
            tanggal_pencairan: {
              gte: new Date(month + "-01"),
              lte: new Date(
                month +
                  "-" +
                  `${daysInMonth(
                    parseInt(month.split("-")[1]),
                    parseInt(month.split("-")[0])
                  )}`
              ),
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
        JadwalAngsuran: {
          orderBy: { angsuran_ke: "asc" },
        },
      },
    })
  );
  const findPengeluaran = await prisma.cost.findMany({
    where: {
      is_active: true,
      OR: [
        { is_fixed: true },
        {
          created_at: {
            gte: new Date(month + "-01"),
            lte: new Date(
              month +
                "-" +
                `${daysInMonth(
                  parseInt(month.split("-")[1]),
                  parseInt(month.split("-")[0])
                )}`
            ),
          },
        },
      ],
    },
    include: {
      User: true,
    },
  });
  return NextResponse.json(
    {
      dataTable: findPengajuan,
      dataCost: findPengeluaran,
    },
    { status: 200 }
  );
};
