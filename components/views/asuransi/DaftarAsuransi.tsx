"use client";

import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { CheckCircleFilled, MinusCircleFilled } from "@ant-design/icons";
import {
  DatePicker,
  Input,
  Select,
  Spin,
  Table,
  TableProps,
  message,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export default function LaporanBulananMaster() {
  const [month, setMonth] = useState<string>(
    `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
  );
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [opt, setOpt] = useState<string>();
  const [nama, setName] = useState<string>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/asuransi?page=${page}&pageSize=${pageSize}${
        month ? "&month=" + month : ""
      }${opt ? "&is-true=" + opt : ""}${nama ? "&name=" + nama : ""}`
    );
    const { data, total } = await res.json();
    setData(data);
    setTotal(total);
    setLoading(false);
  };

  const handleAction = async (id: string) => {
    setLoading(true);
    const res = await fetch("/api/asuransi", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      message.success("Update pembayaran asuransi berhasil");
      await getData();
    } else {
      message.error("Update pembayaran asuransi gagal!");
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [month, page, opt, pageSize, nama]);

  const columnsPengajuan: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "NO",
      key: "no",
      dataIndex: "no",
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
      title: "AREA",
      key: "area",
      dataIndex: "area",
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
      key: "area",
      dataIndex: "area",
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
        return <>{record.User.UnitCabang.name}</>;
      },
    },
    {
      title: "NAMA PEMOHON",
      key: "nama",
      dataIndex: "nama",
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
      title: "TANGGAL PENCAIRAN",
      key: "cair",
      dataIndex: "cair",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{moment(record.tanggal_pencairan).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "PRODUK",
      key: "produk",
      dataIndex: "produk",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.DataPembiayaan.Produk.name}</>;
      },
    },
    {
      title: "JENIS",
      key: "jenis",
      dataIndex: "jenis",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
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
      title: "SUMBER DANA",
      key: "sumdan",
      dataIndex: "sumdan",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.Bank.name}</>;
      },
    },
    {
      title: "TENOR",
      key: "tenor",
      dataIndex: "tenor",
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
        return <>{record.DataPembiayaan.tenor}</>;
      },
    },
    {
      title: "PLAFOND",
      key: "plafond",
      dataIndex: "plafond",
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
      title: "ASURANSI",
      key: "asuransi",
      dataIndex: "asuransi",
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
                (record.DataPembiayaan.by_asuransi / 100)
              ).toFixed(0)
            )}
          </>
        );
      },
    },
    {
      title: "STATUS PEMBAYARAN",
      key: "status_bayar",
      dataIndex: "status_bayar",
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
          <div className="flex justify-center">
            <div
              className={`w-32 py-1 px-2 text-xs font-bold italic text-white bg-${
                record.pembayaran_asuransi ? "green" : "red"
              }-500`}
            >
              {record.pembayaran_asuransi ? "DIBAYAR" : "BELUM DIBAYAR"}
            </div>
          </div>
        );
      },
    },
    {
      title: "TANGGAL PEMBAYARAN",
      key: "tgl_pembayaran",
      dataIndex: "tgl_pembayaran",
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
            {record.tanggal_pembayaran_asuransi &&
              moment(record.tanggal_pembayaran_asuransi).format("DD-MM-YYYY")}
          </>
        );
      },
    },
    {
      title: "AKSI",
      key: "aksi",
      dataIndex: "aksi",
      width: 100,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      fixed: window.innerWidth < 600 ? false : "right",
      render(value, record, index) {
        return (
          <div className="flex justify-center">
            <button
              className={`py-1 px-2 bg-${
                record.pembayaran_asuransi ? "red" : "green"
              }-500 text-white rounded shadow`}
              onClick={() => handleAction(record.id)}
            >
              {record.pembayaran_asuransi ? (
                <MinusCircleFilled />
              ) : (
                <CheckCircleFilled />
              )}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="flex gap-2 my-1">
        <DatePicker
          picker="month"
          // value={month}
          onChange={(date, datestring) => setMonth(datestring as string)}
          placeholder={`${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }`}
        />
        <Input.Search
          onChange={(e) => setName(e.target.value)}
          style={{ width: 170 }}
        />
        <Select
          placeholder="Select Group"
          options={[
            { label: "BELUM DIBAYAR", value: "false" },
            { label: "TELAH DIBAYAR", value: "true" },
          ]}
          onChange={(e) => setOpt(e)}
          allowClear
        />
      </div>
      <div className="px-2">
        <Table
          columns={columnsPengajuan}
          dataSource={data}
          size="small"
          bordered
          scroll={{ x: "max-content", y: "calc(65vh - 100px)" }}
          pagination={{
            pageSize: pageSize,
            defaultPageSize: pageSize,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
            total: total,
          }}
        />
      </div>
    </Spin>
  );
}
