"use client";
import {
  ArrowRightOutlined,
  DeleteOutlined,
  FileFilled,
  FolderFilled,
  FormOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Input,
  Modal,
  Table,
  TableProps,
  DatePicker,
  message,
  Typography,
  Select,
  Tooltip,
  Button,
  Tag,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { formatNumber } from "@/components/utils/inputUtils";
import {
  BankOpt,
  Cabang,
  DataDataPengajuan,
  Options,
  UP,
} from "@/components/utils/Interfaces";
import { Bank, Refferal, User } from "@prisma/client";
import CetakDataPengajuan from "@/components/utils/CetakDataPengajuan";
import { IDRFormat } from "@/components/Utils";
const { Paragraph } = Typography;
const { RangePicker } = DatePicker;

const EditPengajuan = dynamic(
  () => import("@/components/views/pengajuan/EditPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

const CetakAkad = dynamic(
  () => import("@/components/views/monitoring/CetakAkad"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

const ModalBerkas = dynamic(() => import("@/components/utils/ModalBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

const CetakForm = dynamic(
  () => import("@/components/utils/CetakFormPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

const ViewBerkasPengajuan = dynamic(
  () => import("@/components/utils/ViewBerkasPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function MonitoringPusat() {
  const [selected, setSelected] = useState<DataDataPengajuan>();
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [nameOrNopen, setNameOrNopen] = useState<string>();
  const [total, setTotal] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [modalHapus, setModalHapus] = useState(false);
  const [up, setUp] = useState<BankOpt[]>();
  const [cabang, setCabang] = useState<Cabang[]>();
  const [marketing, setMarketing] = useState<User[]>();
  const [refferal, setRefferal] = useState<Options[]>();
  const [provinsi, setProvinsi] = useState<Options[]>();
  const [open, setOpen] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [group, setGroup] = useState<string>();
  const [pencairan, setPencairan] = useState<string>();
  const [groupBank, setGroupBank] =
    useState<{ value: string; label: string }[]>();
  const [selectedBank, setSelectedBank] = useState<string>();
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    (async () => {
      const resProvinsi = await fetch(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      const dataProvinsi = await resProvinsi.json();
      setProvinsi(
        dataProvinsi.map((data: any, ind: number) => {
          return {
            label: data.name,
            value: data.id,
          };
        })
      );

      const resUp = await fetch("/api/master/unit/pelayanan");
      const { result } = await resUp.json();
      const marketing: User[] = [];
      const cabangFull: Cabang[] = [];
      const up: UP[] = result;
      const upOpt: BankOpt[] = up.map((up) => {
        const cabang: Options[] = up.UnitCabang.map((c) => {
          cabangFull.push({ ...c, unit: up.name });
          c.User.forEach((u) => marketing.push(u));
          return { label: c.name, value: c.name };
        });
        return { label: up.name, value: up.name, options: cabang };
      });
      setMarketing(marketing);
      setCabang(cabangFull);
      setUp(upOpt);

      const refRes = await fetch("/api/master/refferal");
      const ref: Refferal[] = await refRes.json();
      const refResult: Options[] = ref.map((r) => {
        return { label: r.name, value: r.id };
      });
      setRefferal(refResult);
    })();
  }, []);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/monitoring/pusat?page=${page}&pageSize=${pageSize}${
        nameOrNopen ? "&name=" + nameOrNopen : ""
      }${from ? "&from=" + from : ""}${to ? "&to=" + to : ""}`
    );
    const { data, total, banks } = await res.json();
    const newBank =
      banks &&
      banks.map((b: Bank) => {
        return {
          label: b.kode,
          value: b.id,
        };
      });
    setGroupBank(newBank);
    let currData = data;
    if (group === "EXPRESS") {
      currData =
        currData &&
        currData.filter(
          (d: DataDataPengajuan) =>
            d.DataPembiayaan.jenis_pembiayaan_id === null
        );
    }
    if (group === "REGULER") {
      currData =
        currData &&
        currData.filter(
          (d: DataDataPengajuan) =>
            d.DataPembiayaan.jenis_pembiayaan_id !== null
        );
    }
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
    if (selectedBank) {
      currData =
        currData &&
        currData.filter((d: DataDataPengajuan) => d.bankId === selectedBank);
    }

    setData(
      currData.map((d: DataDataPengajuan) => {
        return { ...d, key: d.id };
      })
    );
    setTotal(total);
    setLoading(false);
    setSelected(undefined);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [nameOrNopen, page, pageSize, group, pencairan, from, to, selectedBank]);

  const handleDelete = async () => {
    setLoading(true);
    const result = await fetch("/api/monitoring/pusat", {
      method: "DELETE",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ id: selected?.id }),
    });
    const res = await result.json();
    if (result.ok) {
      message.success(res.msg);
    } else {
      message.error(res.msg);
    }
    setLoading(false);
    setModalHapus(false);
    await getData();
  };

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
            fontSize: 13,
          },
        };
      },
      className: "text-center text-xs",
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
      title: "SPV / MARKETING",
      dataIndex: "marketing",
      key: "marketing",
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
            <p className="underline">{record.moc && `/ ${record.moc}`}</p>
            <p>
              {record.User.first_name} {record.User.last_name}{" "}
              <span className="italic opacity-70" style={{ fontSize: 10 }}>
                ({record.User.unit_cabang_id && record.User.UnitCabang.name})
              </span>
            </p>
          </div>
        );
      },
    },
    {
      title: "ADMIN INPUT",
      dataIndex: "admin",
      key: "admin",
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
            {record.DataPembiayaan.User.first_name}{" "}
            {record.DataPembiayaan.User.last_name}
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
            {record.status_approval === "SETUJU" && <CetakAkad data={record} />}
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
    {
      title: "AKTIVITAS",
      dataIndex: "activity",
      key: "activity",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
          className: "example-class-in-td bg-green-500 text-white",
        };
      },
      width: 200,
      render(value, record, index) {
        return (
          <Paragraph
            ellipsis={{
              rows: 1,
              expandable: "collapsible",
            }}
            style={{ fontSize: 11, width: 200 }}
          >
            {record.DataPembiayaan.user_update}
          </Paragraph>
        );
      },
    },
    {
      title: "STATUS DEVIASI",
      key: "status_deviasi",
      dataIndex: "status_deviasi",
      width: 150,
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
          <div className="flex gap-2">
            {record.DataPembiayaan.is_deviasi && (
              <Tag
                color={"blue"}
                style={{ width: 70, textAlign: "center" }}
                className="font-bold"
              >
                DEVIASI
              </Tag>
            )}
            <Paragraph
              ellipsis={{
                rows: 1,
                expandable: "collapsible",
              }}
              style={{ fontSize: 11, width: 150 }}
            >
              {record.DataPembiayaan.is_deviasi &&
                record.DataPembiayaan.keterangan}
            </Paragraph>
          </div>
        );
      },
    },
    {
      title: "AKSI",
      dataIndex: "id",
      key: "id",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
          className: "example-class-in-td bg-green-500 text-white",
        };
      },
      width: 120,
      render(value, record, index) {
        return (
          <div className="flex justify-center gap-1" key={record.id}>
            <Button
              icon={<FolderFilled />}
              type="primary"
              size="small"
              onClick={() => {
                setSelected(record);
                setOpenForm(true);
              }}
            ></Button>
            <Button
              onClick={() => {
                setSelected(record);
                setModalEdit(true);
              }}
              size="small"
              type="primary"
              style={{ backgroundColor: "#19d120" }}
              icon={<FormOutlined />}
            ></Button>
            <Button
              onClick={() => {
                setSelected(record);
                setModalHapus(true);
              }}
              type="primary"
              size="small"
              danger
              disabled={
                loading
                  ? true
                  : record.status_pencairan === "TRANSFER"
                  ? true
                  : false
              }
              style={{
                opacity: record.status_pencairan === "TRANSFER" ? 0.5 : 1,
              }}
              icon={<DeleteOutlined />}
            ></Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="px-2">
      <div className="flex gap-2 my-1 mx-1 md:flex-wrap overflow-x-auto">
        <div className="flex-1">
          <RangePicker
            onChange={(_, info) => {
              setFrom(info && info[0]);
              setTo(info && info[1]);
            }}
            style={{ width: 200 }}
            size="small"
          />
        </div>
        <div className="flex-1">
          <Input.Search
            onChange={(e) => setNameOrNopen(e.target.value)}
            style={{ width: 200 }}
            size="small"
          />
        </div>
        <div className="flex-1">
          <Select
            options={[
              { label: "EXPRESS", value: "EXPRESS" },
              { label: "REGULER", value: "REGULER" },
            ]}
            placeholder="PRODUK"
            onChange={(e) => setGroup(e)}
            allowClear
            size="small"
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Select
            options={[
              { label: "ANTRI", value: "ANTRI" },
              { label: "PROSES", value: "PROSES" },
              { label: "CAIR", value: "CAIR" },
              { label: "BATAL", value: "BATAL" },
            ]}
            placeholder="PENCAIRAN"
            allowClear
            onChange={(e) => setPencairan(e)}
            size="small"
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Select
            options={groupBank}
            placeholder="SUMDAN"
            allowClear
            onChange={(e) => setSelectedBank(e)}
            size="small"
            className="w-full"
          />
        </div>
        <CetakDataPengajuan data={data || []} />
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          scroll={{ x: "max-content", y: 340 }}
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
          summary={(pageData) => {
            let totalPLafond = 0;

            pageData.forEach((pd, i) => {
              totalPLafond += pd.DataPembiayaan.plafond;
            });
            return (
              <Table.Summary.Row className="bg-green-500 text-white text-center text-xs">
                <Table.Summary.Cell index={1} className="text-center text-xs">
                  Summary
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                <Table.Summary.Cell index={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={4}></Table.Summary.Cell>
                <Table.Summary.Cell index={5}></Table.Summary.Cell>
                <Table.Summary.Cell index={6} className="text-xs">
                  {formatNumber(totalPLafond.toFixed(0))}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </div>

      <Modal
        open={modalHapus}
        onCancel={() => setModalHapus(false)}
        title="Konfirmasi Hapus Pengajuan"
        footer={[]}
      >
        <p>
          Lanjutkan penghapusan data pengajuan {selected?.DataPembiayaan.name}?
        </p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 hover:bg-red-500 text-white rounded shadow py-1 px-2"
            disabled={loading}
            onClick={() => handleDelete()}
          >
            YA {loading ? <LoadingOutlined /> : <DeleteOutlined />}
          </button>
        </div>
      </Modal>
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
      {selected && (
        <EditPengajuan
          data={selected}
          getData={getData}
          fullCabang={cabang || []}
          fullUser={marketing || []}
          upOpt={up || []}
          refferalOpt={refferal || []}
          provinsi={provinsi || []}
          open={modalEdit}
          setOpen={setModalEdit}
          key={selected.id || ""}
        />
      )}
      {selected && (
        <CetakForm
          open={openForm}
          setOpen={setOpenForm}
          data={selected}
          key={selected.id}
        />
      )}
    </div>
  );
}
