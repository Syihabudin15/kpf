"use client";
import { AngsuranPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import {
  CheckCircleOutlined,
  EyeOutlined,
  LoadingOutlined,
  MinusCircleFilled,
} from "@ant-design/icons";
import { Input, Table, TableProps, Tooltip, message } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

const CetakTunggakan = dynamic(
  () => import("@/components/views/Angsuran/CetakTunggakan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function TuggakanFlash() {
  const [data, setData] = useState<AngsuranPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [name, setName] = useState<string>();

  const columns: TableProps<AngsuranPengajuan>["columns"] = [
    {
      title: "Nama Pemohon",
      key: "nama",
      dataIndex: "nama",
      render(value, record, index) {
        return <>{record.DataPengajuan.DataPembiayaan.name}</>;
      },
    },
    {
      title: "Nopen",
      key: "nopen",
      dataIndex: "nopen",
      render(value, record, index) {
        return <>{record.DataPengajuan.DataPembiayaan.nopen}</>;
      },
    },
    {
      title: "Produk",
      key: "produk",
      dataIndex: "produk",
      render(value, record, index) {
        return <>{record.DataPengajuan.DataPembiayaan.Produk.name}</>;
      },
    },
    {
      title: "Jenis Pembiayaan",
      key: "jenis",
      dataIndex: "jenis",
      render(value, record, index) {
        return (
          <>
            {record.DataPengajuan.DataPembiayaan.jenis_pembiayaan_id
              ? record.DataPengajuan.DataPembiayaan.JenisPembiayaan.name
              : "Sisa Gaji"}
          </>
        );
      },
    },
    {
      title: "Plafon",
      key: "plafon",
      dataIndex: "plafon",
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
    {
      title: "Tenor",
      key: "tenor",
      dataIndex: "tenor",
      render(value, record, index) {
        return <>{record.DataPengajuan.DataPembiayaan.tenor}</>;
      },
    },
    {
      title: "Angsuran Ke",
      dataIndex: "angsuran_ke",
      key: "angsuran_ke",
      width: 100,
      className: "text-center",
    },
    {
      title: "Jadwal Bayar",
      dataIndex: "tanggal_bayar",
      key: "tanggal_bayar",
      render(value, record, index) {
        return <>{moment(record.tanggal_bayar).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "Angsuran",
      dataIndex: "angsuran",
      key: "angsuran",
      render(value, record, index) {
        return <>{formatNumber(record.angsuran.toFixed(0))}</>;
      },
    },
    {
      title: "Sisa Plafon",
      dataIndex: "sisa_plafond",
      key: "sisa_plafond",
      render(value, record, index) {
        return <>{formatNumber(record.sisa.toFixed(0))}</>;
      },
    },
    {
      title: "Status Pembayaran",
      dataIndex: "status",
      key: "status",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
          className: "example-class-in-td bg-green-500 text-white",
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-center">
            {record.tanggal_pelunasan ? (
              <div
                className={`py-1 px-2 text-center text-white bg-green-500 text-xs`}
              >
                SUDAH BAYAR
              </div>
            ) : (
              <div
                className={`py-1 px-2 text-center text-white bg-red-500 text-xs`}
              >
                BELUM BAYAR
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Tanggal Pembayaran",
      dataIndex: "tgl_pembayaran",
      key: "tgl_pembayaran",
      render(value, record, index) {
        return (
          <>
            {record.tanggal_pelunasan &&
              moment(record.tanggal_pelunasan).format("DD-MM-YYYY")}
          </>
        );
      },
    },
    {
      title: "Aksi",
      dataIndex: "id",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      key: "aksi",
      width: 80,
      fixed: "right",
      render(value, record, index) {
        return (
          <div className="flex justify-center gap-2">
            {!record.tanggal_pelunasan ? (
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded shadow"
                onClick={() => handleClick(record.id)}
              >
                <CheckCircleOutlined />
              </button>
            ) : (
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded shadow"
                onClick={() => handleClick(record.id)}
              >
                <MinusCircleFilled />
              </button>
            )}
            <Link href={`/pengajuan/angsuran/${record.dataPengajuanId}`}>
              <Tooltip
                title={`Detail Angsuran ${record.DataPengajuan.DataPembiayaan.name}`}
              >
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow">
                  <EyeOutlined />
                </button>
              </Tooltip>
            </Link>
          </div>
        );
      },
    },
  ];

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/angsuran/tunggakan-flash?page=${page}${name ? "&name=" + name : ""}`
    );
    const { data, total } = await res.json();
    setData(data);
    setTotal(total);
    setLoading(false);
  };

  const handleClick = async (id: string) => {
    setLoading(true);
    const res = await fetch(`/api/angsuran/flash-antri`, {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ id: id }),
    });
    const { msg } = await res.json();
    if (res.ok) {
      message.success(msg);
    } else {
      message.error(msg);
    }
    setLoading(false);
    await getData();
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [page, name]);
  return (
    <div>
      <div className="flex gap-2 my-1 mx-1">
        <Input.Search
          style={{ width: 200 }}
          onChange={(e) => setName(e.target.value)}
        />
        <CetakTunggakan data={data || []} />
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          size="small"
          loading={loading}
          pagination={{
            pageSize: 20,
            total: total,
            onChange(page, pageSize) {
              setPage(page);
            },
          }}
          scroll={{ x: 2000, y:320 }}
        />
      </div>
    </div>
  );
}
