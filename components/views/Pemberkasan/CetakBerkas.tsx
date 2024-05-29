import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useState } from "react";
import { message } from "antd";
import moment from "moment";
import { DataDataPengajuan } from "@/components/utils/Interfaces";

export default function CetakBerkas({ data }: { data: DataDataPengajuan[] }) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      const newData = data.map((d: DataDataPengajuan, ind: number) => {
        return {
          NO: ind + 1,
          NAMA: d.DataPembiayaan.name,
          "SUMBER DANA": d.Bank.kode,
          "PRODUK PEMBIAYAAN": d.DataPembiayaan.Produk.name,
          "JENIS PEMBIAYAAN": d.DataPembiayaan.jenis_pembiayaan_id
            ? d.DataPembiayaan.JenisPembiayaan.name
            : "Sisa Gaji",
          PLAFON: d.DataPembiayaan.plafond,
          "STATUS KIRIM PUSAT": "",
          AKAD: d.BerkasPengajuan.berkas_akad && moment(d.BerkasPengajuan.tanggal_akad).format("DD-MM-YYYY"),
          PELUNASAN: d.BerkasPengajuan.pelunasan && moment(d.BerkasPengajuan.tanggal_pelunasan).format("DD-MM-YYYY"),
          JAMINAN: d.BerkasPengajuan.jaminan && moment(d.BerkasPengajuan.tanggal_jaminan).format("DD-MM-YYYY"),
          "BUKU REKENING": d.BerkasPengajuan.rekening
          && moment(d.BerkasPengajuan.rekening).format("DD-MM-YYYY"),
          MUTASI: d.BerkasPengajuan.mutasi && moment(d.BerkasPengajuan.tanggal_mutasi).format("DD-MM-YYYY"),
          FLAGGING: d.BerkasPengajuan.flagging && moment(d.BerkasPengajuan.tanggal_flagging).format("DD-MM-YYYY")
        };
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        "PEMBERKASAN_" + new Date().getFullYear()
      );
      XLSX.writeFile(wb, `pemberkasan_${new Date().getFullYear()}.xlsx`);
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
