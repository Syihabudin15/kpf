"use client";

import { useEffect, useState } from "react";
import { DataDataPengajuan } from "../utils/Interfaces";
import {
  Table,
  TableProps,
  DatePicker,
  Input,
  Button,
  Typography,
  Modal,
  PaginationProps,
} from "antd";
import { formatNumber } from "../utils/inputUtils";
import { getAngsuranPerBulan } from "../views/simulasi/simulasiUtil";
import { ceiling } from "../utils/pdf/pdfUtil";
import Link from "next/link";
import {
  DeleteFilled,
  FileFilled,
  FolderFilled,
  FormOutlined,
  PlayCircleFilled,
  PrinterFilled,
  RobotFilled,
} from "@ant-design/icons";
import { Bank, StatusPencairan } from "@prisma/client";
import { FilterOption } from "./viewUtils";
import moment from "moment";
import { IUserNotif } from "./INotif";
import { FormInput, ViewBerkas, ViewBerkasPengajuan } from ".";
import { AkadKredit, FormCetak } from "./pdf";
import { generateTableAngsuran } from "./appUtils";
const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

export default function MonitoringUI({ user }: { user: IUserNotif }) {
  const [data, setData] = useState<DataDataPengajuan[]>([]);
  const [sumdans, setSumdans] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState<string>();
  const [backdate, setBackdate] = useState<string>();
  const [sumdanId, setSumdanId] = useState<string>(
    user.bank_id ? user.bank_id : ""
  );
  const [status, setStatus] = useState<any>();
  const [viewFile, setViewFile] = useState<{
    open: boolean;
    url: string | null;
    title: string | null;
    type: "pdf" | "video";
  }>({
    open: false,
    url: null,
    title: null,
    type: "pdf",
  });
  const [selected, setSelected] = useState<DataDataPengajuan>();
  const [openModal, setOpenModal] = useState({
    berkasPengajuan: false,
    form: false,
    delete: false,
    update: false,
    akad: false,
  });

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/v1/pengajuan?page=${page}&pageSize=${pageSize}${
        backdate ? "&backdate=" + backdate : ""
      }${search ? "&search=" + search : ""}${
        sumdanId ? "&sumdanId=" + sumdanId : ""
      }${status !== undefined ? "&status=" + status : ""}`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setTotal(res.total);
      });
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await fetch(`/api/v1/sumdan?page=1&pageSize=100`)
        .then((res) => res.json())
        .then((res) => {
          setSumdans(res.data);
        });
    })();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [page, pageSize, backdate, search, sumdanId, status]);

  const columns: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      className: "text-xs text-center",
      width: 50,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      render(value, record, index) {
        return <>{(page - 1) * pageSize + (index + 1)}</>;
      },
    },
    {
      title: "UNIT PELAYANAN",
      dataIndex: ["User", "UnitCabang", "name"],
      key: "unitCabang",
      className: "text-xs",
      width: 150,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
    },
    {
      title: "NOPEN",
      dataIndex: ["nopen"],
      key: "nopen",
      className: "text-xs",
      width: 150,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
    },
    {
      title: "NAMA PEMOHON",
      dataIndex: ["nama"],
      key: "fullname",
      className: "text-xs",
      width: 200,
      fixed: window && window.innerWidth > 600 ? "left" : false,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      render(value, record, index) {
        return (
          <span
            className={`${
              record.status_pencairan === "BATAL" && "text-red-500"
            }`}
          >
            {record.nama}
          </span>
        );
      },
    },
    {
      title: "JENIS PEMBIAYAAN",
      dataIndex: "jenis",
      key: "jenis",
      className: "text-xs",
      width: 150,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
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
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "produk",
      key: "produk",
      className: "text-xs",
      width: 200,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-between">
            <span>{record.DataPembiayaan.Produk.name}</span>
            <span className="italic">({record.Bank.kode})</span>
          </div>
        );
      },
    },
    {
      title: "PLAFOND",
      dataIndex: "plafon",
      key: "plafon",
      className: "text-xs text-right",
      width: 120,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      render(value, record, index) {
        return <>{formatNumber(String(record.DataPembiayaan.plafond))}</>;
      },
    },
    {
      title: "TENOR",
      dataIndex: ["DataPembiayaan", "tenor"],
      key: "tenor",
      className: "text-xs text-center",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
    },
    {
      title: "ANGSURAN",
      dataIndex: "angsuran",
      key: "angsuran",
      className: "text-xs text-right",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      render(value, record, index) {
        const angs = getAngsuranPerBulan(
          record.DataPembiayaan.mg_bunga,
          record.DataPembiayaan.tenor,
          record.DataPembiayaan.plafond,
          false,
          record.jenis_margin === "FLAT",
          record.Bank.kode
        );
        const val = ceiling(parseInt(angs), record.DataPembiayaan.pembulatan);
        return (
          <Link
            href={`/pengajuan/angsuran/${record.id}`}
            target="_blank"
            className="text-black"
          >
            {formatNumber(String(val))}
          </Link>
        );
      },
    },
    {
      title: "ACCOUNT OFFICER",
      dataIndex: "ao",
      key: "ao",
      className: "text-xs",
      width: 200,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      render(value, record, index) {
        return (
          <div className="flex flex-col">
            <span>
              {record.User.first_name} {record.User.last_name}
            </span>
            {record.moc && <div className="border-t border-gray-300"></div>}
            <span>{record.moc}</span>
          </div>
        );
      },
    },
    {
      title: "ADMIN",
      dataIndex: ["DataPembiayaan", "User", "first_name"],
      key: "admin",
      className: "text-xs",
      width: 120,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
    },
    {
      title: "AKAD",
      dataIndex: "akad",
      key: "akad",
      className: "text-xs",
      width: 150,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-center gap-2 items-center">
            {["MASTER", "OPERAISONAL", "ENTRY_DATA"].includes(user.role) &&
              record.status_approval === "SETUJU" &&
              record.status_pencairan !== "BATAL" && (
                <Button
                  icon={<PrinterFilled />}
                  size="small"
                  type="primary"
                  onClick={() => {
                    setSelected(record);
                    setOpenModal({ ...openModal, akad: true });
                  }}
                ></Button>
              )}
            {record.BerkasPengajuan.berkas_akad && (
              <Button
                icon={<FileFilled />}
                size="small"
                onClick={() =>
                  setViewFile({
                    ...viewFile,
                    open: true,
                    url: record.BerkasPengajuan.berkas_akad,
                    type: "pdf",
                    title: "BERKAS AKAD " + record.nama,
                  })
                }
              ></Button>
            )}
            {record.BerkasPengajuan.video_akad && (
              <Button
                icon={<PlayCircleFilled />}
                size="small"
                onClick={() =>
                  setViewFile({
                    ...viewFile,
                    open: true,
                    url: record.BerkasPengajuan.video_akad,
                    type: "video",
                    title: "VIDEO AKAD " + record.nama,
                  })
                }
              ></Button>
            )}
          </div>
        );
      },
    },
    {
      title: "BERKAS",
      dataIndex: "berkas",
      key: "berkas",
      className: "text-xs",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      hidden: user.bank_id !== null,
      render(value, record, index) {
        return (
          <div
            className="flex justify-center gap-2"
            onClick={() => setSelected(record)}
          >
            <Button
              icon={<FileFilled />}
              size="small"
              onClick={() =>
                setOpenModal({
                  ...openModal,
                  berkasPengajuan: true,
                  update: false,
                })
              }
            ></Button>
            <Button
              icon={<FolderFilled />}
              size="small"
              type="primary"
              onClick={() => setOpenModal({ ...openModal, form: true })}
            ></Button>
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
          ["style"]: { background: "#22c55e", color: "#f3f4f6", fontSize: 13 },
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
                fontSize: 13,
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
                fontSize: 13,
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
            fontSize: 13,
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
                fontSize: 13,
              },
            };
          },
          width: 300,
          render(value, record, index) {
            return (
              <Paragraph
                ellipsis={{
                  rows: 1,
                  expandable: "collapsible",
                }}
                style={{ fontSize: 12, width: 300 }}
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
                fontSize: 13,
              },
            };
          },
          width: 300,
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
          title: "APPROVAL",
          dataIndex: "keterangan_approval",
          key: "keterangan_approval",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#0284c7",
                color: "#f3f4f6",
                fontSize: 13,
              },
            };
          },
          width: 300,
          render(value, record, index) {
            return (
              <Paragraph
                ellipsis={{
                  rows: 1,
                  expandable: "collapsible",
                }}
                style={{ fontSize: 12, width: 300 }}
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
            fontSize: 13,
          },
        };
      },
      children: [
        {
          title: "SLIK",
          dataIndex: "nama_pemeriksa_slik",
          key: "nama_pemeriksa_slik",
          className: "text-center text-xs",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#4b5563",
                color: "#f3f4f6",
                fontSize: 13,
              },
            };
          },
        },
        {
          title: "VERIFIKASI",
          dataIndex: "nama_pemeriksa_verifikasi",
          key: "nama_pemeriksa_verifikasi",
          className: "text-center text-xs",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#4b5563",
                color: "#f3f4f6",
                fontSize: 13,
              },
            };
          },
        },
        {
          title: "APPROVAL",
          dataIndex: "nama_pemeriksa_approval",
          key: "nama_pemeriksa_approval",
          className: "text-center text-xs",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "#4b5563",
                color: "#f3f4f6",
                fontSize: 13,
              },
            };
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
            fontSize: 13,
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
                fontSize: 13,
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
                fontSize: 13,
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                {record.tanggal_pencairan &&
                  moment(record.tanggal_pencairan).format("DD-MM-YYYY")}
              </>
            );
          },
        },
      ],
    },
    {
      title: "ACTIVITIES",
      dataIndex: "activity",
      key: "activity",
      className: "text-xs",
      width: 200,
      hidden: user.bank_id !== null,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
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
            style={{ fontSize: 11, width: 200 }}
          >
            {record.DataPembiayaan.user_update}
          </Paragraph>
        );
      },
    },
    {
      title: "DEVIASI",
      dataIndex: "deviasi",
      key: "deviasi",
      className: "text-xs",
      width: 200,
      hidden: user.bank_id !== null,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
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
            style={{ fontSize: 11, width: 200 }}
          >
            {record.DataPembiayaan.is_deviasi &&
              record.DataPembiayaan.keterangan}
          </Paragraph>
        );
      },
    },
    {
      title: "ACTION",
      dataIndex: "action",
      key: "action",
      className: "text-xs",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-center gap-2">
            {user.bank_id && (
              <Button
                icon={<FolderFilled />}
                type="primary"
                size="small"
                onClick={() =>
                  setOpenModal({
                    ...openModal,
                    berkasPengajuan: true,
                    update: false,
                  })
                }
              ></Button>
            )}
            {["MASTER", "VERIFIKASI", "OPERASIONAL", "ENTRY_DATA"].includes(
              user.role
            ) && (
              <Button
                icon={<FormOutlined />}
                type="primary"
                size="small"
                onClick={() =>
                  setOpenModal({
                    ...openModal,
                    berkasPengajuan: true,
                    update: true,
                  })
                }
              ></Button>
            )}
            {["MASTER", "VERIFIKASI", "OPERASIONAL"].includes(user.role) && (
              <Button
                icon={<DeleteFilled />}
                type="primary"
                size="small"
                danger
              ></Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white">
      <div className="bg-orange-500 text-gray-100 font-bold p-2 italic rounded">
        MONITORING
      </div>
      <div className="flex justify-between gap-2 py-1">
        <div className="flex gap-2">
          <RangePicker
            size="small"
            onChange={(_, date) => setBackdate(date.join(","))}
          />
          {!user.bank_id && (
            <FilterOption
              options={sumdans.map((s) => ({ label: s.kode, value: s.id }))}
              onChange={setSumdanId}
              placeHolder={"Sumdan"}
            />
          )}
          <FilterOption
            options={[
              { label: "ANTRI", value: null },
              { label: "PROSES", value: StatusPencairan.PROSES },
              { label: "TRANSFER", value: StatusPencairan.TRANSFER },
              { label: "BATAL", value: StatusPencairan.BATAL },
            ]}
            onChange={setStatus}
            placeHolder={"Status"}
          />
        </div>
        <Input.Search
          size="small"
          style={{ width: 170 }}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="p-1">
        <Table
          size="small"
          bordered
          rowKey={"id"}
          columns={columns}
          dataSource={data}
          scroll={{ x: "max-content", y: 335 }}
          pagination={
            {
              size: "small",
              total: total,
              pageSizeOptions: [50, 100, 500, 1000, 10000],
              defaultPageSize: pageSize,
              onChange(page: any, pageSize: any) {
                setPage(page);
                setPageSize(pageSize);
              },
              showTotal(total: any, range: any) {
                return (
                  <div className="flex gap-2 text-xs italic">
                    <span>show</span>
                    <span>{range[0]}</span>
                    <span>-</span>
                    <span>{range[1]}</span>
                    <span>dari : {total}</span>
                  </div>
                );
              },
            } as PaginationProps
          }
          loading={loading}
        />
      </div>
      <ViewBerkas
        key={viewFile.url || "View"}
        title={viewFile.title || ""}
        url={viewFile.url || null}
        open={viewFile.open}
        setOpen={(value: boolean) => setViewFile({ ...viewFile, open: value })}
        type={viewFile.type || "pdf"}
      />
      {selected && (
        <>
          <ViewBerkasPengajuan
            open={openModal.berkasPengajuan}
            setOpen={(value: boolean) =>
              setOpenModal({ ...openModal, berkasPengajuan: value })
            }
            data={selected}
            key={selected.id}
            isEdit={openModal.update}
          />
          <FormCetak
            open={openModal.form}
            setOpen={(value: boolean) =>
              setOpenModal({ ...openModal, form: value })
            }
            data={selected}
            key={selected.id}
          />
          <CetakAkad
            open={openModal.akad}
            setOpen={(value: boolean) =>
              setOpenModal({ ...openModal, akad: value })
            }
            data={selected}
            key={selected.id}
            setData={setSelected}
          />
        </>
      )}
    </div>
  );
}

const CetakAkad = ({
  open,
  setOpen,
  data,
  setData,
}: {
  open: boolean;
  setOpen: Function;
  data: DataDataPengajuan;
  setData: Function;
}) => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [angsurans, setAngsurans] = useState<any[]>([]);

  const generateRefCode = async () => {
    setLoading(true);
    await fetch("/api/v1/generate?sumdan=" + data.Bank.kode)
      .then((res) => res.json())
      .then((res) => {
        setData({
          ...data,
          nomor_akad: `${res.data}/FAS-${
            data.User.UnitCabang ? data.User.UnitCabang.kode_area : "PUSAT"
          }/${moment().format("DDMMYYYY")}`,
        });
      });
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/v1/pengajuan", {
      method: "PUT",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const generateAngsuran = generateTableAngsuran(data);
        setAngsurans(generateAngsuran);
        setOpen(false);
        setShow(true);
      })
      .catch((err) => {
        console.log(err);
        Modal.error({ title: "ERROR!!", content: "Internal Server Error" });
      });
    setLoading(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        loading={loading}
        title={"CETAK AKAD " + data.nama}
        onOk={() => handleSubmit()}
      >
        <div className="flex flex-col gap-2 my-5">
          <FormInput
            label="Tanggal Akad"
            value={moment(data.tanggal_cetak_akad || new Date()).format(
              "YYYY-MM-DD"
            )}
            type="date"
            onChange={(e: any) =>
              setData({ ...data, tanggal_cetak_akad: new Date(e) })
            }
            mode="row"
          />
          <FormInput
            label="Nomor Akad"
            value={data.nomor_akad}
            onChange={(e: any) => setData({ ...data, nomor_akad: e })}
            suffix={
              <Button
                size="small"
                type="primary"
                icon={<RobotFilled />}
                onClick={() => generateRefCode()}
              ></Button>
            }
            mode="row"
          />
          <FormInput
            label="Jenis Margin"
            value={data.jenis_margin}
            type="options"
            options={[
              { label: "FLAT", value: "FLAT" },
              { label: "ANUITAS", value: "ANUITAS" },
            ]}
            onChange={(e: any) => setData({ ...data, jenis_margin: e })}
            mode="row"
          />
          <FormInput
            label="Margin Bunga"
            value={data.DataPembiayaan.mg_bunga}
            type="number"
            onChange={(e: any) =>
              setData({
                ...data,
                DataPembiayaan: { ...data.DataPembiayaan, mg_bunga: Number(e) },
              })
            }
            mode="row"
          />
          <FormInput
            label="Jenis Pembiayaan"
            value={data.DataPembiayaan.JenisPembiayaan.name || "Sisa Gaji"}
            disabled
            mode="row"
          />
          <FormInput
            label="Produk Pembiayaan"
            value={`${data.DataPembiayaan.Produk.name} (${data.Bank.kode})`}
            disabled
            mode="row"
          />
        </div>
      </Modal>
      <Modal
        open={show}
        onClose={() => setShow(false)}
        onCancel={() => setShow(false)}
        title={"AKAD " + data.nama}
        style={{ top: 20 }}
        width={"95vw"}
        footer={[]}
      >
        <div className="h-[80vh]">
          <AkadKredit data={data} angsurans={angsurans} />
        </div>
      </Modal>
    </div>
  );
};
