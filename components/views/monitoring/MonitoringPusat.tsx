"use client";
import {
  DeleteOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Input, Modal, Table, TableProps, DatePicker, message } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { formatNumber } from "@/components/utils/inputUtils";
import Link from "next/link";
import {
  BankOpt,
  Cabang,
  DataDataPengajuan,
  DataDataTaspen,
  Options,
  UP,
} from "@/components/utils/Interfaces";
import { Refferal, User } from "@prisma/client";
import CetakDataPengajuan from "@/components/utils/CetakDataPengajuan";

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
  const [year, setYear] = useState<string>();
  const [nameOrNopen, setNameOrNopen] = useState<string>();
  const [total, setTotal] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [modalHapus, setModalHapus] = useState(false);
  const [up, setUp] = useState<BankOpt[]>();
  const [cabang, setCabang] = useState<Cabang[]>();
  const [marketing, setMarketing] = useState<User[]>();
  const [refferal, setRefferal] = useState<Options[]>();
  const [provinsi, setProvinsi] = useState<Options[]>();

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
          cabangFull.push({ ...c, unit: up.kode_area });
          c.User.forEach((u) => marketing.push(u));
          return { label: c.name, value: c.id };
        });
        return { label: up.name, value: up.id, options: cabang };
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
      `/api/monitoring/pusat?page=${page}${
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
        return <>{index + 1}</>;
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
        return <>{record.User.UnitCabang.name}</>;
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
      className: "text-center",
      fixed: window.innerWidth < 600 ? false : "left",
      width: 150,
      render(value, record, index) {
        return <>{record.DataPembiayaan.name}</>;
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
          <>{moment(record.DataPembiayaan.created_at).format("DD-MM-YYYY")}</>
        );
      },
    },
    // {
    //   title: "Unit Pelayanan",
    //   dataIndex: "Unit Pelayanan",
    //   key: "Unit Pelayanan",
    //   render(value, record, index) {
    //     return (
    //       <>
    //         {record.User.UnitCabang.unit_pelayanan_id &&
    //           record.User.UnitCabang.UnitPelayanan.name}
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: "Unit Cabang",
    //   dataIndex: "Unit Cabang",
    //   key: "Unit Cabang",
    //   render(value, record, index) {
    //     return <>{record.User.UnitCabang.name}</>;
    //   },
    // },
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
    // {
    //   title: "Mitra Bank",
    //   dataIndex: "mitra",
    //   key: "mitra",
    //   render(value, record, index) {
    //     return <>{record.DataPembiayaan.Refferal.name}</>;
    //   },
    // },
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
              <ModalBerkas
                data={{
                  url: record.BerkasPengajuan.berkas_akad || "",
                  type: "application/pdf",
                  title: `Berkas Akad ${record.nomor_akad}`,
                }}
              />
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
          <ViewBerkasPengajuan data={record} role="MASTER" allowForm={true} />
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
      title: "INFORMASI SLIK",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: { background: "#22c55e", color: "#f3f4f6" },
        };
      },
      dataIndex: `status_slik`,
      key: "slik",
      children: [
        {
          title: "STATUS",
          dataIndex: "status_slik",
          key: "status_slik",
          width: 150,
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
          width: 300,
          className: "text-justify",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#22c55e",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
        },
        {
          title: "PEMERIKSA",
          dataIndex: "nama_pemeriksa_slik",
          key: "nama_pemeriksa_slik",
          className: "text-center",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#22c55e",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_slik",
          key: "tanggal_slik",
          className: "text-center",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#22c55e",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <div>
                {record.tanggal_slik &&
                  moment(record.tanggal_slik).format("DD-MM-YYYY")}
              </div>
            );
          },
        },
      ],
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
          className: "text-justify",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#0284c7",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
        },
        {
          title: "PEMERIKSA",
          dataIndex: "nama_pemeriksa_verifikasi",
          key: "nama_pemeriksa_verifikasi",
          className: "text-center",
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
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_verifikasi",
          key: "tanggal_verifikasi",
          className: "text-center",
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
              <div>
                {record.tanggal_verifikasi &&
                  moment(record.tanggal_verifikasi).format("DD-MM-YYYY")}
              </div>
            );
          },
        },
      ],
    },
    
    // {
    //   title: "Informasi Data Checker",
    //   dataIndex: `status_checker`,
    //   key: "checker",
    //   onHeaderCell: (text, record) => {
    //     return {
    //       ["style"]: {
    //         background: "#e11d48",
    //         color: "#f3f4f6",
    //         textAlign: "center",
    //       },
    //       className: "example-class-in-td bg-green-500 text-white",
    //     };
    //   },
    //   children: [
    //     {
    //       title: "Status",
    //       dataIndex: "status_checker",
    //       key: "status_checker",
    //       onHeaderCell: (text, record) => {
    //         return {
    //           ["style"]: {
    //             background: "#e11d48",
    //             color: "#f3f4f6",
    //             textAlign: "center",
    //           },
    //           className: "example-class-in-td bg-green-500 text-white",
    //         };
    //       },
    //       render(value, record, index) {
    //         return (
    //           <div>
    //             {record.status_checker && (
    //               <div
    //                 className={`py-1 px-2 w-24 bg-${
    //                   record.status_checker === "SETUJU"
    //                     ? "green"
    //                     : record.status_checker === "DITOLAK"
    //                     ? "red"
    //                     : record.status_checker === "ANTRI"
    //                     ? "orange"
    //                     : "blue"
    //                 }-500 text-gray-100 text-center`}
    //               >
    //                 {record.status_checker}
    //               </div>
    //             )}
    //           </div>
    //         );
    //       },
    //     },
    //     {
    //       title: "Keterangan",
    //       dataIndex: "keterangan_checker",
    //       key: "keterangan_checker",
    //       width: 300,
    //       onHeaderCell: (text, record) => {
    //         return {
    //           ["style"]: {
    //             background: "#e11d48",
    //             color: "#f3f4f6",
    //             textAlign: "center",
    //           },
    //           className: "example-class-in-td bg-green-500 text-white",
    //         };
    //       },
    //     },
    //     {
    //       title: "Pemeriksa",
    //       dataIndex: "nama_pemeriksa_checker",
    //       key: "nama_pemeriksa_checker",
    //       onHeaderCell: (text, record) => {
    //         return {
    //           ["style"]: {
    //             background: "#e11d48",
    //             color: "#f3f4f6",
    //             textAlign: "center",
    //           },
    //           className: "example-class-in-td bg-green-500 text-white",
    //         };
    //       },
    //     },
    //     {
    //       title: "Tanggal",
    //       dataIndex: "tanggal_checker",
    //       key: "tanggal_checker",
    //       onHeaderCell: (text, record) => {
    //         return {
    //           ["style"]: {
    //             background: "#e11d48",
    //             color: "#f3f4f6",
    //             textAlign: "center",
    //           },
    //           className: "example-class-in-td bg-green-500 text-white",
    //         };
    //       },
    //       render(value, record, index) {
    //         return (
    //           <div>
    //             {record.tanggal_checker &&
    //               moment(record.tanggal_checker).format("DD-MM-YYYY")}
    //           </div>
    //         );
    //       },
    //     },
    //   ],
    // },
    // {
    //   title: "Informasi Data Maker",
    //   dataIndex: `status_maker`,
    //   key: "maker",
    //   onHeaderCell: (text, record) => {
    //     return {
    //       ["style"]: {
    //         background: "#ea580c",
    //         color: "#f3f4f6",
    //         textAlign: "center",
    //       },
    //       className: "example-class-in-td bg-green-500 text-white",
    //     };
    //   },
    //   children: [
    //     {
    //       title: "Status",
    //       dataIndex: "status_maker",
    //       key: "status_maker",
    //       onHeaderCell: (text, record) => {
    //         return {
    //           ["style"]: {
    //             background: "#ea580c",
    //             color: "#f3f4f6",
    //             textAlign: "center",
    //           },
    //           className: "example-class-in-td bg-green-500 text-white",
    //         };
    //       },
    //       render(value, record, index) {
    //         return (
    //           <div>
    //             {record.status_maker && (
    //               <div
    //                 className={`py-1 px-2 w-24 bg-${
    //                   record.status_maker === "SETUJU"
    //                     ? "green"
    //                     : record.status_maker === "DITOLAK"
    //                     ? "red"
    //                     : record.status_maker === "ANTRI"
    //                     ? "orange"
    //                     : "blue"
    //                 }-500 text-gray-100 text-center`}
    //               >
    //                 {record.status_maker}
    //               </div>
    //             )}
    //           </div>
    //         );
    //       },
    //     },
    //     {
    //       title: "Keterangan",
    //       dataIndex: "keterangan_maker",
    //       key: "keterangan_maker",
    //       width: 300,
    //       onHeaderCell: (text, record) => {
    //         return {
    //           ["style"]: {
    //             background: "#ea580c",
    //             color: "#f3f4f6",
    //             textAlign: "center",
    //           },
    //           className: "example-class-in-td bg-green-500 text-white",
    //         };
    //       },
    //     },
    //     {
    //       title: "Pemeriksa",
    //       dataIndex: "nama_pemeriksa_maker",
    //       key: "nama_pemeriksa_maker",
    //       onHeaderCell: (text, record) => {
    //         return {
    //           ["style"]: {
    //             background: "#ea580c",
    //             color: "#f3f4f6",
    //             textAlign: "center",
    //           },
    //           className: "example-class-in-td bg-green-500 text-white",
    //         };
    //       },
    //     },
    //     {
    //       title: "Tanggal",
    //       dataIndex: "tanggal_maker",
    //       key: "tanggal_maker",
    //       onHeaderCell: (text, record) => {
    //         return {
    //           ["style"]: {
    //             background: "#ea580c",
    //             color: "#f3f4f6",
    //             textAlign: "center",
    //           },
    //           className: "example-class-in-td bg-green-500 text-white",
    //         };
    //       },
    //       render(value, record, index) {
    //         return (
    //           <div>
    //             {record.tanggal_maker &&
    //               moment(record.tanggal_maker).format("DD-MM-YYYY")}
    //           </div>
    //         );
    //       },
    //     },
    //   ],
    // },
    {
      title: "INFORMASI APPROVAL",
      dataIndex: `status_approval`,
      key: "approval",
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
          title: "STATUS",
          dataIndex: "status_approval",
          key: "status_approval",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#4b5563",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="flex justify-center text-xs font-bold italic">
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
        {
          title: "KETERANGAN",
          dataIndex: "keterangan_approval",
          key: "keterangan_approval",
          className: "text-justify",
          width: 300,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#4b5563",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
        },
        {
          title: "PEMERIKSA",
          dataIndex: "nama_pemeriksa_approval",
          key: "nama_pemeriksa_approval",
          className: "text-center",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#4b5563",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_approval",
          key: "tanggal_approval",
          className: "text-center",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#4b5563",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <div>
                {record.tanggal_approval &&
                  moment(record.tanggal_approval).format("DD-MM-YYYY")}
              </div>
            );
          },
        },
      ],
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
            <EditPengajuan
              data={record}
              getData={getData}
              fullCabang={cabang || []}
              fullUser={marketing || []}
              upOpt={up || []}
              refferalOpt={refferal || []}
              provinsi={provinsi || []}
            />
            <button
              onClick={() => {
                setSelected(record);
                setModalHapus(true);
              }}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded shadow"
              disabled={loading ? true : record.status_pencairan === "TRANSFER" ? true : false}
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
      <div className="flex gap-5 my-1 mx-1 flex-wrap">
        <DatePicker
          picker="year"
          onChange={(date, dateString) => setYear(dateString as string)}
        />
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setNameOrNopen(e.target.value)}
        />
        <CetakDataPengajuan data={data || []} />
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          scroll={{ x: "max-content", y: 'calc(65vh - 100px)' }}
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
    </div>
  );
}
