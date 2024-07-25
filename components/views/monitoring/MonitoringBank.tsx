"use client";
import { FileFilled, LoadingOutlined } from "@ant-design/icons";
import { Input, Table, TableProps, DatePicker, Typography, Select } from "antd";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { formatNumber } from "@/components/utils/inputUtils";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import CetakDataPengajuan from "@/components/utils/CetakDataPengajuan";

const ViewBerkasPengajuan = dynamic(
  () => import("@/components/utils/ViewBerkasPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
const { Paragraph } = Typography;
const { RangePicker } = DatePicker;

export default function MonitoringBank() {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [nameOrNopen, setNameOrNopen] = useState<string>();
  const [total, setTotal] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DataDataPengajuan>();
  const [expand, setExpand] = useState(false);
  const [pencairan, setPencairan] = useState<string>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/monitoring/bank?page=${page}&pageSize=${pageSize}${
        nameOrNopen ? "&name=" + nameOrNopen : ""
      }${from ? "&from=" + from : ""}${to ? "&to=" + to : ""}`
    );
    const { data, total } = await res.json();
    let currData = data;
    if (pencairan === "PROSES") {
      currData =
        currData &&
        currData.filter(
          (d: DataDataPengajuan) =>
            d.status_approval === "SETUJU" && d.status_pencairan !== "TRANSFER"
        );
    }
    if (pencairan === "ANTRI") {
      currData =
        currData &&
        currData.filter(
          (d: DataDataPengajuan) =>
            (d.status_approval === "ANTRI" ||
              d.status_slik === "ANTRI" ||
              d.status_verifikasi === "ANTRI") &&
            d.status_pencairan !== "BATAL"
        );
    }
    if (pencairan === "CAIR") {
      currData =
        currData &&
        currData.filter(
          (d: DataDataPengajuan) => d.status_pencairan === "TRANSFER"
        );
    }
    if (pencairan === "BATAL") {
      currData =
        currData &&
        currData.filter(
          (d: DataDataPengajuan) => d.status_pencairan === "BATAL"
        );
    }
    setData(
      currData.map((d: DataDataPengajuan) => {
        return { ...d, key: d.id };
      })
    );
    setTotal(total);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [from, to, nameOrNopen, page, pageSize, pencairan]);

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
        return <>{record.DataPembiayaan.nopen}</>;
      },
    },
    {
      title: "NAMA PEMOHON",
      dataIndex: "name",
      key: "name",
      fixed: window.innerWidth < 600 ? false : "left",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.DataPembiayaan.name}</>;
      },
    },
    {
      title: "TANGGAL PENGAJUAN",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render(value, record, index) {
        return (
          <>{moment(record.DataPembiayaan.created_at).format("DD-MM-YYYY")}</>
        );
      },
    },
    {
      title: "UNIT PELAYANAN",
      dataIndex: "Unit Cabang",
      key: "Unit Cabang",
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
      render(value, record, index) {
        return <>{record.Bank.name}</>;
      },
    },
    {
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "produk_pembiayaan",
      key: "produk_pembiayaan",
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
      title: "JENIS PEMBIAYAAN",
      dataIndex: "jenis_pembiayaan",
      key: "jenis_pembiayaan",
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
      title: "TENOR",
      dataIndex: "tenor",
      key: "tenor",
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
        return <>{record.DataPembiayaan.tenor} Bulan</>;
      },
    },
    {
      title: "PLAFOND",
      dataIndex: "plafond",
      key: "plafond",
      width: 100,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      sorter: (a, b) => a.DataPembiayaan.plafond - b.DataPembiayaan.plafond,
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.plafond.toString())}</>;
      },
    },
    {
      title: "BERKAS PENGAJUAN",
      dataIndex: "berkas_pengajuan",
      key: "berkas_pengajuan",
      width: 100,
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
              className="py-1 px-2 rounded shadow border"
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
    {
      title: "STATUS PENGAJUAN",
      dataIndex: "status",
      key: "status",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: { background: "#22c55e", color: "#f3f4f6" },
        };
      },
      children: [
        {
          title: "SLIK",
          dataIndex: "status_slik",
          key: "status_slik",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#22c55e",
                color: "#f3f4f6",
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="flex justify-center text-xs text-center font-bold italic">
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
          title: "VERIFIKASI",
          dataIndex: "status_verifikasi",
          key: "status_verifikasi",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#22c55e",
                color: "#f3f4f6",
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
          title: "APPROVAL",
          dataIndex: "status_approval",
          key: "status_approval",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#22c55e",
                color: "#f3f4f6",
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="flex justify-center text-xs text-center font-bold italic">
                {record.status_approval && (
                  <div
                    className={`py-1 px-2 w-24 bg-${
                      record.status_approval === "SETUJU"
                        ? "green"
                        : record.status_approval === "DITOLAK"
                        ? "red"
                        : record.status_approval === "ANTRI"
                        ? "orange"
                        : "blue"
                    }-500 text-gray-100 text-center`}
                  >
                    {record.status_approval}
                  </div>
                )}
              </div>
            );
          },
        },
      ],
    },
    {
      title: "KETERANGAN PROSES PENGAJUAN",
      key: "keterangan",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            background: "#0284c7",
            color: "#f3f4f6",
            textAlign: "center",
          },
        };
      },
      dataIndex: "keterangan",
      children: [
        {
          title: "SLIK",
          dataIndex: "keterangan_slik",
          key: "keterangan_slik",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#0284c7",
                color: "#f3f4f6",
              },
            };
          },
          width: 300,
          render(value, record, index) {
            return (
              <Paragraph
                ellipsis={{
                  rows: 2,
                  expandable: "collapsible",
                  expanded: expand,
                  onExpand: (_, info) => setExpand(info.expanded),
                }}
              >
                {record.keterangan_slik}
              </Paragraph>
            );
          },
        },
        {
          title: "VERIFIKASI",
          dataIndex: "keterangan_verifikasi",
          key: "keterangan_verifikasi",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#0284c7",
                color: "#f3f4f6",
              },
            };
          },
          width: 300,
          render(value, record, index) {
            return (
              <Paragraph
                ellipsis={{
                  rows: 2,
                  expandable: "collapsible",
                  expanded: expand,
                  onExpand: (_, info) => setExpand(info.expanded),
                }}
              >
                {record.keterangan_verifikasi}
              </Paragraph>
            );
          },
        },
        {
          title: "APPROVAL",
          dataIndex: "keterangan_approval",
          key: "keterangan_approval",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#0284c7",
                color: "#f3f4f6",
              },
            };
          },
          width: 300,
          render(value, record, index) {
            return (
              <Paragraph
                ellipsis={{
                  rows: 2,
                  expandable: "collapsible",
                  expanded: expand,
                  onExpand: (_, info) => setExpand(info.expanded),
                }}
              >
                {record.keterangan_approval}
              </Paragraph>
            );
          },
        },
      ],
    },
    {
      title: "PEMERIKSA PENGAJUAN",
      key: "pemeriksa",
      dataIndex: "pemeriksa",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            background: "#4b5563",
            color: "#f3f4f6",
            textAlign: "center",
          },
        };
      },
      children: [
        {
          title: "SLIK",
          dataIndex: "nama_pemeriksa_slik",
          key: "nama_pemeriksa_slik",
          className: "text-center",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#4b5563",
                color: "#f3f4f6",
              },
            };
          },
        },
        {
          title: "VERIFIKASI",
          dataIndex: "nama_pemeriksa_verifikasi",
          key: "nama_pemeriksa_verifikasi",
          className: "text-center",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#4b5563",
                color: "#f3f4f6",
              },
            };
          },
        },
        {
          title: "APPROVAL",
          dataIndex: "nama_pemeriksa_approval",
          key: "nama_pemeriksa_approval",
          className: "text-center",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#4b5563",
                color: "#f3f4f6",
              },
            };
          },
        },
      ],
    },
    {
      title: "TANGGAL PERIKSA PENGAJUAN",
      key: "tanggal",
      dataIndex: "tanggal",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            backgroundColor: "#f97316",
            color: "#f3f4f6",
          },
        };
      },
      children: [
        {
          title: "SLIK",
          key: "tanggal_slik",
          dataIndex: "tanggal_slik",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                backgroundColor: "#f97316",
                color: "#f3f4f6",
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="text-center">
                {record.tanggal_slik &&
                  moment(record.tanggal_slik).format("DD-MM-YYYY")}
              </div>
            );
          },
        },
        {
          title: "VERIFIKASI",
          key: "tanggal_verifikasi",
          dataIndex: "tanggal_verifikasi",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                backgroundColor: "#f97316",
                color: "#f3f4f6",
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="text-center">
                {record.tanggal_verifikasi &&
                  moment(record.tanggal_verifikasi).format("DD-MM-YYYY")}
              </div>
            );
          },
        },
        {
          title: "APPROVAL",
          key: "tanggal_approval",
          dataIndex: "tanggal_approval",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                backgroundColor: "#f97316",
                color: "#f3f4f6",
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="text-center">
                {record.tanggal_approval &&
                  moment(record.tanggal_approval).format("DD-MM-YYYY")}
              </div>
            );
          },
        },
      ],
    },
    {
      title: "DATA PENCAIRAN",
      key: "pencairan",
      dataIndex: "pencairan",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            backgroundColor: "#ec4899",
            color: "#f3f4f6",
          },
        };
      },
      children: [
        {
          title: "STATUS",
          key: "status_pencairan",
          dataIndex: "status_pencairan",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                backgroundColor: "#ec4899",
                color: "#f3f4f6",
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="flex justify-center text-xs text-center font-bold italic">
                {record.status_pencairan ? (
                  <div
                    className={`py-1 px-2 w-24 bg-${
                      record.status_pencairan === "TRANSFER"
                        ? "green"
                        : record.status_pencairan === "BATAL"
                        ? "red"
                        : "blue"
                    }-500 text-gray-100 text-center`}
                  >
                    {record.status_pencairan}
                  </div>
                ) : (
                  <div
                    className={`py-1 px-2 w-24 bg-orange-500 text-gray-100 text-center`}
                  >
                    ANTRI
                  </div>
                )}
              </div>
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal_pencairan",
          dataIndex: "tanggal_pencairan",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                backgroundColor: "#ec4899",
                color: "#f3f4f6",
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="text-center">
                {record.tanggal_pencairan &&
                  moment(record.tanggal_pencairan).format("DD-MM-YYYY")}
              </div>
            );
          },
        },
      ],
    },
  ];

  return (
    <div className="px-2">
      <div className="flex gap-5 my-1 mx-1">
        <RangePicker
          onChange={(_, info) => {
            setFrom(info && info[0]);
            setTo(info && info[1]);
          }}
        />
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setNameOrNopen(e.target.value)}
        />
        <Select
          style={{ width: 150 }}
          options={[
            { label: "ANTRI", value: "ANTRI" },
            { label: "PROSES", value: "PROSES" },
            { label: "CAIR", value: "CAIR" },
            { label: "BATAL", value: "BATAL" },
          ]}
          // defaultValue={"ALL"}
          placeholder="PENCAIRAN"
          allowClear
          onChange={(e) => setPencairan(e)}
        />
        <CetakDataPengajuan data={data || []} />
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
            pageSize: pageSize,
            pageSizeOptions: [10, 20, 50, 100, 150, 200],
            total,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </div>
      {selected && (
        <ViewBerkasPengajuan
          data={selected}
          role="MASTER"
          allowForm={true}
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
  );
}
