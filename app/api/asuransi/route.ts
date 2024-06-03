import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { daysInMonth } from "@/components/utils/inputUtils";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const name = req.nextUrl.searchParams.get("name");
  const month =
    req.nextUrl.searchParams.get("month") || "2024-" + new Date().getMonth();
  const isTrue = req.nextUrl.searchParams.get("is-true");
  const skip = (page - 1) * 20;
  console.log(skip);
  let result: DataDataPengajuan[] = [];

  if (name) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        pembayaran_asuransi: isTrue ? true : false,
        is_active: true,
        status_pencairan: "TRANSFER",
        tanggal_pencairan: {
          gte: new Date(month + "-01"),
          lte: new Date(
            month +
              "-" +
              daysInMonth(
                parseInt(month.split("-")[1]),
                parseInt(month.split("-")[0])
              )
          ),
        },
        OR: [
          { nama: { contains: name } },
          { nopen: { contains: name } },
          {
            DataPembiayaan: {
              Produk: {
                name: { contains: name },
              },
            },
          },
          {
            Bank: {
              name: { contains: name },
            },
          },
          {
            DataPembiayaan: {
              JenisPembiayaan: {
                name: { contains: name },
              },
            },
          },
        ],
      },
      include: {
        DataPembiayaan: {
          include: {
            User: {
              include: {
                UnitCabang: {
                  include: {
                    UnitPelayanan: true,
                  },
                },
              },
            },
            Produk: true,
            JenisPembiayaan: true,
          },
        },
        User: {
          include: {
            UnitCabang: {
              include: {
                UnitPelayanan: true,
              },
            },
          },
        },
        Bank: true,
      },
      take: 20,
      skip: skip,
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        pembayaran_asuransi: isTrue ? true : false,
        is_active: true,
        status_pencairan: "TRANSFER",
        tanggal_pencairan: {
          gte: new Date(month + "-01"),
          lte: new Date(
            month +
              "-" +
              daysInMonth(
                parseInt(month.split("-")[1]),
                parseInt(month.split("-")[0])
              )
          ),
        },
      },
      include: {
        DataPembiayaan: {
          include: {
            User: {
              include: {
                UnitCabang: {
                  include: {
                    UnitPelayanan: true,
                  },
                },
              },
            },
            Produk: true,
            JenisPembiayaan: true,
          },
        },
        User: {
          include: {
            UnitCabang: {
              include: {
                UnitPelayanan: true,
              },
            },
          },
        },
        Bank: true,
      },
      take: 20,
      skip: skip,
    });
  }

  const total = await prisma.dataPengajuan.findMany({
    where: {
      is_active: true,
      status_pencairan: "TRANSFER",
      pembayaran_asuransi: isTrue ? true : false,
      DataPembiayaan: {
        created_at: {
          gte: new Date(month + "-01"),
          lte: new Date(
            month +
              "-" +
              daysInMonth(
                parseInt(month.split("-")[1]),
                parseInt(month.split("-")[0])
              )
          ),
        },
      },
    },
  });

  return NextResponse.json({ data: result, total }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  const find = await prisma.dataPengajuan.findFirst({ where: { id: data.id } });
  if (!find)
    return NextResponse.json(
      { msg: "Maaf data tidak ditemukan. mohon refresh dan coba lagi!" },
      { status: 404 }
    );

  await prisma.dataPengajuan.update({
    where: {
      id: data.id,
    },
    data: {
      pembayaran_asuransi: find.pembayaran_asuransi ? false : true,
      tanggal_pembayaran_asuransi: data.tanggal_pembayaran_asuransi
        ? new Date(data.tanggal_pembayaran_asuransi).toISOString()
        : new Date(),
    },
  });

  return NextResponse.json(
    { msg: "Berhasil update data pembayaran asuransi!" },
    { status: 200 }
  );
};
