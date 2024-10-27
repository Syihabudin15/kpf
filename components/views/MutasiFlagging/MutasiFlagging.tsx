"use client";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { LoadingOutlined } from "@ant-design/icons";
import { Select, Table, TableProps } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CetakMutasiFlagging from "./CetakMutasiFlagging";

const ModalBerkas = dynamic(() => import("@/components/utils/ModalBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

const ModalMutasiFlagging = dynamic(() => import("./ModalMutasiFlagging"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function MutasiFlagging() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState<string>();
  const [data, setData] = useState<DataDataPengajuan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number>();
  const [selectedOptNested, setSelectedOptNested] = useState<string>();

  const optionsFilter = [
    { label: "Mutasi", value: 300 },
    { label: "Flagging", value: 100 },
  ];
  const optionsFilterNested = [
    { label: "Belum Proses", value: "BELUM_PROSESS" },
    { label: "Proses", value: "PROSESS" },
    { label: "Selesai", value: "SELESAI" },
    { label: "Gagal", value: "GAGAL" },
  ];

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/mutasi-flagging?page=${page || 1}&pageSize=${pageSize || 20}${
        name ? "&name=" + name : ""
      }`
    );
    const { data, total } = await res.json();

    let tempData: DataDataPengajuan[] = data;

    if (selectedOpt) {
      if (selectedOpt === 100) {
        tempData = tempData.filter(
          (e) =>
            !e.DataPembiayaan.jenis_pembiayaan_id ||
            (e.DataPembiayaan.JenisPembiayaan &&
              e.DataPembiayaan.JenisPembiayaan.by_mutasi === 0)
        );
      } else {
        tempData = tempData.filter(
          (e) =>
            e.DataPembiayaan.jenis_pembiayaan_id &&
            e.DataPembiayaan.JenisPembiayaan.by_mutasi !== 0
        );
      }
      if (selectedOptNested) {
        tempData = tempData.filter(
          (e) =>
            e.BerkasPengajuan.status_mutasi === selectedOptNested ||
            e.BerkasPengajuan.status_flagging === selectedOptNested
        );
      }
    }
    setTotal(total);
    setData(tempData);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [selectedOpt, selectedOptNested, page, pageSize]);

  const columns: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "NO",
      key: "no",
      dataIndex: "no",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 50,
      className: "text-center",
      render(value, record, index) {
        const skip = (page - 1) * pageSize;
        return <>{skip + (index + 1)}</>;
      },
    },
    {
      title: "NOPEN",
      key: "nopen",
      dataIndex: "nopen",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 200,
      className: "text-center",
      render(value, record, index) {
        return <>{record.nopen}</>;
      },
    },
    {
      title: "NAMA",
      key: "nama",
      dataIndex: "nama",
      fixed: window.innerWidth < 600 ? false : "left",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 200,
      className: "text-center",
      render(value, record, index) {
        return <>{record.nama}</>;
      },
    },
    {
      title: "AREA",
      key: "area",
      dataIndex: "area",
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
          <>
            {record.User.UnitCabang
              ? record.User.UnitCabang.UnitPelayanan.name
              : "PUSAT"}
          </>
        );
      },
    },
    {
      title: "MARKETING/SPV",
      key: "marketing",
      dataIndex: "marketing",
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
        return <>{`${record.User.first_name} ${record.User.last_name}`}</>;
      },
    },
    {
      title: "PRODUK",
      key: "produk",
      dataIndex: "produk",
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
        return <>{record.DataPembiayaan.Produk.name}</>;
      },
    },
    {
      title: "Jenis Pembiayaan",
      key: "jenis",
      dataIndex: "jenis",
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
          <>
            {record.DataPembiayaan.jenis_pembiayaan_id
              ? record.DataPembiayaan.JenisPembiayaan.name
              : "Sisa Gaji"}
          </>
        );
      },
    },
    {
      title: "MUTASI",
      key: "mutasi",
      dataIndex: "mutasi",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      children: [
        {
          title: "STATUS",
          key: "status",
          dataIndex: "status",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          width: 150,
          render(value, record, index) {
            return (
              <div
                className={`text-white ${
                  record.DataPembiayaan.jenis_pembiayaan_id &&
                  record.DataPembiayaan.JenisPembiayaan.by_mutasi > 0
                    ? "flex"
                    : "hidden"
                } justify-center`}
              >
                {record.BerkasPengajuan.status_mutasi === "SELESAI" ? (
                  <div className="text-xs italic font-bold px-3 py-1 bg-green-500 w-28">
                    SELESAI
                  </div>
                ) : record.BerkasPengajuan.status_mutasi === "PROSESS" ? (
                  <div className="text-xs italic font-bold px-3 py-1 bg-blue-500 w-28">
                    PROSES
                  </div>
                ) : record.BerkasPengajuan.status_mutasi === "GAGAL" ? (
                  <div className="text-xs italic font-bold px-3 py-1 bg-red-500 w-28">
                    GAGAL
                  </div>
                ) : (
                  <div className="text-xs italic font-bold px-3 py-1 bg-orange-500 w-28">
                    BELUM PROSES
                  </div>
                )}
              </div>
            );
          },
        },
        {
          title: "BERKAS",
          key: "berkas_mutasi",
          dataIndex: "berkas_mutasi",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          width: 80,
          render(value, record, index) {
            return (
              <ModalBerkas
                data={{
                  url: record.BerkasPengajuan.mutasi || "",
                  type: "application/pdf",
                  title: `BERKAS MUTASI ${record.DataPembiayaan.name}`,
                }}
                key={"berkas_mutasi" + record.id}
              />
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal_mutasi",
          dataIndex: "tanggal_mutasi",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          width: 100,
          render(value, record, index) {
            return (
              <>
                {record.BerkasPengajuan.tanggal_mutasi
                  ? moment(record.BerkasPengajuan.tanggal_mutasi).format(
                      "DD-MM-YYYY"
                    )
                  : "-"}
              </>
            );
          },
        },
      ],
    },
    {
      title: "FLAGGING",
      key: "flagging",
      dataIndex: "flagging",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      children: [
        {
          title: "STATUS",
          key: "status",
          dataIndex: "status",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          width: 150,
          render(value, record, index) {
            return (
              <div className="text-white flex justify-center">
                {record.BerkasPengajuan.status_flagging === "SELESAI" ? (
                  <div className="text-xs italic font-bold px-3 py-1 bg-green-500 w-28">
                    SELESAI
                  </div>
                ) : record.BerkasPengajuan.status_flagging === "PROSESS" ? (
                  <div className="text-xs italic font-bold px-3 py-1 bg-blue-500 w-28">
                    PROSES
                  </div>
                ) : record.BerkasPengajuan.status_flagging === "GAGAL" ? (
                  <div className="text-xs italic font-bold px-3 py-1 bg-red-500 w-28">
                    GAGAL
                  </div>
                ) : (
                  <div className="text-xs italic font-bold px-3 py-1 bg-orange-500 w-28">
                    BELUM PROSES
                  </div>
                )}
              </div>
            );
          },
        },
        {
          title: "BERKAS",
          key: "berkas_flagging",
          dataIndex: "berkas_flagging",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          width: 80,
          render(value, record, index) {
            return (
              <ModalBerkas
                data={{
                  url: record.BerkasPengajuan.flagging || "",
                  type: "application/pdf",
                  title: `BERKAS FLAGGING ${record.DataPembiayaan.name}`,
                }}
                key={"berkas_flagging" + record.id}
              />
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal_flagging",
          dataIndex: "tanggal_flagging",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          width: 100,
          render(value, record, index) {
            return (
              <>
                {record.BerkasPengajuan.tanggal_flagging
                  ? moment(record.BerkasPengajuan.tanggal_flagging).format(
                      "DD-MM-YYYY"
                    )
                  : "-"}
              </>
            );
          },
        },
      ],
    },
    {
      title: "AKSI",
      key: "aksi",
      dataIndex: "aksi",
      fixed: window.innerWidth < 600 ? false : "right",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      width: 80,
      render(value, record, index) {
        return (
          <div key={record.id}>
            <ModalMutasiFlagging data={record} getData={getData} />
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="flex gap-3 py-1">
        <Select
          placeholder="Semua"
          size="small"
          options={optionsFilter}
          allowClear
          showSearch
          style={{ width: 120 }}
          onChange={(e) => setSelectedOpt(e)}
        />
        <div className={`${selectedOpt ? "" : "hidden"}`}>
          <Select
            placeholder="Semua"
            size="small"
            style={{ width: 120 }}
            options={optionsFilterNested}
            allowClear
            showSearch
            onChange={(e) => setSelectedOptNested(e)}
          />
        </div>
        <CetakMutasiFlagging data={data} />
      </div>
      <Table
        columns={columns}
        bordered
        size="small"
        scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
        loading={loading}
        dataSource={data}
        pagination={{
          pageSize: pageSize,
          total: total,
          onChange(page, pageSize) {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
}
