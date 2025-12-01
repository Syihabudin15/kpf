import moment from "moment";
import { formatNumber } from "../inputUtils";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";
import { DataDataPengajuan } from "../Interfaces";

export const BilangRatusan = async (dana: number) => {
  const kata = [
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
  ];
  let str = "";
  let ratusan = Math.floor(dana / 100);
  dana = dana % 100;

  if (ratusan > 1) {
    str = `${str} ${kata[ratusan]}ratus `;
  } else if (ratusan === 1) {
    str = `${str} Seratus`;
  }

  const puluhan = Math.floor(dana / 10);
  dana = dana % 10;
  if (puluhan > 0) {
    str = `${str} ${kata[puluhan]} Puluh`;
    str = `${str} ${kata[dana]}`;
  } else if (puluhan === 1 && dana > 0) {
    str = `${str} ${kata[dana]} Belas`;
  } else if (puluhan === 1 && dana === 0) {
    str = `${str} ${kata[dana]} Sepuluh`;
  } else if (puluhan === 0) {
    str = `${str} ${kata[dana]}`;
  }

  return str;
};

export const NumberToText = async (dana: number) => {
  const frmt = formatNumber(dana.toString());
  const pecah = frmt.split(",");
  let str = "";

  for (let i = 0; i < pecah.length; i++) {
    if (pecah.length - i === 5 && parseInt(pecah[i]) !== 0) {
      str = `${str} ${BilangRatusan(parseInt(pecah[i]))} Triliyun`;
    } else if (pecah.length - i === 4 && parseInt(pecah[i]) !== 0) {
      str = `${str} ${BilangRatusan(parseInt(pecah[i]))} Milyar`;
    } else if (pecah.length - i === 3 && parseInt(pecah[i]) !== 0) {
      str = `${str} ${BilangRatusan(parseInt(pecah[i]))} Juta`;
    } else if (pecah.length - i === 2 && parseInt(pecah[i]) !== 0) {
      str = `${str} ${BilangRatusan(parseInt(pecah[i]))} Seribu`;
    } else if (pecah.length - i === 1 && parseInt(pecah[i]) !== 0) {
      str = `${str} ${BilangRatusan(parseInt(pecah[i]))}`;
    }
  }
  return str;
};

export const generateTableAngsuran = (data: DataDataPengajuan) => {
  let result = [];
  if (data.jenis_margin === "FLAT") {
    const tables = angsuranFlatToInterest(
      data.DataPembiayaan.tenor,
      data.DataPembiayaan.plafond,
      data.DataPembiayaan.margin_bank,
      data.DataPembiayaan.mg_bunga,
      data.tanggal_cetak_akad?.toString() ||
        moment().format("YYYY-MM-DD").toString(),
      data.id,
      data.DataPembiayaan.pembulatan
    );
    result = tables;
  } else {
    const tables = angsuranAnuitas(
      data.DataPembiayaan.tenor,
      data.DataPembiayaan.plafond,
      data.DataPembiayaan.mg_bunga,
      data.DataPembiayaan.margin_bank,
      data.tanggal_cetak_akad?.toString() ||
        moment().format("YYYY-MM-DD").toString(),
      data.id,
      data.DataPembiayaan.pembulatan,
      data.Bank.kode || undefined,
      data.DataPembiayaan.pembulatanKhusus
    );

    result = tables;
  }

  return result;
};

// const angsuranFlatToInterest = (
//   tenor: number,
//   plafond: number,
//   bungaBank: number,
//   bungaKoperasi: number,
//   tanggal: string,
//   pengajuanId: string,
//   pembulatan: number
// ) => {
//   const table: any[] = [];
//   const bank = rounded(
//     (bungaBank / 100 / (1 - Math.pow(1 + bungaBank / 100 / 12, -tenor)) -
//       1 / (tenor / 12)) *
//       100,
//     4
//   );
//   const angsuranKoperasi = ceiling(
//     parseInt(getAngsuranPerBulan(bungaKoperasi, tenor, plafond, true)),
//     1
//   );
//   const marginss = (plafond * (bank / 100)) / 12;
//   const pokok = rounded(plafond / tenor, 100);
//   let sisa = plafond;
//   const colfee = (angsuranKoperasi - (pokok + marginss)).toFixed(0);

