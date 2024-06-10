import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useState } from "react";
import { message } from "antd";
import moment from "moment";
import { DataPelunasan } from "@/components/utils/Interfaces";

export default function CetakPelunasan({ data }: { data: DataPelunasan[] }) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      const newData = data.map((d: DataPelunasan, ind: number) => {
        return {
          NO: ind + 1,
          "STATUS PELUNASAN": d.type,
          "AREA PELAYANAN": d.DataPengajuan.User.UnitCabang.UnitPelayanan.name,
          NOPEN: d.DataPengajuan.nopen,
          "NO SK": d.DataPengajuan.nomor_sk_pensiun,
          "NAMA PEMOHON": d.DataPengajuan.nama,
          "NO AKAD": d.DataPengajuan.nomor_akad,
          "TANGGAL PELUNASAN": moment(d.tanggal_pelunasan).format("DD-MM-YYYY"),
          "SUMBER DANA": d.DataPengajuan.Bank.name,
          "PRODUK PEMBIAYAAN": d.DataPengajuan.DataPembiayaan.Produk.name,
          TENOR: d.DataPengajuan.DataPembiayaan.tenor,
          PLAFOND: d.DataPengajuan.DataPembiayaan.plafond,
        };
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        "DATA PELUNASAN " + new Date().getFullYear()
      );
      XLSX.writeFile(wb, `PELUNASAN ${new Date().getFullYear()}.xlsx`);
    } catch (err) {
      message.error("Cetak data gagal. Coba lagi nanti!");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center">
      <button
        className="py-1 px-2 rounded shadow hover:opacity-50 border text-xs bg-blue-500 hover:bg-blue-600 text-white"
        onClick={() => handleExcelExport()}
      >
        Cetak {loading ? <LoadingOutlined /> : <PrinterOutlined />}
      </button>
    </div>
  );
}
