"use client";
import { FormOutlined, LoadingOutlined } from "@ant-design/icons";
import { Input, Table, TableProps, DatePicker } from "antd";
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

export default function AntrianVerifikasi() {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<string>();
  const [nameOrNopen, setNameOrNopen] = useState<string>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DataDataPengajuan>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/antrian/verifikasi?page=${page}${
        nameOrNopen ? "&name=" + nameOrNopen : ""
      }${year ? "&year=" + year : ""}`
    );
    const { data, total } = await res.json();
    setData(data);
    setTotal(total);
    // }
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
      title: "SUMBER DANA",
      dataIndex: "sumber_dana",
      key: "sumber_data",
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
            {record.DataPembiayaan.Produk.Bank &&
              record.DataPembiayaan.Produk.Bank.name}
          </>
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
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan && record.DataPembiayaan.name}</>;
      },
    },
    {
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "data_pembiayaan_id",
      key: "data_pembiayaan_id",
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
      title: "JENIS PEMBIAYAAN",
      dataIndex: "data_pembiayaan_id",
      key: "data_pembiayaan_id",
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
            {record.DataPembiayaan.JenisPembiayaan
              ? record.DataPembiayaan.JenisPembiayaan.name
              : "Sisa Gaji"}
          </>
        );
      },
    },
    {
      title: "STATUS VERIFIKASI",
      dataIndex: `status_verifikasi`,
      key: "status_verifikasi",
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
    // {
    //   title: "Informasi Data Slik",
    //   dataIndex: `status_slik`,
    //   key: "slik",
    //   onHeaderCell: (text, record) => {
    //     return {
    //       ["style"]: {
    //         background: "#22c55e",
    //         color: "#f3f4f6",
    //         textAlign: "center",
    //       },
    //       className: "example-class-in-td bg-green-500 text-white",
    //     };
    //   },
    //   children: [
    //     {
    //       title: "Status",
    //       dataIndex: "status_slik",
    //       key: "status_slik",
    //       className: "text-center",
    //       onHeaderCell: (text, record) => {
    //         return {
    //           ["style"]: {
    //             background: "#22c55e",
    //             color: "#f3f4f6",
    //             textAlign: "center",
    //           },
    //           className: "example-class-in-td bg-green-500 text-white",
    //         };
    //       },
    //       render(value, record, index) {
    //         return (
    //           <div className="flex justify-center">
    //             {record.status_slik && (
    //               <div
    //                 className={`py-1 px-2 w-24 bg-${
    //                   record.status_slik === "SETUJU"
    //                     ? "green"
    //                     : record.status_slik === "DITOLAK"
    //                     ? "red"
    //                     : record.status_slik === "ANTRI"
    //                     ? "orange"
    //                     : "blue"
    //                 }-500 text-gray-100 text-center`}
    //               >
    //                 {record.status_slik}
    //               </div>
    //             )}
    //           </div>
    //         );
    //       },
    //     },
    //     {
    //       title: "Keterangan",
    //       dataIndex: "keterangan_slik",
    //       key: "keterangan_slik",
    //       onHeaderCell: (text, record) => {
    //         return {
    //           ["style"]: {
    //             background: "#22c55e",
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
    //       dataIndex: "nama_pemeriksa_slik",
    //       key: "nama_pemeriksa_slik",
    //       onHeaderCell: (text, record) => {
    //         return {
    //           ["style"]: {
    //             background: "#22c55e",
    //             color: "#f3f4f6",
    //             textAlign: "center",
    //           },
    //           className: "example-class-in-td bg-green-500 text-white",
    //         };
    //       },
    //     },
    //     {
    //       title: "Tanggal",
    //       dataIndex: "tanggal_slik",
    //       key: "tanggal_slik",
    //       onHeaderCell: (text, record) => {
    //         return {
    //           ["style"]: {
    //             background: "#22c55e",
    //             color: "#f3f4f6",
    //             textAlign: "center",
    //           },
    //           className: "example-class-in-td bg-green-500 text-white",
    //         };
    //       },
    //       render(value, record, index) {
    //         return (
    //           <div>
    //             {record.tanggal_slik &&
    //               moment(record.tanggal_slik).format("DD-MM-YYYY")}
    //           </div>
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

      <Table
        columns={columns}
        dataSource={data}
        bordered
        scroll={{ x: 1200, y: "calc(65vh - 100px)" }}
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
      {selected && (
        <ViewBerkasPengajuan
          data={selected}
          getData={getData}
          role={"VERIFIKASI"}
          allowForm={true}
          isPeriksa={true}
          pathname="verifikasi"
          nextpath="slik"
          open={open}
          setOpen={setOpen}
        />
      )}
    </section>
  );
}
