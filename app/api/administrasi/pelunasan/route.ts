import { DataPelunasan } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import moment from "moment-timezone";
import { PelunasanDebitur } from "@prisma/client";
import { getServerSession } from "next-auth";

export const GET = async (req: NextRequest) => {
  const month: string = <any>req.nextUrl.searchParams.get("month");
  const name = req.nextUrl.searchParams.get("name");
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "20"
  );
  const skip = (page - 1) * pageSize;

  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
    include: {
      Bank: true,
    },
  });

  let result: DataPelunasan[] = [];
  let total = 0;

  if (!user) {
    return NextResponse.json({ data: [], total: 0 }, { status: 401 });
  }

  if (user.bank_id) {
    const data = await handleBank(
      skip,
      pageSize,
      month,
      user.bank_id,
      name || undefined
    );
    result = <any>data.result;
    total = data.total;
  } else {
    const data = await handlePusat(skip, pageSize, month, name || undefined);
    result = <any>data.result;
    total = data.total;
  }

  return NextResponse.json({ data: result, total: total }, { status: 200 });
};

const handleBank = async (
  skip: number,
  take: number,
  month: string,
  bankId: string,
  name?: string
) => {
  let result: PelunasanDebitur[] = [];
  if (name) {
    result = <any>await prisma.pelunasanDebitur.findMany({
      where: {
        DataPengajuan: {
          bankId: bankId,
          OR: [
            { nama: { contains: name } },
            { nopen: { contains: name } },
            { nomor_sk_pensiun: { contains: name } },
          ],
        },
      },
      include: {
        DataPengajuan: {
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
        },
      },
      skip: skip,
      take: take,
    });
  } else {
    result = <any>await prisma.pelunasanDebitur.findMany({
      where: {
        tanggal_pelunasan: {
          gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(),
          lte: moment(`${month}-${moment(month).daysInMonth()}`)
            .tz("Asia/Jakarta")
            .toISOString(),
        },
        DataPengajuan: {
          bankId: bankId,
        },
      },
      include: {
        DataPengajuan: {
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
        },
      },
      take: take,
      skip: skip,
    });
  }
  const total = await prisma.pelunasanDebitur.count({
    where: {
      tanggal_pelunasan: {
        gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(),
        lte: moment(`${month}-${moment(month).daysInMonth()}`)
          .tz("Asia/Jakarta")
          .toISOString(),
      },
      DataPengajuan: {
        bankId: bankId,
      },
    },
  });
  return { result, total: name ? result.length : total };
};

const handlePusat = async (
  skip: number,
  take: number,
  month: string,
  name?: string
) => {
  let result: PelunasanDebitur[] = [];
  if (name) {
    result = <any>await prisma.pelunasanDebitur.findMany({
      where: {
        DataPengajuan: {
          OR: [
            { nama: { contains: name } },
            { nopen: { contains: name } },
            { nomor_sk_pensiun: { contains: name } },
          ],
        },
      },
      include: {
        DataPengajuan: {
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
        },
      },
      skip: skip,
      take: take,
    });
  } else {
    result = <any>await prisma.pelunasanDebitur.findMany({
      where: {
        tanggal_pelunasan: {
          gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(),
          lte: moment(`${month}-${moment(month).daysInMonth()}`)
            .tz("Asia/Jakarta")
            .toISOString(),
        },
      },
      include: {
        DataPengajuan: {
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
        },
      },
      take: take,
      skip: skip,
    });
  }
  const total = await prisma.pelunasanDebitur.count({
    where: {
      tanggal_pelunasan: {
        gte: moment(`${month}-01`).tz("Asia/Jakarta").toISOString(),
        lte: moment(`${month}-${moment(month).daysInMonth()}`)
          .tz("Asia/Jakarta")
          .toISOString(),
      },
    },
  });
  return { result, total: name ? result.length : total };
};
