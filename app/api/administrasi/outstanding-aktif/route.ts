import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { daysInMonth } from "@/components/utils/inputUtils";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { getServerSession } from "next-auth";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (page - 1) * 20;
  const name = req.nextUrl.searchParams.get("name");
  const year =
    req.nextUrl.searchParams.get("year") || new Date().getFullYear().toString();

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
    const data = await handleBank(year, skip, user.bank_id, name);
    result = data.result;
    total = data.total;
  } else {
    const data = await handleMaster(year, skip, name);
    result = data.result;
    total = data.total;
  }
  return NextResponse.json({ data: result, total: total }, { status: 200 });
};

const handleMaster = async (year: any, skip: number, nama: string | null) => {
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
  return { result, total };
};

const handleBank = async (
  year: any,
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
  return { result, total };
};
