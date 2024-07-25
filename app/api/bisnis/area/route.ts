import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import moment from "moment-timezone";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const area = req.nextUrl.searchParams.get("area");
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

  if (!area)
    return NextResponse.json({ dataOK: [], dataPending: [] }, { status: 404 });

  const data = await handleArea(area as string, from, to);
  let dataOK = data.dataOK;
  let dataPending = data.dataPending;

  return NextResponse.json({ dataOK, dataPending }, { status: 200 });
};

const handleArea = async (area: string, from: string, to: string) => {
  const dataOK = <any>await prisma.unitCabang.findMany({
    where: {
      unit_pelayanan_id: area,
    },
    include: {
      User: {
        include: {
          DataPengajuan: {
            where: {
              status_pencairan: "TRANSFER",
              is_active: true,
              tanggal_pencairan: {
                gte: moment(from).tz("Asia/Jakarta").toISOString(true),
                lte: moment(`${to} 23:59`).tz("Asia/Jakarta").toISOString(true),
              },
            },
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
      },
    },
  });
  const dataPending = <any>await prisma.unitCabang.findMany({
    where: {
      unit_pelayanan_id: area,
    },
    include: {
      User: {
        include: {
          DataPengajuan: {
            where: {
              is_active: true,
              OR: [{ status_pencairan: "PROSES" }, { status_pencairan: null }],
              DataPembiayaan: {
                created_at: {
                  gte: moment(from).tz("Asia/Jakarta").toISOString(true),
                  lte: moment(`${to} 23:59`)
                    .tz("Asia/Jakarta")
                    .toISOString(true),
                },
              },
            },
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
      },
    },
  });
  return { dataOK, dataPending };
};
