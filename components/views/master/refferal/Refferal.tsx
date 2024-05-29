"use client";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Refferal } from "@prisma/client";
import {
  Form,
  Input,
  Modal,
  Table,
  TableProps,
  Tooltip,
  notification,
} from "antd";
import { useEffect, useState } from "react";

interface DataType extends Refferal {
  key?: string;
}

export default function RefferalView() {
  const [data, setData] = useState<DataType[]>();
  const [selected, setSelected] = useState<DataType>();
  const [modalTambah, setModalTambah] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalHapus, setModalHapus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleAction = (record: DataType, type: string) => {
    setSelected(record);
    if (type == "hapus") {
      setModalHapus(true);
      form.setFieldsValue({
        id: record.id,
        name: record.name,
      });
    } else {
      setModalEdit(true);
    }
  };
  const handlePost = async (postData: DataType) => {
    const result = await fetch("/api/master/refferal", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(postData),
    });
    const resultMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resultMsg.msg });
    } else {
      notification.error({ message: resultMsg.msg });
    }
    setModalTambah(false);
    await getData();
    setLoading(false);
  };
  const handlePut = async (putData: DataType) => {
    const result = await fetch("/api/master/refferal", {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(putData),
    });
    const resultMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resultMsg.msg });
    } else {
      notification.error({ message: resultMsg.msg });
    }
    setModalEdit(false);
    await getData();
    setLoading(false);
  };
  const handleDelete = async () => {
    const result = await fetch("/api/master/refferal", {
      method: "DELETE",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({
        id: selected?.id,
      }),
    });
    const resultMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resultMsg.msg });
    } else {
      notification.error({ message: resultMsg.msg });
    }
    setModalHapus(false);
    await getData();
    setLoading(false);
  };
  const getData = async () => {
    setLoading(true);
    const res = await fetch("/api/master/refferal");
    const result: Refferal[] = await res.json();
    const resultMap: DataType[] = result.map((e) => {
      return { ...e, key: e.id };
    });
    setData(resultMap);
    setLoading(false);
  };
  useEffect(() => {
    if (!selected) return;
    form.setFieldsValue({
      id: selected.id,
      name: selected.name,
    });
  }, [selected]);
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  const columns: TableProps<DataType>["columns"] = [
    { title: "Nama", dataIndex: "name", key: "name" },
    {
      title: "Aksi",
      dataIndex: "id",
      key: "id",
      render(value, record, index) {
        return (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleAction(record, "edit")}
              className="bg-blue-500 px-2 text-gray-100 rounded hover:bg-blue-600 shadow"
            >
              <Tooltip title="Edit Refferal">{<EditOutlined />}</Tooltip>
            </button>
            <button
              type="button"
              onClick={() => handleAction(record, "hapus")}
              className="bg-red-500 px-2 text-gray-100 rounded hover:bg-red-600 shadow"
            >
              <Tooltip title="Delete Refferal">{<DeleteOutlined />}</Tooltip>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="m-2 block sm:flex sm:gap-5">
        <div className="btn-action-top">
          <button
            className="border bg-green-500 text-gray-50 py-1 px-3 rounded-md hover:bg-green-600 text-xs shadow"
            onClick={() => setModalTambah(true)}
          >
            <UserAddOutlined /> Tambah
          </button>
        </div>
        <div className="pembiayaan">
          <Input.Search placeholder="Cari Nama" />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 200 }}
      />

      {/* Modal Tambah */}
      <Modal
        open={modalTambah}
        onCancel={() => setModalTambah(false)}
        title="Tambah Refferal SIP KPF"
        footer={[]}
      >
        <Form onFinish={handlePost} className="my-5">
          <Form.Item label="Nama Refferal" name={"name"} required>
            <Input required />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <button
              type="submit"
              className="border bg-orange-500 text-gray-50 py-1 px-3 rounded-md hover:bg-orange-600 shadow"
              disabled={loading}
            >
              {loading ? <LoadingOutlined /> : "Simpan"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
      {/* End Modal Tambah */}

      {/* Modal Edit */}
      <Modal
        open={modalEdit}
        onCancel={() => setModalEdit(false)}
        title="Edit Refferal SIP KPF"
        footer={[]}
      >
        <Form
          onFinish={handlePut}
          className="my-5"
          labelCol={{ span: 8 }}
          form={form}
        >
          <Form.Item label="ID" name={"id"} hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Nama Refferal" name={"name"} required>
            <Input required />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <button
              type="submit"
              className="border bg-orange-500 text-gray-50 py-1 px-3 rounded-md hover:bg-orange-600 shadow"
              disabled={loading}
            >
              {loading ? <LoadingOutlined /> : "Simpan"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
      {/* End Modal Edit */}
      {/* Modal Edit */}
      <Modal
        open={modalHapus}
        onCancel={() => setModalHapus(false)}
        title="Konfirmasi Hapus Refferal"
        footer={[]}
      >
        <p>
          Yakin menghapus refferal{" "}
          <span className="text-green-500">{selected && selected.name}</span>?
        </p>
        <div className="flex justify-end mt-5">
          <button
            onClick={() => handleDelete()}
            type="submit"
            className="border bg-orange-500 text-gray-50 py-1 px-3 rounded-md hover:bg-orange-600 shadow"
            disabled={loading}
          >
            {loading ? <LoadingOutlined /> : "YA"}
          </button>
        </div>
      </Modal>
      {/* End Modal Edit */}
    </div>
  );
}