//   for (let i = 0; i <= tenor; i++) {
//     if (i === 0) {
//       table.push({
//         angsuran_ke: i,
//         angsuran: "0",
//         pokok: "0",
//         margin: "0",
//         margin_bank: "0",
//         collfee: "0",
//         tanggal_bayar: moment(tanggal).add(i, "M").format("YYYY-MM-DD"),
//         sisa: plafond.toFixed(0),
//         dataPengajuanId: pengajuanId,
//       });
//     } else {
//       sisa -= rounded(pokok, 0);
//       table.push({
//         angsuran_ke: i,
//         angsuran: angsuranKoperasi.toFixed(0),
//         pokok: pokok.toFixed(0),
//         margin: rounded(marginss + parseInt(colfee), 0).toFixed(0),
//         margin_bank: (pokok + marginss).toFixed(0),
//         collfee: colfee,
//         tanggal_bayar: moment(tanggal).add(i, "M").format("YYYY-MM-DD"),
//         sisa: sisa.toFixed(0),
//         dataPengajuanId: pengajuanId,
//       });
//     }
//   }

//   return table;
// };

const angsuranFlatToInterest = (
  tenor: number,
  plafond: number,
  bungaBank: number,
  bungaKoperasi: number,
  tanggal: string,
  pengajuanId: string,
  pembulatan: number
) => {
  const table: any[] = [];
  const angsuranKoperasi = ceiling(
    parseInt(getAngsuranPerBulan(bungaKoperasi, tenor, plafond, false, true)),
    pembulatan
  );

  const bank = getAngsuranPerBulan(bungaBank, tenor, plafond, false, true);
  const pokok = plafond / tenor;
  // const margin = angsuranKoperasi - pokok;
  // const bankShare = (bungaBank / bungaKoperasi) * margin;
  let sisa = plafond;

  for (let i = 0; i <= tenor; i++) {
    if (i === 0) {
      table.push({
        angsuran_ke: i,
        angsuran: "0",
        pokok: "0",
        margin: "0",
        margin_bank: "0",
        collfee: "0",
        tanggal_bayar: moment(tanggal).add(i, "M").format("YYYY-MM-DD"),
        sisa: plafond.toFixed(0),
        dataPengajuanId: pengajuanId,
      });
    } else {
      sisa -= pokok;
      table.push({
        angsuran_ke: i,
        angsuran: angsuranKoperasi.toFixed(0),
        pokok: ceiling(pokok, 1).toFixed(0),
        margin: (angsuranKoperasi - pokok).toFixed(0),
        margin_bank: bank,
        collfee: (angsuranKoperasi - parseInt(bank)).toFixed(0),
        tanggal_bayar: moment(tanggal).add(i, "M").format("YYYY-MM-DD"),
        sisa: sisa.toFixed(0),
        dataPengajuanId: pengajuanId,
      });
    }
  }

  return table;
};

// export const angsuranAnuitas = (
//   tenor: number,
//   plafond: number,
//   bungaKoperasi: number,
//   bungaBank: number,
//   tanggal: string,
//   pengajuanId: string,
//   pembulatan: number
// ) => {
//   let table: any[] = [];
//   let montly_rate = bungaKoperasi / 12 / 100;

//   let monthly_installment =
//     (plafond * montly_rate) / (1 - Math.pow(1 + montly_rate, -tenor));
//   let rounded_installment = ceiling(monthly_installment, pembulatan);

