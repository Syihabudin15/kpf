"use client";

import {
  DataDataPengajuan,
  DataPelunasan,
} from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { FileFilled, LoadingOutlined } from "@ant-design/icons";
import { DatePicker, Input, Table, TableProps } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BerkasOnly = dynamic(() => import("@/components/utils/BerkasOnly"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});
const CetakPelunasan = dynamic(
  () => import("@/components/views/repayment/CetakPelunasan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function Pelunasan() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [data, setData] = useState<DataPelunasan[]>();
  const [total, setTotal] = useState(0);
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<DataPelunasan>();
  const [openModalBerkas, setOpenModalBerkas] = useState(false);
  const [month, setMonth] = useState(
    `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
  );

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/administrasi/pelunasan?page=${page}&pageSize=${pageSize}${
        name ? "&name=" + name : ""
      }${month ? "&month=" + month : ""}`
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
  }, [page, pageSize, name, month]);

  const columns: TableProps<DataPelunasan>["columns"] = [
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
        return <>{(page - 1) * pageSize + (index + 1)}</>;
      },
    },
    {
      title: "STATUS PELUNASAN",
      dataIndex: "status_pelunasan",
      key: "status_pelunasan",
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
          <div className="flex justify-center text-xs italic font-bold text-white">
            <span
              className={`py-1 px-4 bg-${
                record.type === "MENINGGAL_DUNIA"
                  ? "red"
                  : record.type === "TOPUP"
                  ? "green"
                  : "blue"
              }-500`}
            >
              {record.type}
            </span>
          </div>
        );
      },
    },
    {
      title: "AREA PELAYANAN",
      dataIndex: "area_pelayanan",
      key: "area_pelayanan",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      sorter: (a, b) =>
        a.DataPengajuan.User.UnitCabang.UnitPelayanan.name.localeCompare(
          b.DataPengajuan.User.UnitCabang.UnitPelayanan.name
        ),
      render(value, record, index) {
        return <>{record.DataPengajuan.User.UnitCabang.UnitPelayanan.name}</>;
      },
    },
    {
      title: "NOPEN",
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
        return <>{record.DataPengajuan.nopen}</>;
      },
    },
    {
      title: "NO SK",
      dataIndex: "no_sk",
      key: "no_sk",
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
        return <>{record.DataPengajuan.nomor_sk_pensiun}</>;
      },
    },
    {
      title: "NAMA PEMOHON",
      dataIndex: "nama",
      key: "nama",
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
        return <>{record.DataPengajuan.nama}</>;
      },
    },
    {
      title: "NO AKAD",
      dataIndex: "no_akad",
      key: "no_akad",
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
        return <>{record.DataPengajuan.nomor_akad}</>;
      },
    },
    {
      title: "TANGGAL AKAD",
      dataIndex: "tanggal_akad",
      key: "tanggal_akad",
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
            {moment(record.DataPengajuan.tanggal_cetak_akad).format(
              "DD-MM-YYYY"
            )}
          </>
        );
      },
    },
    {
      title: "BERKAS PELUNASAN",
      dataIndex: "berkas",
      key: "berkas",
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
          <div className="flex justify-center">
            <button
              className="py-1 px-2 rounded shadow"
              disabled={
                loading ? loading : record.berkas_pelunasan ? false : true
              }
              style={{ opacity: record.berkas_pelunasan ? 1 : 0.5 }}
              onClick={() => {
                setSelected(record);
                setOpenModalBerkas(true);
              }}
            >
              <FileFilled />
            </button>
          </div>
        );
      },
    },
    {
      title: "TANGGAL PELUNASAN",
      dataIndex: "tanggal_pelunasan",
      key: "tanggal_pelunasan",
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
        return <>{moment(record.tanggal_pelunasan).format("DD-MM-YYYY")}</>;
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
        return <>{record.DataPengajuan.Bank.name}</>;
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
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPengajuan.DataPembiayaan.Produk.name}</>;
      },
    },
    {
      title: "TENOR",
      dataIndex: "tenor",
      key: "tenor",
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
        return <>{record.DataPengajuan.DataPembiayaan.tenor}</>;
      },
    },
    {
      title: "PLAFOND",
      dataIndex: "plafond",
      key: "plafond",
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
            {formatNumber(
              record.DataPengajuan.DataPembiayaan.plafond.toFixed(0)
            )}
          </>
        );
      },
    },
  ];

  return (
    <div>
      <div className="p-0 flex flex-wrap gap-2 mb-1">
        <Input.Search
          placeholder="nama pemohon"
          style={{ width: 170 }}
          onChange={(e) => setName(e.target.value)}
        />
        <DatePicker
          picker="month"
          onChange={(date: any, dateString: any) =>
            setMonth(
              dateString
                ? (dateString as string)
                : `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
            )
          }
        />
        <CetakPelunasan data={data || []} />
      </div>
      <div className="p-0">
        <Table
          bordered
          size="small"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            total: total,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
            defaultPageSize: 20,
          }}
          scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
        />
      </div>

      {selected && (
        <BerkasOnly
          title={`BERKAS PELUNASAN ${selected.DataPengajuan.nama}`}
          type="application/pdf"
          url={selected.berkas_pelunasan || ""}
          open={openModalBerkas}
          setOpen={setOpenModalBerkas}
        />
      )}
    </div>
  );
}
