"use client";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { DatePicker, Input, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";

export default function OutstandingAktif() {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [year, setYear] = useState<string>();
  const [nama, setNama] = useState<string>();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/administrasi/outstanding-aktif?page=${page}${
        nama ? "&name=" + nama : ""
      }${year ? "&year=" + year : ""}`
    );
    const { data, total } = await res.json();
    setTotal(total);
    setData(data);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  return (
    <div>
      <div className="flex gap-5 my-1 mx-1">
        <DatePicker
          picker="year"
          onChange={(date, dateString) => setYear(dateString as string)}
        />
        <Input.Search
          style={{ width: 200 }}
          onChange={(e) => setNama(e.target.value)}
        />
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
            pageSize: 20,
            total: total,
            onChange(page, pageSize) {
              setPage(page);
            },
          }}
        />
      </div>
    </div>
  );
}

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
      return <>{index + 1}</>;
    },
  },
  {
    title: "MITRA BANK",
    dataIndex: "mitra",
    width: 150,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    key: "mitra",
    render(value, record, index) {
      return <>{record.DataPembiayaan.Refferal.name}</>;
    },
  },
  {
    title: "NOPEN",
    width: 150,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "nopen",
    key: "nopen",
    render(value, record, index) {
      return <>{record.DataPembiayaan.nopen}</>;
    },
  },
  {
    title: "NAMA PEMOHON",
    width: 200,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "nama_pemohon",
    fixed: window.innerWidth < 600 ? false : "left",
    key: "nama_pemohon",
    render(value, record, index) {
      return <>{record.DataPembiayaan.name}</>;
    },
  },
  {
    title: "SUMBER DANA",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "sumber_dana",
    width: 200,
    key: "sumber_dana",
    render(value, record, index) {
      return <>{record.Bank.name}</>;
    },
  },
  {
    title: "TANGGAL AKAD",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "tanggal_akad",
    width: 150,
    key: "tanggal_akad",
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
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    width: 150,
    dataIndex: "tanggal_cair",
    key: "tanggal_cair",
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
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "tanggal_lunas",
    width: 150,
    key: "tanggal_lunas",
    render(value, record, index) {
      const lunas = moment(record.tanggal_cetak_akad)
        .add(record.DataPembiayaan.tenor, "M")
        .format("DD-MM-YYYY");
      return <>{lunas}</>;
    },
  },
  {
    title: "PRODUK PEMBIAYAAN",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "produk",
    width: 150,
    key: "produk",
    render(value, record, index) {
      return <>{record.DataPembiayaan.Produk.name}</>;
    },
  },
  {
    title: "JENIS PEMBIAYAAN",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "jenis",
    width: 150,
    key: "jenis",
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
    width: 150,
    key: "plafon",
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
    title: "ANGSURAN PERBULAN",
    dataIndex: "angsuran",
    width: 150,
    key: "angsuran",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      const angsuran = getAngsuranPerBulan(
        record.DataPembiayaan.margin_bank || 18,
        record.DataPembiayaan.tenor,
        record.DataPembiayaan.plafond
      );
      const result = ceiling(
        parseInt(angsuran),
        record.DataPembiayaan.pembulatan
      );
      return <>{formatNumber(result.toFixed(0))}</>;
    },
  },
  {
    title: "ANGSURAN KE",
    dataIndex: "angsuran_ke",
    width: 150,
    key: "angsuran_ke",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      const angsuran = record.JadwalAngsuran.filter(
        (e) => e.tanggal_pelunasan === null
      );
      return <>{angsuran.length}</>;
    },
  },
  {
    title: "SISA TENOR",
    dataIndex: "sisa_tenor",
    width: 150,
    key: "sisa_tenor",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      const angsuran = record.JadwalAngsuran.filter(
        (e) => e.tanggal_pelunasan === null
      );
      return <>{angsuran.length}</>;
    },
  },
  {
    title: "OUTSTANDING",
    dataIndex: "outstanding",
    width: 150,
    key: "outstanding",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      const angsuran = record.JadwalAngsuran.filter(
        (e) => e.tanggal_pelunasan === null
      );
      return <>{formatNumber(angsuran[0].sisa.toFixed(0))}</>;
    },
  },
];
