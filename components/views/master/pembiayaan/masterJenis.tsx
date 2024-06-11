"use client";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  TableProps,
  Tooltip,
  notification,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { formatNumber } from "@/components/utils/inputUtils";
import { JenisPembiayaan } from "@prisma/client";

interface DataType extends JenisPembiayaan {
  key: string;
}

export default function MasterJenis() {
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openHapus, setOpenHapus] = useState(false);
  const [selected, setSelected] = useState<JenisPembiayaan>();
  const [formData] = Form.useForm();
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [name, setName] = useState<string>();
  const [total, setTotal] = useState<number>(0);

  const handlePost = async (postData: JenisPembiayaan) => {
    setLoading(true);
    const result = await fetch("/api/master/pembiayaan", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        name: postData.name,
        by_mutasi: postData.by_mutasi,
      }),
    });
    const resultMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resultMsg.msg });
    } else {
      notification.error({ message: resultMsg.msg });
    }
    setOpenTambah(false);
    await getData();
  };
  const handlePut = async (putData: JenisPembiayaan) => {
    setLoading(true);
    const result = await fetch("/api/master/pembiayaan", {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        id: putData.id,
        name: putData.name,
        by_mutasi: putData.by_mutasi,
      }),
    });
    const resultMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resultMsg.msg });
    } else {
      notification.error({ message: resultMsg.msg });
    }
    setOpenEdit(false);
    await getData();
  };
  const handleDelete = async (id: number | string) => {
    setLoading(true);
    const result = await fetch("/api/master/pembiayaan", {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ id }),
    });
    const resultMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resultMsg.msg });
    } else {
      notification.error({ message: resultMsg.msg });
    }
    setOpenHapus(false);
    await getData();
  };
  const handleAction = (record: DataType, type: string) => {
    setSelected(record);

    if (type === "edit") {
      setOpenEdit(true);
    } else {
      setOpenHapus(true);
    }
  };
  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/master/pembiayaan?page=${page}${name ? "&name=" + name : ""}`
    );
    const { result, total } = await res.json();
    const resultData: DataType[] = result.map((e: DataType) => {
      return {
        ...e,
        key: e.id,
      };
    });
    setTotal(total);
    setData(resultData);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [name, page]);
  useEffect(() => {
    if (!selected) return;
    formData.setFieldsValue({
      id: selected.id,
      name: selected.name,
      by_mutasi: selected.by_mutasi,
    });
  }, [selected]);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "NAMA",
      dataIndex: "name",
      width: 200,
      fixed: window.innerWidth < 600 ? false : "left",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "font-semibold",
    },
    {
      title: "MUTASI (Rp)",
      dataIndex: "by_mutasi",
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
        return <span>{formatNumber(value.toString())}</span>;
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
      fixed: window.innerWidth < 600 ? false : "right",
      width: 100,
      render: (value, record, index) => (
        <div className="flex flex-wrap gap-2 justify-center" key={value}>
          <button
            type="button"
            onClick={() => handleAction(record, "edit")}
            className="bg-blue-500 px-2 text-gray-100 rounded hover:bg-blue-600 shadow"
          >
            <Tooltip title="Edit Jenis Pembiayaan">{<EditOutlined />}</Tooltip>
          </button>
          {/*  */}
          <button
            type="button"
            onClick={() => handleAction(record, "hapus")}
            className="bg-red-500 px-2 text-gray-100 rounded hover:bg-red-600 shadow"
          >
            <Tooltip title="Hapus Jenis Pembiayaan">
              {<DeleteOutlined />}
            </Tooltip>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="m-2 block sm:flex sm:gap-5">
        <div className="btn-action-top">
          <button
            className="border bg-green-500 text-gray-50 py-1 px-3 rounded-md hover:bg-green-600 text-xs shadow"
            onClick={() => setOpenTambah(true)}
          >
            <PlusCircleOutlined /> Tambah
          </button>
        </div>
        <div className="pembiayaan">
          <Input.Search
            placeholder="Cari Nama"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        scroll={{ x: "max-content", y: "calc(50vh - 100px)" }}
        size="small"
        pagination={{
          pageSize: 20,
          total: total,
          onChange(page, pageSize) {
            setPage(page);
          },
        }}
        loading={loading}
      />
      {/* Modal Tambah */}
      <Modal
        open={openTambah}
        onCancel={() => setOpenTambah(false)}
        title="Tambah Jenis Pembiayaan"
        footer={[]}
      >
        <Form onFinish={handlePost} className="my-5" labelCol={{ span: 6 }}>
          <Form.Item label="Nama " name={"name"} required>
            <Input required />
          </Form.Item>
          <Form.Item label="Biaya Mutasi" required name={"by_mutasi"}>
            <InputNumber
              suffix="Rp"
              required
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
              style={{ width: "100%" }}
            />
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

      {/* Edit Modal */}
      <Modal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        title="Edit Jenis Pembiayaan"
        footer={[]}
      >
        <Form
          onFinish={handlePut}
          className="my-5"
          labelCol={{ span: 6 }}
          form={formData}
        >
          <Form.Item label="ID " required name={"id"} hidden>
            <Input required />
          </Form.Item>
          <Form.Item label="Nama" required name={"name"}>
            <Input required />
          </Form.Item>
          <Form.Item label="Biaya Mutasi" required name={"by_mutasi"}>
            <InputNumber
              prefix="Rp"
              required
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
              style={{ width: "100%" }}
            />
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
      {/* End Edit Modal */}

      {/* Hapus Modal */}
      <Modal
        open={openHapus}
        onCancel={() => setOpenHapus(false)}
        title="Konfirmasi Hapus Jenis Pembiayaan"
        footer={[]}
      >
        <p>
          Yakin hapus jenis pembiayaan{" "}
          <span className="text-green-500">{selected && selected.name}</span> ?
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => handleDelete(selected ? selected.id : "")}
            type="button"
            className="border bg-orange-500 text-gray-50 py-1 px-3 rounded-md hover:bg-orange-600 shadow"
            disabled={loading}
          >
            {loading ? <LoadingOutlined /> : "Ya"}
          </button>
        </div>
      </Modal>
      {/* end Hapus Modal */}
    </div>
  );
}
