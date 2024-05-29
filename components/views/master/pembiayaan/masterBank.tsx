"use client";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
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
import {
  formatNumber,
  inputTextToDecimal,
} from "@/components/utils/inputUtils";
import { Bank } from "@prisma/client";

interface DataType extends Bank {
  key: string;
}

export default function MasterBank() {
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openHapus, setOpenHapus] = useState(false);
  const [selected, setSelected] = useState<DataType>();
  const [formData] = Form.useForm();
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const handleAction = (record: DataType, type: string) => {
    setSelected(record);

    if (type === "edit") {
      setOpenEdit(true);
    } else {
      setOpenHapus(true);
    }
  };

  const handlePost = async (postData: DataType) => {
    setLoading(true);
    const result = await fetch("/api/master/bank", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        name: postData.name,
        by_admin: parseFloat(postData.by_admin.toString()),
        by_tatalaksana: postData.by_tatalaksana,
        by_materai: postData.by_materai,
        by_buka_rekening: postData.by_buka_rekening,
        by_flagging: postData.by_flagging,
        by_epotpen: postData.by_epotpen,
        by_angsuran: parseFloat(postData.by_angsuran.toString()),
        by_admin_bank: parseFloat((postData.by_admin_bank || 0).toString()),
        by_lainnya: parseFloat((postData.by_lainnya || 0).toString()),
        by_provisi: postData.by_provisi,
        margin_bank: parseFloat((postData.margin_bank || 0).toString()),
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
  const handlePut = async (putData: DataType) => {
    setLoading(true);
    const result = await fetch("/api/master/bank", {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        id: putData.id,
        name: putData.name,
        by_admin: parseFloat(putData.by_admin.toString()),
        by_tatalaksana: putData.by_tatalaksana,
        by_materai: putData.by_materai,
        by_buka_rekening: putData.by_buka_rekening,
        by_flagging: putData.by_flagging,
        by_epotpen: putData.by_epotpen,
        by_angsuran: parseFloat(putData.by_angsuran.toString()),
        by_admin_bank: parseFloat((putData.by_admin_bank || 0).toString()),
        by_lainnya: parseFloat((putData.by_lainnya || 0).toString()),
        by_provisi: putData.by_provisi || 0,
        margin_bank: parseFloat((putData.margin_bank || 0).toString()),
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
  const handleDelete = async (id: string | number) => {
    setLoading(true);
    const result = await fetch("/api/master/bank", {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ id: id }),
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
  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/master/bank?page=${page}${name ? "&name=" + name : ""}`
    );
    const { result, total } = await res.json();
    const results: DataType[] = result.map((e: DataType) => {
      return {
        ...e,
        key: e.id,
      };
    });
    setTotal(total);
    setData(results);
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
      by_admin: selected.by_admin,
      by_tatalaksana: selected.by_tatalaksana,
      by_materai: selected.by_materai,
      by_buka_rekening: selected.by_buka_rekening,
      by_flagging: selected.by_flagging,
      by_epotpen: selected.by_epotpen,
      by_angsuran: selected.by_angsuran,
      by_admin_bank: selected.by_admin_bank,
      by_provisi: selected.by_provisi || 0,
      by_lainnya: selected.by_lainnya,
      margin_bank: selected.margin_bank,
      is_syariah: selected.is_syariah,
    });
  }, [selected]);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Nama Bank",
      dataIndex: "name",
      className: "font-semibold",
      width: 250,
    },
    { title: "Biaya Admin (%)", dataIndex: "by_admin" },
    { title: "Biaya Admin Bank (%)", dataIndex: "by_admin_bank" },
    { title: "Biaya Cadangan (%)", dataIndex: "by_lainnya" },
    {
      title: "Biaya Tatalaksana (Rp)",
      dataIndex: "by_tatalaksana",
      render(value, record, index) {
        return <span>{formatNumber(value.toString())}</span>;
      },
    },
    {
      title: "Biaya Materai (Rp)",
      dataIndex: "by_materai",
      render(value, record, index) {
        return <span>{formatNumber(value.toString())}</span>;
      },
    },
    {
      title: "Biaya Buka rekening (Rp)",
      dataIndex: "by_buka_rekening",
      render(value, record, index) {
        return <span>{formatNumber(value.toString())}</span>;
      },
    },
    {
      title: "Biaya Flagging",
      dataIndex: "by_flagging",
      render(value, record, index) {
        return <>{formatNumber(record.by_flagging.toString())}</>;
      },
    },
    {
      title: "Biaya Epotpen",
      dataIndex: "by_epotpen",
      render(value, record, index) {
        return <>{formatNumber(record.by_epotpen.toString())}</>;
      },
    },
    {
      title: "Biaya Provisi",
      dataIndex: "by_provisi",
      render(value, record, index) {
        return <>{formatNumber((record.by_provisi || 0).toString())}</>;
      },
    },
    { title: "Sisa Gaji (%)", dataIndex: "by_angsuran" },
    { title: "Margin Bank (%)", dataIndex: "margin_bank" },
    {
      title: "Syariah",
      dataIndex: "is_syariah",
      width: 80,
      render(value, record, index) {
        return <>{record.is_syariah ? "YA" : "TIDAK"}</>;
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      fixed: "right",
      width: 100,
      render: (value, record, index) => (
        <div className="flex flex-wrap gap-2" key={value}>
          <button
            type="button"
            onClick={() => handleAction(record, "edit")}
            className="bg-blue-500 px-2 text-gray-100 rounded hover:bg-blue-600 shadow"
          >
            <Tooltip title="Edit Bank">{<EditOutlined />}</Tooltip>
          </button>
          {/*  */}
          <button
            type="button"
            onClick={() => handleAction(record, "hapus")}
            className="bg-red-500 px-2 text-gray-100 rounded hover:bg-red-600 shadow"
          >
            <Tooltip title="Hapus Bank">{<DeleteOutlined />}</Tooltip>
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
        scroll={{ x: 2500 }}
        size="middle"
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
        title="Tambah Bank Pembiayaan"
        wrapClassName="modal-create"
        width={"100%"}
        footer={[]}
      >
        <Form onFinish={handlePost} className="my-5" labelCol={{ span: 8 }}>
          <div className="block md:flex">
            <div className="flex-1">
              <Form.Item label="Nama" required name={"name"}>
                <Input required />
              </Form.Item>
              <Form.Item label="Biaya Administrasi" required name={"by_admin"}>
                <Input suffix="%" required type="number" />
              </Form.Item>
              <Form.Item
                label="Biaya Admin Bank"
                required
                name={"by_admin_bank"}
              >
                <Input suffix="%" required type="number" />
              </Form.Item>
              <Form.Item label="Biaya Cadangan" required name={"by_lainnya"}>
                <Input suffix="%" required type="number" />
              </Form.Item>
              <Form.Item
                label="Biaya Tatalaksana"
                required
                name={"by_tatalaksana"}
              >
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
              <Form.Item label="Biaya Materai" required name={"by_materai"}>
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
              <Form.Item
                label="Biaya Buka Rekening"
                required
                name={"by_buka_rekening"}
              >
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
            </div>
            <div className="flex-1">
              <Form.Item label="Biaya Flagging" required name={"by_flagging"}>
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
              <Form.Item label="Biaya Epotpen" required name={"by_epotpen"}>
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
              <Form.Item label="Biaya Provisi" required name={"by_provisi"}>
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
              <Form.Item label="Sisa Gaji" required name={"by_angsuran"}>
                <Input suffix="%" required />
              </Form.Item>
              <Form.Item label="Margin Bank" required name={"margin_bank"}>
                <Input suffix="%" required />
              </Form.Item>
              {/* <Form.Item label="Bank Syariah" required name={"is_syariah"}>
                <Select
                  options={[
                    { label: "YA", value: true },
                    { label: "TIDAK", value: false },
                  ]}
                />
              </Form.Item> */}
            </div>
          </div>
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
        title="Edit Bank Pembiayaan"
        wrapClassName="modal-create"
        width={"100%"}
        footer={[]}
      >
        <Form
          onFinish={handlePut}
          className="my-5"
          labelCol={{ span: 8 }}
          form={formData}
        >
          <div className="block md:flex">
            <div className="flex-1">
              <Form.Item label="ID " name={"id"} hidden>
                <Input />
              </Form.Item>
              <Form.Item label="Nama" required name={"name"}>
                <Input required />
              </Form.Item>
              <Form.Item label="Biaya Administrasi" required name={"by_admin"}>
                <Input suffix="%" required type="number" />
              </Form.Item>
              <Form.Item
                label="Biaya Admin Bank"
                required
                name={"by_admin_bank"}
              >
                <Input suffix="%" required type="number" />
              </Form.Item>
              <Form.Item label="Biaya Cadangan" required name={"by_lainnya"}>
                <Input suffix="%" required type="number" />
              </Form.Item>
              <Form.Item
                label="Biaya Tatalaksana"
                required
                name={"by_tatalaksana"}
              >
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
              <Form.Item label="Biaya Materai" required name={"by_materai"}>
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
              <Form.Item
                label="Biaya Buka Rekening"
                required
                name={"by_buka_rekening"}
              >
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
            </div>
            <div className="flex-1">
              <Form.Item label="Biaya Flagging" required name={"by_flagging"}>
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
              <Form.Item label="Biaya Epotpen" required name={"by_epotpen"}>
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
              <Form.Item label="Biaya Provisi" required name={"by_provisi"}>
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
              <Form.Item label="Sisa Gaji" required name={"by_angsuran"}>
                <Input suffix="%" required />
              </Form.Item>
              <Form.Item label="Margin Bank" required name={"margin_bank"}>
                <Input suffix="%" required />
              </Form.Item>
              {/* <Form.Item label="Bank Syariah" required name={"is_syariah"}>
                <Select
                  defaultValue={selected?.is_syariah}
                  options={[
                    { label: "YA", value: true },
                    { label: "TIDAK", value: false },
                  ]}
                />
              </Form.Item> */}
            </div>
          </div>

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
        title="Konfirmasi Hapus Bank Pembiayaan"
        footer={[]}
      >
        <p>
          Yakin hapus bank pembiayaan{" "}
          <span className="text-green-500">{selected && selected.name}</span> ?
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => handleDelete(selected ? selected.id : "")}
            type="button"
            className="border bg-orange-500 text-gray-50 py-1 px-3 rounded-md hover:bg-orange-600 shadow"
          >
            {loading ? <LoadingOutlined /> : "Ya"}
          </button>
        </div>
      </Modal>
      {/* end Hapus Modal */}
    </div>
  );
}
