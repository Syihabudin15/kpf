"use client";

import { formatNumber } from "@/components/utils/inputUtils";
import { GiroPos } from "@/components/utils/Interfaces";
import {
  BankOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Transaction, TransactionType } from "@prisma/client";
import {
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Table,
  TableProps,
  Tabs,
  Typography,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

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
  const [addModal, setAddModal] = useState(false);
  const [form] = Form.useForm();
  const [transactions, setTransaction] = useState<Transaction[]>([]);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(`/api/administrasi/giro-pos/detail?slug=${slug}`);
    if (!res.ok) {
      setErr(true);
    }
    setErr(false);
    const { data }: { data: GiroPos } = await res.json();
    setTransaction(data.Transaction);
    const transIn = data.Transaction.filter((e) => e.type === "MASUK");
    const transOut = data.Transaction.filter((e) => e.type === "KELUAR");

    let tempBalance = 0;
    let danaIn = 0;
    let danaOut = 0;
    data.Transaction.forEach((e) => {
      if (e.type === "MASUK") {
        tempBalance += e.nominal;
        danaIn += e.nominal;
      } else {
        tempBalance = tempBalance - e.nominal;
        danaOut += e.nominal;
      }
    });

    setBankName(data.name);
    setBalance(tempBalance);
    setIn(transIn);
    setOut(transOut);
    setBalanceIn(danaIn);
    setBalanceOut(danaOut);
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
        return <>{index + 1}</>;
      },
    },
    {
      title: "TIPE TRANSAKSI",
      key: "type",
      dataIndex: "type",
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
          <div
            className={`bg-${
              record.type === "MASUK" ? "green" : "red"
            }-500 py-1 px-1 text-xs font-bold italic text-white`}
          >
            {record.type}
          </div>
        );
      },
    },
    {
      title: "NOMINAL TRANSAKSI",
      key: "nominal",
      dataIndex: "nominal",
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
        return <>{formatNumber(record.nominal.toFixed(0))}</>;
      },
    },
    {
      title: "TANGGAL",
      key: "tanggal",
      dataIndex: "tanggal",
      className: "text-center",

      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 100,
      render(value, record, index) {
        return <>{moment(record.created_at).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "KETERANGAN",
      key: "keterangan",
      dataIndex: "keterangan",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 200,
      render(value, record, index) {
        return (
          <Paragraph
            ellipsis={{
              rows: 2,
              expandable: "collapsible",
            }}
          >
            {record.description}
          </Paragraph>
        );
      },
    },
  ];
  const handleAdd = async () => {
    setLoading(true);
    const valuseForm = form.getFieldsValue();
    const res = await fetch("/api/administrasi/giro-pos/detail", {
      method: "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify(valuseForm),
    });

    const result = await res.json();
    if (!res.ok) {
      return Modal.error({
        title: <span className="text-red-500">We have an error</span>,
        content: <div>{result.msg}</div>,
        closable: true,
        footer: [],
      });
    }
    Modal.success({
      title: <span className="text-green-500">We have an error</span>,
      content: <div>{result.msg}</div>,
      closable: true,
      footer: [],
    });
    setAddModal(false);
    await getData();
    return setLoading(false);
  };
  return (
    <Spin spinning={loading}>
      {err ? (
        <div className="flex justify-center text-lg text-center italic font-bold text-red-500">
          <p>Error Not Data Found</p>
        </div>
      ) : (
        <div>
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
              <p className="text-lg font-bold italic">
                SALDO {bankName?.toUpperCase()}
              </p>
              <div className="flex gap-3 font-bold" style={{ fontSize: 30 }}>
                <WalletOutlined />
                {loading ? (
                  <LoadingOutlined />
                ) : (
                  <p>{formatNumber(balance.toFixed(0))}</p>
                )}
              </div>
            </div>
            <div className="flex-1 bg-green-500 text-white p-3 rounded shadow">
              <p className="text-lg font-bold italic">MASUK</p>
              <div className="flex gap-3 font-bold" style={{ fontSize: 30 }}>
                <WalletOutlined />
                {loading ? (
                  <LoadingOutlined />
                ) : (
                  <p>{formatNumber(balanceIn.toFixed(0))}</p>
                )}
              </div>
            </div>
            <div className="flex-1 bg-red-500 text-white p-3 rounded shadow">
              <p className="text-lg font-bold italic">KELUAR</p>
              <div className="flex gap-3 font-bold" style={{ fontSize: 30 }}>
                <WalletOutlined />
                {loading ? (
                  <LoadingOutlined />
                ) : (
                  <p>{formatNumber(balanceOut.toFixed(0))}</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-1 bg-white p-1">
            <div className="flex gap-2">
              <button
                className="bg-green-500 hover:bg-green-600 text-white rounded shadow text-xs py-1 px-2"
                onClick={() => setAddModal(true)}
              >
                <PlusCircleOutlined /> Baru
              </button>
              <RangePicker />
            </div>
            <div className="mt-1">
              <Tabs
                items={[
                  {
                    label: "SEMUA TRANSAKSI",
                    key: "semua_transaksi",
                    children: (
                      <>
                        <Table
                          columns={columns}
                          size="small"
                          bordered
                          dataSource={transactions}
                        />
                      </>
                    ),
                  },
                  {
                    label: "TRANSAKSI MASUK",
                    key: "transaksi_masuk",
                    children: (
                      <>
                        <Table
                          columns={columns}
                          size="small"
                          bordered
                          dataSource={trxIn}
                        />
                      </>
                    ),
                  },
                  {
                    label: "TRANSAKSI KELUAR",
                    key: "transaksi_keluar",
                    children: (
                      <>
                        <Table
                          columns={columns}
                          size="small"
                          bordered
                          dataSource={trxOut}
                        />
                      </>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      )}
      <Modal
        open={addModal}
        onCancel={() => setAddModal(false)}
        title="Tambah Transaksi"
        footer={[]}
      >
        <Form
          labelCol={{ span: 7 }}
          onFinish={handleAdd}
          className="mt-4"
          form={form}
        >
          <Form.Item
            label="Tipe Transaksi"
            name={"type"}
            rules={[{ required: true }]}
            hasFeedback
          >
            <Select
              options={[
                { label: "MASUK", value: "MASUK" },
                { label: "KELUAR", value: "KELUAR" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Nominal"
            name={"nominal"}
            rules={[{ required: true }]}
          >
            <Input
              onChange={(e) => {
                form.setFieldValue(
                  "nominal",
                  formatNumber(e.target.value || "0")
                );
              }}
            />
          </Form.Item>
          <Form.Item
            label="Keterangan"
            name={"description"}
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            label="Tanggal"
            name={"created_at"}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item hidden label="Slug" name={"slug"}>
            <Input value={slug} />
          </Form.Item>
          <Form.Item className="flex justify-end mt-3">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded shadow"
            >
              Simpan
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
}
