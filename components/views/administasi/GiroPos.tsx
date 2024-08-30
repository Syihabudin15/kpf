"use client";

import { GiroPos } from "@/components/utils/Interfaces";
import { EyeOutlined, FormOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  TableProps,
  Typography,
} from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

export default function GiroPost() {
  const [data, setData] = useState<GiroPos[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const handleAdd = async (e: { name: string; description: string }) => {
    setLoading(true);
    const res = await fetch("/api/administrasi/giro-pos", {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify({ ...e, slug: e.name.toLowerCase() }),
    });
    const result = await res.json();
    if (!res.ok) {
      Modal.error({
        title: <span className="text-red-500">Error</span>,
        content: (
          <div>
            <p>{result.msg}</p>
            <p>Code: {res.status}</p>
          </div>
        ),
      });
    } else {
      Modal.success({
        title: <span className="text-green-500">Berhasil</span>,
        content: (
          <div>
            <p>{result.msg}</p>
          </div>
        ),
      });
    }
    await getData();
    setLoading(false);
  };

  const getData = async () => {
    setLoading(true);
    const res = await fetch(`/api/administrasi/giro-pos`);
    const { data } = await res.json();
    setData(data);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      // setInterval(async () => {
      await getData();
      // }, 120000);
    })();
  }, []);
  const columns: TableProps<GiroPos>["columns"] = [
    {
      title: "NO",
      key: "NO",
      dataIndex: "NO",
      width: 50,
      className: "text-center",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{index + 1}</>;
      },
    },
    {
      title: "NAMA GIRO",
      key: "NAMA",
      dataIndex: "NAMA",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.name}</>;
      },
    },
    {
      title: "BALANCE",
      key: "balance",
      dataIndex: "balance",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.balance}</>;
      },
    },

    {
      title: "KETERANGAN",
      key: "keterangan",
      dataIndex: "keterangan",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
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
    {
      title: "AKSI",
      key: "detail",
      dataIndex: "detail",
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
          <div className="flex justify-center gap-2">
            <button
              title="Edit data"
              className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded shadow"
            >
              <FormOutlined />
            </button>
            <Link href={`/laporan-administrasi/bank/${record.slug}`}>
              <button
                title="Lihat detail"
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow"
              >
                <EyeOutlined />
              </button>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="mb-1">
        <button
          className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded shadow"
          onClick={() => setAddModal(true)}
        >
          <PlusOutlined /> Baru
        </button>
      </div>
      <Table
        columns={columns}
        loading={loading}
        dataSource={data}
        bordered
        scroll={{ x: "max-content", y: "calc(61.5vh - 100px)" }}
        size="small"
      />
      <Modal
        open={addModal}
        onCancel={() => setAddModal(false)}
        title={"Tambah Giro Baru"}
        footer={[]}
      >
        <Form labelCol={{ span: 5 }} onFinish={handleAdd}>
          <Form.Item label="Nama" name={"name"} required>
            <Input placeholder="place a name" required />
          </Form.Item>
          <Form.Item label="Keterangan" name={"description"} required>
            <Input.TextArea
              placeholder="place a description about giro name"
              required
            />
          </Form.Item>
          <div className="flex justify-end gap-5">
            <Button htmlType="button" onClick={() => setAddModal(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              OK
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
