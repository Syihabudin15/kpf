"use client";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber, getUsiaMasuk } from "@/components/utils/inputUtils";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { DatePicker, Input, Select, Table, TableProps, Typography } from "antd";
import moment from "moment";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";
import { useEffect, useState } from "react";
import CetakDaftarNominatif from "./CetakDaftarNominatif";
import { Bank, User } from "@prisma/client";
import { AsuransiRate } from "@/components/utils/AsuransiRate";
import CetakFlagging from "./CetakFlagging";
const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

export default function ArusKas({
  user,
  banks,
}: {
  user: User;
  banks: Bank[];
}) {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [nama, setNama] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [selectedBank, setSelectedBank] = useState<string>();
  const [unit, setUnit] = useState<string>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/administrasi/daftar-nominatif?page=${page}${
        pageSize ? "&pageSize=" + pageSize : ""
      }${nama ? "&name=" + nama : ""}${from ? "&from=" + from : ""}${
        to ? "&to=" + to : ""
      }`
    );
    const { data, total } = await res.json();
    setTotal(total);
    setData(
      data.map((e: DataDataPengajuan) => {
        return { ...e, key: e.id };
      })
    );
    if (selectedBank) {
      setData(data.filter((d: DataDataPengajuan) => d.bankId === selectedBank));
    }
    if (unit) {
      setData(
        data.filter(
          (d: DataDataPengajuan) =>
            d.User.UnitCabang.UnitPelayanan.name === unit
        )
      );
    }
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [nama, page, from, to, pageSize, selectedBank, unit]);

  const columns: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 50,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        const currPage = (page - 1) * pageSize;

        return <>{currPage + (index + 1)}</>;
      },
    },
    {
      title: "AREA PELAYANAN",
      dataIndex: "area_pelayanan",
      key: "area_pelayanan",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.User.UnitCabang.UnitPelayanan.name}</>;
      },
    },
    {
      title: "UNIT PELAYANAN",
      dataIndex: "unit_pelayanan",
      width: 150,
      key: "unit_pelayanan",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          <>{record.area_pelayanan_berkas || record.User.UnitCabang.name}</>
        );
      },
    },
    {
      title: "MOC & ADMIN",
      dataIndex: "admin_dan_moc",
      width: 150,
      key: "admin_dan_moc",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          <div className="flex flex-col">
            <span>
              {record.User.first_name || ""} {record.User.last_name || ""}
            </span>
            <span className="text-xs opacity-70">
              ({record.DataPembiayaan.User.first_name || ""}{" "}
              {record.DataPembiayaan.User.last_name || ""})
            </span>
          </div>
        );
      },
    },
    {
      title: "NOPEN",
      dataIndex: "nopen",
      key: "nopen",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan.nopen}</>;
      },
    },
    {
      title: "NO SK PENSIUN",
      dataIndex: "no_sk_pensiun",
      key: "no_sk_pensiun",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.nomor_sk_pensiun}</>;
      },
    },
    {
      title: "NAMA PEMOHON",
      dataIndex: "nama_pemohon",
      key: "nama_pemohon",
      width: 200,
      fixed: window.innerWidth < 600 ? false : "left",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan.name}</>;
      },
    },
    {
      title: "MITRA BANK",
      dataIndex: "mitra_bank",
      key: "mitra_bank",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan.Refferal.name}</>;
      },
    },
    {
      title: "SUMBER DANA",
      dataIndex: "sumber_dana",
      key: "sumber_dana",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.Bank.name}</>;
      },
    },
    {
      title: "TENOR",
      dataIndex: "tenor",
      key: "tenor",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan.tenor}</>;
      },
    },
    {
      title: "PLAFOND",
      dataIndex: "plafon",
      key: "plafon",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.plafond.toFixed(0))}</>;
      },
    },
    {
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "produk",
      key: "produk",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan.Produk.name}</>;
      },
    },
    {
      title: "JENIS PEMBIAYAAN",
      dataIndex: "jenis",
      key: "jenis",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          <>
            {record.DataPembiayaan.jenis_pembiayaan_id
              ? record.DataPembiayaan.JenisPembiayaan.name
              : "Sisa Gaji"}
          </>
        );
      },
    },
    {
      title: "TANGGAL PENGAJUAN",
      dataIndex: "tanggal_pengajuan",
      key: "tanggal_pengajuan",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          record.DataPembiayaan.tanggal_input && (
            <>
              {moment(record.DataPembiayaan.tanggal_input).format("DD-MM-YYYY")}
            </>
          )
        );
      },
    },
    {
      title: "TANGGAL AKAD",
      dataIndex: "tanggal_akad",
      key: "tanggal_akad",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          record.tanggal_cetak_akad && (
            <>{moment(record.tanggal_cetak_akad).format("DD-MM-YYYY")}</>
          )
        );
      },
    },
    {
      title: "TANGGAL CAIR",
      dataIndex: "tanggal_cair",
      key: "tanggal_cair",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          record.tanggal_pencairan && (
            <>{moment(record.tanggal_pencairan).format("DD-MM-YYYY")}</>
          )
        );
      },
    },
    {
      title: "TANGGAL LUNAS",
      dataIndex: "tanggal_lunas",
      key: "tanggal_lunas",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        const lunas = moment(record.tanggal_cetak_akad)
          .add(record.DataPembiayaan.tenor, "M")
          .format("DD-MM-YYYY");
        return <>{lunas}</>;
      },
    },
    {
      title: "MARGIN (%)",
      dataIndex: "margin",
      key: "margin",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan.mg_bunga} %</>;
      },
    },
    {
      title: "ADMIN BANK",
      dataIndex: "admin bank",
      key: "admin bank",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          <>
            {formatNumber(
              (
                record.DataPembiayaan.plafond *
                (record.DataPembiayaan.by_admin_bank / 100)
              ).toFixed(0)
            )}
          </>
        );
      },
    },
    {
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      title: "ADMIN MITRA",
      dataIndex: "admin mitra",
      key: "admin mitra",
      width: 150,
      render(value, record, index) {
        return (
          <>
            {formatNumber(
              (
                record.DataPembiayaan.plafond *
                (record.DataPembiayaan.by_admin / 100)
              ).toFixed(0)
            )}
          </>
        );
      },
    },
    {
      title: "PENCADANGAN PUSAT",
      dataIndex: "pencadangan_pusat",
      key: "pencadangan_pusat",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          <>
            {formatNumber(
              (
                record.DataPembiayaan.plafond *
                (record.DataPembiayaan.by_lainnya / 100)
              ).toFixed(0)
            )}
          </>
        );
      },
    },
    {
      title: "TATALAKSANA",
      dataIndex: "tatalaksana",
      key: "tatalaksana",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          <>{formatNumber(record.DataPembiayaan.by_tatalaksana.toFixed(0))}</>
        );
      },
    },
    {
      title: "STATUS DEVIASI",
      key: "status_deviasi",
      dataIndex: "status_deviasi",
      width: 100,
      fixed: window.innerWidth < 600 ? false : "right",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <div
            className={`text-center italic text-xs ${
              record.DataPembiayaan.is_deviasi ? "text-red" : ""
            }`}
          >
            {record.DataPembiayaan.is_deviasi ? "DEVIASI" : "TIDAK DEVIASI"}
          </div>
        );
      },
    },
    {
      title: "KETERANGAN DEVIASI",
      key: "keterangan_deviasi",
      dataIndex: "keterangan_deviasi",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <Paragraph
            ellipsis={{
              rows: 2,
              expandable: "collapsible",
            }}
          >
            {record.DataPembiayaan.is_deviasi &&
              record.DataPembiayaan.keterangan}
          </Paragraph>
        );
      },
    },
    {
      title: "ASURANSI",
      dataIndex: "asuransi",
      key: "asuransi",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      children: [
        {
          title: "ASURANSI (%)",
          dataIndex: "asuransi_prc",
          key: "asuransi_prc",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            return (
              <>
                ({record.DataPembiayaan.by_asuransi} %){" "}
                {formatNumber(
                  (
                    record.DataPembiayaan.plafond *
                    (record.DataPembiayaan.by_asuransi / 100)
                  ).toFixed(0)
                )}
              </>
            );
          },
        },
        {
          title: "PREMI ASURANSI",
          dataIndex: "premi_asuransi",
          key: "premi_asuransi",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            const { tahun, bulan } = getUsiaMasuk(
              record.DataPembiayaan.tanggal_lahir,
              (record.tanggal_cetak_akad || moment()).toString()
            );
            let asRate = AsuransiRate.filter(
              (a) => a.usia === Math.round(parseFloat(`${tahun}.${bulan}`))
            );

            const ind = Math.round(record.DataPembiayaan.tenor / 12);
            const rate = asRate && ind ? asRate[0].jk[`${ind - 1}`] : 0;
            const premi =
              record.DataPembiayaan.Produk.name === "Flash Sisa Gaji"
                ? 0
                : record.DataPembiayaan.plafond * (rate / 1000);
            const ciuPremi =
              record.DataPembiayaan.plafond * ((1.5 * ind) / 100);
            const bumiPremi = record.DataPembiayaan.plafond * ((2 * ind) / 100);
            const resultPremi =
              record.jenis_asuransi === "BERDIKARI"
                ? premi
                : record.jenis_asuransi === "CIU"
                ? ciuPremi
                : bumiPremi;
            return (
              <div>
                {formatNumber(resultPremi.toFixed(0))}
                <span
                  style={{ fontSize: 8 }}
                  className="text-xs italic opacity-60"
                >
                  ({record.jenis_asuransi})
                </span>
              </div>
            );
          },
        },
        {
          title: "SELISIH ASURANSI",
          dataIndex: "selisih_asuransi",
          key: "selisih_asuransi",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            const { tahun, bulan } = getUsiaMasuk(
              record.DataPembiayaan.tanggal_lahir,
              (record.tanggal_cetak_akad || moment()).toString()
            );

            let asRate = AsuransiRate.filter(
              (a) => a.usia == Math.round(parseFloat(`${tahun}.${bulan}`))
            );

            const ind = Math.round(record.DataPembiayaan.tenor / 12);
            const rate = asRate && ind ? asRate[0].jk[ind - 1] : 0;
            const premi =
              record.DataPembiayaan.Produk.name === "Flash Sisa Gaji"
                ? 0
                : record.DataPembiayaan.plafond * (rate / 1000);
            const ciuPremi =
              record.DataPembiayaan.plafond * ((1.5 * ind) / 100);
            const bumiPremi = record.DataPembiayaan.plafond * ((2 * ind) / 100);
            const asur =
              record.DataPembiayaan.plafond *
              (record.DataPembiayaan.by_asuransi / 100);
            const resultPremi =
              record.jenis_asuransi === "BERDIKARI"
                ? premi
                : record.jenis_asuransi === "CIU"
                ? ciuPremi
                : bumiPremi;

            return <div>{formatNumber((asur - resultPremi).toFixed(0))}</div>;
          },
        },
      ],
    },
    {
      title: "DATA INFORMASI",
      dataIndex: "data_informasi",
      key: "data_informasi",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          <>
            {formatNumber(
              (
                record.DataPembiayaan.by_epotpen +
                record.DataPembiayaan.by_flagging
              ).toFixed(0)
            )}
          </>
        );
      },
    },
    {
      title: "PEMBUKAAN TABUNGAN",
      dataIndex: "pembukaan_tabungan",
      key: "pembukaan_tabungan",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          <>{formatNumber(record.DataPembiayaan.by_buka_rekening.toFixed(0))}</>
        );
      },
    },
    {
      title: "BIAYA MATERAI",
      dataIndex: "biaya_materai",
      key: "biaya_materai",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.by_materai.toFixed(0))}</>;
      },
    },
    {
      title: "BIAYA MUTASI",
      dataIndex: "biaya_mutasi",
      width: 150,
      key: "biaya_mutasi",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.by_mutasi.toFixed(0))}</>;
      },
    },
    {
      title: "BIAYA PROVISI",
      dataIndex: "biaya_provisi",
      width: 150,
      key: "biaya_provisi",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.by_provisi.toFixed(0))}</>;
      },
    },
    {
      title: "ANGSURAN",
      dataIndex: "angsuran",
      key: "angsuran",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      children: [
        {
          title: "ANGSURAN PERBULAN",
          dataIndex: "angsuranbulan",
          key: "angsuranbulan",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            const angsuran = ceiling(
              parseInt(
                getAngsuranPerBulan(
                  record.DataPembiayaan.mg_bunga,
                  record.DataPembiayaan.tenor,
                  record.DataPembiayaan.plafond
                )
              ),
              record.DataPembiayaan.pembulatan
            );
            return <>{formatNumber(angsuran.toFixed(0))}</>;
          },
        },
        {
          title: "ANGSURAN BANK",
          dataIndex: "angsuranbank",
          key: "angsuranbank",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            const angsuran = ceiling(
              parseInt(
                getAngsuranPerBulan(
                  record.DataPembiayaan.margin_bank,
                  record.DataPembiayaan.tenor,
                  record.DataPembiayaan.plafond
                )
              ),
              record.DataPembiayaan.pembulatan
            );
            return <>{formatNumber(angsuran.toFixed(0))}</>;
          },
        },
        {
          title: "ANGSURAN KPF",
          dataIndex: "selisih",
          key: "selisih",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            const angsuran = ceiling(
              parseInt(
                getAngsuranPerBulan(
                  record.DataPembiayaan.mg_bunga,
                  record.DataPembiayaan.tenor,
                  record.DataPembiayaan.plafond
                )
              ),
              record.DataPembiayaan.pembulatan
            );
            const angsuranBank = ceiling(
              parseInt(
                getAngsuranPerBulan(
                  record.DataPembiayaan.margin_bank,
                  record.DataPembiayaan.tenor,
                  record.DataPembiayaan.plafond
                )
              ),
              record.DataPembiayaan.pembulatan
            );
            return <>{formatNumber((angsuran - angsuranBank).toFixed(0))}</>;
          },
        },
      ],
    },
    {
      title: "BLOKIR ANGSURAN",
      dataIndex: "blokir",
      key: "blokir",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        const angsuran = ceiling(
          parseInt(
            getAngsuranPerBulan(
              record.DataPembiayaan.mg_bunga,
              record.DataPembiayaan.tenor,
              record.DataPembiayaan.plafond
            )
          ),
          record.DataPembiayaan.pembulatan
        );
        return (
          <>
            {record.DataPembiayaan.blokir}x |{" "}
            {formatNumber((angsuran * record.DataPembiayaan.blokir).toFixed(0))}
          </>
        );
      },
    },
    {
      title: "NOMINAL TAKE OVER",
      dataIndex: "nominal take over",
      key: "nominal take over",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          <>
            {formatNumber(
              (
                record.DataPembiayaan.bpp + record.DataPembiayaan.pelunasan
              ).toFixed(0)
            )}
          </>
        );
      },
    },
    {
      title: "PENCAIRAN",
      dataIndex: "pencairan",
      key: "pencairan",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        const by_admin =
          record.DataPembiayaan.plafond *
          ((record.DataPembiayaan.by_admin +
            record.DataPembiayaan.by_admin_bank +
            record.DataPembiayaan.by_lainnya) /
            100);
        const informasi =
          record.DataPembiayaan.by_epotpen + record.DataPembiayaan.by_flagging;
        const asuransi =
          record.DataPembiayaan.plafond *
          (record.DataPembiayaan.by_asuransi / 100);
        const angsuran = ceiling(
          parseInt(
            getAngsuranPerBulan(
              record.DataPembiayaan.mg_bunga,
              record.DataPembiayaan.tenor,
              record.DataPembiayaan.plafond
            )
          ),
          parseInt(process.env.NEXT_PUBLIC_APP_PEMBULATAN || "100")
        );
        const blokir = record.DataPembiayaan.blokir * angsuran;
        const kotor =
          record.DataPembiayaan.plafond -
          (by_admin +
            informasi +
            asuransi +
            record.DataPembiayaan.by_tatalaksana +
            record.DataPembiayaan.by_mutasi +
            record.DataPembiayaan.by_materai +
            record.DataPembiayaan.by_buka_rekening +
            record.DataPembiayaan.by_provisi +
            blokir);
        const bersih =
          kotor - (record.DataPembiayaan.bpp + record.DataPembiayaan.pelunasan);
        return <>{formatNumber(bersih.toFixed(0))}</>;
      },
    },
    {
      title: "DROPPING",
      dataIndex: "dropping",
      key: "dropping",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        const by_adminBank =
          record.DataPembiayaan.plafond *
          (record.DataPembiayaan.by_admin_bank / 100);
        const biaya =
          by_adminBank +
          record.DataPembiayaan.by_provisi +
          record.DataPembiayaan.by_buka_rekening;
        const bersih = record.DataPembiayaan.plafond - biaya;
        return <>{formatNumber(bersih.toFixed(0))}</>;
      },
    },
  ];

  return (
    <div>
      <div className="flex gap-5 my-1 mx-1">
        <RangePicker
          onChange={(_, info) => {
            setFrom(info && info[0]);
            setTo(info && info[1]);
          }}
        />
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setNama(e.target.value)}
        />
        {!user.bank_id && (
          <Select
            placeholder="SUMDAN"
            options={banks.map((b) => {
              return {
                label: b.kode,
                value: b.id,
              };
            })}
            allowClear
            onChange={(e) => setSelectedBank(e)}
          />
        )}
        {!user.bank_id && (
          <Select
            placeholder="AREA PELAYANAN"
            options={[
              { label: "JAWA BARAT", value: "JAWA BARAT" },
              { label: "JAWA TIMUR", value: "JAWA TIMUR" },
              { label: "JAWA TENGAH", value: "JAWA TENGAH" },
            ]}
            allowClear
            onChange={(e) => setUnit(e)}
          />
        )}
        <CetakDaftarNominatif data={data || []} />
        <CetakFlagging data={data || []} />
        {/* <CetakLabaRugi data={data || []} /> */}
      </div>
      <div className="px-2">
        <Table
          dataSource={data}
          columns={columns}
          bordered
          size="small"
          loading={loading}
          scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
          pagination={{
            pageSize: pageSize,
            pageSizeOptions: [50, 100, 500, 1000, 10000, 20000],
            total: total,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          summary={(pageData) => {
            let plafon = 0;
            let adminBank = 0;
            let adminKoperasi = 0;
            let adminCadangan = 0;
            let tatalaksana = 0;
            let asuransi = 0;
            let dataInformasi = 0;
            let tabungan = 0;
            let materai = 0;
            let mutasi = 0;
            let blokir = 0;
            let takeover = 0;
            let provisi = 0;
            let selisihAngsuran = 0;
            let premiAsuransi = 0;
            let totalAngsuran = 0;
            let totalAngsuranBank = 0;
            let selisihAsuransi = 0;
            let totalDropping = 0;

            pageData.forEach((pd, ind) => {
              plafon += pd.DataPembiayaan.plafond;
              adminBank +=
                pd.DataPembiayaan.plafond *
                (pd.DataPembiayaan.by_admin_bank / 100);
              adminKoperasi +=
                pd.DataPembiayaan.plafond * (pd.DataPembiayaan.by_admin / 100);
              adminCadangan +=
                pd.DataPembiayaan.plafond *
                (pd.DataPembiayaan.by_lainnya / 100);
              tatalaksana += pd.DataPembiayaan.by_tatalaksana;
              asuransi +=
                pd.DataPembiayaan.plafond *
                (pd.DataPembiayaan.by_asuransi / 100);
              dataInformasi +=
                pd.DataPembiayaan.by_epotpen + pd.DataPembiayaan.by_flagging;
              tabungan += pd.DataPembiayaan.by_buka_rekening;
              materai += pd.DataPembiayaan.by_materai;
              mutasi += pd.DataPembiayaan.by_mutasi;
              provisi += pd.DataPembiayaan.by_provisi;
              const { tahun, bulan } = getUsiaMasuk(
                pd.DataPembiayaan.tanggal_lahir,
                (pd.tanggal_cetak_akad || moment()).toString()
              );
              const asRate = AsuransiRate.filter(
                (a) => a.usia == Math.round(parseFloat(`${tahun}.${bulan}`))
              );

              const indRate = Math.round(pd.DataPembiayaan.tenor / 12);
              const rate = asRate && indRate ? asRate[0].jk[indRate - 1] : 0;
              const premAsuransi =
                pd.DataPembiayaan.Produk.name === "Flash Sisa Gaji"
                  ? 0
                  : pd.DataPembiayaan.plafond * (rate / 1000);
              const ciuPremi =
                pd.DataPembiayaan.plafond * ((1.5 * indRate) / 100);
              const bumiPremi =
                pd.DataPembiayaan.plafond * ((2 * indRate) / 100);
              const resultPremi =
                pd.jenis_asuransi === "BERDIKARI"
                  ? premAsuransi
                  : pd.jenis_asuransi === "CIU"
                  ? ciuPremi
                  : bumiPremi;
              const asur =
                pd.DataPembiayaan.plafond *
                (pd.DataPembiayaan.by_asuransi / 100);
              premiAsuransi += resultPremi;
              selisihAsuransi += asur - resultPremi;
              const angsuran = ceiling(
                parseInt(
                  getAngsuranPerBulan(
                    pd.DataPembiayaan.mg_bunga,
                    pd.DataPembiayaan.tenor,
                    pd.DataPembiayaan.plafond
                  )
                ),
                pd.DataPembiayaan.pembulatan
              );
              const angsuranBank = ceiling(
                parseInt(
                  getAngsuranPerBulan(
                    pd.DataPembiayaan.margin_bank,
                    pd.DataPembiayaan.tenor,
                    pd.DataPembiayaan.plafond
                  )
                ),
                pd.DataPembiayaan.pembulatan
              );
              totalAngsuran += angsuran;
              totalAngsuranBank += angsuranBank;
              selisihAngsuran += angsuran - angsuranBank;
              blokir += pd.DataPembiayaan.blokir * angsuran;
              takeover += pd.DataPembiayaan.pelunasan + pd.DataPembiayaan.bpp;

              totalDropping +=
                pd.DataPembiayaan.plafond -
                (pd.DataPembiayaan.by_provisi +
                  pd.DataPembiayaan.by_buka_rekening +
                  pd.DataPembiayaan.plafond *
                    (pd.DataPembiayaan.by_admin_bank / 100));
            });
            const pencairan =
              plafon -
              (adminBank +
                adminKoperasi +
                adminCadangan +
                tatalaksana +
                asuransi +
                dataInformasi +
                tabungan +
                materai +
                mutasi +
                provisi +
                blokir +
                takeover);
            return (
              <Table.Summary.Row className="bg-green-500 text-white">
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2} className="text-center">
                  Summary
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={10}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={11} className="text-center">
                  <>{formatNumber(plafon.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={12}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={13}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={14}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={15}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={16}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={17}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={18}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={19} className="text-center">
                  <>{formatNumber(adminBank.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={20} className="text-center">
                  <>{formatNumber(adminKoperasi.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={21} className="text-center">
                  <>{formatNumber(adminCadangan.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={23} className="text-center">
                  <>{formatNumber(tatalaksana.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={24} className="text-center">
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={24} className="text-center">
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={25} className="text-center">
                  <>{formatNumber(asuransi.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={26} className="text-center">
                  <>{formatNumber(premiAsuransi.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={27} className="text-center">
                  <>{formatNumber(selisihAsuransi.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={28} className="text-center">
                  <>{formatNumber(dataInformasi.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={29} className="text-center">
                  <>{formatNumber(tabungan.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={30} className="text-center">
                  <>{formatNumber(materai.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={31} className="text-center">
                  <>{formatNumber(mutasi.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={32} className="text-center">
                  <>{formatNumber(provisi.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={33} className="text-center">
                  <>{formatNumber(totalAngsuran.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={34} className="text-center">
                  <>{formatNumber(totalAngsuranBank.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={35} className="text-center">
                  <>{formatNumber(selisihAngsuran.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={36} className="text-center">
                  <>{formatNumber(blokir.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={37} className="text-center">
                  <>{formatNumber(takeover.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={38} className="text-center">
                  <>{formatNumber(pencairan.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={39} className="text-center">
                  <>{formatNumber(totalDropping.toFixed(0))}</>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </div>
    </div>
  );
}
