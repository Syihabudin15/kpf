import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import { DataDataPengajuan } from "./Interfaces";
import * as XLSX from "xlsx";
import { useState } from "react";
import { message } from "antd";
import moment from "moment";
import { ceiling } from "./pdf/pdfUtil";
import { getAngsuranPerBulan } from "../views/simulasi/simulasiUtil";

export default function CetakDataPengajuan({
  data,
}: {
  data: DataDataPengajuan[];
}) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      const newData = data.map((d: DataDataPengajuan, ind: number) => {
        return {
          NO: ind + 1,
          "TANGGAL PENGAJUAN": moment(d.DataPembiayaan.created_at).format(
            "DD-MM-YYYY"
          ),
          "UNIT PELAYANAN": d.User.unit_cabang_id
            ? d.User.UnitCabang.name
            : "PUSAT",
          "AREA PELAYANAN": d.User.unit_cabang_id
            ? d.User.UnitCabang.UnitPelayanan.name
            : "JAWA BARAT",
          NOPEN: d.DataPembiayaan.nopen,
          "NAMA PEMOHON": d.DataPembiayaan.name,
          ALAMAT: `${d.DataPengajuanAlamat.alamat} ${d.DataPengajuanAlamat.rt}/${d.DataPengajuanAlamat.rw}, ${d.DataPengajuanAlamat.kelurahan} ${d.DataPengajuanAlamat.kecamatan} ${d.DataPengajuanAlamat.kota}`,
          "NO TELEPON": d.no_telepon,
          "SUMBER DANA": d.Bank.kode,
          // "PRODUK PEMBIAYAAN": d.DataPembiayaan.Produk.name,
          // "JENIS PEMBIAYAAN": d.DataPembiayaan.jenis_pembiayaan_id
          //   ? d.DataPembiayaan.JenisPembiayaan.name
          //   : "Sisa Gaji",
          // "MITRA BANK": d.DataPembiayaan.Refferal.name,
          PLAFON: d.DataPembiayaan.plafond,
          TENOR: d.DataPembiayaan.tenor,
          ANGSURAN:
            d.jenis_margin === "FLAT"
              ? ceiling(
                  parseInt(
                    getAngsuranPerBulan(
                      d.DataPembiayaan.mg_bunga,
                      d.DataPembiayaan.tenor,
                      d.DataPembiayaan.plafond,
                      false,
                      true
                    )
                  ),
                  d.DataPembiayaan.pembulatan
                )
              : ceiling(
                  parseInt(
                    getAngsuranPerBulan(
                      d.DataPembiayaan.mg_bunga,
                      d.DataPembiayaan.tenor,
                      d.DataPembiayaan.plafond
                    )
                  ),
                  d.DataPembiayaan.pembulatan
                ),
          MARKETING: d.User.first_name + " " + d.User.last_name,
          // "AGENT FRONTING": d.agent_fronting,
          "ADMIN INPUT":
            d.DataPembiayaan.User.first_name + d.DataPembiayaan.User.last_name,
          // "STATUS VERIFIKASI": d.status_verifikasi,
          // "KETERANGAN VERIFIKASI": d.keterangan_verifikasi,
          // "TANGGAL PROSES VERIFIKASI": d.tanggal_verifikasi
          //   ? moment(d.tanggal_verifikasi).format("DD-MM-YYYY")
          //   : "",
          // "STATUS SLIK": d.status_slik,
          // "KETERANGAN SLIK": d.keterangan_slik,
          // "TANGGAL PROSES SLIK": d.tanggal_slik
          //   ? moment(d.tanggal_slik).format("DD-MM-YYYY")
          //   : "",
          // "STATUS CHECKER": d.status_checker,
          // "KETERANGAN CHECKER": d.keterangan_checker,
          // "TANGGAL PROSES CHECKER": d.tanggal_checker
          //   ? moment(d.tanggal_checker).format("DD-MM-YYYY")
          //   : "",
          // "STATUS MAKER": d.status_maker,
          // "KETERANGAN MAKER": d.keterangan_maker,
          // "TANGGAL PROSES MAKER": d.tanggal_maker
          //   ? moment(d.tanggal_maker).format("DD-MM-YYYY")
          //   : "",
          // "STATUS APPROVAL": d.status_approval,
          // "KETERANGAN APPROVAL": d.keterangan_approval,
          // "TANGGAL PROSES APPROVAL": d.tanggal_approval
          //   ? moment(d.tanggal_approval).format("DD-MM-YYYY")
          //   : "",
          "STATUS PENCAIRAN": d.status_pencairan,
          "TANGGAL PENCAIRAN": d.tanggal_pencairan
            ? moment(d.tanggal_pencairan).format("DD-MM-YYYY")
            : "",
        };
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        "DATA PENGAJUAN " + new Date().getFullYear()
      );
      XLSX.writeFile(wb, `pengajuan_${new Date().getFullYear()}.xlsx`);
    } catch (err) {
      message.error("Cetak data gagal. Coba lagi nanti!");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center">
      <button
        className="py-1 px-3 w-20 rounded shadow hover:opacity-50 border text-xs bg-blue-500 hover:bg-blue-600 text-white"
        onClick={() => handleExcelExport()}
      >
        Cetak {loading ? <LoadingOutlined /> : <PrinterOutlined />}
      </button>
    </div>
  );
}
