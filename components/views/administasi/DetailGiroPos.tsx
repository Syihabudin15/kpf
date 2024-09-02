"use client";

import {
  BankOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Transaction } from "@prisma/client";
import { DatePicker, Select, Spin, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
const { RangePicker } = DatePicker;

export default function DetailGiroPos({ slug }: { slug: string }) {
  const [bankName, setBankName] = useState<string>();
  const [balance, setBalance] = useState(0);
  const [balanceIn, setBalanceIn] = useState(0);
  const [balanceOut, setBalanceOut] = useState(0);
  const [trxIn, setIn] = useState<Transaction[]>([]);
  const [trxOut, setOut] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch(`/api/administrasi/giro-pos/detail?slug=${slug}`);
    if (!res.ok) {
      setErr(true);
    }
    setErr(false);
    const { data } = await res.json();
    setBankName(data.name);
    setBalance(0);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  const columns: TableProps<Transaction>["columns"] = [
    {
      title: "NO",
      key: "no",
      dataIndex: "no",
    },
    {
      title: "TIPE TRANSAKSI",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "NOMINAL TRANSAKSI",
      key: "nominal",
      dataIndex: "nominal",
    },
    {
      title: "TANGGAL",
      key: "tanggal",
      dataIndex: "tanggal",
    },
    {
      title: "KETERANGAN",
      key: "keterangan",
      dataIndex: "keterangan",
    },
  ];
  return (
    <Spin spinning={loading}>
      {err ? (
        <div className="flex justify-center text-lg text-center italic font-bold text-red-500">
          <p>Error Not Data Found</p>
        </div>
      ) : (
        <div className="bg-white">
          <div className="flex justify-between gap-5">
            <div className="flex-1 bg-blue-500 text-white p-3 rounded shadow">
              <div style={{ fontSize: 100 }} className="flex justify-center">
                <BankOutlined />
              </div>
              <p className="text-4xl font-bold text-center">
                {bankName?.toUpperCase()}
              </p>
            </div>
            <div className="flex-1 bg-blue-500 text-white p-3 rounded shadow">
              <p className="text-lg font-bold italic">SALDO</p>
              <div className="flex gap-3 font-bold" style={{ fontSize: 30 }}>
                <WalletOutlined />
                {loading ? <LoadingOutlined /> : <p>{balance}</p>}
              </div>
            </div>
            <div className="flex-1 bg-green-500 text-white p-3 rounded shadow">
              <p className="text-lg font-bold italic">MASUK</p>
              <div className="flex gap-3 font-bold" style={{ fontSize: 30 }}>
                <WalletOutlined />
                {loading ? <LoadingOutlined /> : <p>{balanceIn}</p>}
              </div>
            </div>
            <div className="flex-1 bg-red-500 text-white p-3 rounded shadow">
              <p className="text-lg font-bold italic">KELUAR</p>
              <div className="flex gap-3 font-bold" style={{ fontSize: 30 }}>
                <WalletOutlined />
                {loading ? <LoadingOutlined /> : <p>{balanceOut}</p>}
              </div>
            </div>
          </div>
          <div className="mt-1">
            <div className="flex gap-2">
              <button className="bg-green-500 hover:bg-green-600 text-white rounded shadow text-xs py-1 px-2">
                <PlusCircleOutlined /> Baru
              </button>
              <RangePicker />
              <Select
                placeholder="TIPE TRANSAKSI"
                options={[
                  { label: "MASUK", value: "MASUK" },
                  { label: "KELUAR", value: "KELUAR" },
                ]}
              />
            </div>
            <div className="mt-1">
              <Table size="small" columns={columns} bordered />
            </div>
          </div>
        </div>
      )}
    </Spin>
  );
}
