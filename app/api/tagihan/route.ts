import { formatNumberTitik } from "@/components/utils/inputUtils";
import ExcelJS from "exceljs";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import path from "path";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { data } = await req.json();

  try {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.join(
      process.cwd(),
      "/storage" + "/slik/tagihan.xlsx"
    );

    // Memuat workbook dari file yang ada
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1); // Ambil worksheet pertama

    if (!worksheet) {
      return NextResponse.json(
        { data: [], msg: "Worksheet not found" },
        { status: 404 }
      );
    }
    // const rowCount = worksheet.rowCount;

    // Menghapus dari baris ke-3 sampai akhir

    for (let i = 3; i < data.length + 3; i++) {
      worksheet.spliceRows(i, 1, [
        i - 2,
        moment(data[i - 3].tanggal_bayar).format("YYYYMM"),
        moment(data[i - 3].tanggal_bayar).format("YYYYMM"),
        "",
        data[i - 3].DataPengajuan.nomor_sk_pensiun,
        data[i - 3].DataPengajuan.jenis_pensiun === "TASPEN" ? "01" : "03",
        "00",
        data[i - 3].DataPengajuan.nopen,
        data[i - 3].DataPengajuan.nomor_sk_pensiun,
        data[i - 3].DataPengajuan.nama,
        data[i - 3].DataPengajuan.DataPembiayaan.tenor,
        data[i - 3].angsuran_ke,
        formatNumberTitik(data[i - 3].angsuran.toFixed(0)),
        "00",
        moment(data[i - 3].DataPengajuan.tanggal_cetak_akad).format(
          "DD/MM/YYYY"
        ),
        data[i - 3].DataPengajuan.DataPembiayaan.juru_bayar_tujuan,
        "-",
        data[i - 3].DataPengajuan.DataPembiayaan.jenis_pembiayaan_id &&
        data[i - 3].DataPengajuan.DataPembiayaan.JenisPembiayaan.name &&
        data[i - 3].DataPengajuan.DataPembiayaan.JenisPembiayaan.name ===
          "Mutasi Take Over"
          ? data[i - 3].DataPengajuan.DataPembiayaan.juru_bayar_asal
          : "-",
        "KPF",
        formatNumberTitik(
          data[i - 3].DataPengajuan.DataPembiayaan.plafond.toFixed(0)
        ),
      ]);
    }

    // Mengatur response untuk mengunduh file Excel
    await workbook.xlsx.writeFile(filePath);

    return NextResponse.json({ msg: "Berhasil" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { data: [], msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};
export const GET = async () => {
  const currMonth = moment().format("YYYY-MM");
  const data = await prisma.jadwalAngsuran.findMany({
    where: {
      tanggal_pelunasan: null,
      tanggal_bayar: {
        gte: moment(`${currMonth}-01`).tz("Asia/Jakarta").toISOString(true),
        lte: moment(`${currMonth}-${moment(currMonth).daysInMonth()} 23:59`)
          .tz("Asia/Jakarta")
          .toISOString(true),
      },
    },
    include: {
      DataPengajuan: {
        include: {
          DataPembiayaan: {
            include: {
              Produk: true,
              JenisPembiayaan: true,
            },
          },
          Bank: true,
        },
      },
    },
  });

  return NextResponse.json({ data: data }, { status: 200 });
};
