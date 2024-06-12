import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import { DataDataPencairan, DataDataPengajuan } from "./Interfaces";
import * as XLSX from "xlsx";
import { useState } from "react";
import { message } from "antd";
import { getAngsuranPerBulan } from "../views/simulasi/simulasiUtil";
import { ceiling } from "./pdf/pdfUtil";

export default function CetakNominatif({ data }: { data: DataDataPencairan }) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      const newData = data.DataPengajuan.map((d: DataDataPengajuan) => {
        return {
          NOPEN: d.DataPembiayaan.nopen,
          NAMA: d.DataPembiayaan.name,
          ALAMAT: d.DataPengajuanAlamat.alamat,
          KELURAHAN: d.DataPengajuanAlamat.kelurahan,
          KECAMATAN: d.DataPengajuanAlamat.kecamatan,
          KOTA: d.DataPengajuanAlamat.kota,
          PROVINSI: d.DataPengajuanAlamat.provinsi,
          "NO TELEPON": d.no_telepon,
          NIK: d.nik,
          NPWP: d.npwp,
          "STATUS KAWIN": d.status_kawin,
          "JURU BAYAR ASAL": d.DataPembiayaan.juru_bayar_asal,
          "JURU BAYAR TUJUAN": d.DataPembiayaan.juru_bayar_tujuan,
          "PRODUK PEMBIAYAAN": d.DataPembiayaan.Produk.name,
          "JENIS PEMBIAYAAN": d.DataPembiayaan.jenis_pembiayaan_id
            ? d.DataPembiayaan.JenisPembiayaan.name
            : "Sisa Gaji",
          "PEMBIAYAAN SEBELUMNYA": d.DataPembiayaan.pembiayaan_sebelumnya,
          "KODE JIWA": d.kode_jiwa,
          "TEMPAT LAHIR": d.DataPembiayaan.tempat_lahir,
          "TANGGAL LAHIR": d.DataPembiayaan.tanggal_lahir,
          "GAJI BERSIH": d.DataPembiayaan.gaji_bersih,
          PLAFON: d.DataPembiayaan.plafond,
          TENOR: d.DataPembiayaan.tenor,
          MARGIN: d.DataPembiayaan.mg_bunga,
          "ANGSURAN PERBULAN": ceiling(
            parseInt(
              getAngsuranPerBulan(
                d.DataPembiayaan.mg_bunga,
                d.DataPembiayaan.tenor,
                d.DataPembiayaan.plafond
              )
            ),
            parseInt(process.env.NEXT_PUBLIC_APP_PEMBULATAN || "100")
          ),
          [`ADMIN ${d.Bank.kode}`]: ceiling(
            parseInt(
              getAngsuranPerBulan(
                d.Bank.margin_bank || 0,
                d.DataPembiayaan.tenor,
                d.DataPembiayaan.plafond
              )
            ),
            parseInt(process.env.NEXT_PUBLIC_APP_PEMBULATAN || "100")
          ),
          [`ADMIN MITRA`]:
            ceiling(
              parseInt(
                getAngsuranPerBulan(
                  d.DataPembiayaan.mg_bunga,
                  d.DataPembiayaan.tenor,
                  d.DataPembiayaan.plafond
                )
              ),
              parseInt(process.env.NEXT_PUBLIC_APP_PEMBULATAN || "100")
            ) -
            ceiling(
              parseInt(
                getAngsuranPerBulan(
                  d.Bank.margin_bank || 0,
                  d.DataPembiayaan.tenor,
                  d.DataPembiayaan.plafond
                )
              ),
              parseInt(process.env.NEXT_PUBLIC_APP_PEMBULATAN || "100")
            ),
          "BIAYA ASURANSI":
            d.DataPembiayaan.plafond * (d.DataPembiayaan.by_asuransi / 100),
          "BIAYA PEMBUKAAN TABUNGAN": d.DataPembiayaan.by_buka_rekening,
          "BIAYA MATERAI": d.DataPembiayaan.by_materai,
          "BIAYA DATA INFORMASI":
            d.DataPembiayaan.by_epotpen + d.DataPembiayaan.by_flagging,
          "NO REKENING BANK": d.BerkasPengajuan.no_rekening,
          "NAMA BANK": d.BerkasPengajuan.nama_bank,
          "BIAYA MUTASI": d.DataPembiayaan.by_mutasi,
          "BIAYA PROVISI": d.DataPembiayaan.by_provisi,
          "NO AKAD": d.nomor_akad,
          "NO SK": d.nomor_sk_pensiun,
          MARKETING: d.User.first_name + " " + d.User.last_name,
          "AGENT FRONTING": d.agent_fronting,
          "KODE REFFERAL": d.DataPembiayaan.Refferal.kode,
          "AREA PELAYANAN": d.User.UnitCabang.UnitPelayanan.name,
        };
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        data.nomor_surat.replaceAll("/", "_")
      );
      XLSX.writeFile(wb, "nominatif.xlsx");
    } catch (err) {
      message.error("Gagal cetak nominatif. Coba lagi nanti!");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center">
      <button
        className="py-1 px-2 rounded shadow hover:opacity-50 border"
        onClick={() => handleExcelExport()}
      >
        {loading ? <LoadingOutlined /> : <PrinterOutlined />}
      </button>
    </div>
  );
}
