import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import moment from "moment-timezone";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const month: string =
    <any>req.nextUrl.searchParams.get("month") ||
    `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
  const page: number = <any>req.nextUrl.searchParams.get("page");
  const type = req.nextUrl.searchParams.get("type");
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "20"
  );
  const skip = (page - 1) * pageSize;

  let result: DataDataPengajuan[] = [];
  let total = 0;
  if (type) {
    const data = await handleType(type, skip, pageSize, month);
    result = data.result;
    total = data.total;
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
        tanggal_pencairan: {
          gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(),
          lte: moment(`${month}-${moment(month).daysInMonth()}`)
            .tz("Asia/Jakarta")
            .toISOString(),
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
      },
      skip: skip,
      take: pageSize,
    });
    total = await prisma.dataPengajuan.count({
      where: {
        status_pencairan: "TRANSFER",
        tanggal_pencairan: {
          gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(),
          lte: moment(`${month}-${moment(month).daysInMonth()}`)
            .tz("Asia/Jakarta")
            .toISOString(),
        },
      },
    });
  }

  return NextResponse.json(
    {
      data: result,
      total: total,
    },
    { status: 200 }
  );
};

const handleType = async (
  type: string,
  skip: number,
  pageSize: number,
  month: string
) => {
  let result: DataDataPengajuan[] = [];
  let total = 0;

  if (type === "REGULER") {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
        DataPembiayaan: {
          Produk: {
            name: { not: "Flash Sisa Gaji" },
          },
        },
        tanggal_pencairan: {
          gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(),
          lte: moment(`${month}-${moment(month).daysInMonth()}`)
            .tz("Asia/Jakarta")
            .toISOString(),
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
      },
      skip: skip,
      take: pageSize,
    });
    total = await prisma.dataPengajuan.count({
      where: {
        status_pencairan: "TRANSFER",
        DataPembiayaan: {
          Produk: {
            name: { not: "Flash Sisa Gaji" },
          },
        },
        tanggal_pencairan: {
          gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(),
          lte: moment(`${month}-${moment(month).daysInMonth()} 23:59`)
            .tz("Asia/Jakarta")
            .toISOString(),
        },
      },
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
        DataPembiayaan: {
          Produk: {
            name: "Flash Sisa Gaji",
          },
        },
        tanggal_pencairan: {
          gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(),
          lte: moment(`${month}-${moment(month).daysInMonth()} 23:59`)
            .tz("Asia/Jakarta")
            .toISOString(),
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
      },
      skip: skip,
      take: pageSize,
    });
    total = await prisma.dataPengajuan.count({
      where: {
        status_pencairan: "TRANSFER",
        DataPembiayaan: {
          Produk: {
            name: "Flash Sisa Gaji",
          },
        },
        tanggal_pencairan: {
          gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(),
          lte: moment(`${month}-${moment(month).daysInMonth()} 23:59`)
            .tz("Asia/Jakarta")
            .toISOString(),
        },
      },
    });
  }
  return { result, total };
};
