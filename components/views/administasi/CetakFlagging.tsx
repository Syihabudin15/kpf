import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useState } from "react";
import { message } from "antd";
import moment from "moment";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";

export default function CetakFlagging({ data }: { data: DataDataPengajuan[] }) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      const taspen: any[] = [];
      const asabri: any[] = [];

      for (let i = 0; i < data.length; i++) {
        const angsuran = ceiling(
          parseInt(
            getAngsuranPerBulan(
              data[i].DataPembiayaan.mg_bunga,
              data[i].DataPembiayaan.tenor,
              data[i].DataPembiayaan.plafond
            )
          ),
          data[i].DataPembiayaan.pembulatan
        );

        if (data[i].jenis_pensiun === "ASABRI") {
          asabri.push({
            "No.": i + 1,
            Tgl_Permohonan: moment().format("DD/MM/YYYY"),
            Kd_Branch: "",
            Branch: data[i].DataPembiayaan.juru_bayar_tujuan,
            No_Ktpa: "",
            Nrp_Nip: "",
            Nopen: data[i].nopen,
            Nama: data[i].nama_skep,
            Tgl_Lahir: moment(
              new Date(data[i].DataPembiayaan.tanggal_lahir)
            ).format("DD/MM/YYYY"),
            Nik: data[i].nik,
            Awal_Kredit: moment(data[i].tanggal_cetak_akad).format(
              "DD/MM/YYYY"
            ),
            Akhir_Kredit: moment(data[i].tanggal_cetak_akad)
              .add(data[i].DataPembiayaan.tenor, "M")
              .format("DD/MM/YYYY"),
            Plafond: data[i].DataPembiayaan.plafond,
            Norek_Tab: data[i].DataPembiayaan.no_rekening,
            Norek_Kredit: data[i].DataPembiayaan.no_rekening,
            No_Pk: data[i].nomor_akad,
            Status: "",
            Kd_Jurubayar: "",
            Jns_Tab: "GIRO PENSIUNAN",
          });
        } else {
          taspen.push({
            NO: i + 1,
            NAMA: data[i].nama_skep,
            "NO. PENSIUN": data[i].nopen,
            "TEMPAT/TGL LAHIR": `${
              data[i].DataPembiayaan.tempat_lahir
            }, ${moment(new Date(data[i].DataPembiayaan.tanggal_lahir)).format(
              "DD/MM/YYYY"
            )}`,
            ALAMAT: `${data[i].DataPengajuanAlamat.alamat} RT${data[i].DataPengajuanAlamat.rt} RW${data[i].DataPengajuanAlamat.rw}`,
            KELURAHAN: data[i].DataPengajuanAlamat.kelurahan,
            KECAMATAN: data[i].DataPengajuanAlamat.kecamatan,
            KOTA: data[i].DataPengajuanAlamat.kota,
            PROPINSI: data[i].DataPengajuanAlamat.provinsi,
            "KODE POS": data[i].DataPengajuanAlamat.kode_pos,
            "KANTOR BAYAR": data[i].DataPembiayaan.juru_bayar_tujuan,
            "REK GIRO POS": data[i].DataPembiayaan.no_rekening,
            NIK: data[i].nik,
            "NO HP": data[i].no_telepon,
            "TGL AWAL FLAGGING": moment(data[i].tanggal_cetak_akad).format(
              "DD/MM/YYYY"
            ),
            "TGL AKHIR FLAGGING": moment(data[i].tanggal_cetak_akad)
              .add(data[i].DataPembiayaan.tenor, "M")
              .format("DD/MM/YYYY"),
            ANGSURAN: angsuran,
          });
        }
      }

      const wb = XLSX.utils.book_new();
      const wsTaspen = XLSX.utils.json_to_sheet(taspen);
      const wsAsabri = XLSX.utils.json_to_sheet(asabri);
      XLSX.utils.book_append_sheet(wb, wsTaspen, "TASPEN");
      XLSX.utils.book_append_sheet(wb, wsAsabri, "ASABRI");
      XLSX.writeFile(wb, `FLAGGING KPF.xlsx`);
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
        Cetak Flagging {loading ? <LoadingOutlined /> : <PrinterOutlined />}
      </button>
    </div>
  );
}
