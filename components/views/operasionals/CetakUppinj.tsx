import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useState } from "react";
import { message } from "antd";
import moment from "moment";
import { DataDataPengajuan } from "@/components/utils/Interfaces";

export default function CetakUPPINJ({ data }: { data: DataDataPengajuan[] }) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      const newData = data.map((d: DataDataPengajuan, ind: number) => {
        return {
          FULLNM: d.DataPembiayaan.name,
          NOCIF: "",
          NO_TABUNGAN: d.DataPembiayaan.no_rekening,
          KODE_INSTANSI: "",
          PLAFOND: d.DataPembiayaan.plafond,
          TOT_BUNGA: "",
          DITERIMA: "",
          ANGS_POKOK: "",
          TGL_ANGS1: "",
          NO_PK: "",
          TGL_PK: moment(d.tanggal_cetak_akad).format("DD-MM-YYYY"),
          JK_WAKTU: d.DataPembiayaan.tenor,
          FLAT: "",
          EFEKTIF: d.DataPembiayaan.mg_bunga,
          BYAADMIN:
            d.DataPembiayaan.plafond * (d.DataPembiayaan.by_admin_bank / 100),
          PRODUK: 84,
          PROVISI: d.DataPembiayaan.by_provisi,
          NOTARIS: "",
          NOTARISL: "",
          ASURANSIJ: "",
          ASURANSIL: "",
          SURVEY: "",
          METERAI: "",
          PINJLAMA: "",
          BYLAIN: d.DataPembiayaan.by_flagging,
          JNSPGAPO: 39,
          HUBBNKAPO: 20,
          JENISAPO: "03",
          RESTRUKAPO: 10,
          SUMDLAPO: 10,
          JNSDEBAPO: 874,
          SANDIBKAPO: "",
          KAGOUSHAPO: 4,
          JAMINAPO: "000",
          BJAMINAPO: 0,
          BMPKAPO: "00",
          SIFKRDSLIK: 9,
          JNSKRDSLIK: "P99",
          JNSAKDSLIK: "000",
          SCTRCDSLIK: "009000",
          KRDPEMSLIK: "10",
          LOKASIALIK: "",
          GOLKRD: "NU",
          ORIPENG: 9,
          SCTRCD: 1019,
          JNSPENG: 39,
          GPCD: 874,
          SUMDNLNS: 10,
          JNSUSH: 4,
          COUNTER: 1,
        };
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(wb, ws, "UPPINJ");
      XLSX.writeFile(wb, "UPPINJ.xlsx");
    } catch (err) {
      message.error("Gagal cetak UPPINJ. Coba lagi nanti!");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center">
      <button
        className="py-1 px-2 rounded shadow border"
        onClick={() => handleExcelExport()}
      >
        {loading ? <LoadingOutlined /> : <PrinterOutlined />}
      </button>
    </div>
  );
}
