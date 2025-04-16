"use client";
import { formatNumber } from "@/components/utils/inputUtils";
import { DataAngnsuranMJM, Tagihan } from "@/components/utils/Interfaces";
import { DatePicker, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export default function TagihanDebitur() {
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState<string>(moment().format("YYYY-MM"));
  const [data, setData] = useState<Tagihan[]>([]);

  // const handleCetak = async () => {
  //   setLoading(true);
  //   const res = await fetch("/api/tagihan", {
  //     method: "POST",
  //     headers: { "Content-type": "Application/json" },
  //     body: JSON.stringify({ data }),
  //   });
  //   if (!res.ok) {
  //     Modal.error({
  //       title: <span className="text-red-500">Internal Server error</span>,
  //       footer: [],
  //       closable: true,
  //       content: (
  //         <div className="p-2 my-2">
  //           Kami mengalami kendala. Mohon refresh dan coba lagi!
  //         </div>
  //       ),
  //     });
  //     return setLoading(false);
  //   }
  //   const a = document.createElement("a");
  //   a.href = "/slik/tagihan.xlsx";
  //   a.download = "tagihanbaru.xlsx";
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  //   setLoading(false);
  // };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/tagihan-debitur?month=" + month);
      const { data } = await res.json();
      setData(data);
      setLoading(false);
    })();
  }, [month]);

  return (
    <div>
      <div className="p-1 flex gap-2">
        <button
          className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-4 rounded shadow"
          // onClick={() => handleCetak()}
        >
          Cetak
        </button>
        <DatePicker
          picker="month"
          onChange={(_, e) => setMonth(moment(e).format("YYYY-MM"))}
        />
      </div>
      <div className="p-1">
        <Table
          columns={columns}
          dataSource={data}
          size="small"
          pagination={false}
          bordered
          scroll={{ x: "max-content", y: "calc(72vh - 100px)" }}
          loading={loading}
        />
      </div>
    </div>
  );
}
const columns: TableProps<Tagihan>["columns"] = [
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
      return <>{record.DataPengajuan.nopen}</>;
    },
  },
  {
    title: "NAMA PEMOHON",
    dataIndex: "name",
    key: "name",
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
    title: "NO SKEP",
    dataIndex: "skep",
    key: "skep",
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
      return <>{record.DataPengajuan.nomor_sk_pensiun}</>;
    },
  },
  {
    title: "ANGSURAN KE",
    dataIndex: "angsuranke",
    key: "angsuranke",
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
      return <>{record.angsuran_ke}</>;
    },
  },
  {
    title: "ANGSURAN",
    dataIndex: "angsuran",
    key: "angsuran",
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
      return <>{formatNumber(record.angsuran.toFixed(0))}</>;
    },
  },
  {
    title: "JADWAL BAYAR",
    dataIndex: "jadwalabayar",
    key: "jadwalabayar",
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
      return <>{moment(record.tanggal_bayar).format("DD/MM/YYYY")}</>;
    },
  },
  {
    title: "TANGGAL AKAD",
    dataIndex: "tglAkad",
    key: "tglAkad",
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
          {moment(record.DataPengajuan.tanggal_cetak_akad).format("DD/MM/YYYY")}
        </>
      );
    },
  },
];
