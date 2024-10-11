"use client";
import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import { DataDataUser } from "./Interfaces";
import * as XLSX from "xlsx";
import { useState } from "react";
import { message } from "antd";
import moment from "moment";

export default function CetakDataKaryawan({ data }: { data: DataDataUser[] }) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      const newData = data.map((d, ind: number) => {
        return {
          NO: ind + 1,
          NAMA: d.first_name + " " + d.last_name,
          USERNAME: d.username,
          NIP: d.nip,
          NIK: d.nik,
          "TEMPAT LAHIR": d.tempat_lahir || "-",
          "TANGGAL LAHIR": d.tanggal_lahir
            ? moment(d.tanggal_lahir).format("DD-MM-YYYY")
            : "-",
          ALAMAT: d.alamat,
          JABATAN: d.posisi,
          "NO TELEPON": d.no_telepon || "-",
          EMAIL: d.email,
          AREA: d.unit_cabang_id
            ? d.UnitCabang.UnitPelayanan.name.toUpperCase()
            : "JAWA BARAT",
          CABANG: d.unit_cabang_id ? d.UnitCabang.name : "PUSAT",
          MASUK: moment(d.created_at).format("DD-MM-YYYY"),
          STATUS: d.status_active ? "AKTIF" : "NONAKTIF",
        };
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Data Karyawan " + new Date().getFullYear()
      );
      XLSX.writeFile(wb, "DataKaryawan.xlsx");
    } catch (err) {
      message.error("Gagal cetak nominatif. Coba lagi nanti!");
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
