"use client";
import { LoadingOutlined } from "@ant-design/icons";
import { Input, Table, TableProps, DatePicker } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";

const ViewBerkasPengajuan = dynamic(
  () => import("@/components/utils/ViewBerkasPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function DeletedPengajuan() {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<string>();
  const [nameOrNopen, setNameOrNopen] = useState<string>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/deleted/pengajuan?page=${page}${
        nameOrNopen ? "&name=" + nameOrNopen : ""
      }${year ? "&year=" + year : ""}`
    );
    const { data, total } = await res.json();
    setData(data);
    setTotal(total);
    // }
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [year, nameOrNopen, page]);
  const columns: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "No",
      dataIndex: "nopen",
      key: "nopen",
      width: 50,
      render(value, record, index) {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Tanggal Pengajuan",
      dataIndex: "created_at",
      key: "created_at",
      render(value, record, index) {
        return (
          <>
            {record.DataPembiayaan &&
              moment(record.DataPembiayaan.created_at).format("DD-MM-YYYY")}
          </>
        );
      },
    },
    {
      title: "Sumber Dana",
      dataIndex: "sumber_dana",
      key: "sumber_dana",
      render(value, record, index) {
        return <>{record.Bank.name}</>;
      },
    },
    {
      title: "Nopen",
      dataIndex: "nopen",
      key: "nopen",
      render(value, record, index) {
        return <>{record.nopen}</>;
      },
    },
    {
      title: "Nama Pemohon",
      dataIndex: "name",
      key: "name",
      render(value, record, index) {
        return <>{record.nama}</>;
      },
    },
    {
      title: "Produk Pembiayaan",
      dataIndex: "data_pembiayaan_id",
      key: "data_pembiayaan_id",
      render(value, record, index) {
        return (
          <>{record.DataPembiayaan && record.DataPembiayaan.Produk.name}</>
        );
      },
    },
    {
      title: "Jenis Pembiayaan",
      dataIndex: "data_pembiayaan_id",
      key: "data_pembiayaan_id",
      render(value, record, index) {
        return (
          <>
            {record.DataPembiayaan.JenisPembiayaan
              ? record.DataPembiayaan.JenisPembiayaan.name
              : "Sisa Gaji"}
          </>
        );
      },
    },
    {
      title: "Plafon",
      dataIndex: "plafon",
      key: "plafon",
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.plafond.toFixed(0))}</>;
      },
    },
    {
      title: "Tenor",
      dataIndex: "tenor",
      key: "tenor",
      render(value, record, index) {
        return <>{record.DataPembiayaan.tenor}</>;
      },
    },
    {
      title: "Ajukan Ulang",
      dataIndex: "id",
      key: "id",
      fixed: "right",
      width: 70,
      render(value, record, index) {
        return <></>;
      },
    },
  ];
  return (
    <section className="px-2">
      <div className="flex gap-5 my-1 mx-1">
        <DatePicker
          picker="year"
          onChange={(date, dateString) => setYear(dateString as string)}
        />
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setNameOrNopen(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        bordered
        scroll={{ x: 1800, y:320 }}
        size="small"
        loading={loading}
        pagination={{
          pageSize: 20,
          total: total,
          onChange(page, pageSize) {
            setPage(page);
          },
        }}
      />
    </section>
  );
}
