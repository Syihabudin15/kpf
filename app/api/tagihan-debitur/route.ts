import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { Tagihan } from "@/components/utils/Interfaces";
import * as XLSX from "xlsx";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";
import { ceiling } from "@/components/utils/pdf/pdfUtil";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const buffer = Buffer.from(data.url.split(",")[1], "base64");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetbook = workbook.Sheets[workbook.SheetNames[0]];
    const result: any[] = XLSX.utils.sheet_to_json(sheetbook);
    let newData: any[] = [];

    for (let i = 1; i < result.length - 1; i++) {
      if (result[i]["NO PENSIUN"]) {
        const find = await prisma.dataPengajuan.findMany({
          where: {
            nopen: result[i]["NO PENSIUN"].toString(),
            status_lunas: false,
            tagihan_manual: false,
          },
          include: {
            DataPembiayaan: {
              include: {
                Produk: {
                  include: { Bank: true },
                },
              },
            },
          },
        });
        // let angsuranReguler: number = 0;
        // let angsuranFlash: number = 0;
        // if (find.length !== 0) {
        //   for (let j = 0; j < find.length - 1; j++) {
        //     if (find[j].DataPembiayaan.jenis_pembiayaan_id == null) {
        //       const angs = ceiling(
        //         parseInt(
        //           getAngsuranPerBulan(
        //             find[j].DataPembiayaan.mg_bunga,
        //             find[j].DataPembiayaan.tenor,
        //             find[j].DataPembiayaan.plafond,
        //             false,
        //             true
        //           )
        //         ),
        //         find[j].DataPembiayaan.pembulatan
        //       );
        //       angsuranFlash += angs;
        //     } else {
        //       const angs = ceiling(
        //         parseInt(
        //           getAngsuranPerBulan(
        //             find[j].DataPembiayaan.mg_bunga,
        //             find[j].DataPembiayaan.tenor,
        //             find[j].DataPembiayaan.plafond,
        //             false,
        //             false
        //           )
        //         ),
        //         find[j].DataPembiayaan.pembulatan
        //       );
        //       angsuranReguler += angs;
        //     }
        //   }
        // }
        console.log({
          nama: result[i]["NAMA PENERIMA"],
          pinjaman: find,
        });
      }
    }

    return NextResponse.json(
      {
        msg: "Success",
        data: newData.slice(1, newData.length - 5),
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};

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

  const find = await prisma.dataPengajuan.findMany({
    where: {
      status_pencairan: "TRANSFER",
      status_lunas: false,
      tagihan_manual: false,
      is_active: true,
      DataPembiayaan: { is_active: true },
    },
    include: {
      JadwalAngsuran: {
        where: {
          tanggal_pelunasan: null,
        },
      },
    },
  });

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
        include: { DataPembiayaan: { include: { JenisPembiayaan: true } } },
      },
    },
  });
  const newData: Tagihan[] = [];
  const sisaGaji = jadwal.filter(
    (e) => e.DataPengajuan.DataPembiayaan.jenis_pembiayaan_id === null
  );
  const reguler = jadwal.filter(
    (e) => e.DataPengajuan.DataPembiayaan.jenis_pembiayaan_id !== null
  );
  if (reguler.length === 0 || sisaGaji.length === 0) return;

  reguler.forEach((e) => {
    const find = newData.filter(
      (f) =>
        f.DataPengajuan.DataPembiayaan.nopen ===
        e.DataPengajuan.DataPembiayaan.nopen
    );
    if (find.length !== 0) {
      let tempAngsuran = 0;
      find.forEach((f) => (tempAngsuran += f.angsuran));
      newData.push({ ...e, angsuran: tempAngsuran });
    } else {
      newData.push(e);
    }
  });
  sisaGaji.forEach((e) => {
    const find = newData.filter(
      (f) =>
        f.DataPengajuan.DataPembiayaan.nopen ===
        e.DataPengajuan.DataPembiayaan.nopen
    );
    if (find.length !== 0) {
      let tempAngsuran = 0;
      find.forEach((f) => (tempAngsuran += f.angsuran));
      newData.push({ ...e, angsuran: tempAngsuran });
    } else {
      newData.push(e);
    }
  });

  newData.sort((a, b) => b.angsuran_ke - a.angsuran_ke);

  return NextResponse.json({ data: newData }, { status: 200 });
};
