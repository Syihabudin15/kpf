"use client";
import { LoadingOutlined } from "@ant-design/icons";
import { Input, Table, TableProps, DatePicker } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { formatNumber } from "@/components/utils/inputUtils";
import { DataDataPengajuan } from "@/components/utils/Interfaces";

const ViewBerkasPengajuan = dynamic(
  () => import("@/components/utils/ViewBerkasPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function RiwayatSlik() {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<string>();
  const [nameOrNopen, setNameOrNopen] = useState<string>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/slik/riwayat?page=${page}${
        nameOrNopen ? "&name=" + nameOrNopen : ""
      }${year ? "&year=" + year : ""}`
    );
    const { data, total } = await res.json();
    setData(data);
    setTotal(total);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [year, nameOrNopen, page]);
  const columns: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "NO",
      dataIndex: "nopen",
      key: "nopen",
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
      title: "TANGGAL PENGAJUAN",
      dataIndex: "created_at",
      key: "created_at",
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
            {record.DataPembiayaan &&
              moment(record.DataPembiayaan.created_at).format("DD-MM-YYYY")}
          </>
        );
      },
    },
    {
      title: "SUMBER DANA",
      dataIndex: "sumber_dana",
      key: "sumber_dana",
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
      title: "NAMA PEMOHON",
      dataIndex: "name",
      key: "name",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.DataPembiayaan && record.DataPembiayaan.name}</>;
      },
    },
    {
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "data_pembiayaan_id",
      key: "data_pembiayaan_id",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <>{record.DataPembiayaan && record.DataPembiayaan.Produk.name}</>
        );
      },
    },
    {
      title: "JENIS PEMBIAYAAN",
      dataIndex: "data_pembiayaan_id",
      key: "data_pembiayaan_id",
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
      title: "PLAFOND",
      dataIndex: "plafon",
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
      title: "TENOR",
      dataIndex: "Tenor",
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
        return <>{record.DataPembiayaan.tenor} Bulan</>;
      },
    },
    {
      title: "INFORMASI VERIFIKASI",
      dataIndex: `status_verifikasi`,
      key: "verifikasi",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            background: "#0284c7",
            color: "#f3f4f6",
            textAlign: "center",
          },
        };
      },
      children: [
        {
          title: "STATUS",
          dataIndex: "status_verifikasi",
          key: "status_verifikasi",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#0284c7",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="flex justify-center text-xs font-bold italic">
                {record.status_verifikasi && (
                  <div
                    className={`py-1 px-2 w-24 bg-${
                      record.status_verifikasi === "SETUJU"
                        ? "green"
                        : record.status_verifikasi === "DITOLAK"
                        ? "red"
                        : record.status_verifikasi === "ANTRI"
                        ? "orange"
                        : "blue"
                    }-500 text-gray-100 text-center`}
                  >
                    {record.status_verifikasi}
                  </div>
                )}
              </div>
            );
          },
        },
        {
          title: "KETERANGAN",
          dataIndex: "keterangan_verifikasi",
          key: "keterangan_verifikasi",
          width: 300,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#0284c7",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
          className: "text-justify",
        },
        {
          title: "PEMERIKSA",
          dataIndex: "nama_pemeriksa_verifikasi",
          key: "nama_pemeriksa_verifikasi",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#0284c7",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
          className: "text-center",
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_verifikasi",
          key: "tanggal_verifikasi",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#0284c7",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            return (
              <div>
                {record.tanggal_verifikasi &&
                  moment(record.tanggal_verifikasi).format("DD-MM-YYYY")}
              </div>
            );
          },
        },
      ],
    },
    {
      title: "INFORMASI SLIK",
      dataIndex: `status_slik`,
      key: "slik",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            background: "#22c55e",
            color: "#f3f4f6",
            textAlign: "center",
          },
        };
      },
      children: [
        {
          title: "STATUS",
          dataIndex: "status_slik",
          key: "status_slik",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#22c55e",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            return (
              <div className="flex justify-center text-xs font-bold italic">
                {record.status_slik && (
                  <div
                    className={`py-1 px-2 w-24 bg-${
                      record.status_slik === "SETUJU"
                        ? "green"
                        : record.status_slik === "DITOLAK"
                        ? "red"
                        : record.status_slik === "ANTRI"
                        ? "orange"
                        : "blue"
                    }-500 text-gray-100 text-center`}
                  >
                    {record.status_slik}
                  </div>
                )}
              </div>
            );
          },
        },
        {
          title: "KETERANGAN",
          dataIndex: "keterangan_slik",
          key: "keterangan_slik",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#22c55e",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
          className: "text-justify",
          width: 300,
        },
        {
          title: "PEMERIKSA",
          dataIndex: "nama_pemeriksa_slik",
          key: "nama_pemeriksa_slik",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#22c55e",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
          className: "text-center",
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_slik",
          key: "tanggal_slik",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#22c55e",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            return (
              <div>{moment(record.tanggal_slik).format("DD-MM-YYYY")}</div>
            );
          },
        },
      ],
    },
    {
      title: "VIEW BERKAS",
      dataIndex: "id",
      key: "id",
      fixed: "right",
      width: 80,

      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
          className: "example-class-in-td bg-green-500 text-white",
        };
      },
      render(value, record, index) {
        return (
          <ViewBerkasPengajuan
            data={record}
            role={"CHECKER"}
            allowForm={false}
          />
        );
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

      <div>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          scroll={{ x: 3000, y: 320 }}
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
      </div>
    </section>
  );
}
