import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const area = req.nextUrl.searchParams.get("area");

  if (!area)
    return NextResponse.json({ dataOK: [], dataPending: [] }, { status: 404 });

  const data = await handleArea(area as string);
  let dataOK = data.dataOK;
  let dataPending = data.dataPending;

  return NextResponse.json({ dataOK, dataPending }, { status: 200 });
};

const handleArea = async (area: string) => {
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
              OR: [
                {status_pencairan: "PROSES"},
                {status_pencairan: null},
              ]
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
