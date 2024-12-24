"use client";

import { formatNumber } from "@/components/utils/inputUtils";
import { Inventaris } from "@prisma/client";
import { DatePicker, Form, Input, Modal, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

const { RangePicker } = DatePicker;

export default function InventarisPage() {
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [data, setData] = useState<Inventaris[]>();
  const [modalTambah, setModalTambah] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState<string>();

  const columns: TableProps<Inventaris>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 50,
      // fixed: window.innerWidth < 600 ? false : "left",
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
      title: "NAMA BARANG",
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
      render(value, record, index) {
        return <>{record.nama}</>;
      },
    },
    {
      title: "KODE BARANG",
      dataIndex: "kode",
      key: "kode",
      width: 100,
      fixed: window.innerWidth < 600 ? false : "left",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.nama}</>;
      },
    },
    {
      title: "Harga",
      dataIndex: "harga",
      key: "harga",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{formatNumber(record.harga.toFixed(0))}</>;
      },
    },
    {
      title: "Jumlah",
      dataIndex: "Jumlah",
      key: "Jumlah",
      width: 100,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.jumlah}</>;
      },
    },
    {
      title: "Tanggal Pembelian",
      dataIndex: "tanggal",
      key: "tanggal",
      width: 100,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{moment(record.tanggal_pembelian).format("DD-MM-YYYY")}</>;
      },
    },
  ];

  const handleSubmit = async (e: any) => {
    setLoading(true);
    const res = await fetch("/api/keuangan/inventaris", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(e),
    });
    if (!res.ok) {
      const { msg } = await res.json();
      Modal.error({
        title: (
          <span className="text-red-500 italic font-bold">
            Internar Server Error
          </span>
        ),
        footer: [],
        children: <>{msg}</>,
        closable: true,
      });
      return setLoading(false);
    }
    setModalTambah(false);
    await getData();
    setLoading(false);
  };
  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/keuangan/inventaris?page=${page}&pageSize=${pageSize}`
    );
    const { data, total } = await res.json();
    setData(data);
    setTotal(total);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      getData();
    })();
  }, [page, pageSize]);

  return (
    <div className="bg-white p-1">
      <div className="flex gap-5 items-center">
        <RangePicker
          onChange={(_, info) => {
            setFrom(info && info[0]);
            setTo(info && info[1]);
          }}
          width={170}
        />
        <Input.Search onChange={(e) => setName(e.target.value)} />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-2 rounded shadow"
          onClick={() => setModalTambah(true)}
        >
          Tambah
        </button>
      </div>
      <div className="my-1">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          bordered
          scroll={{ x: "max-content", y: "calc(61.5vh - 100px)" }}
          size="small"
          pagination={{
            pageSize: pageSize,
            pageSizeOptions: [10, 20, 50, 100, 150, 200],
            total,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </div>
      <Modal
        open={modalTambah}
        onCancel={() => setModalTambah(false)}
        onClose={() => setModalTambah(false)}
        title="Tambah Inventaris"
        footer={[]}
      >
        <Form labelCol={{ span: 7 }} onFinish={(e) => handleSubmit(e)}>
          <Form.Item
            label="Nama Barang"
            name={"nama"}
            required
            rules={[{ required: true, min: 2 }]}
          >
            <Input required />
          </Form.Item>
          <Form.Item label="Kode Barang" name={"kode"}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Harga"
            name={"harga"}
            required
            rules={[{ required: true }]}
          >
            <Input required />
          </Form.Item>
          <Form.Item
            label="Jumlah"
            name={"jumlah"}
            required
            rules={[{ required: true }]}
          >
            <Input type="number" required />
          </Form.Item>
          <Form.Item
            label="Tanggal Pembelian"
            name={"tanggal_pembelian"}
            required
            rules={[{ required: true }]}
          >
            <Input type="date" required />
          </Form.Item>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded shadow"
            >
              Submit
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
