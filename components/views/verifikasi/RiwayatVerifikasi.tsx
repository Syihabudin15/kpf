"use client";
import { FileOutlined, LoadingOutlined } from "@ant-design/icons";
import { Input, Table, TableProps, DatePicker, Typography } from "antd";
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

export default function RiwayatVerifikasi() {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<string>();
  const [nameOrNopen, setNameOrNopen] = useState<string>();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DataDataPengajuan>();
  const [expand, setExpand] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/riwayat/verifikasi?page=${page}${
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
        const currPage = (page - 1) * 20;
        return <>{currPage + (index + 1)}</>;
      },
    },
    {
      title: "TANGGAL PENGAJUAN",
      dataIndex: "created_at",
      key: "created_at",
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
            {record.DataPembiayaan &&
              moment(record.DataPembiayaan.created_at).format("DD-MM-YYYY")}
          </>
        );
      },
    },
    {
      title: "NO PENSIUN",
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
        return <>{record.DataPembiayaan && record.DataPembiayaan.nopen}</>;
      },
    },
    {
      title: "NAMA PEMOHON",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: window.innerWidth < 600 ? false : "left",
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
      title: "PLAFOND",
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
            {record.DataPembiayaan &&
              formatNumber(record.DataPembiayaan.plafond.toString())}
          </>
        );
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
      render(value, record, index) {
        return (
          <>{record.DataPembiayaan && record.DataPembiayaan.Produk.name}</>
        );
      },
    },
    {
      title: "STATUS",
      dataIndex: "status_verifikasi",
      key: "status_verifikasi",
      width: 150,
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
          <div className="flex justify-center font-sans italic text-xs">
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
      title: "KKETERANGAN",
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
      render(value, record, index) {
        return (
          <Typography.Paragraph
            ellipsis={{
              rows: 2,
              expandable: "collapsible",
              expanded: expand,
              onExpand: (_, info) => setExpand(info.expanded),
            }}
          >
            {record.keterangan_verifikasi}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: "PEMERIKSA",
      dataIndex: "nama_pemeriksa_verifikasi",
      key: "nama_pemeriksa_verifikasi",
      width: 150,
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
      width: 150,
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
    {
      title: "VIEW BERKAS",
      dataIndex: "id",
      key: "id",
      fixed: "right",
      width: 70,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-center">
            <button
              className="py-1 px-2 rounded shadow"
              onClick={() => {
                setSelected(record);
                setOpen(true);
              }}
            >
              <FileOutlined />
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
          style={{ width: 170 }}
          onChange={(e) => setNameOrNopen(e.target.value)}
        />
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
          size="small"
          loading={loading}
          pagination={{
            pageSize: 20,
            total,
            onChange(page, pageSize) {
              setPage(page);
            },
          }}
        />
      </div>
      {selected && (
        <ViewBerkasPengajuan
          data={selected}
          role={"VERIFIKASI"}
          allowForm={false}
          open={open}
          setOpen={setOpen}
        />
      )}
    </section>
  );
}
