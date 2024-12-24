export const dynamic = "force-dynamic";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const date = new Date();
  const from =
    req.nextUrl.searchParams.get("from") ||
    moment(`${date.getFullYear()}-1-1`).format("YYYY-MM-DD");
  const to =
    req.nextUrl.searchParams.get("to") ||
    moment(`${date.getFullYear()}-12-${moment(date).daysInMonth()}`).format(
      "YYYY-MM-DD"
    );
  const result = await prisma.dataPengajuan.findMany({
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
      DataPembiayaan: true,
      JadwalAngsuran: true,
      Bank: true,
    },
  });
  const prevYearFrom = moment(`${moment().year() - 1}-1`).format("YYYY-MM-DD");
  const prevYearTo = moment(
    `${moment().year() - 1}-12-${moment(
      `${moment().year() - 1}-12-`
    ).daysInMonth()}`
  ).format("YYYY-MM-DD");
  const prevYear = await prisma.dataPengajuan.findMany({
    where: {
      AND: [
        { status_pencairan: "TRANSFER" },
        {
          tanggal_pencairan: {
            gte: moment(prevYearFrom).tz("Asia/Jakarta").toISOString(true),
            lte: moment(`${prevYearTo} 23:59`)
              .tz("Asia/Jakarta")
              .toISOString(true),
          },
        },
      ],
    },
    include: {
      DataPembiayaan: true,
      JadwalAngsuran: true,
      Bank: true,
    },
  });
  const invent = await prisma.inventaris.findMany({
    where: {
      tanggal_pembelian: {
        gte: moment(from).tz("Asia/Jakarta").toISOString(true),
        lte: moment(`${to} 23:59`).tz("Asia/Jakarta").toISOString(true),
      },
    },
  });
  const anggota = await prisma.user.findMany({
    where: { is_anggota: true },
  });
  return NextResponse.json(
    { data: result, prevYear: prevYear, inventaris: invent, anggota: anggota },
    { status: 200 }
  );
};
