import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useState } from "react";
import { message } from "antd";
import moment from "moment";
import { AngsuranPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";

export default function CetakTunggakan({
  data,
}: {
  data: AngsuranPengajuan[];
}) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      const newData = data.map((d: AngsuranPengajuan, ind: number) => {
        return {
          NO: ind + 1,
          "NAMA PEMOHON": d.DataPengajuan.DataPembiayaan.name,
          NOPEN: d.DataPengajuan.DataPembiayaan.nopen,
          PRODUK: d.DataPengajuan.DataPembiayaan.Produk.name,
          JENIS: d.DataPengajuan.DataPembiayaan.jenis_pembiayaan_id
            ? d.DataPengajuan.DataPembiayaan.JenisPembiayaan.name
            : "Sisa Gaji",
          PLAFON: formatNumber(
            d.DataPengajuan.DataPembiayaan.plafond.toFixed(0)
          ),
          TENOR: d.DataPengajuan.DataPembiayaan.tenor,
          ANGSURAN_KE: d.angsuran_ke,
          "JADWAL BAYAR": moment(d.tanggal_bayar).format("DD-MM-YYYY"),
          ANGSURAN: formatNumber(d.angsuran.toFixed(0)),
        };
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(wb, ws, "TUNGGAKAN");
      XLSX.writeFile(wb, "TUNGGAKAN.xlsx");
    } catch (err) {
      message.error("Gagal cetak tunggakan debitur. Coba lagi nanti!");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center">
      <button
        className="py-1 px-2 rounded shadow bg-blue-500 hover:opacity-50 border text-white text-xs"
        onClick={() => handleExcelExport()}
      >
        Cetak {loading ? <LoadingOutlined /> : <PrinterOutlined />}
      </button>
    </div>
  );
}