//   for (let i = 0; i <= tenor; i++) {
//     if (i === 0) {
//       table.push({
//         angsuran_ke: i,
//         tanggal_bayar: moment(tanggal).add(i, "M").format("YYYY-MM-DD"),
//         angsuran: "0",
//         angsuran_bank: "0",
//         pokok: "0",
//         margin: "0",
//         sisa: plafond.toFixed(0),
//         dataPengajuannId: pengajuanId,
//       });
//     } else {
//       let interest = rounded(plafond * montly_rate, 0);
//       let principal = rounded_installment - interest;
//       let total = plafond - principal;

//       plafond -= principal;
//       if (total < 0) {
//         interest += Math.abs(total);
//         principal -= Math.abs(total);
//         total = 0; // Set sisa pokok menjadi nol
//       }
//       table.push({
//         angsuran_ke: i,
//         tanggal_bayar: moment(tanggal).add(i, "M").format("YYYY-MM-DD"),
//         angsuran: rounded_installment.toFixed(0),
//         angsuran_bank: rounded_installment.toFixed(0),
//         pokok: principal.toFixed(0),
//         margin: interest.toFixed(0),
//         sisa: total.toFixed(0),
//         dataPengajuannId: pengajuanId,
//       });
//     }
//   }
//   return table;
// };
export const angsuranAnuitas = (
  tenor: number,
  plafond: number,
  bungaKoperasi: number,
  bungaBank: number,
  tanggal: string,
  pengajuanId: string,
  pembulatan: number,
  bprCode?: string,
  isKhusus?: boolean
) => {
  let table: any[] = [];

  let montly_rate = bungaKoperasi / 12 / 100;

  // let monthly_installment =
  //   (plafond * montly_rate) / (1 - Math.pow(1 + montly_rate, -tenor));
  // let rounded_installmentManual = ceiling(monthly_installment, pembulatan);
  let rounded_installment = ceiling(
    parseInt(
      getAngsuranPerBulan(
        bungaKoperasi,
        tenor,
        plafond,
        false,
        false,
        bprCode,
        isKhusus
      )
    ),
    pembulatan
  );
  let angsuranBank = ceiling(
    parseInt(
      getAngsuranPerBulan(
        bungaBank,
        tenor,
        plafond,
        false,
        false,
        bprCode,
        isKhusus
      )
    ),
    pembulatan
  );

  for (let i = 0; i <= tenor; i++) {
    if (i === 0) {
      table.push({
        angsuran_ke: i,
        angsuran: "0",
        pokok: "0",
        margin: "0",
        margin_bank: "0",
        collfee: "0",
        tanggal_bayar: moment(tanggal).add(i, "M").format("YYYY-MM-DD"),
        sisa: plafond.toFixed(0),
        dataPengajuanId: pengajuanId,
      });
    } else {
      let interest = rounded(plafond * montly_rate, 0);
      let principal = rounded_installment - interest;
      let total = plafond - principal;

      plafond -= principal;
      if (total < 0) {
        interest += Math.abs(total);
        principal -= Math.abs(total);
        total = 0; // Set sisa pokok menjadi nol
      }

      table.push({
        angsuran_ke: i,
        angsuran: rounded_installment.toFixed(0),
        pokok: principal.toFixed(0),
        margin: (rounded_installment - principal).toFixed(0),
        margin_bank: angsuranBank,
        tanggal_bayar: moment(tanggal).add(i, "M").format("YYYY-MM-DD"),
        collfee: (rounded_installment - angsuranBank).toFixed(0),
        sisa: total.toFixed(0),
        dataPengajuanId: pengajuanId,
      });
    }
  }
  return table;
};

export function ceiling(number: number, precision: number) {
  return Math.ceil(number / precision) * precision;
}

export function rounded(number: number, precision: number) {
  var factor = Math.pow(10, precision);
  var tempNumber = number * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
}

