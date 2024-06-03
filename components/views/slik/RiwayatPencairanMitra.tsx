"use client";

import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { DatePicker, Input, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export default function RiwayatPencairanMitra() {
  const [name, setName] = useState<string>();
  const [year, setYear] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/slik/riwayat-pencairan-mitra?page=${page}${
        name ? "&name=" + name : ""
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
  }, [page, name, year]);

  return (
    <div>
      <div className="flex gap-5 my-1 mx-1">
        <DatePicker
          picker="year"
          onChange={(date, dateString) => setYear(dateString as string)}
        />
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="p-2">
        <Table
          size="small"
          dataSource={data}
          columns={columns}
          scroll={{ x: 1000, y: 'calc(65vh - 100px)' }}
          bordered
          loading={loading}
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
    key: "no",
    dataIndex: "no",
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
    key: "mitra",
    dataIndex: "mitra",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>{record.Bank.kode}</>;
    },
  },
  {
    title: "NAMA PEMOHON",
    key: "nama",
    dataIndex: "nama",
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
    title: "PENGAJUAN PEMBIAYAAN",
    key: "pembiayaan",
    dataIndex: "pembiayaan",
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
  // {
  //   title: "PENCAIRAN MITRA BANK",
  //   key: "pencairan_mitra",
  //   dataIndex: "pencairan_mitra",
  //   onHeaderCell: (text, record) => {
  //     return {
  //       ["style"]: {
  //         textAlign: "center",
  //       },
  //     };
  //   },
  //   className: "text-center",
  //   render(value, record, index) {
  //     return <>{0}</>;
  //   },
  // },
  {
    title: "TANGGAL PENCAIRAN",
    key: "tanggal_cair",
    dataIndex: "tanggal_cair",
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
          {record.DataPencairan.tanggal_proses &&
            moment(record.DataPencairan.tanggal_proses).format("DD-MM-YYYY")}
        </>
      );
    },
  },
];
