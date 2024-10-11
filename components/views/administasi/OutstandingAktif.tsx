"use client";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { DatePicker, Input, Table, TableProps, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";
import { Role } from "@prisma/client";

export default function OutstandingAktif({ role }: { role: Role }) {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [year, setYear] = useState<string>();
  const [nama, setNama] = useState<string>();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/administrasi/outstanding-aktif?page=${page}${
        pageSize ? "&pageSize=" + pageSize : ""
      }${nama ? "&name=" + nama : ""}${year ? "&year=" + year : ""}`
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
  }, [nama, page, pageSize, year]);

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
      key: "mitra",
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
      width: 150,
      key: "tanggal_lunas",
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
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "produk",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      key: "produk",
      render(value, record, index) {
        return <>{record.DataPembiayaan.Produk.name}</>;
      },
    },
    {
      title: "JENIS PEMBIAYAAN",
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
      width: 150,
      key: "tenor",
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
      title: "ANGSURAN",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      dataIndex: "angsuran",
      key: "angsuran",
      width: 150,
      render(value, record, index) {
        const angsuran = getAngsuranPerBulan(
          role === "BANK"
            ? record.DataPembiayaan.margin_bank
            : record.DataPembiayaan.mg_bunga,
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
      title: "POKOK",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      dataIndex: "pokok",
      key: "pokok",
      width: 150,
      render(value, record, index) {
        const angsuran = record.JadwalAngsuran.filter(
          (e) => e.tanggal_pelunasan === null
        );
        return <>{formatNumber(angsuran[0].pokok.toFixed(0))}</>;
      },
    },
    {
      title: "ANGSURAN KE",
      dataIndex: "angsuran_ke",
      key: "angsuran_ke",
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
        const angsuran = record.JadwalAngsuran.filter(
          (e) => e.tanggal_pelunasan === null
        );
        return <>{angsuran && angsuran[0].angsuran_ke}</>;
      },
    },
    {
      title: "SISA TENOR",
      dataIndex: "sisa_tenor",
      key: "sisa_tenor",
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
        const angsuran = record.JadwalAngsuran.filter(
          (e) => e.tanggal_pelunasan === null
        );
        return <>{angsuran && angsuran.length}</>;
      },
    },
    {
      title: "OUTSTANDING",
      dataIndex: "outstanding",
      key: "outstanding",
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
        const angsuran = record.JadwalAngsuran.filter(
          (e) => e.tanggal_pelunasan === null
        );
        const angsuranBulan = getAngsuranPerBulan(
          role === "BANK"
            ? record.DataPembiayaan.margin_bank
            : record.DataPembiayaan.mg_bunga,
          record.DataPembiayaan.tenor,
          record.DataPembiayaan.plafond
        );
        const ceilingAngsuran = ceiling(
          parseInt(angsuranBulan),
          record.DataPembiayaan.pembulatan
        );
        const sisaAngsuran = ceilingAngsuran * angsuran.length;

        return (
          <div>
            <Tooltip
              title={`Sisa Angsuran Total : ${formatNumber(
                sisaAngsuran.toFixed(0)
              )}`}
            >
              {angsuran &&
                formatNumber((angsuran[0].sisa + angsuran[0].pokok).toFixed(0))}
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex gap-5 my-1 mx-1">
        <DatePicker
          picker="year"
          onChange={(date, dateString) => setYear(dateString as string)}
        />
        <Input.Search
          style={{ width: 170 }}
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
            pageSize: pageSize,
            total: total,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </div>
    </div>
  );
}
