import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { getServerSession } from "next-auth";
import moment from "moment-timezone";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;
  const name = req.nextUrl.searchParams.get("name");
  const date = new Date();
  const from =
    req.nextUrl.searchParams.get("from") ||
    moment(`${date.getFullYear()}-${date.getMonth() + 1}-1`).format(
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
    const data = await handleBank(from, to, skip, user.bank_id, pageSize, name);
    result = data.result;
    total = data.total;
  } else {
    const data = await handleMaster(from, to, skip, pageSize, name);
    result = data.result;
    total = data.total;
  }
  return NextResponse.json({ data: result, total: total }, { status: 200 });
};

const handleMaster = async (
  from: string,
  to: string,
  skip: number,
  pageSize: number,
  nama: string | null
) => {
  let result: DataDataPengajuan[] = [];

  if (nama) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_pencairan: "TRANSFER" },
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
        JadwalAngsuran: true,
      },
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_pencairan: "TRANSFER" },
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
        JadwalAngsuran: true,
      },
      skip: skip,
      take: pageSize,
    });
  }
  const total = await prisma.dataPengajuan.count({
    where: {
      AND: [
        { status_pencairan: "TRANSFER" },
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
  pageSize: number,
  nama: string | null
) => {
  let result: DataDataPengajuan[] = [];

  if (nama) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_pencairan: "TRANSFER" },
          { bankId: bankId },
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
        JadwalAngsuran: true,
      },
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_pencairan: "TRANSFER" },
          { bankId: bankId },
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
        JadwalAngsuran: true,
      },
      skip: skip,
      take: pageSize,
    });
  }
  const total = await prisma.dataPengajuan.count({
    where: {
      AND: [
        { status_pencairan: "TRANSFER" },
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
