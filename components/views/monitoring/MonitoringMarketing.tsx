"use client";
import { FileFilled, LoadingOutlined } from "@ant-design/icons";
import { Input, Table, TableProps, DatePicker } from "antd";
import moment from "moment";
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

export default function MonitoringMarketing() {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<string>();
  const [nameOrNopen, setNameOrNopen] = useState<string>();
  const [total, setTotal] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<DataDataPengajuan>();
  const [open, setOpen] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/monitoring/marketing?page=${page}${
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
        return <>{index + 1}</>;
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
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan.name}</>;
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
      className: "text-center",
      render(value, record, index) {
        return <>{record.Bank.name}</>;
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
          <>{moment(record.DataPembiayaan.created_at).format("DD-MM-YYYY")}</>
        );
      },
    },
    {
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "produk_pembiayaan",
      key: "produk_pembiayaan",
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
      className: "text-center",
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
      title: "INFORMASI SLIK",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: { background: "#22c55e", color: "#f3f4f6" },
          className: "example-class-in-td bg-green-500 text-white",
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
        },
        {
          title: "PEMERIKSA",
          dataIndex: "nama_pemeriksa_slik",
          key: "nama_pemeriksa_slik",
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
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_slik",
          key: "tanggal_slik",
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
              <div className="flex justify-center font-bold text-xs italic">
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
    //           <div className="flex justify-center">
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
    //           <div className="flex justify-center">
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
          className: "text-justify",
        },
        {
          title: "PEMERIKSA",
          dataIndex: "nama_pemeriksa_approval",
          key: "nama_pemeriksa_approval",
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
          className: "text-center",
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_approval",
          key: "tanggal_approval",
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
          className: "text-center",
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
      title: "STATUS PENCAIRAN",
      dataIndex: "status_pencairan",
      key: "status_pencairan",
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
          <div className="flex justify-center text-xs font-bold italic">
            {record.status_pencairan && (
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
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="px-2">
      <div className="flex gap-5 my-1 mx-1">
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
          role="MASTER"
          allowForm={false}
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
  );
}
