import moment from "moment";
import * as XLSX from "xlsx";
import { PV } from "@formulajs/formulajs";

export const IDRFormat = (number: number) => {
  const temp = new Intl.NumberFormat("de-DE", {
    style: "decimal",
    currency: "IDR",
  }).format(number);
  return temp;
};

export const IDRToNumber = (str: string) => {
  return parseInt(str.replace(/\D/g, ""));
};

interface IExportData {
  data: any[];
  sheetname: string;
}
export const ExportData = (data: IExportData[], filename: string) => {
  const wb = XLSX.utils.book_new();
  for (const d of data) {
    const ws = XLSX.utils.json_to_sheet(d.data);
    XLSX.utils.book_append_sheet(wb, ws, d.sheetname);
  }
  XLSX.writeFile(wb, `${filename}_${moment().format("DDMMYYYY")}.xlsx`);
};

export function getFullAge(startDate: string, endDate: string) {
  const momentBirthdate = moment(startDate, "YYYY-MM-DD");
  const dateNow = moment(endDate);

  const durasi = moment.duration(dateNow.diff(momentBirthdate));

  const year = durasi.years();
  const month = durasi.months();
  const day = durasi.days();

  return { year, month, day };
}

export function getMaxTenor(
  max_usia: number,
  usia_tahun: number,
  usia_bulan: number
) {
  const tmp = max_usia - usia_tahun;
  const max_tenor = usia_tahun <= max_usia ? tmp * 12 - (usia_bulan + 1) : 0;
  return max_tenor;
}

export function getMaxPlafond(
  mg_bunga: number,
  tenor: number,
  max_angsuran: number
) {
  const maxPlafond =
    Number(PV(mg_bunga / 100 / 12, tenor, max_angsuran, 0, 0)) * -1;
  return maxPlafond;
}

export const getAngsuran = (
  plafond: number,
  tenor: number,
  bunga: number,
  rounded: number,
  jenismargin: any
) => {
  if (jenismargin === "ANUITAS") {
    return getAnuitas(plafond, tenor, bunga, rounded);
  } else {
    return getFlat(plafond, tenor, bunga, rounded);
  }
};

const getAnuitas = (
  plafond: number,
  tenor: number,
  bunga: number,
  rounded: number
) => {
  const r = bunga / 12 / 100;

  const angsuran =
    (plafond * (r * Math.pow(1 + r, tenor))) / (Math.pow(1 + r, tenor) - 1);
  const pokok = plafond / tenor;
  const margin = angsuran - pokok;

  return {
    angsuran: Math.ceil(angsuran / rounded) * rounded,
    pokok,
    margin,
  };
};

const getFlat = (
  plafond: number,
  tenor: number,
  bunga: number,
  rounded: number
) => {
  const r = bunga / 100 / 12;

  const angsuran = plafond * r;
  const pokok = plafond / tenor;
  const margin = angsuran - pokok;

  return {
    angsuran: Math.ceil(angsuran / rounded) * rounded,
    pokok,
    margin,
  };
};
