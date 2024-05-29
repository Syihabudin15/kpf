import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { daysInMonth } from "@/components/utils/inputUtils";
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
  const dateTime = new Date();

  if (name) {
    result = <any>await prisma.jadwalAngsuran.findMany({
      where: {
        DataPengajuan: {
          DataPembiayaan: {
            Produk: {
              name: { not: "Flash Sisa Gaji" },
            },
            OR: [{ name: { contains: name } }, { nopen: { contains: name } }],
          },
        },
        tanggal_bayar: {
          gte: new Date(
            `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-1`
          ),
          lte: new Date(
            `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${daysInMonth(
              dateTime.getMonth(),
              dateTime.getFullYear()
            )}`
          ),
        },
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
    });
  } else {
    result = <any>await prisma.jadwalAngsuran.findMany({
      where: {
        DataPengajuan: {
          DataPembiayaan: {
            Produk: {
              name: { not: "Flash Sisa Gaji" },
            },
          },
        },
        tanggal_bayar: {
          gte: new Date(
            `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-1`
          ),
          lte: new Date(
            `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${daysInMonth(
              dateTime.getMonth(),
              dateTime.getFullYear()
            )}`
          ),
        },
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
    });
  }

  let total = await prisma.jadwalAngsuran.count({
    where: {
      DataPengajuan: {
        DataPembiayaan: {
          Produk: {
            name: { not: "Flash Sisa Gaji" },
          },
        },
      },
      tanggal_bayar: {
        gte: new Date(`${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-1`),
        lte: new Date(
          `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${daysInMonth(
            dateTime.getMonth(),
            dateTime.getFullYear()
          )}`
        ),
      },
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
              name: { not: "Flash Sisa Gaji" },
            },
            OR: [{ name: { contains: name } }, { nopen: { contains: name } }],
          },
          bankId: bankId,
        },
        tanggal_bayar: {
          gte: new Date(
            `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-1`
          ),
          lte: new Date(
            `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${daysInMonth(
              dateTime.getMonth(),
              dateTime.getFullYear()
            )}`
          ),
        },
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
    });
  } else {
    result = <any>await prisma.jadwalAngsuran.findMany({
      where: {
        DataPengajuan: {
          DataPembiayaan: {
            Produk: {
              name: { not: "Flash Sisa Gaji" },
            },
          },
          bankId: bankId,
        },
        tanggal_bayar: {
          gte: new Date(
            `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-1`
          ),
          lte: new Date(
            `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${daysInMonth(
              dateTime.getMonth(),
              dateTime.getFullYear()
            )}`
          ),
        },
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
    });
  }

  let total = await prisma.jadwalAngsuran.count({
    where: {
      DataPengajuan: {
        DataPembiayaan: {
          Produk: {
            name: { not: "Flash Sisa Gaji" },
          },
        },
        bankId: bankId,
      },
      tanggal_bayar: {
        gte: new Date(`${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-1`),
        lte: new Date(
          `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${daysInMonth(
            dateTime.getMonth(),
            dateTime.getFullYear()
          )}`
        ),
      },
    },
  });
  return { result, total: name ? name.length : total };
};

export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  const find = await prisma.jadwalAngsuran.findFirst({
    where: { id: data.id },
  });

  if (!find)
    return NextResponse.json({ msg: "Data tidak ditemukan!" }, { status: 404 });

  await prisma.jadwalAngsuran.update({
    where: {
      id: data.id,
    },
    data: {
      tanggal_pelunasan: find.tanggal_pelunasan ? null : new Date(),
    },
  });
  return NextResponse.json(
    { msg: "Data angsuran berhasil diupdate!" },
    { status: 200 }
  );
};
