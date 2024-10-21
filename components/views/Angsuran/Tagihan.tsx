"use client";
import { formatNumber } from "@/components/utils/inputUtils";
import { DataAngnsuranMJM } from "@/components/utils/Interfaces";
import { Modal, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Tagihan() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataAngnsuranMJM[]>([]);

  const handleCetak = async () => {
    setLoading(true);
    const res = await fetch("/api/tagihan", {
      method: "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) {
      Modal.error({
        title: <span className="text-red-500">Internal Server error</span>,
        footer: [],
        closable: true,
        content: (
          <div className="p-2 my-2">
            Kami mengalami kendala. Mohon refresh dan coba lagi!
          </div>
        ),
      });
      return setLoading(false);
    }
    const a = document.createElement("a");
    a.href = "/slik/tagihan.xlsx";
    a.download = "tagihanbaru.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/tagihan");
      const { data } = await res.json();
      setData(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="p-1">
        <button
          className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-4 rounded shadow"
          onClick={() => handleCetak()}
        >
          Cetak
        </button>
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={data}
          size="small"
          pagination={false}
          bordered
          scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
          loading={loading}
        />
      </div>
    </div>
  );
}
const columns: TableProps<DataAngnsuranMJM>["columns"] = [
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
    title: "PERIODE",
    dataIndex: "periode",
    key: "periode",
    width: 80,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>{moment(record.tanggal_bayar).format("YYYYMM")}</>;
    },
  },
  {
    title: "BULAN TAGIH",
    dataIndex: "bulan_tagih",
    key: "bulan_tagih",
    width: 80,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>{moment(record.tanggal_bayar).format("YYYYMM")}</>;
    },
  },
  {
    title: "NO. TAGIHAN",
    dataIndex: "no_tagihan",
    key: "no_tagihan",
    width: 80,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <></>;
    },
  },
  {
    title: "NO SK",
    dataIndex: "no_sk",
    key: "no_sk",
    width: 180,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>{record.DataPengajuan.nomor_sk_pensiun}</>;
    },
  },
  {
    title: "INSTANSI",
    dataIndex: "instansi",
    key: "instansi",
    width: 80,
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
        <>{record.DataPengajuan.jenis_pensiun === "TASPEN" ? "01" : "02"}</>
      );
    },
  },
  {
    title: "STATUS SK",
    dataIndex: "status",
    key: "status",
    width: 100,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>00</>;
    },
  },
  {
    title: "NO. PENSIUN",
    dataIndex: "nopen",
    key: "nopen",
    width: 120,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>{record.DataPengajuan.nopen}</>;
    },
  },
  {
    title: "NO SK",
    dataIndex: "nosk",
    key: "nosk",
    width: 180,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>{record.DataPengajuan.nomor_sk_pensiun}</>;
    },
  },
  {
    title: "NAMA PENERIMA",
    dataIndex: "nama_penerima",
    key: "nama_penerima",
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
      return <>{record.DataPengajuan.nama}</>;
    },
  },
  {
    title: "TENOR",
    dataIndex: "tenor",
    key: "tenor",
    width: 80,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>{record.DataPengajuan.DataPembiayaan.tenor}</>;
    },
  },
  {
    title: "ANGSURAN KE",
    dataIndex: "angsuran_ke",
    key: "angsuran_ke",
    width: 100,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>{record.angsuran_ke}</>;
    },
  },
  {
    title: "ANGSURAN",
    dataIndex: "angsuran",
    key: "angsuran",
    width: 120,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>{record.angsuran}</>;
    },
  },
  {
    title: "KD STATUS",
    dataIndex: "kd_status",
    key: "kd_status",
    width: 80,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>00</>;
    },
  },
  {
    title: "TANGGAL AKAD",
    dataIndex: "tanggal_akad",
    key: "tanggal_akad",
    width: 100,
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
          {moment(record.DataPengajuan.tanggal_cetak_akad).format("DD/MM/YYYY")}
        </>
      );
    },
  },
  {
    title: "KANTOR BAYAR",
    dataIndex: "kantor_bayar",
    key: "kantor_bayar",
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
      return <>{record.DataPengajuan.DataPembiayaan.juru_bayar_tujuan}</>;
    },
  },
  {
    title: "STATUS PINJAMAN",
    dataIndex: "status_pinjaman",
    key: "status_pinjaman",
    width: 100,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>-</>;
    },
  },
  {
    title: "KANTOR BAYAR LAMA",
    dataIndex: "kantor_bayar_lama",
    key: "kantor_bayar_lama",
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
      return <>{record.DataPengajuan.DataPembiayaan.juru_bayar_asal}</>;
    },
  },
  {
    title: "SUMBER DANA",
    dataIndex: "sumber_dana",
    key: "sumber_dana",
    width: 80,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>KPF</>;
    },
  },
  {
    title: "PLAFON",
    dataIndex: "plafond",
    key: "plafond",
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
          {formatNumber(record.DataPengajuan.DataPembiayaan.plafond.toFixed(0))}
        </>
      );
    },
  },
];
