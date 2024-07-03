"use client";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { DatePicker, Input, Table, TableProps } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ModalBerkas = dynamic(() => import("@/components/utils/ModalBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function PenerimaanBersih() {
  const [nama, setName] = useState<string>();
  const [year, setYear] = useState<string>(moment().format("YYYY-MM"));
  const [page, setPage] = useState(1);
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/ops/penerimaan-bersih?page=${page}${nama ? "&nama=" + nama : ""}${
        year ? "&year=" + year : ""
      }`
    );
    const { data, total } = await res.json();
    setData(
      data.map((d: any, ind: number) => {
        return { ...d, key: ind };
      })
    );
    setTotal(total);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [nama, page, year]);

  const columns: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
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
        const currPage = (page - 1) * 20;
        return <>{currPage + (index + 1)}</>;
      },
    },
    {
      title: "NOMOR SI",
      dataIndex: "no_si",
      key: "no_si",
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
        return <div>{record.DataPencairan.nomor_surat}</div>;
      },
    },
    {
      title: "NO PENSIUN",
      dataIndex: "no",
      key: "nopen",
      fixed: window.innerWidth < 600 ? false : "left",
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
      dataIndex: "nama",
      key: "nama",
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
      title: "NO SK PENSIUN",
      dataIndex: "no_skep",
      key: "no_skep",
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
        return <>{record.nomor_sk_pensiun}</>;
      },
    },
    {
      title: "AREA PELAYANAN",
      dataIndex: "up",
      key: "up",
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
      title: "PLAFOND",
      dataIndex: "plafon",
      key: "plafon",
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
        return <>{formatNumber(record.DataPembiayaan.plafond.toFixed(0))}</>;
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
      render(value, record, index) {
        return <>{record.DataPembiayaan.Produk.name}</>;
      },
    },
    {
      title: "JENIS PEMBIAYAAN",
      dataIndex: "jenis_pembiayaan",
      key: "jenis_pembiayaan",
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
      title: "BERKAS PENERIMAAN BERSIH",
      dataIndex: "berkas_terima_bersih",
      key: "berkas_terima_bersih",
      children: [
        {
          title: "VIEW",
          key: "view",
          dataIndex: "view",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          width: 100,
          render(value, record, index) {
            return (
              <ModalBerkas
                data={{
                  url: record.BerkasPengajuan.berkas_lainnya || "",
                  type: "application/pdf",
                  title: `PENERIMAAN BERSIH ${record.DataPembiayaan.name}`,
                }}
                key={record.id}
              />
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          width: 100,
          dataIndex: "tanggal",
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
                {record.BerkasPengajuan.tanggal_berkas_lainnya &&
                  moment(record.BerkasPengajuan.tanggal_berkas_lainnya).format(
                    "DD-MM-YYYY"
                  )}
              </>
            );
          },
        },
      ],
    },
  ];

  return (
    <div>
      <div className="flex gap-5 my-1 mx-1 flex-wrap">
        <DatePicker
          picker="month"
          onChange={(date, dateString) => setYear(dateString as string)}
        />
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Table
          columns={columns}
          bordered
          size="small"
          scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
          dataSource={data}
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
    </div>
  );
}
