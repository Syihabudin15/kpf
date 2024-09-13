import moment from "moment";

export function formatNumber(n: string) {
  // format number 1000000 to 1,234,567
  if (parseInt(n) < 0) {
    return `-${n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  } else {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
export function formatNumberTitik(n: string) {
  // format number 1000000 to 1.234.567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export function inputTextToDecimal(stringValue: string) {
  stringValue = stringValue.trim();
  var result = stringValue.replace(/[^0-9]/g, "");
  if (/[,\.]\d{2}$/.test(stringValue)) {
    result = result.replace(/(\d{2})$/, ".$1");
  }
  return parseFloat(result);
}

interface DateDiffReturn {
  year: number;
  month: number;
  day: number;
}
export function DateDiff(birth: string): DateDiffReturn {
  const date = birth.split("-");
  const currentDate = new Date();
  const birthDateObj = new Date(
    parseInt(date[2]),
    parseInt(date[1]) - 1,
    parseInt(date[0])
  );

  let years = currentDate.getFullYear() - birthDateObj.getFullYear();
  let months = currentDate.getMonth() - birthDateObj.getMonth();
  let days = currentDate.getDate() - birthDateObj.getDate();

  // Koreksi jika tanggal lahir setelah tanggal saat ini dalam tahun ini
  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months = 12 + months;
  }

  // Koreksi jika hari lahir setelah tanggal saat ini
  if (days < 0) {
    const lastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      birthDateObj.getDate()
    );
    const daysInLastMonth = Math.floor(
      (currentDate.valueOf() - lastMonth.valueOf()) / (24 * 60 * 60 * 1000)
    );

    days = daysInLastMonth + days;
    months--;
  }
  return {
    year: years,
    month: months,
    day: days,
  };
}
export function getUsiaTanggalLunas(
  mulai: string,
  lahir: string,
  tenor: number
) {
  const tanggalLunas = moment(mulai).add(tenor, "M");

  const date1 = tanggalLunas;
  const date2 = moment([
    lahir.split("-")[2],
    parseInt(lahir.split("-")[1]) - 1,
    lahir.split("-")[0],
  ]);

  const year = date1.diff(date2, "year");
  date2.add(year, "years");
  const month = date1.diff(date2, "months");
  date2.add(month, "months");
  const day = date1.diff(date2, "days");

  const result = {
    tanggalLunas: tanggalLunas.format("DD-MM-YYYY"),
    tahun: year.toString(),
    bulan: month.toString(),
    hari: day.toString(),
  };
  return result;
}
export function getUsiaMasuk(tgl_lahir: string, tgl_akad: string) {
  const date1 = moment(tgl_akad);
  const date2 = moment([
    tgl_lahir.split("-")[2],
    parseInt(tgl_lahir.split("-")[1]) - 1,
    tgl_lahir.split("-")[0],
  ]);

  const year = date1.diff(date2, "year");
  date2.add(year, "years");
  const month = date1.diff(date2, "months");
  date2.add(month, "months");
  const day = date1.diff(date2, "days");

  const result = {
    tahun: year.toString(),
    bulan: month.toString(),
    hari: day.toString(),
  };
  return result;
}
export function newGetUsiaMasuk(tgl_lahir: Date, tgl_akad: Date) {
  const date1 = moment(tgl_akad);
  const date2 = moment(tgl_lahir);

  const year = date1.diff(date2, "year");
  date2.add(year, "years");
  const month = date1.diff(date2, "months");
  date2.add(month, "months");
  const day = date1.diff(date2, "days");

  const result = {
    tahun: year.toString(),
    bulan: month.toString(),
    hari: day.toString(),
  };
  return result;
}

export function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

export const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => {
  return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
};
