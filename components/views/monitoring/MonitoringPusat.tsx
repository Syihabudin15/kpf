"use client";
import {
  DeleteOutlined,
  EyeOutlined,
  FileFilled,
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
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { formatNumber } from "@/components/utils/inputUtils";
import Link from "next/link";
import {
  BankOpt,
  Cabang,
  DataDataPengajuan,
  Options,
  UP,
} from "@/components/utils/Interfaces";
import { Bank, Refferal, User } from "@prisma/client";
import CetakDataPengajuan from "@/components/utils/CetakDataPengajuan";
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
          },
        };
      },
      width: 120,
      className: "text-center",
      render(value, record, index) {
        return (
          <>{record.area_pelayanan_berkas || record.User.UnitCabang.name}</>
        );
      },
    },

    {
      title: "NO PENSIUN",
      dataIndex: "nopen",
      key: "nopen",
      width: 120,
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
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      fixed: window.innerWidth < 600 ? false : "left",
      width: 150,
      render(value, record, index) {
        return (
          <>
            <Tooltip
              title={`Admin : ${record.DataPembiayaan.User.first_name} ${record.DataPembiayaan.User.last_name}`}
            >
              {record.DataPembiayaan.name}
            </Tooltip>
          </>
        );
      },
    },
    {
      title: "TANGGAL PENGAJUAN",
      dataIndex: "created_at",
      key: "created_at",
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
      width: 150,
      render(value, record, index) {
        return <>{record.Bank.name}</>;
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
          },
        };
      },
      width: 150,
      render(value, record, index) {
        return <>{record.DataPembiayaan.Produk.name}</>;
      },
    },
    {
      title: "JENIS PEMBIAYAAN",
      dataIndex: "jenis_pembiayaan",
      key: "jenis_pembiayaan",
      width: 150,
      className: "text-center",
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
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 100,
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan.tenor} Bulan</>;
      },
    },
    {
      title: "PLAFOND",
      dataIndex: "plafond",
      key: "plafond",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 150,
      className: "text-center",
      sorter: (a, b) => a.DataPembiayaan.plafond - b.DataPembiayaan.plafond,
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.plafond.toString())}</>;
      },
    },
    {
      title: "MARKETING / SPV",
      dataIndex: "marketing",
      key: "marketing",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 120,
      className: "text-center",
      render(value, record, index) {
        return (
          <div>
            {record.User.first_name} {record.User.last_name}{" "}
            <span className="italic opacity-70" style={{ fontSize: 10 }}>
              ({record.User.unit_cabang_id && record.User.UnitCabang.name})
            </span>
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
          },
        };
      },
      width: 120,
      className: "text-center",
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
          },
          className: "example-class-in-td bg-green-500 text-white",
        };
      },
      children: [
        {
          title: "CETAK",
          dataIndex: "cetak",
          key: "cetak",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          width: 80,
          render(value, record, index) {
            return (
              record.status_approval === "SETUJU" && <CetakAkad data={record} />
            );
          },
        },
        {
          title: "VIEW",
          dataIndex: "view",
          key: "view",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          width: 80,
          render(value, record, index) {
            return (
              <>
                <ModalBerkas
                  data={{
                    url: record.BerkasPengajuan.berkas_akad || "",
                    type: "application/pdf",
                    title: `BERKAS AKAD ${record.DataPembiayaan.name}`,
                  }}
                  key={"akad" + record.id}
                />
              </>
            );
          },
        },
      ],
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
      title: "ANGSURAN",
      dataIndex: "jadwal_angsuran",
      key: "jadwal_angsuran",
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
            {record.status_pencairan === "TRANSFER" && (
              <Link href={`/pengajuan/angsuran/${record.id}`}>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-0 px-2 rounded shadow">
                  <EyeOutlined />
                </button>
              </Link>
            )}
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
    {
      title: "Aktivitas Terbaru",
      dataIndex: "activity",
      key: "activity",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
          className: "example-class-in-td bg-green-500 text-white",
        };
      },
      width: 400,
      render(value, record, index) {
        return (
          <Paragraph
            ellipsis={{
              rows: 2,
              expandable: "collapsible",
            }}
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
      width: 100,
      fixed: window.innerWidth < 600 ? false : "right",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <div
            className={`text-center italic text-xs ${
              record.DataPembiayaan.is_deviasi ? "text-red" : ""
            }`}
          >
            {record.DataPembiayaan.is_deviasi ? "DEVIASI" : "TIDAK DEVIASI"}
          </div>
        );
      },
    },
    {
      title: "KETERANGAN DEVIASI",
      key: "keterangan_deviasi",
      dataIndex: "keterangan_deviasi",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <Paragraph
            ellipsis={{
              rows: 2,
              expandable: "collapsible",
            }}
          >
            {record.DataPembiayaan.is_deviasi &&
              record.DataPembiayaan.keterangan}
          </Paragraph>
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
      fixed: window.innerWidth < 600 ? false : "right",
      width: 100,
      render(value, record, index) {
        return (
          <div className="flex justify-center gap-1">
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded shadow"
              onClick={() => {
                setSelected(record);
                setModalEdit(true);
              }}
            >
              <FormOutlined />
            </button>
            <button
              onClick={() => {
                setSelected(record);
                setModalHapus(true);
              }}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded shadow"
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
            >
              {loading ? <LoadingOutlined /> : <DeleteOutlined />}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="px-2">
      <div className="flex gap-2 my-1 mx-1 md:flex-wrap overflow-x-auto">
        <RangePicker
          onChange={(_, info) => {
            setFrom(info && info[0]);
            setTo(info && info[1]);
          }}
        />
        <Input.Search
          onChange={(e) => setNameOrNopen(e.target.value)}
          style={{ width: 170 }}
        />
        <Select
          options={[
            { label: "EXPRESS", value: "EXPRESS" },
            { label: "REGULER", value: "REGULER" },
          ]}
          placeholder="PRODUK"
          onChange={(e) => setGroup(e)}
          allowClear
        />
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
        />
        <Select
          options={groupBank}
          placeholder="SUMDAN"
          allowClear
          onChange={(e) => setSelectedBank(e)}
        />
        <CetakDataPengajuan data={data || []} />
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          scroll={{ x: "max-content", y: "calc(61.5vh - 100px)" }}
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
          summary={(pageData) => {
            let totalPLafond = 0;

            pageData.forEach((pd, i) => {
              totalPLafond += pd.DataPembiayaan.plafond;
            });
            return (
              <Table.Summary.Row className="bg-green-500 text-white text-center">
                <Table.Summary.Cell index={1} className="text-center">
                  Summary
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                <Table.Summary.Cell index={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={4}></Table.Summary.Cell>
                <Table.Summary.Cell index={5}></Table.Summary.Cell>
                <Table.Summary.Cell index={6}></Table.Summary.Cell>
                <Table.Summary.Cell index={7}></Table.Summary.Cell>
                <Table.Summary.Cell index={8}></Table.Summary.Cell>
                <Table.Summary.Cell index={9}></Table.Summary.Cell>
                <Table.Summary.Cell index={10}>
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
    </div>
  );
}
