"use client";
import { AngsuranDebitur } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import { JadwalAngsuran } from "@prisma/client";
import { message } from "antd";
import moment from "moment";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function CetakExcelAngsuranDebitur({
  data,
}: {
  data: AngsuranDebitur;
}) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      data.JadwalAngsuran.sort((a, b) => a.angsuran_ke - b.angsuran_ke);
      const newData = data.JadwalAngsuran.map(
        (d: JadwalAngsuran, ind: number) => {
          return {
            NO: d.angsuran_ke,
            "TANGGAL BAYAR": moment(d.tanggal_bayar).format("DD-MM-YYYY"),
            ANGSURAN: formatNumber(d.angsuran.toFixed(0)),
            POKOK: formatNumber(d.pokok.toFixed(0)),
            MARGIN: formatNumber(d.margin.toFixed(0)),
            "TANGGAL PELUNASAN": d.tanggal_pelunasan
              ? moment(d.tanggal_pelunasan).format("DD-MM-YYYY")
              : "",
            SISA: formatNumber(d.sisa.toFixed(0)),
          };
        }
      );
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Angsuran " + data.DataPembiayaan.name
      );
      XLSX.writeFile(wb, "ANGSURAN_" + data.DataPembiayaan.name + ".xlsx");
    } catch (err) {
      message.error("Gagal cetak angsuran debitur. Coba lagi nanti!");
    }
    setLoading(false);
  };
  return (
    <div>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded shadow"
          onClick={() => handleExcelExport()}
        >
          {loading ? (
            <LoadingOutlined />
          ) : (
            <>
              Excel <PrinterOutlined />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
