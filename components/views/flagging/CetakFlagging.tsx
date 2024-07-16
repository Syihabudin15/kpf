"use client";
import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useState } from "react";
import { message } from "antd";
import moment from "moment";
import { flagging } from "@prisma/client";

export default function CetakFlagging({ data }: { data: flagging[] }) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      const newData = data.map((d, ind: number) => {
        return {
          NO: ind + 1,
          NOPEN: d.nama_penerima,
          NAMA: d.nama_penerima,
          NIPNRP: d.nipnrp,
          "TANGGAL LAHIR": moment(d.tgllahir_penerima).format("DD/MM/YYYY"),
          ALAMAT: d.alamatrumah,
          "KANTOR CABANG": d.kantor_cabang,
          "ALAMAT CABANG": d.alamat_cabang,
          "JANDA DUDA YP DARI": d.jandadudaypdari,
          "TANGGAL LAHIR JANDA DUDA YP": moment(d.tgllahir_jandadudayp),
          "NO SKEP": d.noskep,
          "JENIS DAPEM": d.jnsdapem,
          "KANTOR BAYAR DAPEM": d.ktrbaydapem,
        };
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Data Taspen " + new Date().getFullYear()
      );
      XLSX.writeFile(wb, "DataTaspen.xlsx");
    } catch (err) {
      message.error("Gagal cetak data taspen. Coba lagi nanti!");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white text-xs p-2 rounded shadow hover:opacity-50 border"
        onClick={() => handleExcelExport()}
      >
        {loading ? <LoadingOutlined /> : <PrinterOutlined />} Cetak
      </button>
    </div>
  );
}
