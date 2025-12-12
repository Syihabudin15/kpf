"use client";
import {
  ArrowRightOutlined,
  FileFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Input,
  Table,
  TableProps,
  DatePicker,
  Typography,
  Select,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import CetakDataPengajuan from "@/components/utils/CetakDataPengajuan";
import { Button } from "antd";
import { IDRFormat } from "@/components/Utils";
const ModalBerkas = dynamic(() => import("@/components/utils/ModalBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

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
        const currPage = (page - 1) * pageSize;
        return <>{currPage + (index + 1)}</>;
      },
    },
    {
      title: "UNIT PELAYANAN",
      dataIndex: "unit",
      key: "unit",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      width: 150,
      className: "text-xs",
      render(value, record, index) {
        return (
          <div>
            <p>{record.area_pelayanan_berkas || record.User.UnitCabang.name}</p>
            <p className="text-xs opacity-70">
              {record.User.UnitCabang.UnitPelayanan.kode_area}
            </p>
          </div>
        );
      },
    },
    {
      title: "DATA PEMOHON",
      dataIndex: "name",
      key: "name",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      fixed: window.innerWidth < 600 ? false : "left",
      className: "text-xs",
      width: 200,
      render(value, record, index) {
        return (
          <div>
            <p
              style={{
                ...(record.status_pencairan === "BATAL" && { color: "red" }),
              }}
            >
              {record.DataPembiayaan.name}
            </p>
            <p className="opacity-70 italic">{record.DataPembiayaan.nopen}</p>
          </div>
        );
      },
    },
    {
      title: "TGL PENGAJUAN",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
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
        return (
          <Tooltip
            title={`Last Update: ${moment(
              record.DataPembiayaan.updated_at
            ).format("DD-MM-YYYY")}`}
          >
            {moment(record.DataPembiayaan.created_at).format("DD-MM-YYYY")}
          </Tooltip>
        );
      },
    },
    {
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "produk_pembiayaan",
      key: "produk_pembiayaan",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      width: 180,
      className: "text-xs",
      render(value, record, index) {
        return (
          <div>
            <p>
              {record.DataPembiayaan.Produk.name}{" "}
              <span className="opacity-70 italic">({record.Bank.kode})</span>
            </p>
            <p className="opacity-70 italic">
              {record.DataPembiayaan.jenis_pembiayaan_id
                ? record.DataPembiayaan.JenisPembiayaan.name
                : "Sisa Gaji"}
            </p>
          </div>
        );
      },
    },
    {
      title: "PEMBIAYAAN",
      dataIndex: "plafond",
      key: "plafond",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      width: 130,
      className: "text-right text-xs",
      sorter: (a, b) => a.DataPembiayaan.plafond - b.DataPembiayaan.plafond,
      render(value, record, index) {
        return (
          <div>
            <p>{IDRFormat(record.DataPembiayaan.plafond)}</p>
            <p className="opacity-70 italic">
              {record.DataPembiayaan.tenor} Bulan
            </p>
          </div>
        );
      },
    },
    {
      title: "AKAD",
      dataIndex: "akad",
      key: "akad",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
          className: "example-class-in-td bg-green-500 text-white",
        };
      },
      width: 100,
      render(value, record, index) {
        return (
          <div className="flex gap-2 items-center">
            <ModalBerkas
              data={{
                url: record.BerkasPengajuan.berkas_akad || "",
                type: "application/pdf",
                title: `BERKAS AKAD ${record.DataPembiayaan.name}`,
              }}
              key={"akad" + record.id}
            />
          </div>
        );
      },
    },
    {
      title: "BERKAS",
      dataIndex: "berkas_pengajuan",
      key: "berkas_pengajuan",
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
          <div className="flex justify-center">
            <Button
              className="py-1 px-2 rounded shadow border"
              onClick={() => {
                setSelected(record);
                setOpen(true);
              }}
              size="small"
              icon={<FileFilled />}
            ></Button>
          </div>
        );
      },
    },
    {
      title: "STATUS VERIFIKASI",
      dataIndex: "verif",
      key: "verif",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            background: "#22c55e",
            color: "#f3f4f6",
            fontSize: 13,
            textAlign: "center",
          },
        };
      },
      width: 200,
      render(value, record, index) {
        const status = record.status_verifikasi;
        return (
          <div className="flex gap-2">
            {status && (
              <Tag
                color={
                  status === "SETUJU"
                    ? "green-inverse"
                    : ["ANTRI", "PENDING"].includes(status)
                    ? "orange-inverse"
                    : "red-inverse"
                }
                style={{ width: 70, textAlign: "center" }}
                className="font-bold"
              >
                {status}
              </Tag>
            )}
            {record.keterangan_verifikasi && (
              <Paragraph
                ellipsis={{
                  rows: 1,
                  expandable: "collapsible",
                }}
                style={{ fontSize: 11, width: 150 }}
              >
                {record.keterangan_verifikasi} - (
                {moment(record.tanggal_verifikasi).format("DD/MM/YYYY HH:mm")}{" "}
                By {record.nama_pemeriksa_verifikasi})
              </Paragraph>
            )}
          </div>
        );
      },
    },
    {
      title: "STATUS SLIK",
      dataIndex: "slik",
      key: "slik",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            background: "#0284c7",
            color: "#f3f4f6",
            fontSize: 13,
            textAlign: "center",
          },
        };
      },
      width: 200,
      render(value, record, index) {
        const status = record.status_slik;
        return (
          <div className="flex gap-2">
            {status && (
              <Tag
                color={
                  status === "SETUJU"
                    ? "green-inverse"
                    : ["ANTRI", "PENDING"].includes(status)
                    ? "orange-inverse"
                    : "red-inverse"
                }
                style={{ width: 70, textAlign: "center" }}
                className="font-bold"
              >
                {status}
              </Tag>
            )}
            {record.keterangan_slik && (
              <Paragraph
                ellipsis={{
                  rows: 1,
                  expandable: "collapsible",
                }}
                style={{ fontSize: 11, width: 150 }}
              >
                {record.keterangan_slik} - (
                {moment(record.tanggal_slik).format("DD/MM/YYYY HH:mm")} By{" "}
                {record.nama_pemeriksa_slik})
              </Paragraph>
            )}
          </div>
        );
      },
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "approval",
      key: "approval",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            background: "#4b5563",
            color: "#f3f4f6",
            fontSize: 13,
            textAlign: "center",
          },
        };
      },
      width: 200,
      render(value, record, index) {
        const status = record.status_approval;
        return (
          <div className="flex gap-2">
            {status && (
              <Tag
                color={
                  status === "SETUJU"
                    ? "green-inverse"
                    : ["ANTRI", "PENDING"].includes(status)
                    ? "orange-inverse"
                    : "red-inverse"
                }
                style={{ width: 70, textAlign: "center" }}
                className="font-bold"
              >
                {status}
              </Tag>
            )}
            {record.keterangan_approval && (
              <Paragraph
                ellipsis={{
                  rows: 1,
                  expandable: "collapsible",
                }}
                style={{ fontSize: 11, width: 150 }}
              >
                {record.keterangan_approval} - (
                {moment(record.tanggal_approval).format("DD/MM/YYYY HH:mm")} By{" "}
                {record.nama_pemeriksa_approval})
              </Paragraph>
            )}
          </div>
        );
      },
    },
    {
      title: "STATUS DROPPING",
      dataIndex: "dropping",
      key: "dropping",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            backgroundColor: "#ec4899",
            color: "#f3f4f6",
            fontSize: 13,
            textAlign: "center",
          },
        };
      },
      width: 200,
      render(value, record, index) {
        const status = record.status_pencairan;
        return (
          <div className="flex gap-2">
            {status && (
              <Tag
                color={
                  !status
                    ? "orange"
                    : status === "TRANSFER"
                    ? "green-inverse"
                    : status === "PROSES"
                    ? "blue-inverse"
                    : "red-inverse"
                }
                style={{ width: 70, textAlign: "center" }}
                className="font-bold"
              >
                {status || "ANTRI"}
              </Tag>
            )}
            {record.tanggal_pencairan &&
              moment(record.tanggal_pencairan).format("DD/MM/YYYY HH:mm")}
          </div>
        );
      },
    },
    {
      title: "MUTASI / TAKEOVER",
      dataIndex: "mutasitakeover",
      key: "mutasitakeover",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      // width: 200,
      className: "text-xs",
      render(value, record, index) {
        return (
          <div className="flex flex-col">
            {record.DataPembiayaan.pelunasan &&
            record.DataPembiayaan.pelunasan !== 0 ? (
              <Tag color="blue" style={{ fontSize: 10 }}>
                Takeover : {record.DataPembiayaan.pembiayaan_sebelumnya}
              </Tag>
            ) : (
              ""
            )}
            {record.DataPembiayaan.by_mutasi &&
            record.DataPembiayaan.by_mutasi !== 0 ? (
              <Tag color="purple" style={{ fontSize: 10 }}>
                Mutasi : {record.DataPembiayaan.juru_bayar_asal}{" "}
                <ArrowRightOutlined style={{ fontSize: 10 }} />{" "}
                {record.DataPembiayaan.juru_bayar_tujuan}
              </Tag>
            ) : (
              ""
            )}
          </div>
        );
      },
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
            pageSizeOptions: [50, 100, 500, 1000, 10000, 20000],
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
          key={selected.id || ""}
        />
      )}
    </div>
  );
}
