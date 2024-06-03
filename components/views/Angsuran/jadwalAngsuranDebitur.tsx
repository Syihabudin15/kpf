"use client";
import { AngsuranDebitur } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import {
  CheckCircleOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { JadwalAngsuran } from "@prisma/client";
import { Spin, Table, TableProps, message } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CetakExcelAngsuranDebitur = dynamic(
  () => import("@/components/views/Angsuran/CetakExcelAngsuranDebitur"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
const CetakPdfAngsuranDebitur = dynamic(
  () => import("@/components/views/Angsuran/CetakPdfAngsuranDebitur"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function JadwalAngsuranDebitur({id}: {id: string}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AngsuranDebitur>();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/angsuran?id=${id}`);
      const result = await res.json();
      result.data.JadwalAngsuran.sort(
        (a: JadwalAngsuran, b: JadwalAngsuran) => a.angsuran_ke - b.angsuran_ke
      );
      setData(result.data);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  const handleClick = async (id: string) => {
    setLoading(true);
    const res = await fetch(`/api/angsuran`, {
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
  const handleDelete = async (id: string) => {
    setLoading(true);
    const res = await fetch(`/api/angsuran`, {
      method: "DELETE",
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

  const columns: TableProps<JadwalAngsuran>["columns"] = [
    {
      title: "NO",
      dataIndex: "angsuran_ke",
      key: "angsuran_ke",
      width: 50,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
    },
    {
      title: "JADWAL BAYAR",
      dataIndex: "tanggal_bayar",
      key: "tanggal_bayar",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{moment(record.tanggal_bayar).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "ANGSURAN",
      dataIndex: "angsuran",
      key: "angsuran",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.angsuran.toFixed(0))}</>;
      },
    },
    {
      title: "POKOK",
      dataIndex: "pokok",
      key: "pokok",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.pokok.toFixed(0))}</>;
      },
    },
    {
      title: "MARGIN",
      dataIndex: "margin",
      key: "margin",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.margin.toFixed(0))}</>;
      },
    },
    {
      title: "STATUS PEMBAYARAN",
      dataIndex: "status",
      key: "status",
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
          <div className="flex justify-center gap-2 text-xs font-bold italic">
            <div
              className={`py-1 px-5 text-center text-white bg-${
                record.tanggal_pelunasan ? "green" : "red"
              }-500 text-xs`}
            >
              {record.tanggal_pelunasan ? "SUDAH BAYAR" : "BELUM BAYAR"}
            </div>
          </div>
        );
      },
    },
    {
      title: "TANGGAL PEMBAYARAN",
      dataIndex: "tanggal_bayar",
      key: "tanggal_bayar",
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
          <div className="text-center">
            {record.tanggal_pelunasan
              ? moment(record.tanggal_pelunasan).format("DD-MM-YYYY")
              : "-"}
          </div>
        );
      },
    },
    {
      title: "AKSI",
      dataIndex: "id",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      key: "aksi",
      width: 80,
      fixed: "right",
      render(value, record, index) {
        return (
          <div className="flex justify-center gap-2">
            {!record.tanggal_pelunasan && (
              <button
                className="bg-green-500 hover:bg-green-600 text-white rounded shadow py-1 px-2"
                onClick={() => handleClick(record.id)}
              >
                {loading ? <LoadingOutlined /> : <CheckCircleOutlined />}
              </button>
            )}
            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded shadow py-1 px-2"
              onClick={() => handleDelete(record.id)}
            >
              {loading ? <LoadingOutlined /> : <MinusCircleOutlined />}
            </button>
          </div>
        );
      },
    },
  ];
  

  return (
    <Spin spinning={loading}>
      <div>
        <div className="my-1 px-2 flex gap-2 flex-wrap">
          {/* {data  ? <CetakPdfAngsuranDebitur data={data} /> : <LoadingOutlined/>} */}
          {/* {data ? <CetakExcelAngsuranDebitur data={data} /> : <LoadingOutlined/>} */}
        </div>
        <div className="p-2">
          <Table
            dataSource={data?.JadwalAngsuran || []}
            columns={columns}
            size="small"
            loading={loading}
            bordered
            pagination={{ pageSize: 12 }}
            scroll={{ x: 1000, y: 320 }}
          />
        </div>
      </div>
    </Spin>
  );
}
