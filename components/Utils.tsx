import moment from "moment";
import * as XLSX from "xlsx";

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
