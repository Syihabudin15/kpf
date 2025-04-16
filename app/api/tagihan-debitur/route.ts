import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { Tagihan } from "@/components/utils/Interfaces";

export const GET = async (req: NextRequest) => {
  const tempMonth =
    req.nextUrl.searchParams.get("month") || moment().format("YYYY-MM");
  const month = moment(tempMonth).add(1, "M").format("YYYY-MM");
  // const find = await prisma.dataTaspen.findMany({
  //   where: { is_active: true },
  //   include: {
  //     DataPengajuan: {
  //       where: {
  //         status_lunas: false,
  //         is_active: true,
  //         DataPembiayaan: {
  //           is_active: true,
  //         },
  //       },
  //       include: {
  //         DataPembiayaan: true,
  //         JadwalAngsuran: {
  //           where: {
  //             tanggal_pelunasan: null,
  //             tanggal_bayar: {
  //               lte: moment(`${month}-${moment(month).daysInMonth()} 23:59`)
  //                 .add(1, "M")
  //                 .tz("Asia/Jakarta")
  //                 .toISOString(true),
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  // let temp: Tagihan[] = [];
  // find.forEach((d) => {
  //   if (d.DataPengajuan.length !== 0) {
  //     const filterTransfer = d.DataPengajuan.filter(
  //       (dp) =>
  //         dp.status_pencairan === "TRANSFER" && dp.JadwalAngsuran.length !== 0
  //     );
  //     temp.push({ ...d, DataPengajuan: filterTransfer });
  //   }
  // });
  // const data = temp.filter((d) => d.DataPengajuan.length !== 0);

  const jadwal = await prisma.jadwalAngsuran.findMany({
    where: {
      tanggal_pelunasan: null,
      tanggal_bayar: {
        lte: moment(`${month}-${moment(month).daysInMonth()} 23:59`)
          .tz("Asia/Jakarta")
          .toISOString(true),
      },
      DataPengajuan: {
        is_active: true,
        status_pencairan: "TRANSFER",
        status_lunas: false,
        DataPembiayaan: { is_active: true },
        tagihan_manual: false,
      },
    },
    orderBy: {
      DataPengajuan: {
        tanggal_cetak_akad: "asc",
      },
    },
    include: {
      DataPengajuan: {
        include: { DataPembiayaan: true },
      },
    },
  });
  jadwal.sort((a, b) => b.angsuran_ke - a.angsuran_ke);
  const newData: Tagihan[] = [];
  jadwal.forEach((e) => {
    const find = newData.filter(
      (f) => f.DataPengajuan.nama === e.DataPengajuan.nama
    );
    if (find.length !== 0) {
      return;
    } else {
      newData.push(e);
    }
  });

  return NextResponse.json({ data: newData }, { status: 200 });
};
