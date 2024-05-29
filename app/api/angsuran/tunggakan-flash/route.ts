import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { getServerSession } from "next-auth";
import { AngsuranPengajuan } from "@/components/utils/Interfaces";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const name = req.nextUrl.searchParams.get("name");
  const skip = (page - 1) * 20;
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!user) return NextResponse.json({ data: [], total: 0 }, { status: 401 });

  let result: AngsuranPengajuan[] = [];
  let total = 0;

  if (user.bank_id) {
    const data = await handleBank(skip, user.bank_id, name);
    result = <AngsuranPengajuan[]>data.result;
    total = data.total;
  } else {
    const data = await handleMaster(skip, name);
    result = <AngsuranPengajuan[]>data.result;
    total = data.total;
  }
  return NextResponse.json({ data: result, total: total }, { status: 200 });
};

const handleMaster = async (skip: number, name: string | null) => {
  let result: AngsuranPengajuan[] = [];

  if (name) {
    result = <any>await prisma.jadwalAngsuran.findMany({
      where: {
        DataPengajuan: {
          DataPembiayaan: {
            Produk: {
              name: "Flash Sisa Gaji",
            },
            OR: [{ name: { contains: name } }, { nopen: { contains: name } }],
          },
        },
        tanggal_bayar: {
          lte: new Date(),
        },
        tanggal_pelunasan: null,
      },
      include: {
        DataPengajuan: {
          include: {
            DataPembiayaan: {
              include: {
                Produk: { include: { Bank: true } },
                JenisPembiayaan: true,
              },
            },
          },
        },
      },
      skip: skip,
      take: 20,
      orderBy: { DataPengajuan: { DataPembiayaan: { nopen: "asc" } } },
    });
  } else {
    result = <any>await prisma.jadwalAngsuran.findMany({
      where: {
        DataPengajuan: {
          DataPembiayaan: {
            Produk: {
              name: "Flash Sisa Gaji",
            },
          },
        },
        tanggal_bayar: {
          lte: new Date(),
        },
        tanggal_pelunasan: null,
      },
      include: {
        DataPengajuan: {
          include: {
            DataPembiayaan: {
              include: {
                Produk: { include: { Bank: true } },
                JenisPembiayaan: true,
              },
            },
          },
        },
      },
      skip: skip,
      take: 20,
      orderBy: { DataPengajuan: { DataPembiayaan: { nopen: "asc" } } },
    });
  }

  let total = await prisma.jadwalAngsuran.count({
    where: {
      DataPengajuan: {
        DataPembiayaan: {
          Produk: {
            name: "Flash Sisa Gaji",
          },
        },
      },
      tanggal_bayar: {
        lte: new Date(),
      },
      tanggal_pelunasan: null,
    },
  });
  return { result, total: name ? name.length : total };
};

const handleBank = async (
  skip: number,
  bankId: string,
  name: string | null
) => {
  let result: AngsuranPengajuan[] = [];
  const dateTime = new Date();

  if (name) {
    result = <any>await prisma.jadwalAngsuran.findMany({
      where: {
        DataPengajuan: {
          DataPembiayaan: {
            Produk: {
              name: "Flash Sisa Gaji",
            },
            OR: [{ name: { contains: name } }, { nopen: { contains: name } }],
          },
          bankId: bankId,
        },
        tanggal_bayar: {
          lte: new Date(),
        },
        tanggal_pelunasan: null,
      },
      include: {
        DataPengajuan: {
          include: {
            DataPembiayaan: {
              include: {
                Produk: { include: { Bank: true } },
                JenisPembiayaan: true,
              },
            },
          },
        },
      },
      skip: skip,
      take: 20,
      orderBy: { DataPengajuan: { DataPembiayaan: { nopen: "asc" } } },
    });
  } else {
    result = <any>await prisma.jadwalAngsuran.findMany({
      where: {
        DataPengajuan: {
          DataPembiayaan: {
            Produk: {
              name: "Flash Sisa Gaji",
            },
          },
          bankId: bankId,
        },
        tanggal_bayar: {
          lte: new Date(),
        },
        tanggal_pelunasan: null,
      },
      include: {
        DataPengajuan: {
          include: {
            DataPembiayaan: {
              include: {
                Produk: { include: { Bank: true } },
                JenisPembiayaan: true,
              },
            },
          },
        },
      },
      skip: skip,
      take: 20,
      orderBy: { DataPengajuan: { DataPembiayaan: { nopen: "asc" } } },
    });
  }

  let total = await prisma.jadwalAngsuran.count({
    where: {
      DataPengajuan: {
        DataPembiayaan: {
          Produk: {
            name: "Flash Sisa Gaji",
          },
        },
        bankId: bankId,
      },
      tanggal_bayar: {
        lte: new Date(),
      },
      tanggal_pelunasan: null,
    },
  });
  return { result, total: name ? name.length : total };
};
