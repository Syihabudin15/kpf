const moment = require("moment-timezone");
const { PV, PMT, EDATE } = require("@formulajs/formulajs");

export interface DateDiff {
  tahun: string | number;
  bulan: string | number;
  hari: string | number;
}
export interface DateDifUsiaAndTanggalLunas extends DateDiff {
  tanggalLunas: string;
}

export function DateDiffUsiaMasuk(mulai: string, target: Date) {
  const date1 = moment(target).tz("Asia/Jakarta");
  const date2 = moment([
    parseInt(mulai.split("-")[2]),
    parseInt(mulai.split("-")[1]) - 1,
    parseInt(mulai.split("-")[0]),
  ]).tz("Asia/Jakarta");

  const years = date1.diff(date2, "year");
  date2.add(years, "years");
  const months = date1.diff(date2, "months");
  date2.add(months, "months");
  const days = date1.diff(date2, "days");

  const result: DateDiff = {
    tahun: years.toString(),
    bulan: months.toString(),
    hari: days.toString(),
  };
  return result;
}

export function DateDiffUsiaTanggalLunas(
  mulai: string,
  target: string,
  tenor: number
) {
  const tgl = EDATE(moment(target).tz("Asia/Jakarta")._d, tenor);
  const tanggalLunas = moment(tgl).tz("Asia/Jakarta").format("DD-MM-YYYY");

  const tglLahirSplt = mulai.split("-");
  const date1 = moment(tgl).tz("Asia/Jakarta");
  const date2 = moment([
    parseInt(tglLahirSplt[2]),
    parseInt(tglLahirSplt[1]),
    parseInt(tglLahirSplt[0]),
  ]).tz("Asia/Jakarta");

  const year = date1.diff(date2, "year");
  date2.add(year, "years");
  const month = date1.diff(date2, "months");
  date2.add(month, "months");
  const day = date1.diff(date2, "days");

  const result: DateDifUsiaAndTanggalLunas = {
    tanggalLunas: tanggalLunas,
    tahun: year.toString(),
    bulan: month.toString(),
    hari: day.toString(),
  };
  return result;
}

export function getAngsuranPerBulan(
  bunga: number,
  tenor: number,
  plafond: number,
  fixed?: boolean,
  isFlat?: boolean,
  bpr?: string | null
) {
  if (isFlat) {
    const r = Math.ceil(bunga / 12 / 100 / 0.001) * 0.001;
    const pokok = parseInt((plafond / tenor).toString());
    const margin = parseInt((plafond * r).toString());
    const angsuran = Math.ceil(pokok + margin);
    if (fixed) {
      return angsuran.toString();
    } else {
      return angsuran.toFixed(0);
    }
  } else {
    const mgBunga = bunga / 100;
    const tempResult = PMT(mgBunga / 12, tenor, plafond) * -1;
    const result = bpr && bpr === "BPR BNM" ? tempResult + 500 : tempResult;
    if (fixed) {
      return result.toString();
    } else {
      return result.toFixed(0);
    }
  }
}
export function getAngsuranPerBulanPdf(
  bunga: number,
  tenor: number,
  plafond: number
) {
  const result = PMT(bunga / 12 / 100, tenor, plafond) * -1;
  return Math.ceil(+result.toFixed(0));
}

export function getMaxTenor(
  max_usia: number,
  usia_tahun: number,
  usia_bulan: number
) {
  const tmp = max_usia - usia_tahun;
  const result = tmp * 12 - (usia_bulan + 1);
  return result;
}
export function newGetMaxTenor(
  max_usia: number,
  usia_tahun: number,
  usia_bulan: number
) {
  let tmp = max_usia - usia_tahun;
  const max_tenor = usia_tahun <= max_usia ? tmp * 12 - (usia_bulan + 1) : 0;
  return max_tenor;
}

export function getMaxPlafond(
  mg_bunga: number,
  tenor: number,
  max_angsuran: number
) {
  const maxPlafond = PV(mg_bunga / 100 / 12, tenor, max_angsuran, 0, 0) * -1;
  return maxPlafond;
}
