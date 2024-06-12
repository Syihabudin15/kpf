import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { DataPelunasan } from "@/components/utils/Interfaces";
import moment from "moment-timezone";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "20"
  );
  const name = <any>req.nextUrl.searchParams.get("name");
  const skip = (page - 1) * pageSize;
  const month: string =
    <any>req.nextUrl.searchParams.get("month") ||
    `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;

  let result: DataPelunasan[] = [];

  if (name) {
    result = <any>await prisma.pelunasanDebitur.findMany({
      where: {
        DataPengajuan: {
          nama: { contains: name },
          status_lunas: true,
          is_active: true,
        },
        tanggal_pelunasan: {
          gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(true),
          lte: moment(`${month}-${moment(month).daysInMonth()}`)
            .tz("Asia/Jakarta")
            .toISOString(true),
        },
      },
      include: {
        DataPengajuan: {
          include: {
            DataPembiayaan: {
              include: {
                User: {
                  include: {
                    UnitCabang: { include: { UnitPelayanan: true } },
                  },
                },
                JenisPembiayaan: true,
                Produk: { include: { Bank: true } },
                Refferal: true,
              },
            },
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            DataTaspen: {
              include: {
                DataKeluarga: true,
                Domisili: true,
                DataPasangan: true,
                TunjanganPotongan: true,
              },
            },
            BerkasPengajuan: true,
            Bank: true,
            DataPengajuanAlamat: true,
            DataPengajuanPasangan: true,
            JadwalAngsuran: true,
          },
        },
      },
      skip: skip,
      take: pageSize,
    });
  } else {
    result = <any>await prisma.pelunasanDebitur.findMany({
      where: {
        DataPengajuan: {
          status_lunas: true,
          is_active: true,
        },
        tanggal_pelunasan: {
          gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(true),
          lte: moment(`${month}-${moment(month).daysInMonth()}`)
            .tz("Asia/Jakarta")
            .toISOString(true),
        },
      },
      include: {
        DataPengajuan: {
          include: {
            DataPembiayaan: {
              include: {
                User: {
                  include: {
                    UnitCabang: { include: { UnitPelayanan: true } },
                  },
                },
                JenisPembiayaan: true,
                Produk: { include: { Bank: true } },
                Refferal: true,
              },
            },
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            DataTaspen: {
              include: {
                DataKeluarga: true,
                Domisili: true,
                DataPasangan: true,
                TunjanganPotongan: true,
              },
            },
            BerkasPengajuan: true,
            Bank: true,
            DataPengajuanAlamat: true,
            DataPengajuanPasangan: true,
            JadwalAngsuran: true,
          },
        },
      },
      skip: skip,
      take: pageSize,
    });
  }

  let total = await prisma.pelunasanDebitur.count({
    where: {
      DataPengajuan: {
        is_active: true,
        status_lunas: true,
      },
      tanggal_pelunasan: {
        gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(true),
        lte: moment(`${month}-${moment(month).daysInMonth()}`)
          .tz("Asia/Jakarta")
          .toISOString(true),
      },
    },
  });
  const dataPengajuan = await prisma.dataPengajuan.findMany({
    where: {
      is_active: true,
      status_pencairan: "TRANSFER",
      status_lunas: false,
    },
    include: {
      DataPembiayaan: {
        include: {
          User: {
            include: {
              UnitCabang: { include: { UnitPelayanan: true } },
            },
          },
          JenisPembiayaan: true,
          Produk: { include: { Bank: true } },
          Refferal: true,
        },
      },
      User: {
        include: { UnitCabang: { include: { UnitPelayanan: true } } },
      },
      DataTaspen: {
        include: {
          DataKeluarga: true,
          Domisili: true,
          DataPasangan: true,
          TunjanganPotongan: true,
        },
      },
      BerkasPengajuan: true,
      Bank: true,
      DataPengajuanAlamat: true,
      DataPengajuanPasangan: true,
      JadwalAngsuran: true,
    },
  });

  return NextResponse.json(
    { data: result, total: name ? result.length : total, dataPengajuan },
    { status: 200 }
  );
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  try {
    const result = await prisma.pelunasanDebitur.create({ data: data });
    return NextResponse.json(
      { msg: "Berhasil menambahkan data pelunasan!", data: result },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Gagal menambah data pelunasan. Coba lagi nanti!" },
      { status: 500 }
    );
  }
};
