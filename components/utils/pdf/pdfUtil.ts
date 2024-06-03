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
      data.tanggal_cetak_akad?.toString() ||
        moment().format("YYYY-MM-DD").toString(),
      data.id,
      data.DataPembiayaan.pembulatan
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
    parseInt(getAngsuranPerBulan(bungaKoperasi, tenor, plafond, true)),
    pembulatan
  );

  const bank = getAngsuranPerBulan(bungaBank, tenor, plafond, true);
  const margin = (plafond * (parseFloat(bank) / 100)) / 12;
  const pokok = plafond / tenor;
  let sisa = plafond;
  const colfee = angsuranKoperasi - (pokok + margin);

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
        margin: (margin + colfee).toFixed(0),
        margin_bank: (pokok - margin).toFixed(0),
        collfee: colfee.toFixed(0),
        tanggal_bayar: moment(tanggal).add(i, "M").format("YYYY-MM-DD"),
        sisa: sisa.toFixed(0),
        dataPengajuanId: pengajuanId,
      });
    }
  }

  return table;
};

export const angsuranAnuitas = (
  tenor: number,
  plafond: number,
  bungaKoperasi: number,
  tanggal: string,
  pengajuanId: string,
  pembulatan: number
) => {
  let table: any[] = [];
  let montly_rate = bungaKoperasi / 12 / 100;

  let monthly_installment =
    (plafond * montly_rate) / (1 - Math.pow(1 + montly_rate, -tenor));
  let rounded_installment = ceiling(monthly_installment, pembulatan);

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
        margin: interest.toFixed(0),
        margin_bank: (principal - interest).toFixed(0),
        tanggal_bayar: moment(tanggal).add(i, "M").format("YYYY-MM-DD"),
        collfee: (rounded_installment - principal).toFixed(0),
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
