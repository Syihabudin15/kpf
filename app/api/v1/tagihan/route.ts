import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import moment from "moment";
import * as XLSX from "xlsx";

export const GET = async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get("page"));
  const pageSize = Number(req.nextUrl.searchParams.get("pageSize"));
  const search = req.nextUrl.searchParams.get("search");
  const backdate = req.nextUrl.searchParams.get("backdate");
  const sumdanId = req.nextUrl.searchParams.get("sumdanId");
  const status = req.nextUrl.searchParams.get("status");
  const skip = (page - 1) * pageSize;

  const data = await prisma.jadwalAngsuran.findMany({
    where: {
      DataPengajuan: {
        tagihan_manual: false,
      },
      //   tanggal_pelunasan: null,
      tanggal_bayar: {
        gte: moment(backdate || new Date())
          .startOf("month")
          .toDate(),
        lte: moment(backdate || new Date())
          .endOf("month")
          .toDate(),
      },
      ...(search && {
        DataPengajuan: {
          OR: [{ nama: { contains: search } }, { nopen: { contains: search } }],
        },
      }),
      ...(sumdanId && { DataPengajuan: { bankId: sumdanId } }),
      ...(status
        ? {
            tanggal_pelunasan:
              status === "INCLUDE BLOKIR" ? { not: null } : null,
          }
        : { tanggal_pelunasan: null }),
    },
    skip: skip,
    take: pageSize,
    include: { DataPengajuan: { include: { DataPembiayaan: true } } },
  });
  const total = await prisma.jadwalAngsuran.count({
    where: {
      DataPengajuan: {
        tagihan_manual: false,
      },
      tanggal_bayar: {
        gte: moment(backdate || new Date())
          .startOf("month")
          .toDate(),
        lte: moment(backdate || new Date())
          .endOf("month")
          .toDate(),
      },
      ...(search && {
        OR: [
          {
            DataPengajuan: {
              OR: [
                { nama: { contains: search } },
                { nopen: { contains: search } },
              ],
            },
          },
        ],
      }),
      ...(sumdanId && { DataPengajuan: { bankId: sumdanId } }),
      ...(status
        ? {
            tanggal_pelunasan:
              status === "INCLUDE BLOKIR" ? { not: null } : null,
          }
        : { tanggal_pelunasan: null }),
    },
  });

  return NextResponse.json(
    { data, total, status: 200, msg: "OK" },
    { status: 200 }
  );
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  const month = data.month || null;

  try {
    const buffer = Buffer.from(data.url.split(",")[1], "base64");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetbook = workbook.Sheets[workbook.SheetNames[0]];
    const result: any[] = XLSX.utils.sheet_to_json(sheetbook);
    const resposne: { nopen: string; name: string; msg: string[] }[] = [];

    let allData = await prisma.dataPengajuan.findMany({
      where: {
        is_active: true,
        status_pencairan: "TRANSFER",
        tagihan_manual: false,
        status_lunas: false,
        JadwalAngsuran: {
          some: {
            tanggal_bayar: {
              gte: moment(month || new Date())
                .startOf("month")
                .toDate(),
              lte: moment(month || new Date())
                .endOf("month")
                .toDate(),
            },
            tanggal_pelunasan: null,
          },
        },
      },
      include: {
        JadwalAngsuran: {
          where: {
            tanggal_bayar: {
              gte: moment(month || new Date())
                .startOf("month")
                .toDate(),
              lte: moment(month || new Date())
                .endOf("month")
                .toDate(),
            },
            tanggal_pelunasan: null,
          },
        },
      },
    });

    for (const dapem of result) {
      const msg: string[] = [];
      const nopen = dapem["NO PENSIUN"];
      const name = dapem["NAMA PENERIMA"];
      const plafond = dapem[" PLAFON "];
      const tenor = dapem["TENOR"];
      const periode = dapem["PERIODE"];
      const noSKEP = dapem["NO. SK"];
      const instansi = dapem["INSTANSI"];
      const angsuran = dapem[" ANGSURAN "];
      const angsuranke = dapem["ANGSURAN KE"];

      if (!nopen) continue;

      const find = await prisma.jadwalAngsuran.findFirst({
        where: {
          DataPengajuan: { DataPembiayaan: { nopen: String(nopen) } },
          tanggal_bayar: {
            gte: moment(month || new Date())
              .startOf("month")
              .toDate(),
            lte: moment(month || new Date())
              .endOf("month")
              .toDate(),
          },
        },
        include: {
          DataPengajuan: {
            include: {
              DataPembiayaan: true,
            },
          },
        },
      });

      if (!find) {
        msg.push(`Nopen [${nopen}] tidak ditemukan`);
        continue;
      }
      if (plafond !== find.DataPengajuan.DataPembiayaan.plafond) {
        msg.push(
          `Plafond tidak sesuai! ${plafond} | ${find.DataPengajuan.DataPembiayaan.plafond}`
        );
      }
      if (
        name !== find.DataPengajuan.nama &&
        name !== find.DataPengajuan.nama_skep
      ) {
        msg.push(
          `Nama Pemohon tidak sesuai! ${name} | KTP:${find.DataPengajuan.nama} | SK:${find.DataPengajuan.nama_skep}`
        );
      }
      if (tenor !== find.DataPengajuan.DataPembiayaan.tenor) {
        msg.push(
          `Tenor tidak sesuai! ${tenor} | ${find.DataPengajuan.DataPembiayaan.tenor}`
        );
      }
      if (periode != moment(find.tanggal_bayar).format("YYYYMM")) {
        msg.push(
          `Periode tidak sesuai! ${periode} | ${moment(
            find.tanggal_bayar
          ).format("YYYYMM")}`
        );
      }
      if (noSKEP !== find.DataPengajuan.nomor_sk_pensiun) {
        msg.push(
          `No SKEP tidak sesuai! ${noSKEP} | ${find.DataPengajuan.nomor_sk_pensiun}`
        );
      }
      const ins = find.DataPengajuan.jenis_pensiun?.includes("TASPEN")
        ? "01"
        : "02";
      if (instansi !== ins) {
        msg.push(
          `Instansi tidak sesuai! ${instansi} | ${ins} (${find.DataPengajuan.jenis_pensiun})`
        );
      }
      if (angsuran !== find.angsuran) {
        const temp = angsuran - find.angsuran;
        if (temp > 100 || temp < -100) {
          msg.push(`Angsuran tidak sesuai! ${angsuran} | ${find.angsuran}`);
        }
      }
      if (angsuranke !== find.angsuran_ke) {
        msg.push(
          `Angsuran ke tidak sesuai! ${angsuranke} | ${find.angsuran_ke}`
        );
      }
      resposne.push({ name, nopen, msg });
      allData = allData.filter((ad) => ad.nopen !== nopen);
    }
    return NextResponse.json(
      {
        msg: "OK",
        data: resposne.filter((r) => r.msg.length !== 0),
        allData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};

const getDetail = async (nopen: string, month: string) => {
  const find = await prisma.jadwalAngsuran.findMany({
    where: {
      DataPengajuan: {
        nopen,
        status_pencairan: "TRANSFER",
        is_active: true,
        status_lunas: false,
        tagihan_manual: false,
      },
      tanggal_bayar: {
        gte: moment(month || new Date())
          .startOf("month")
          .toDate(),
        lte: moment(month || new Date())
          .endOf("month")
          .toDate(),
      },
    },
    include: { DataPengajuan: true },
  });
};
