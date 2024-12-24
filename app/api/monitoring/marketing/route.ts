import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { getServerSession } from "next-auth";
export const dynamic = "force-dynamic";
import moment from "moment-timezone";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (page - 1) * 20;
  const year =
    req.nextUrl.searchParams.get("year") || moment().format("YYYY-MM");
  const name = req.nextUrl.searchParams.get("name");
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!user) return NextResponse.json({ data: [], total: 0 }, { status: 401 });

  let result: DataDataPengajuan[] = [];

  if (name) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { is_active: true },
          { user_id: user.id },
          {
            DataPembiayaan: {
              OR: [{ name: { contains: name } }, { nopen: { contains: name } }],
            },
          },
        ],
      },
      include: {
        DataPembiayaan: {
          include: {
            Produk: {
              include: { Bank: true },
            },
            JenisPembiayaan: true,
            Refferal: true,
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
          },
        },
        User: { include: { UnitCabang: { include: { UnitPelayanan: true } } } },
        BerkasPengajuan: true,
        DataTaspen: {
          include: {
            DataKeluarga: true,
            Domisili: true,
            DataPasangan: true,
            TunjanganPotongan: true,
          },
        },
        Bank: true,
        DataPengajuanAlamat: true,
        DataPengajuanPasangan: true,
      },
      skip: skip,
      take: 20,
      orderBy: { DataPembiayaan: { created_at: "desc" } },
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { is_active: true },
          { user_id: user.id },
          { status_verifikasi: { not: null } },

          {
            DataPembiayaan: {
              created_at: {
                gte: moment(`${year}-01`).tz("Asia/Jakarta").toISOString(true),
                lte: moment(`${year}-${moment(year).daysInMonth()} 23:59`)
                  .tz("Asia/Jakarta")
                  .toISOString(true),
              },
            },
          },
        ],
      },
      include: {
        DataPembiayaan: {
          include: {
            Produk: {
              include: { Bank: true },
            },
            JenisPembiayaan: true,
            Refferal: true,
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
          },
        },
        User: { include: { UnitCabang: { include: { UnitPelayanan: true } } } },
        BerkasPengajuan: true,
        DataTaspen: {
          include: {
            DataKeluarga: true,
            Domisili: true,
            DataPasangan: true,
            TunjanganPotongan: true,
          },
        },
        Bank: true,
        DataPengajuanAlamat: true,
        DataPengajuanPasangan: true,
      },
      skip: skip,
      take: 20,
      orderBy: { DataPembiayaan: { created_at: "desc" } },
    });
  }

  const total = await prisma.dataPengajuan.findMany({
    where: {
      AND: [
        { DataPembiayaan: { is_active: true } },
        { status_verifikasi: { not: null } },
        { is_active: true },
        { user_id: user.id },
        {
          DataPembiayaan: {
            created_at: {
              gte: moment(`${year}-01`).tz("Asia/Jakarta").toISOString(true),
              lte: moment(`${year}-${moment(year).daysInMonth()} 23:59`)
                .tz("Asia/Jakarta")
                .toISOString(true),
            },
          },
        },
      ],
    },
  });
  return NextResponse.json(
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
};