export const docChecklist = (kode: string) => {
  const bodies = [
    [
      { data: "1", width: 30 },
      { data: "KTP Pemohon", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "2", width: 30 },
      { data: "KTP Suami Istri", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "3", width: 30 },
      { data: "Kartu Keluarga Pemohon", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "4", width: 30 },
      { data: "Surat Nikah", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "5", width: 30 },
      { data: "Surat Kematian", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "6", width: 30 },
      { data: "Foto Debitur", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "7", width: 30 },
      { data: "KTP NPWP (untuk pembiayaan > Rp. 50 Jt)", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "8", width: 30 },
      { data: "Perjanjian Kredit halaman 1, 2 dan 3", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "9", width: 30 },
      { data: `Jadwal Angsuran untuk ${kode}`, width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "10", width: 30 },
      { data: "Surat Pernyataan DSR 70%", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "11", width: 30 },
      { data: "Surat Pernyataan dan Kesanggupan", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "12", width: 30 },
      { data: "KARIP/Buku ASABRI", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "13", width: 30 },
      {
        data: "Slip Gaji (POS)/Rekening Koran (Bank)/Print Out Butab (Bank) 3 Bulan Terakhir",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "14", width: 30 },
      {
        data: "Analisa Perhitungan/Simulasi",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "15", width: 30 },
      {
        data: "Form Permohonan Pembiayaan Pensiun",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "16", width: 30 },
      {
        data: "Surat Keterangan dan Pernyataan Perihal Perbedaan Identitas",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "17", width: 30 },
      {
        data: "Surat Pernyataan DEBITUR Mitra Kerja PT. Pos Indonesia/Bank DP Taspen",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
  ];
  const bodiesBNM = [
    [
      { data: "1", width: 30 },
      { data: "KTP Pemohon", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "2", width: 30 },
      { data: "KTP Suami Istri", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "3", width: 30 },
      { data: "Kartu Keluarga Pemohon", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "4", width: 30 },
      { data: "Surat Nikah", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "5", width: 30 },
      { data: "Surat Kematian", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "6", width: 30 },
      { data: "Foto Debitur", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "7", width: 30 },
      { data: "KTP NPWP (untuk pembiayaan > Rp. 50 Jt)", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "8", width: 30 },
      { data: "Perjanjian Kredit halaman 1, 2 dan 3", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "9", width: 30 },
      { data: `Jadwal Angsuran untuk ${kode}`, width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "10", width: 30 },
      { data: "KARIP/Buku ASABRI", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "11", width: 30 },
      {
        data: "Slip Gaji (POS)/Rekening Koran (Bank)/Print Out Butab (Bank) 3 Bulan Terakhir",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "12", width: 30 },
      {
        data: "Analisa Perhitungan/Simulasi",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "13", width: 30 },
      {
        data: "Form Permohonan Pembiayaan Pensiun",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "14", width: 30 },
      {
        data: "Surat Keterangan dan Pernyataan Perihal Perbedaan Identitas",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "15", width: 30 },
      {
        data: "Surat Pernyataan DEBITUR Mitra Kerja PT. Pos Indonesia/Bank DP Taspen",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
  ];

  const bodiesBds = [
    [
      { data: "1", width: 30 },
      { data: "KTP Pemohon", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "2", width: 30 },
      { data: "KTP Suami Istri", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "3", width: 30 },
      { data: "Kartu Keluarga Pemohon", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "4", width: 30 },
      { data: "KTP NPWP (untuk pembiayaan > Rp. 50 Jt)", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "5", width: 30 },
      { data: "Surat Nikah", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "6", width: 30 },
      { data: "Surat Kematian", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "7", width: 30 },
      { data: "Foto Debitur", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "8", width: 30 },
      { data: "Perjanjian Kredit halaman 1, 2 dan 3", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "9", width: 30 },
      { data: `Jadwal Angsuran untuk ${kode}`, width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "10", width: 30 },
      { data: "Surat Pernyataan DSR 70%", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "11", width: 30 },
      { data: "Surat Pernyataan dan Kesanggupan", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "12", width: 30 },
      { data: "KARIP/Buku ASABRI", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "13", width: 30 },
      {
        data: "Slip Gaji (POS)/Rekening Koran (Bank)/Print Out Butab (Bank) 3 Bulan Terakhir",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "14", width: 30 },
      {
        data: "Analisa Perhitungan/Simulasi",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "15", width: 30 },
      {
        data: "Form Permohonan Pembiayaan Pensiun",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "16", width: 30 },
      {
        data: "Surat Keterangan dan Pernyataan Perihal Perbedaan Identitas",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "17", width: 30 },
      {
        data: "Surat Pernyataan DEBITUR Mitra Kerja PT. Pos Indonesia/Bank DP Taspen",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "18", width: 30 },
      {
        data: "Tanda Terima Uang Oleh Nasabah",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
  ];
  const bodiesDassa = [
    [
      { data: "1", width: 30 },
      { data: "KTP Pemohon", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "2", width: 30 },
      { data: "KTP Suami Istri", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "3", width: 30 },
      { data: "Kartu Keluarga Pemohon", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "4", width: 30 },
      { data: "Surat Nikah", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "5", width: 30 },
      { data: "Surat Kematian", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "6", width: 30 },
      { data: "Foto Debitur", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "7", width: 30 },
      { data: "KTP NPWP (untuk pembiayaan > Rp. 50 Jt)", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "8", width: 30 },
      { data: "Perjanjian Kredit halaman 1, 2 dan 3", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "9", width: 30 },
      { data: "Surat Pernyataan DSR 70%", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "10", width: 30 },
      { data: "Surat Pernyataan dan Kesanggupan", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "11", width: 30 },
      { data: "KARIP/Buku ASABRI", width: 120 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "12", width: 30 },
      {
        data: "Slip Gaji (POS)/Rekening Koran (Bank)/Print Out Butab (Bank) 3 Bulan Terakhir",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "13", width: 30 },
      {
        data: "Analisa Perhitungan/Simulasi",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "14", width: 30 },
      {
        data: "Form Permohonan Pembiayaan Pensiun",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "15", width: 30 },
      {
        data: "Surat Keterangan dan Pernyataan Perihal Perbedaan Identitas",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
    [
      { data: "16", width: 30 },
      {
        data: "Surat Pernyataan DEBITUR Mitra Kerja PT. Pos Indonesia/Bank DP Taspen",
        width: 120,
      },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
      { data: "", width: 40 },
    ],
  ];
  const bodyDoc = [
    [
      { data: "1", width: 30 },
      { data: "Surat Keputusan Pensiun", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "2", width: 30 },
      { data: "Data Pembelian Barang", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "3", width: 30 },
      { data: "Jadwal Anguran (Repayment schedule)", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "4", width: 30 },
      { data: "Bukti Pencairan Pembiayaan", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "5", width: 30 },
      { data: "Tanda terima penyerahan jaminan", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "6", width: 30 },
      { data: "Surat Penyataan Pemotongan Gaji > 70% ", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
  ];
  const bodyDocBNM = [
    [
      { data: "1", width: 30 },
      { data: "Surat Keputusan Pensiun", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "2", width: 30 },
      { data: "Jadwal Anguran (Repayment schedule)", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "3", width: 30 },
      { data: "Surat Penyataan Pemotongan Gaji > 70% ", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
  ];
  const bodyDocDassa = [
    [
      { data: "1", width: 30 },
      { data: "Surat Keputusan Pensiun", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "2", width: 30 },
      { data: "Bukti Pencairan Pembiayaan", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "3", width: 30 },
      { data: "Tanda terima penyeraan jaminan", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "4", width: 30 },
      { data: "Surat Penyataan Pemotongan Gaji > 70% ", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
  ];

  if (kode === "BPR BNM") {
    return { top: bodiesBNM, bottom: bodyDocBNM };
  } else if (kode === "BPR BDS") {
    return { top: bodiesBds, bottom: bodyDoc };
  } else if (kode === "BPR DASSA") {
    return { top: bodiesDassa, bottom: bodyDocDassa };
  } else {
    return { top: bodies, bottom: bodyDoc };
  }
};
