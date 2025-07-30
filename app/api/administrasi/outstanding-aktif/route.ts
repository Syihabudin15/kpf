import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { getServerSession } from "next-auth";
import moment from "moment-timezone";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const pageSize: number = <any>req.nextUrl.searchParams.get("pageSize") || 20;
  const skip = (page - 1) * pageSize;
  const name = req.nextUrl.searchParams.get("name");
  const date = new Date();
  const from =
    req.nextUrl.searchParams.get("from") ||
    moment(`${date.getFullYear()}-${date.getMonth() + 1}-01`).format(
      "YYYY-MM-DD"
    );
  const to =
    req.nextUrl.searchParams.get("to") ||
    moment(
      `${date.getFullYear()}-${date.getMonth() + 1}-${moment(
        date
      ).daysInMonth()}`
    ).format("YYYY-MM-DD");

  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  if (!user) return NextResponse.json({ data: [], total: 0 }, { status: 200 });

  let result: DataDataPengajuan[] = [];
  let total = 0;

  if (user.bank_id) {
    const data = await handleBank(from, to, skip, user.bank_id, name);
    result = data.result;
    total = data.total;
  } else {
    const data = await handleMaster(from, to, skip, name);
    result = data.result;
    total = data.total;
  }
  return NextResponse.json({ data: result, total: total }, { status: 200 });
};

const handleMaster = async (
  from: string,
  to: string,
  skip: number,
  nama: string | null
) => {
  let result: DataDataPengajuan[] = [];

  if (nama) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_pencairan: "TRANSFER" },
          { is_active: true },
          { status_lunas: false },
          {
            DataPembiayaan: {
              OR: [{ name: { contains: nama } }, { nopen: { contains: nama } }],
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
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_pencairan: "TRANSFER" },
          { is_active: true },
          { status_lunas: false },
          {
            tanggal_pencairan: {
              gte: moment(from).tz("Asia/Jakarta").toISOString(true),
              lte: moment(`${to} 23:59`).tz("Asia/Jakarta").toISOString(true),
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
      skip: skip,
      take: 20,
    });
  }
  const total = await prisma.dataPengajuan.count({
    where: {
      AND: [
        { status_pencairan: "TRANSFER" },
        { status_lunas: false },
        { is_active: true },
        {
          tanggal_pencairan: {
            gte: moment(from).tz("Asia/Jakarta").toISOString(true),
            lte: moment(`${to} 23:59`).tz("Asia/Jakarta").toISOString(true),
          },
        },
      ],
    },
  });
  return { result, total };
};

const handleBank = async (
  from: string,
  to: string,
  skip: number,
  bankId: string,
  nama: string | null
) => {
  let result: DataDataPengajuan[] = [];

  if (nama) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_pencairan: "TRANSFER" },
          { is_active: true },
          { bankId: bankId },
          { status_lunas: false },
          {
            DataPembiayaan: {
              OR: [{ name: { contains: nama } }, { nopen: { contains: nama } }],
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
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_pencairan: "TRANSFER" },
          { is_active: true },
          { bankId: bankId },
          { status_lunas: false },
          {
            tanggal_pencairan: {
              gte: moment(from).tz("Asia/Jakarta").toISOString(true),
              lte: moment(`${to} 23:59`).tz("Asia/Jakarta").toISOString(true),
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
      skip: skip,
      take: 20,
    });
  }
  const total = await prisma.dataPengajuan.count({
    where: {
      AND: [
        { status_pencairan: "TRANSFER" },
        { status_lunas: false },
        { is_active: true },
        { bankId: bankId },
        {
          tanggal_pencairan: {
            gte: moment(from).tz("Asia/Jakarta").toISOString(true),
            lte: moment(`${to} 23:59`).tz("Asia/Jakarta").toISOString(true),
          },
        },
      ],
    },
  });
  return { result, total };
};
