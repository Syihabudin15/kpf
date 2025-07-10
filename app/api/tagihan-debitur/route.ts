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
    const messages: string[] = [];

    const tempTagihan = prisma.jadwalAngsuran.findMany({
      where: {
        tanggal_bayar: {
          gte: moment(
            `${new Date().getFullYear()}-${new Date().getMonth()}-01`
          ).toISOString(),
          lte: moment(
            `${new Date().getFullYear()}-${new Date().getMonth()}-${moment().daysInMonth()}`
          ).toISOString(),
        },
        tanggal_pelunasan: null,
      },
    });

    for (let i = 1; i < result.length - 1; i++) {
      if (result[i]["NO PENSIUN"]) {
        const detail = await getDetailAngsuran(String(result[i]["NO PENSIUN"]));

        // Check NOPEN
        if (detail === null) {
          messages.push(
            `(Row ${result[i]["NO."]}) NOPEN ${result[i]["NO PENSIUN"]} - ${result[i]["NAMA PENERIMA"]} tidak ditemukan (Invalid Nopen)`
          );
        } else {
          // Check Angsuran
          if (
            parseInt(result[i][" ANGSURAN "]) !== detail.angsExp &&
            parseInt(result[i][" ANGSURAN "]) !== detail.angsReg
          ) {
            messages.push(
              `(Row ${result[i]["NO."]})) NOPEN ${result[i]["NO PENSIUN"]} - ${
                result[i]["NAMA PENERIMA"]
              } Invalid Angsuran (${parseInt(
                result[i][" ANGSURAN "]
              )}), Angsuran Flash :${detail.angsExp}, Angsuran SK :${
                detail.angsReg
              }`
            );
          }

          // Check Angsuran Ke
          if (
            parseInt(result[i]["ANGSURAN KE"]) !== detail.angsKeExp &&
            parseInt(result[i]["ANGSURAN KE"]) !== detail.angsKeReg
          ) {
            messages.push(
              `(Row ${result[i]["NO."]}) NOPEN ${result[i]["NO PENSIUN"]} - ${result[i]["NAMA PENERIMA"]} Invalid Angsuran Ke, Excel : ${result[i]["ANGSURAN KE"]}, Sistem : Flash (${detail.angsKeExp}) - SK (${detail.angsKeReg})`
            );
          }

          // Check Tenor
          if (
            parseInt(result[i]["TENOR"]) !== detail.tenorExp &&
            parseInt(result[i]["TENOR"]) !== detail.tenorReg
          ) {
            messages.push(
              `(Row ${result[i]["NO."]}) NOPEN ${result[i]["NO PENSIUN"]} - ${result[i]["NAMA PENERIMA"]} Invalid Tenor : ${result[i]["TENOR"]}, Sistem : Flash (${detail.tenorExp}) - SK (${detail.tenorReg})`
            );
          }

          // Check Plafond
          if (
            parseInt(result[i][" PLAFON "]) !== detail.plafondExp &&
            parseInt(result[i][" PLAFON "]) !== detail.plafondReg
          ) {
            messages.push(
              `(Row ${result[i]["NO."]}) NOPEN ${result[i]["NO PENSIUN"]} - ${result[i]["NAMA PENERIMA"]} InvalidPlafond : ${result[i]["PLAFOND"]}, Sistem : Flash (${detail.plafondExp}) - SK (${detail.plafondReg})`
            );
          }
          // Check Kode Instansi
          if (result[i]["INSTANSI"] !== detail.instansi) {
            messages.push(
              `(Row ${result[i]["NO."]}) NOPEN ${result[i]["NO PENSIUN"]} - ${
                result[i]["NAMA PENERIMA"]
              } Invalid Instansi : ${result[i]["INSTANSI"]}, Sistem : ${
                detail.instansi
              } (${detail.instansi === "01" ? "TASPEN" : "ASABRI"})`
            );
          }
          // Check No SKEP
          if (result[i]["NO. SK"] !== detail.data[0].nomor_sk_pensiun) {
            messages.push(
              `(Row ${result[i]["NO."]}) NOPEN ${result[i]["NO PENSIUN"]} - ${result[i]["NAMA PENERIMA"]} Invalid No SKEP : ${result[i]["NO. SK"]}, Sistem : ${detail.data[0].nomor_sk_pensiun}`
            );
          }
          // Check No SKEP
          if (result[i]["NO. SK"] !== result[i]["NO SK"]) {
            messages.push(
              `(Row ${result[i]["NO."]}) NOPEN ${result[i]["NO PENSIUN"]} - ${result[i]["NAMA PENERIMA"]} Invalid No SKEP di Excel (NO. SK dan NO SK Berbeda)`
            );
          }
          // Chech Periode
          if (
            result[i]["PERIODE"] !== moment().add(1, "month").format("YYYYMM")
          ) {
            messages.push(
              `(Row ${result[i]["NO."]}) NOPEN ${result[i]["NO PENSIUN"]} - ${
                result[i]["NAMA PENERIMA"]
              } Invalid PERIODE/BULAN TAGIH : ${
                result[i]["PERIODE"]
              }, Sistem : ${moment().add(1, "month").format("YYYYMM")}`
            );
          }
        }
      }
    }
    return NextResponse.json(
      {
        msg: "Success",
        data: result.slice(1, result.length - 5),
        result: { messages, tempTagihan },
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
  console.log(moment(45958).add().format("DD/MM/YYYY"));
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

const getDetailAngsuran = async (nopen: string) => {
  let angsExp = 0;
  let angsReg = 0;
  let angsKeExp = 0;
  let angsKeReg = 0;
  let tenorExp = 0;
  let tenorReg = 0;
  let plafondExp = 0;
  let plafondReg = 0;
  let akadExp = "";
  let akadReg = "";

  const find = await prisma.dataPengajuan.findMany({
    where: {
      nopen: nopen,
      tagihan_manual: false,
      status_lunas: false,
      status_pencairan: "TRANSFER",
    },
    include: {
      DataPembiayaan: {
        include: {
          Produk: {
            include: { Bank: true },
          },
        },
      },
      JadwalAngsuran: {
        where: {
          tanggal_pelunasan: { not: null },
        },
        orderBy: {
          angsuran_ke: "desc",
        },
      },
    },
  });
  if (find.length !== 0) {
    find.forEach((f) => {
      if (
        f.jenis_margin === "FLAT" &&
        moment(f.tanggal_cetak_akad) > moment("01/04/2025")
      ) {
        angsExp += ceiling(
          parseInt(
            getAngsuranPerBulan(
              f.DataPembiayaan.mg_bunga,
              f.DataPembiayaan.tenor,
              f.DataPembiayaan.plafond,
              false,
              true
            )
          ),
          f.DataPembiayaan.pembulatan
        );
        angsKeExp = f.JadwalAngsuran[0].angsuran_ke + 1;
        tenorExp = f.DataPembiayaan.tenor;
        plafondExp += f.DataPembiayaan.plafond;
        akadExp = moment(f.tanggal_cetak_akad).format("DD/MM/YYYY");
      } else {
        angsReg += ceiling(
          parseInt(
            getAngsuranPerBulan(
              f.DataPembiayaan.mg_bunga,
              f.DataPembiayaan.tenor,
              f.DataPembiayaan.plafond,
              false,
              false
            )
          ),
          f.DataPembiayaan.pembulatan
        );
      }
      angsKeReg = f.JadwalAngsuran[0].angsuran_ke + 1;
      tenorReg = f.DataPembiayaan.tenor;
      plafondReg += f.DataPembiayaan.plafond;
      akadReg = moment(f.tanggal_cetak_akad).format("DD/MM/YYYY");
    });

    return {
      angsExp,
      angsReg,
      type: angsExp === 0 ? "REGULLER" : angsReg === 0 ? "EXPRESS" : "HALF",
      data: find,
      angsKeExp,
      angsKeReg,
      tenorExp,
      tenorReg,
      plafondExp,
      plafondReg,
      instansi: find[0].jenis_pensiun === "TASPEN" ? "01" : "02",
      akadExp,
      akadReg,
    };
  } else {
    return null;
  }
};
