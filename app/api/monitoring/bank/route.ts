import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { getServerSession } from "next-auth";
import moment from "moment-timezone";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const pageSize: number = parseInt(
    <any>req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;
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
          { bankId: user.bank_id },
          {
            OR: [
              { status_verifikasi: "ANTRI" },
              { status_slik: "ANTRI" },
              { status_approval: "ANTRI" },
              { status_pencairan: "PROSES" },
            ],
          },
          {
            DataPembiayaan: {
              OR: [{ name: { contains: name } }, { nopen: { contains: name } }],
            },
          },
          { status_verifikasi: { not: null } },
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
      take: pageSize,
      orderBy: { DataPembiayaan: { created_at: "desc" } },
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { is_active: true },
          { bankId: user.bank_id },
          { status_verifikasi: { not: null } },
          {
            OR: [
              {
                DataPembiayaan: {
                  created_at: {
                    gte: moment(from).tz("Asia/Jakarta").toISOString(true),
                    lte: moment(`${to} 23:59`)
                      .tz("Asia/Jakarta")
                      .toISOString(true),
                  },
                },
              },
              { status_slik: "ANTRI" },
              { status_verifikasi: "ANTRI" },
              { status_approval: "ANTRI" },
              { status_pencairan: "PROSES" },
              {
                AND: [
                  { status_pencairan: null },
                  { status_pencairan: { not: "BATAL" } },
                ],
              },
            ],
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
      take: pageSize,
      orderBy: { DataPembiayaan: { created_at: "desc" } },
    });
  }

  const total = await prisma.dataPengajuan.findMany({
    where: {
      AND: [
        { DataPembiayaan: { is_active: true } },
        { is_active: true },
        { status_verifikasi: { not: null } },
        { bankId: user.bank_id },
        {
          OR: [
            {
              DataPembiayaan: {
                created_at: {
                  gte: moment(from).tz("Asia/Jakarta").toISOString(true),
                  lte: moment(`${to} 23:59`)
                    .tz("Asia/Jakarta")
                    .toISOString(true),
                },
              },
            },
            { status_pencairan: "PROSES" },
            {
              AND: [
                { status_pencairan: null },
                { status_pencairan: { not: "BATAL" } },
              ],
            },
          ],
        },
      ],
    },
  });
  return NextResponse.json(
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
};
