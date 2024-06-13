import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useState } from "react";
import { message } from "antd";
import moment from "moment";
import { DataDataPengajuan } from "@/components/utils/Interfaces";

export default function CetakCIFTAB({ data }: { data: DataDataPengajuan[] }) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      const newData = data.map((d: DataDataPengajuan, ind: number) => {
        return {
          NO: ind + 1,
          FULLNM: d.DataPembiayaan.name,
          CUSTNO: "",
          BRND: "088",
          PRODTYP: "T3",
          MKTOFFR: 3,
          INSTCD: "",
          GPCD: 874,
          TIPE: "P",
          IDTYPE1: 2,
          IDNO1: d.nik,
          IDNODT1: moment(d.masa_ktp).format("DD-MM-YYYY"),
          FADR1: d.DataPengajuanAlamat.alamat,
          FADR2: d.DataPengajuanAlamat.kecamatan,
          FADR3: d.DataPengajuanAlamat.kota,
          FPSTCD: d.DataPengajuanAlamat.kode_pos,
          FLOCCD: "",
          FTELPNO1: d.no_telepon,
          NPWPNO: d.npwp,
          SEX: d.jenis_kelamin === "LAKI_LAKI" ? 1 : 2,
          BRTPLC: d.User.UnitCabang.name,
          BRTHDT: d.DataPembiayaan.tanggal_lahir,
          MOTHNM: d.nama_ibu_kandung,
          MRGSTAT: "A",
          RELIGION:
            d.agama === "ISLAM"
              ? 1
              : d.agama === "HINDU"
              ? 2
              : d.agama === "BUDHA"
              ? 3
              : d.agama === "KATHOLIK"
              ? 4
              : d.agama === "ATHEIS"
              ? 5
              : 6,
          OCCUPAT: "012",
          COUNTRY: "KPA",
          TERKAIT: "T",
          SADR1: "",
          SADR2: "",
          SADR3: "",
          SPSTCD: "",
          SLOCCD: "",
          EDU:
            d.pendidikan === "SD"
              ? 1
              : d.pendidikan === "SMP"
              ? 2
              : d.pendidikan === "SMA"
              ? 3
              : d.pendidikan === "D3"
              ? 4
              : d.pendidikan === "S1"
              ? 5
              : 6,
          WIC: "T",
          WRGNEG: "ID",
          PEKERJAAN: "012",
          INSTANSI: d.golongan,
          BIDUSAHA: 9990,
          JABATAN: 69,
          INSTADR1: d.User.UnitCabang.UnitPelayanan.name,
          INSTADR2: "",
          INSTADR3: "",
          AWKERJADT: "",
          INSTTELP1: "",
          TUJBKREK: "02",
          SMBDANA: "99",
          PENGDANA: "01",
          INCOME: "",
          HIGHRISK: "T",
          RELASI: 9,
          FULLNMMRELASI: d.DataPengajuanPasangan.nama_pasangan,
          FADR1MRELASI: d.DataPengajuanPasangan.alamat_pasangan,
          FADR2MRELASI: "",
          FADR3MRELASI: "",
          BRTPLCRELASI: "",
          BRTHDTRELASI: d.DataPengajuanPasangan.tanggal_lahir_pasangan
            ? moment(d.DataPengajuanPasangan.tanggal_lahir_pasangan).format(
                "DD-MM-YYYY"
              )
            : "",
          JOB: "05",
          IDTYPE: 2,
          IDNO: d.DataPengajuanPasangan.nik_pasangan,
          IDNODT: d.DataPengajuanPasangan.masa_ktp_pasangan
            ? moment(d.DataPengajuanPasangan.masa_ktp_pasangan).format(
                "DD-MM-YYYY"
              )
            : "",
          FULLNMSLIK: d.DataPembiayaan.name,
          STATUS: "00",
          HUBDEB: "N",
          GPCDSLIK: "S14",
          BIDUSDEB: 841000,
          INCOMECD: 3,
          INCOMEPER: "",
          PISAHHARTA: "T",
          LANG_BMPK: "T",
          LAMP_BMPK: "T",
        };
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(wb, ws, "CIFTAB");
      XLSX.writeFile(wb, "CIFTAB.xlsx");
    } catch (err) {
      message.error("Gagal cetak ciftab. Coba lagi nanti!");
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
