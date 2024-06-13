"use client";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { FileFilled, LoadingOutlined } from "@ant-design/icons";
import { Input, Table, TableProps } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CetakBerkas from "./CetakBerkas";
import moment from "moment";

const ViewBerkasPengajuan = dynamic(
  () => import("@/components/utils/ViewBerkasPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
const ModalBerkas = dynamic(() => import("@/components/utils/ModalBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function CariBerkasPembiayaan() {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [name, setName] = useState<string>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DataDataPengajuan>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/pemberkasan/cari-berkas?page=${page}${name ? "&name=" + name : ""}`
    );
    const { data, total } = await res.json();
    setData(
      data.map((d: DataDataPengajuan) => {
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
  }, [page, name]);

  const columns: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "NO",
      key: "no",
      width: 50,
      dataIndex: "no",
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
      title: "AREA PELAYANAN",
      key: "up",
      dataIndex: "up",
      sorter: (a, b) =>
        a.User.UnitCabang.UnitPelayanan.name
          .toString()
          .localeCompare(b.User.UnitCabang.UnitPelayanan.name.toString()),
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
        return <>{record.User.UnitCabang.UnitPelayanan.name}</>;
      },
    },
    {
      title: "TANGGAL PENCAIRAN",
      key: "tanggal_pencairan",
      width: 150,
      dataIndex: "tanggal_pencairan",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      sorter: (a, b) =>
        (a.tanggal_pencairan || new Date())
          .toString()
          .localeCompare((b.tanggal_pencairan || new Date()).toString()),
      render(value, record, index) {
        return (
          <>
            {record.tanggal_pencairan &&
              moment(record.tanggal_pencairan).format("DD-MM-YYYY")}
          </>
        );
      },
    },
    {
      title: "NO PENSIUN",
      key: "nopen",
      dataIndex: "nopen",
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
      key: "name",
      dataIndex: "name",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      fixed: window.innerWidth < 600 ? false : "left",
      render(value, record, index) {
        return <>{record.DataPembiayaan.name}</>;
      },
    },
    {
      title: "SUMBER DANA",
      key: "sumber_dana",
      width: 200,
      sorter: (a, b) =>
        a.Bank.name.toString().localeCompare(b.Bank.name.toString()),
      dataIndex: "sumber_dana",
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
      title: "NOMOR AKAD",
      key: "no_akad",
      width: 200,
      dataIndex: "no_akad",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.nomor_akad}</>;
      },
    },
    {
      title: "TENOR",
      key: "tenor",
      width: 100,
      dataIndex: "tenor",
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
      key: "plafon",
      width: 150,
      dataIndex: "plafon",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.plafond.toFixed(0))}</>;
      },
    },
    {
      title: "PRODUK PEMBIAYAAN",
      key: "produk",
      width: 150,
      dataIndex: "produk",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.DataPembiayaan.Produk.name}</>;
      },
    },
    {
      title: "JENIS PEMBIAYAAN",
      key: "jenis",
      dataIndex: "jenis",
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
            {record.DataPembiayaan.jenis_pembiayaan_id
              ? record.DataPembiayaan.JenisPembiayaan.name
              : "Sisa Gaji"}
          </>
        );
      },
    },
    {
      title: "VIEW BERKAS",
      dataIndex: "berkas",
      key: "berkas",
      children: [
        {
          title: "PENGAJUAN",
          key: "pengajuan",
          width: 100,
          dataIndex: "pengajuan",
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
                  className="py-1 px-2 border rounded shadow"
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
          title: "AKAD",
          key: "akad",
          dataIndex: "akad",
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
              <ModalBerkas
                data={{
                  url: record.BerkasPengajuan.berkas_akad || "",
                  type: "application/pdf",
                  title: "VIEW AKAD",
                }}
              />
            );
          },
        },
        {
          title: "PELUNASAN",
          key: "pelunasan",
          width: 100,
          dataIndex: "pelunasan",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <ModalBerkas
                data={{
                  url: record.BerkasPengajuan.pelunasan || "",
                  type: "application/pdf",
                  title: "VIEW PELUNASAN",
                }}
              />
            );
          },
        },
        {
          title: "JAMINAN",
          key: "jaminan",
          width: 100,
          dataIndex: "jaminan",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <ModalBerkas
                data={{
                  url: record.BerkasPengajuan.jaminan || "",
                  type: "application/pdf",
                  title: "VIEW JAMINAN",
                }}
              />
            );
          },
        },
        {
          title: "BUKU REKEKNIG",
          key: "rekening",
          width: 100,
          dataIndex: "rekening",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <ModalBerkas
                data={{
                  url: record.BerkasPengajuan.rekening || "",
                  type: "application/pdf",
                  title: "VIEW REKENING",
                }}
              />
            );
          },
        },
        {
          title: "MUTASI",
          key: "mutasi",
          width: 100,
          dataIndex: "mutasi",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <ModalBerkas
                data={{
                  url: record.BerkasPengajuan.mutasi || "",
                  type: "application/pdf",
                  title: "VIEW MUTASI",
                }}
              />
            );
          },
        },
        {
          title: "FLAGGING",
          key: "flagging",
          width: 100,
          dataIndex: "flagging",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <ModalBerkas
                data={{
                  url: record.BerkasPengajuan.flagging || "",
                  type: "application/pdf",
                  title: "VIEW FLAGGING",
                }}
              />
            );
          },
        },
      ],
    },
    {
      title: "STATUS JAMINAN",
      key: "status_jaminan",
      width: 150,
      dataIndex: "status_jaminan",
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
          <div className="flex justify-center text-white text-xs font-bold italic">
            <div
              className={`py-1 px-4 bg-${
                record.BerkasPengajuan.jaminan ? "green" : "red"
              }-500 text-center text-xs w-24`}
            >
              {record.BerkasPengajuan.jaminan ? "SUCCESS" : "TBO"}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex gap-5 my-1 mx-1">
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setName(e.target.value)}
        />
        <CetakBerkas data={data || []} />
      </div>
      <div className="p-2">
        <Table
          columns={columns}
          dataSource={data}
          bordered
          loading={loading}
          size="small"
          scroll={{ x: "max-content", y: "calc(65vh - 100px)" }}
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
          role="PEMBERKASAN"
          allowForm={false}
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
  );
}
