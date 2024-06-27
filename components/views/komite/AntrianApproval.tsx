"use client";
import { FormOutlined, LoadingOutlined } from "@ant-design/icons";
import { Input, Table, TableProps, DatePicker, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DataDataPengajuan } from "@/components/utils/Interfaces";

const ViewBerkasPengajuan = dynamic(
  () => import("@/components/utils/ViewBerkasPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function AntrianApproval() {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<string>();
  const [nameOrNopen, setNameOrNopen] = useState<string>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DataDataPengajuan>();
  const [expand, setExpand] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/antrian/approval?page=${page}${
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
      title: "NAMA PEMOHON",
      dataIndex: "name",
      key: "name",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      fixed: window.innerWidth < 600 ? false : "left",
      render(value, record, index) {
        return <>{record.DataPembiayaan && record.DataPembiayaan.name}</>;
      },
    },
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
      className: "text-center",
      render(value, record, index) {
        return <>{index + 1}</>;
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
      title: "MITRA BANK",
      dataIndex: "mitra_bank",
      key: "mitra_bank",
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
            {record.DataPembiayaan.refferal_id &&
              record.DataPembiayaan.Refferal.name}
          </>
        );
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
      title: "STATUS APPROVAL",
      dataIndex: `status_approval`,
      key: "status_approval",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 150,
      className: "text-center",
      render(value, record, index) {
        return (
          <div className="flex justify-center text-xs font-sans italic">
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
      title: "INFORMASI SLIK",
      dataIndex: `status_slik`,
      key: "slik",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            background: "#22c55e",
            color: "#f3f4f6",
            textAlign: "center",
          },
        };
      },
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
          width: 300,
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
                {record.keterangan_slik}
              </Typography.Paragraph>
            );
          },
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
              <div>{moment(record.tanggal_slik).format("DD-MM-YYYY")}</div>
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
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                background: "#0284c7",
                color: "#f3f4f6",
                textAlign: "center",
              },
            };
          },
          width: 300,
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
                {moment(record.tanggal_verifikasi).format("DD-MM-YYYY")}
              </div>
            );
          },
        },
      ],
    },

    // {
    //   title: "Informasi Data Checker",
    //   dataIndex: `maker`,
    //   key: "cheker",
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
    //       dataIndex: "status_maker",
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
    //       className: "text-center",
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
    //       key: "keterangan_maker",
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
    //       width: 300,
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
    //           <div>{moment(record.tanggal_checker).format("DD-MM-YYYY")}</div>
    //         );
    //       },
    //     },
    //   ],
    // },
    // {
    //   title: "Informasi Data Maker",
    //   dataIndex: `maker`,
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
    //       className: "text-center",
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
    //       width: 300,
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
    //           <div>{moment(record.tanggal_maker).format("DD-MM-YYYY")}</div>
    //         );
    //       },
    //     },
    //   ],
    // },
    {
      title: "PERIKSA",
      dataIndex: "id",
      key: "id",
      fixed: window.innerWidth < 600 ? false : "right",
      width: 80,
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
              className="py-1 px-2 rounded shadow text-white bg-green-500 hover:bg-green-600"
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
          role={"MAKER"}
          allowForm={true}
          isPeriksa={true}
          getData={getData}
          pathname="approval"
          nextpath="transfer"
          open={open}
          setOpen={setOpen}
        />
      )}
    </section>
  );
}
