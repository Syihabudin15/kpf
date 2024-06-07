import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useState } from "react";
import * as XLSX from "xlsx";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";

export default function CetakManagement({
  data,
  type,
}: {
  data: DataDataPengajuan[];
  type?: string | null | undefined;
}) {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = () => {
    setLoading(true);
    try {
      let sheet1: any[] = [];
      let sheet2: any[] = [];

      data.forEach((d, ind) => {
        const angsuranKoperasi = getAngsuranPerBulan(
          d.DataPembiayaan.mg_bunga,
          d.DataPembiayaan.tenor,
          d.DataPembiayaan.plafond
        );
        const angsuranBank = getAngsuranPerBulan(
          d.DataPembiayaan.margin_bank,
          d.DataPembiayaan.tenor,
          d.DataPembiayaan.plafond
        );
        const adminKoperasi = d.DataPembiayaan.plafond * (1 / 100);
        const adminBank = d.DataPembiayaan.plafond * (1 / 100);
        const adminLainnya = d.DataPembiayaan.plafond * (3 / 100);
        const tlk_eh =
          d.DataPembiayaan.Produk.name === "Flash Sisa Gaji"
            ? d.DataPembiayaan.by_tatalaksana * (1 / 100)
            : d.DataPembiayaan.by_tatalaksana
            ? 200000
            : 0;
        const tlk_ib =
          d.DataPembiayaan.Produk.name === "Flash Sisa Gaji"
            ? d.DataPembiayaan.by_tatalaksana * (2 / 100)
            : d.DataPembiayaan.by_tatalaksana
            ? 300000
            : 0;
        const asuransiKoperasi =
          d.DataPembiayaan.plafond * (d.DataPembiayaan.by_asuransi / 100);
        const asuransiMitra = 0;
        if (type) {
          sheet1.push({
            NO: ind + 1,
            NOPEN: d.DataPembiayaan.nopen,
            "NAMA PEMOHON": d.DataPembiayaan.name,
            "AREA PELAYANAN": d.User.unit_cabang_id
              ? d.User.UnitCabang.UnitPelayanan.name
              : "",
            "UNIT CABANG": d.User.unit_cabang_id ? d.User.UnitCabang.name : "",
            "SUMBER DANA": d.Bank.kode,
            "PRODUK PEMBIAYAAN": d.DataPembiayaan.Produk.name,
            "JENIS PEMBIAYAAN": d.DataPembiayaan.jenis_pembiayaan_id
              ? d.DataPembiayaan.JenisPembiayaan.name
              : "Sisa Gaji",
            "MITRA KOPERASI": d.Bank.name,
            TENOR: d.DataPembiayaan.tenor,
            PLAFON: formatNumber(d.DataPembiayaan.plafond.toFixed(0)),
            "ANGSURAN KOPERASI": formatNumber(
              ceiling(
                parseInt(angsuranKoperasi),
                d.DataPembiayaan.pembulatan
              ).toFixed(0)
            ),
            "ANGSURAN BANK": formatNumber(
              ceiling(
                parseInt(angsuranBank),
                d.DataPembiayaan.pembulatan
              ).toFixed(0)
            ),
            "SELISIH ANGURAN": formatNumber(
              (parseInt(angsuranKoperasi) - parseInt(angsuranBank)).toFixed(0)
            ),
            "ADMIN KOPERASI": formatNumber(adminKoperasi.toFixed(0)),
            "ADMIN BANK": formatNumber(adminBank.toFixed(0)),
            "ADMIN AREA": formatNumber(adminLainnya.toFixed(0)),
            "BUKA REKENING": formatNumber(
              d.DataPembiayaan.by_buka_rekening.toFixed(0)
            ),
            FLAGGING: formatNumber(d.DataPembiayaan.by_flagging.toFixed(0)),
            EPOTPEN: formatNumber(d.DataPembiayaan.by_epotpen.toFixed(0)),
            MATERAI: formatNumber(d.DataPembiayaan.by_materai.toFixed(0)),
            MUTASI: formatNumber(d.DataPembiayaan.by_mutasi.toFixed(0)),
            TLK_EH: formatNumber(tlk_eh.toFixed(0)),
            TLK_IB: formatNumber(tlk_ib.toFixed(0)),
            "ASURANSI KOPERASI": formatNumber(asuransiKoperasi.toFixed(0)),
            "ASURANSI MITRA": formatNumber(asuransiMitra.toFixed(0)),
            "SELISIH ASURANSI": formatNumber(
              (asuransiKoperasi - asuransiMitra).toFixed(0)
            ),
          });
        } else {
          if (type === "EXPRESS") {
            sheet2.push({
              NO: ind + 1,
              NOPEN: d.DataPembiayaan.nopen,
              "NAMA PEMOHON": d.DataPembiayaan.name,
              "AREA PELAYANAN": d.User.unit_cabang_id
                ? d.User.UnitCabang.UnitPelayanan.name
                : "",
              "UNIT CABANG": d.User.unit_cabang_id
                ? d.User.UnitCabang.name
                : "",
              "SUMBER DANA": d.Bank.kode,
              "PRODUK PEMBIAYAAN": d.DataPembiayaan.Produk.name,
              "JENIS PEMBIAYAAN": d.DataPembiayaan.jenis_pembiayaan_id
                ? d.DataPembiayaan.JenisPembiayaan.name
                : "Sisa Gaji",
              "MITRA KOPERASI": d.Bank.name,
              TENOR: d.DataPembiayaan.tenor,
              PLAFON: formatNumber(d.DataPembiayaan.plafond.toFixed(0)),
              "ANGSURAN KOPERASI": formatNumber(
                ceiling(
                  parseInt(angsuranKoperasi),
                  d.DataPembiayaan.pembulatan
                ).toFixed(0)
              ),
              "ANGSURAN BANK": formatNumber(
                ceiling(
                  parseInt(angsuranBank),
                  d.DataPembiayaan.pembulatan
                ).toFixed(0)
              ),
              "SELISIH ANGURAN": formatNumber(
                (parseInt(angsuranKoperasi) - parseInt(angsuranBank)).toFixed(0)
              ),
              "ADMIN KOPERASI": formatNumber(adminKoperasi.toFixed(0)),
              "ADMIN BANK": formatNumber(adminBank.toFixed(0)),
              "ADMIN AREA": formatNumber(adminLainnya.toFixed(0)),
              "BUKA REKENING": formatNumber(
                d.DataPembiayaan.by_buka_rekening.toFixed(0)
              ),
              FLAGGING: formatNumber(d.DataPembiayaan.by_flagging.toFixed(0)),
              EPOTPEN: formatNumber(d.DataPembiayaan.by_epotpen.toFixed(0)),
              MATERAI: formatNumber(d.DataPembiayaan.by_materai.toFixed(0)),
              MUTASI: formatNumber(d.DataPembiayaan.by_mutasi.toFixed(0)),
              TLK_EH: formatNumber(tlk_eh.toFixed(0)),
              TLK_IB: formatNumber(tlk_ib.toFixed(0)),
              "ASURANSI KOPERASI": formatNumber(asuransiKoperasi.toFixed(0)),
              "ASURANSI MITRA": formatNumber(asuransiMitra.toFixed(0)),
              "SELISIH ASURANSI": formatNumber(
                (asuransiKoperasi - asuransiMitra).toFixed(0)
              ),
            });
          } else {
            sheet1.push({
              NO: ind + 1,
              NOPEN: d.DataPembiayaan.nopen,
              "NAMA PEMOHON": d.DataPembiayaan.name,
              "AREA PELAYANAN": d.User.unit_cabang_id
                ? d.User.UnitCabang.UnitPelayanan.name
                : "",
              "UNIT CABANG": d.User.unit_cabang_id
                ? d.User.UnitCabang.name
                : "",
              "SUMBER DANA": d.Bank.kode,
              "PRODUK PEMBIAYAAN": d.DataPembiayaan.Produk.name,
              "JENIS PEMBIAYAAN": d.DataPembiayaan.jenis_pembiayaan_id
                ? d.DataPembiayaan.JenisPembiayaan.name
                : "Sisa Gaji",
              "MITRA KOPERASI": d.Bank.name,
              TENOR: d.DataPembiayaan.tenor,
              PLAFON: formatNumber(d.DataPembiayaan.plafond.toFixed(0)),
              "ANGSURAN KOPERASI": formatNumber(
                ceiling(
                  parseInt(angsuranKoperasi),
                  d.DataPembiayaan.pembulatan
                ).toFixed(0)
              ),
              "ANGSURAN BANK": formatNumber(
                ceiling(
                  parseInt(angsuranBank),
                  d.DataPembiayaan.pembulatan
                ).toFixed(0)
              ),
              "SELISIH ANGURAN": formatNumber(
                (parseInt(angsuranKoperasi) - parseInt(angsuranBank)).toFixed(0)
              ),
              "ADMIN KOPERASI": formatNumber(adminKoperasi.toFixed(0)),
              "ADMIN BANK": formatNumber(adminBank.toFixed(0)),
              "ADMIN AREA": formatNumber(adminLainnya.toFixed(0)),
              "BUKA REKENING": formatNumber(
                d.DataPembiayaan.by_buka_rekening.toFixed(0)
              ),
              FLAGGING: formatNumber(d.DataPembiayaan.by_flagging.toFixed(0)),
              EPOTPEN: formatNumber(d.DataPembiayaan.by_epotpen.toFixed(0)),
              MATERAI: formatNumber(d.DataPembiayaan.by_materai.toFixed(0)),
              MUTASI: formatNumber(d.DataPembiayaan.by_mutasi.toFixed(0)),
              TLK_EH: formatNumber(tlk_eh.toFixed(0)),
              TLK_IB: formatNumber(tlk_ib.toFixed(0)),
              "ASURANSI KOPERASI": formatNumber(asuransiKoperasi.toFixed(0)),
              "ASURANSI MITRA": formatNumber(asuransiMitra.toFixed(0)),
              "SELISIH ASURANSI": formatNumber(
                (asuransiKoperasi - asuransiMitra).toFixed(0)
              ),
            });
          }
        }
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(sheet1);
      XLSX.utils.book_append_sheet(wb, ws, "REGULER");
      if (!type) {
        const ws2 = XLSX.utils.json_to_sheet(sheet2);
        XLSX.utils.book_append_sheet(wb, ws2, "EXPRESS");
      }

      XLSX.writeFile(wb, `MANAGEMENT ${new Date().getFullYear()}.xlsx`);
    } catch (err) {
      message.error("Cetak data gagal. Coba lagi nanti!");
    }
    setLoading(false);
  };

  return (
    <div>
      <div>
        <button
          className="py-2 px-2 border shadow rounded bg-blue-500 hover:bg-blue-600 text-white text-xs"
          disabled={loading}
          style={{ opacity: loading ? 0.5 : 1 }}
          onClick={() => handleExcelExport()}
        >
          Cetak {loading ? <LoadingOutlined /> : <PrinterOutlined />}
        </button>
      </div>
    </div>
  );
}
