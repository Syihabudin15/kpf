"use client";
import { FormOutlined, LoadingOutlined } from "@ant-design/icons";
import { Input, Table, TableProps, DatePicker, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { formatNumber } from "@/components/utils/inputUtils";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
const { Paragraph } = Typography;
const ViewBerkasPengajuan = dynamic(
  () => import("@/components/utils/ViewBerkasPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function AntrianSlik() {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<string>();
  const [nameOrNopen, setNameOrNopen] = useState<string>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<DataDataPengajuan>();
  const [open, setOpen] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/slik/antrian?page=${page}${
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
      className: "text-center  text-xs",
      render(value, record, index) {
        return <>{index + 1}</>;
      },
    },
    {
      title: "TANGGAL PENGAJUAN",
      dataIndex: "created_at",
      key: "created_at",
      width: 170,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      className: "text-center  text-xs",
      render(value, record, index) {
        return (
          <>{moment(record.DataPembiayaan.created_at).format("DD-MM-YYYY")}</>
        );
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
            fontSize: 13,
          },
        };
      },
      className: " text-xs",
      render(value, record, index) {
        return <>{record.DataPembiayaan && record.DataPembiayaan.name}</>;
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
            fontSize: 13,
          },
        };
      },
      className: " text-xs",
      render(value, record, index) {
        return <>{record.Bank.kode}</>;
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
            fontSize: 13,
          },
        };
      },
      className: "text-center  text-xs",
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.plafond.toFixed(0))}</>;
      },
    },
    {
      title: "TENOR",
      dataIndex: "Tenor",
      key: "tenor",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      className: "text-center  text-xs",
      render(value, record, index) {
        return <>{record.DataPembiayaan.tenor} Bulan</>;
      },
    },
    {
      title: "STATUS SLIK",
      dataIndex: `status_slik`,
      key: "status_slik",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      className: "text-center  text-xs",
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
      title: "INFROSMASI VERIFIKASI",
      dataIndex: "dataVerifikasi",
      key: "dataVerifikasi",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: { background: "#22c55e", color: "#f3f4f6", fontSize: 13 },
        };
      },
      children: [
        {
          title: "STATUS",
          dataIndex: "statusVerif",
          key: "statusVerif",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#22c55e",
                color: "#f3f4f6",
                fontSize: 13,
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="flex justify-center text-xs text-center font-bold italic">
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
                textAlign: "center",
                background: "#22c55e",
                color: "#f3f4f6",
                fontSize: 13,
              },
            };
          },
          render(value, record, index) {
            return (
              <Paragraph
                ellipsis={{
                  rows: 1,
                  expandable: "collapsible",
                }}
                style={{ fontSize: 12, width: 300 }}
              >
                {record.keterangan_verifikasi}
              </Paragraph>
            );
          },
        },
        {
          title: "PEMERIKSA",
          dataIndex: "pemeriksaVerif",
          key: "pemeriksaVerif",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#22c55e",
                color: "#f3f4f6",
                fontSize: 13,
              },
            };
          },
          render(value, record, index) {
            return <>{record.nama_pemeriksa_verifikasi}</>;
          },
        },
      ],
    },
    {
      title: "KOTA LAYANAN",
      dataIndex: "kota",
      key: "kota",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      className: "text-center  text-xs",
      render(value, record, index) {
        return (
          <>{record.area_pelayanan_berkas || record.User.UnitCabang.name}</>
        );
      },
    },
    {
      title: "MITRA BANK",
      dataIndex: "mitra",
      key: "mitra",
      width: 170,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      className: "text-center text-xs",
      render(value, record, index) {
        return <>{record.DataPembiayaan.Refferal.name}</>;
      },
    },
    {
      title: "PERIKSA",
      dataIndex: "id",
      key: "id",
      fixed: window.innerWidth < 600 ? false : "right",
      width: 100,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-center" key={record.id}>
            <button
              className="py-1 px-2 rounded shadow bg-green-500 hover:bg-green-600 text-white"
              onClick={() => {
                setSelected(record);
                setOpen(true);
              }}
            >
              <FormOutlined />
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
          role={"BANK"}
          allowForm={true}
          isPeriksa={true}
          pathname="slik"
          nextpath="approval"
          getData={getData}
          open={open}
          setOpen={setOpen}
        />
      )}
    </section>
  );
}
