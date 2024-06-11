"use client";
import { FileFilled, LoadingOutlined } from "@ant-design/icons";
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

export default function AntrianChecker() {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<string>();
  const [nameOrNopen, setNameOrNopen] = useState<string>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DataDataPengajuan>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/antrian/checker?page=${page}${
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
      title: "Mitra Bank",
      dataIndex: "mitra_bank",
      key: "mitra_bank",
      render(value, record, index) {
        return (
          <>
            {record.DataPembiayaan.refferal_id &&
              record.DataPembiayaan.Refferal.name}
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
      title: "Nama Pemohon",
      dataIndex: "name",
      key: "name",
      render(value, record, index) {
        return <>{record.DataPembiayaan && record.DataPembiayaan.name}</>;
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
      title: "Jenis Produk",
      dataIndex: "data_pembiayaan_id",
      key: "data_pembiayaan_id",
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
      title: "Plafon",
      dataIndex: "plafon",
      key: "plafon",
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.plafond.toFixed(0))}</>;
      },
    },
    {
      title: "Tenor",
      dataIndex: "Tenor",
      key: "tenor",
      render(value, record, index) {
        return <>{record.DataPembiayaan.tenor} Bulan</>;
      },
    },
    {
      title: "Status Checker",
      dataIndex: `status_checker`,
      key: "status_checker",
      width: 120,
      className: "text-center",
      render(value, record, index) {
        return (
          <div>
            {record.status_checker && (
              <div
                className={`py-1 px-2 w-24 bg-${
                  record.status_checker === "SETUJU"
                    ? "green"
                    : record.status_checker === "DITOLAK"
                    ? "red"
                    : record.status_checker === "ANTRI"
                    ? "orange"
                    : "blue"
                }-500 text-gray-100 text-center`}
              >
                {record.status_checker}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Informasi Data Verifikasi",
      dataIndex: `status_verifikasi`,
      key: "verifikasi",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            background: "#0284c7",
            color: "#f3f4f6",
            textAlign: "center",
          },
          className: "example-class-in-td bg-green-500 text-white",
        };
      },
      children: [
        {
          title: "Status",
          dataIndex: "status_verifikasi",
          key: "status_verifikasi",
          className: "text-center",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#0284c7",
                color: "#f3f4f6",
                textAlign: "center",
              },
              className: "example-class-in-td bg-green-500 text-white",
            };
          },
          render(value, record, index) {
            return (
              <div>
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
          title: "Keterangan",
          dataIndex: "keterangan_verifikasi",
          key: "keterangan_verifikasi",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#0284c7",
                color: "#f3f4f6",
                textAlign: "center",
              },
              className: "example-class-in-td bg-green-500 text-white",
            };
          },
          width: 300,
        },
        {
          title: "Pemeriksa",
          dataIndex: "nama_pemeriksa_verifikasi",
          key: "nama_pemeriksa_verifikasi",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#0284c7",
                color: "#f3f4f6",
                textAlign: "center",
              },
              className: "example-class-in-td bg-green-500 text-white",
            };
          },
        },
        {
          title: "Tanggal",
          dataIndex: "tanggal_verifikasi",
          key: "tanggal_verifikasi",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#0284c7",
                color: "#f3f4f6",
                textAlign: "center",
              },
              className: "example-class-in-td bg-green-500 text-white",
            };
          },
          render(value, record, index) {
            return (
              <div>
                {moment(record.tanggal_verifikasi).format("DD-MM-YYYY")}
              </div>
            );
          },
        },
      ],
    },
    {
      title: "Informasi Data Slik",
      dataIndex: `status_slik`,
      key: "slik",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            background: "#22c55e",
            color: "#f3f4f6",
            textAlign: "center",
          },
          className: "example-class-in-td bg-green-500 text-white",
        };
      },
      children: [
        {
          title: "Status",
          dataIndex: "status_slik",
          key: "status_slik",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#22c55e",
                color: "#f3f4f6",
                textAlign: "center",
              },
              className: "example-class-in-td bg-green-500 text-white",
            };
          },
          className: "text-center",
          render(value, record, index) {
            return (
              <div>
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
          title: "Keterangan",
          dataIndex: "keterangan_slik",
          key: "keterangan_slik",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#22c55e",
                color: "#f3f4f6",
                textAlign: "center",
              },
              className: "example-class-in-td bg-green-500 text-white",
            };
          },
          width: 300,
        },
        {
          title: "Pemeriksa",
          dataIndex: "nama_pemeriksa_slik",
          key: "nama_pemeriksa_slik",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#22c55e",
                color: "#f3f4f6",
                textAlign: "center",
              },
              className: "example-class-in-td bg-green-500 text-white",
            };
          },
        },
        {
          title: "Tanggal",
          dataIndex: "tanggal_slik",
          key: "tanggal_slik",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#22c55e",
                color: "#f3f4f6",
                textAlign: "center",
              },
              className: "example-class-in-td bg-green-500 text-white",
            };
          },
          render(value, record, index) {
            return (
              <div>{moment(record.tanggal_slik).format("DD-MM-YYYY")}</div>
            );
          },
        },
      ],
    },

    {
      title: "Periksa",
      dataIndex: "id",
      key: "id",
      fixed: "right",
      width: 70,

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
          <div className="flex justify-center">
            <button
              className="py-1 px-2 border rounded shadow"
              onClick={() => {
                setSelected(record);
                setOpen(true);
              }}
            >
              <FileFilled />
            </button>
          </div>
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
          style={{ width: 200 }}
          onChange={(e) => setNameOrNopen(e.target.value)}
        />
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          scroll={{ x: "max-content", y: "calc(65vh - 100px)" }}
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
      {selected && (
        <ViewBerkasPengajuan
          data={selected}
          role={"CHECKER"}
          allowForm={true}
          isPeriksa={true}
          getData={getData}
          pathname="checker"
          nextpath="maker"
          open={open}
          setOpen={setOpen}
        />
      )}
    </section>
  );
}
