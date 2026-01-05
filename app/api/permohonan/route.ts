import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const search = req.nextUrl.searchParams.get("search");

  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!user) return NextResponse.json({ data: [], total: 0 }, { status: 401 });

  const find = await prisma.dataPengajuan.findMany({
    where: {
      ...(search && {
        OR: [{ nama: { contains: search } }, { nopen: { contains: search } }],
      }),
      status_verifikasi: null,
      is_active: true,
    },
    orderBy: {
      DataPembiayaan: {
        created_at: "desc",
      },
    },
    include: {
      DataPembiayaan: {
        include: {
          Produk: {
            include: { Bank: true },
          },
          JenisPembiayaan: true,
          User: true,
          Refferal: true,
        },
      },
      BerkasPengajuan: true,
      DataTaspen: {
        include: {
          Domisili: true,
          DataPasangan: true,
        },
      },
      DataPengajuanAlamat: true,
      DataPengajuanPasangan: true,
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
  });

  const total = await prisma.dataPengajuan.count({
    where: {
      ...(search && {
        OR: [{ nama: { contains: search } }, { nopen: { contains: search } }],
      }),
      status_verifikasi: null,
      is_active: true,
    },
  });

  return NextResponse.json({ status: 200, data: find, total }, { status: 200 });
};
