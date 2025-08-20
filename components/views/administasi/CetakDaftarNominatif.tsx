import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useState } from "react";
import { message } from "antd";
import moment from "moment";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";
import { getUsiaMasuk } from "@/components/utils/inputUtils";
import { AsuransiRate } from "@/components/utils/AsuransiRate";

export default function CetakDaftarNominatif({
  data,
}: {
  data: DataDataPengajuan[];
}) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      let totalPlafond = 0;
      let totalAdmin = 0;
      let totalAdminBank = 0;
      let totalCadangan = 0;
      let totalAsuransi = 0;
      let totalInformasi = 0;
      let totalTatalaksana = 0;
      let totalTabungan = 0;
      let totalMaterai = 0;
      let totalMutasi = 0;
      let totalBlokir = 0;
      let totalTakeOver = 0;
      let totalPencairan = 0;
      let totalProvisi = 0;
      let totalAngsuran = 0;
      let totalPremiAsuransi = 0;
      let totalSelisihAsuransi = 0;
      let totalAngsuranBank = 0;
      let totalAngsuranKoperasi = 0;

      const newData: any[] = data.map((d: DataDataPengajuan, ind: number) => {
        const plafond = d.DataPembiayaan.plafond;
        const admin = plafond * (d.DataPembiayaan.by_admin / 100);
        const adminBank = plafond * (d.DataPembiayaan.by_admin_bank / 100);
        const cadangan = plafond * (d.DataPembiayaan.by_lainnya / 100);
        const asuransi = plafond * (d.DataPembiayaan.by_asuransi / 100);
        const informasi =
          d.DataPembiayaan.by_flagging + d.DataPembiayaan.by_epotpen;
        const tatalaksana = d.DataPembiayaan.by_tatalaksana;
        const tabungan = d.DataPembiayaan.by_buka_rekening;
        const materai = d.DataPembiayaan.by_materai;
        const mutasi = d.DataPembiayaan.by_mutasi;
        const provisi = d.DataPembiayaan.by_provisi;
        const angsuran =
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
                    d.DataPembiayaan.plafond,
                    false,
                    false,
                    d.Bank.kode,
                    d.DataPembiayaan.pembulatanKhusus
                  )
                ),
                d.DataPembiayaan.pembulatan
              );
        const angsuranBank =
          d.jenis_margin === "FLAT"
            ? ceiling(
                parseInt(
                  getAngsuranPerBulan(
                    d.DataPembiayaan.margin_bank,
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
                    d.DataPembiayaan.margin_bank,
                    d.DataPembiayaan.tenor,
                    d.DataPembiayaan.plafond,
                    false,
                    false,
                    d.Bank.kode,
                    d.DataPembiayaan.pembulatanKhusus
                  )
                ),
                d.DataPembiayaan.pembulatan
              );
        const angsuranKoperasi = angsuran - angsuranBank;
        const blokir = d.DataPembiayaan.blokir * angsuran;
        const takeOver = d.DataPembiayaan.pelunasan + d.DataPembiayaan.bpp;
        const { tahun, bulan } = getUsiaMasuk(
          d.DataPembiayaan.tanggal_lahir,
          (d.tanggal_cetak_akad || moment()).toString()
        );
        const asRate = AsuransiRate.filter(
          (a) => a.usia == Math.round(parseFloat(`${tahun}.${bulan}`))
        );

        const inda = Math.floor(d.DataPembiayaan.tenor / 12);
        const rate = asRate && inda ? asRate[0].jk[inda - 1] : 0;
        const premiAsuransi =
          d.DataPembiayaan.Produk.name === "Flash Sisa Gaji"
            ? 0
            : d.DataPembiayaan.plafond * (rate / 1000);
        const selisihAsuransi = asuransi - premiAsuransi;
        const pencairan =
          plafond -
          (admin +
            adminBank +
            cadangan +
            tatalaksana +
            asuransi +
            informasi +
            tabungan +
            materai +
            mutasi +
            provisi +
            blokir +
            takeOver);

        totalPlafond += plafond;
        totalAdmin += admin;
        totalAdminBank += adminBank;
        totalCadangan += cadangan;
        totalAsuransi += asuransi;
        totalInformasi += informasi;
        totalTatalaksana += tatalaksana;
        totalTabungan += tabungan;
        totalMaterai += materai;
        totalMutasi += mutasi;
        totalBlokir += blokir;
        totalTakeOver += takeOver;
        totalPencairan += pencairan;
        totalProvisi += provisi;
        totalAngsuran += angsuran;
        totalPremiAsuransi += premiAsuransi;
        totalSelisihAsuransi += selisihAsuransi;
        totalAngsuranBank += angsuranBank;
        totalAngsuranKoperasi += angsuranKoperasi;

        if (d.Bank.kode === "BPR SIP") {
          return {
            NO: ind + 1,
            "AREA PELAYANAN": d.User.UnitCabang.UnitPelayanan.name,
            "UNIT PELAYANAN": d.User.UnitCabang.name,
            MARKETING: d.User.first_name + " " + d.User.last_name,
            NOPEN: d.DataPembiayaan.nopen,
            "NO SK PENSIUN": d.nomor_sk_pensiun,
            "NAMA PEMOHON": d.nama,
            "MITRA BANK": d.DataPembiayaan.Refferal.name,
            "SUMBER DANA": d.Bank.name,
            TENOR: d.DataPembiayaan.tenor,
            PLAFOND: d.DataPembiayaan.plafond,
            PRODUK: d.DataPembiayaan.Produk.name,
            JENIS: d.DataPembiayaan.jenis_pembiayaan_id
              ? d.DataPembiayaan.JenisPembiayaan.name
              : "Sisa Gaji",
            "TANGGAL AKAD": moment(d.tanggal_cetak_akad).format("DD/MM/YYYY"),
            "TANGGAL PENCAIRAN": moment(d.tanggal_pencairan).format(
              "DD/MM/YYYY"
            ),
            "TANGGAL LUNAS": moment(d.tanggal_cetak_akad)
              .add(d.DataPembiayaan.tenor, "M")
              .format("DD/MM/YYYY"),
            "MARGIN BUNGA": d.DataPembiayaan.mg_bunga,
            "ADMIN BANK": adminBank,
            "ADMIN MITRA": admin,
            "PENCADANGAN PUSAT": cadangan,
            TATALAKSANA: tatalaksana,
            "PREMI ASURANSI": asuransi,
            "DATA INFORMASI": informasi,
            "PEMBUKAAN TABUNGAN": tabungan,
            "BIAYA MATERAI": materai,
            "BIAYA MUTASI": mutasi,
            "BIAYA LAYANAN KREDIT": provisi,
            "ANGSURAN PERBULAN": angsuran,
            "ANGSURAN BANK": angsuranBank,
            "ANGSURAN KOPERASI": angsuranKoperasi,
            "BLOKIR ANGSURAN": d.DataPembiayaan.blokir,
            "TOTAL BLOKIR ANGSURAN": blokir,
            "NOMINAL TAKE OVER": takeOver,
            PENCAIRAN: pencairan,
          };
        } else {
          return {
            NO: ind + 1,
            "AREA PELAYANAN": d.User.UnitCabang.UnitPelayanan.name,
            "UNIT PELAYANAN": d.User.UnitCabang.name,
            MARKETING: `${d.User.first_name} ${d.User.last_name}`,
            NOPEN: d.DataPembiayaan.nopen,
            "NO SK PENSIUN": d.nomor_sk_pensiun,
            "NAMA PEMOHON": d.nama,
            "MITRA BANK": d.DataPembiayaan.Refferal.name,
            "SUMBER DANA": d.Bank.name,
            TENOR: d.DataPembiayaan.tenor,
            PLAFOND: d.DataPembiayaan.plafond,
            PRODUK: d.DataPembiayaan.Produk.name,
            JENIS: d.DataPembiayaan.jenis_pembiayaan_id
              ? d.DataPembiayaan.JenisPembiayaan.name
              : "Sisa Gaji",
            "TANGGAL AKAD": moment(d.tanggal_cetak_akad).format("DD/MM/YYYY"),
            "TANGGAL PENCAIRAN": moment(d.tanggal_pencairan).format(
              "DD/MM/YYYY"
            ),
            "TANGGAL LUNAS": moment(d.tanggal_cetak_akad)
              .add(d.DataPembiayaan.tenor, "M")
              .format("DD/MM/YYYY"),
            "MARGIN BUNGA": d.DataPembiayaan.mg_bunga,
            "ADMIN BANK": adminBank,
            "ADMIN MITRA": admin,
            "PENCADANGAN PUSAT": cadangan,
            TATALAKSANA: tatalaksana,
            ASURANSI: asuransi,
            "PREMI ASURANSI": premiAsuransi,
            "SELISIH ASURANSI": selisihAsuransi,
            "DATA INFORMASI": informasi,
            "PEMBUKAAN TABUNGAN": tabungan,
            "BIAYA MATERAI": materai,
            "BIAYA MUTASI": mutasi,
            "BIAYA PROVISI": provisi,
            "ANGSURAN PERBULAN": angsuran,
            "ANGSURAN BANK": angsuranBank,
            "ANGSURAN KOPERASI": angsuranKoperasi,
            "BLOKIR ANGSURAN": d.DataPembiayaan.blokir,
            "TOTAL BLOKIR ANGSURAN": blokir,
            "NOMINAL TAKE OVER": takeOver,
            PENCAIRAN: pencairan,
          };
        }
      });
      newData.push({
        NO: "TOTAL",
        "AREA PELAYANAN": "-",
        "UNIT PELAYANAN": "-",
        MARKETING: "-",
        NOPEN: "-",
        "NO SK PENSIUN": "-",
        "NAMA PEMOHON": "-",
        "SUMBER DANA": "-",
        TENOR: "-",
        PLAFOND: "-",
        "TANGGAL AKAD": "-",
        "TANGGAL PENCAIRAN": "-",
        "TANGGAL LUNAS": "-",
        "MARGIN BUNGA": "-",
        "ADMIN BANK": totalAdminBank,
        "ADMIN MITRA": totalAdmin,
        "PENCADANGAN PUSAT": totalCadangan,
        TATALAKSANA: totalTatalaksana,
        ASURANSI: totalAsuransi,
        "PREMI ASURANSI": totalPremiAsuransi,
        "SELISIH ASURANSI": totalSelisihAsuransi,
        "DATA INFORMASI": totalInformasi,
        "PEMBUKAAN TABUNGAN": totalTabungan,
        "BIAYA MATERAI": totalMaterai,
        "BIAYA MUTASI": totalMutasi,
        "BIAYA PROVISI": totalProvisi,
        "ANGSURAN PERBULAN": totalAngsuran,
        "ANGSURAN BANK": totalAngsuranBank,
        "ANGSURAN KOPERASI": totalAngsuranKoperasi,
        "BLOKIR ANGSURAN": "-",
        "TOTAL BLOKIR ANGSURAN": totalBlokir,
        "NOMINAL TAKE OVER": totalTakeOver,
        PENCAIRAN: totalPencairan,
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        "NOMINATIF " + new Date().getFullYear()
      );
      XLSX.writeFile(wb, `NOMINATIF ${new Date().getFullYear()}.xlsx`);
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
