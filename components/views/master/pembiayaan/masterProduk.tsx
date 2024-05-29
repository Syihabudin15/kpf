"use client";
import { formatNumber } from "@/components/utils/inputUtils";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Bank, Produk } from "@prisma/client";
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
import { useEffect, useState } from "react";

interface DataType extends Produk {
  key: string | number;
  Bank: Bank;
}
interface OptionBank {
  label: string;
  value: string;
}

export default function MasterProduk() {
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openHapus, setOpenHapus] = useState(false);
  const [selected, setSelected] = useState<DataType>();
  const [formData] = Form.useForm();
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [dataBank, setDataBank] = useState<OptionBank[]>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [name, setName] = useState<string>();

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
    const result = await fetch("/api/master/produk", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(postData),
    });
    const resultMsg = await result.json();
    if (result.ok) {
      notification.success({
        message: resultMsg.msg || "Data produk berhasil dibuat",
      });
    } else {
      notification.error({
        message: resultMsg.msg || "Gagal menambahkan data produk",
      });
    }

    setOpenTambah(false);
    await getData();
  };
  const handlePut = async (putData: DataType) => {
    setLoading(true);
    const result = await fetch("/api/master/produk", {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        id: putData.id,
        name: putData.name,
        by_asuransi: parseFloat(putData.by_asuransi.toString()),
        mg_bunga: parseFloat(putData.mg_bunga.toString()),
        min_age: parseFloat(putData.min_age.toString()),
        max_age: parseFloat(putData.max_age.toString()),
        max_usia_lunas: parseFloat(putData.max_usia_lunas.toString()),
        max_tenor: parseInt(putData.max_tenor.toString()),
        max_plafon: putData.max_plafon,
        bank_id: putData.bank_id,
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
    const result = await fetch("/api/master/produk", {
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
  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/master/produk?page=${page}${name ? "&name=" + name : ""}`
    );
    const { data, totalLength } = await res.json();
    const resultMap: DataType[] = await data.map((e: DataType) => {
      return {
        ...e,
        key: e.id,
        Bank: e.Bank,
      };
    });
    setData(resultMap);
    setTotal(totalLength);
    const resBank = await fetch("/api/master/bank");
    const { result, total } = await resBank.json();
    const results: OptionBank[] = result.map((e: Bank) => {
      return {
        label: e.name,
        value: e.id,
      };
    });
    setDataBank(results);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [page, name]);
  useEffect(() => {
    if (!selected) return;
    formData.setFieldsValue({
      id: selected.id,
      name: selected.name,
      by_asuransi: selected.by_asuransi,
      mg_bunga: selected.mg_bunga,
      min_age: selected.min_age,
      max_age: selected.max_age,
      max_usia_lunas: selected.max_usia_lunas,
      max_tenor: selected.max_tenor,
      max_plafon: selected.max_plafon,
      bank: selected.bank_id,
      bank_id: selected.bank_id,
    });
  }, [selected]);
  const columns: TableProps<DataType>["columns"] = [
    { title: "NAMA", dataIndex: "name", className: "font-semibold", onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    } },
    { title: "ASURANSI (%)", dataIndex: "by_asuransi", onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center", },
    { title: "BUNGA (%)", dataIndex: "mg_bunga", onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center", },
    { title: "MIN USIA", dataIndex: "min_age", onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center", },
    { title: "MAKS USIA", dataIndex: "max_age",onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center", },
    { title: "MAKS USIA LUNAS", dataIndex: "max_usia_lunas",onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center", },
    { title: "MAKS TENOR", dataIndex: "max_tenor",onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center", },
    {
      title: "MAKS PLAFOND",
      dataIndex: "max_plafon",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.max_plafon.toFixed(0))}</>;
      },
    },
    {
      title: "BANK",
      dataIndex: "bank_id",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "font-semibold text-center",
      render(value, record, index) {
        return <>{record.Bank.name}</>;
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
      render: (value, record, index) => (
        <div className="flex flex-wrap gap-2" key={value}>
          <button
            type="button"
            onClick={() => handleAction(record, "edit")}
            className={`px-2 text-gray-100 rounded bg-blue-500 hover:bg-blue-600 shadow`}
          >
            <Tooltip title="Edit Produk Pembiayaan">{<EditOutlined />}</Tooltip>
          </button>
          {/*  */}
          <button
            type="button"
            onClick={() => handleAction(record, "hapus")}
            className={`${
              record.name === "Flash Sisa Gaji" ? "bg-red-900" : "bg-red-500"
            } px-2 text-gray-100 rounded ${
              record.name === "Flash Sisa Gaji" ? "" : "hover:bg-red-600"
            } shadow`}
          >
            <Tooltip title="Hapus Produk Pembiayaan">
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
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
        scroll={{ x: 1200, y: 320 }}
        size="middle"
        pagination={{
          pageSize: 20,
          total: total,
          onChange(page, pageSize) {
            setPage(page);
          },
        }}
      />

      {/* Modal Tambah */}
      <Modal
        open={openTambah}
        onCancel={() => setOpenTambah(false)}
        title="Tambah Jenis Pembiayaan"
        footer={[]}
      >
        <Form onFinish={handlePost} className="my-5" labelCol={{ span: 8 }}>
          <Form.Item label="Nama " name={"name"}>
            <Input />
          </Form.Item>
          <Form.Item label="Biaya Asuransi" name={"by_asuransi"}>
            <Input suffix="%" type="number" />
          </Form.Item>
          <Form.Item label="Margin Bunga" name={"mg_bunga"}>
            <Input suffix="%" type="number" />
          </Form.Item>
          <Form.Item label="Minimal Usia" name={"min_age"}>
            <Input
              suffix="Tahun.Bulan"
              placeholder="70.05 or 70"
              type="number"
            />
          </Form.Item>
          <Form.Item label="Maksimal Usia" name={"max_age"}>
            <Input suffix="Tahun.Bulan" placeholder="79.11" type="number" />
          </Form.Item>
          <Form.Item label="Maksimal Usia Lunas" name={"max_usia_lunas"}>
            <Input suffix="Tahun.Bulan" placeholder="79.11" />
          </Form.Item>
          <Form.Item label="Maksimal Tenor" name={"max_tenor"}>
            <Input placeholder="120" type="number" />
          </Form.Item>
          <Form.Item label="Maksimal Plafon" name={"max_plafon"}>
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
            />
          </Form.Item>
          <Form.Item label="Bank Pembiayaan" name={"bank_id"}>
            <Select options={dataBank} allowClear />
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
        title="Edit Produk Pembiayaan"
        footer={[]}
      >
        <Form
          onFinish={handlePut}
          className="my-5"
          labelCol={{ span: 8 }}
          form={formData}
        >
          <Form.Item label="ID " name={"id"} hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Nama " name={"name"}>
            <Input
              disabled={selected?.name === "Flash Sisa Gaji" ? true : false}
            />
          </Form.Item>
          <Form.Item label="Biaya Asuransi" name={"by_asuransi"}>
            <Input required suffix="%" type="number" />
          </Form.Item>
          <Form.Item label="Margin Bunga" name={"mg_bunga"}>
            <Input required suffix="%" type="number" />
          </Form.Item>
          <Form.Item label="Minimal Usia" name={"min_age"}>
            <Input
              suffix="Tahun.Bulan"
              placeholder="70.05 or 70"
              type="number"
              required
            />
          </Form.Item>
          <Form.Item label="Maksimal Usia" name={"max_age"}>
            <Input
              suffix="Tahun.Bulan"
              placeholder="79.11"
              type="number"
              required
            />
          </Form.Item>
          <Form.Item label="Maksimal Usia Lunas" name={"max_usia_lunas"}>
            <Input
              suffix="Tahun.Bulan"
              placeholder="79.11"
              type="number"
              required
            />
          </Form.Item>
          <Form.Item label="Maksimal Tenor" name={"max_tenor"}>
            <Input placeholder="120" type="number" required />
          </Form.Item>
          <Form.Item label="Maksimal PLafon" name={"max_plafon"}>
            <InputNumber
              style={{ width: "100%" }}
              required
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
            />
          </Form.Item>
          <Form.Item label="Bank Pembiayaan" name={"bank_id"}>
            <Select options={dataBank} allowClear />
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
        title="Konfirmasi Hapus Prduk Pembiayaan"
        footer={[]}
      >
        <p>
          Yakin hapus produk pembiayaan{" "}
          <span className="text-green-500">{selected && selected.name}</span> ?
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => handleDelete(selected ? selected.id : "")}
            type="button"
            className="border bg-orange-500 text-gray-50 py-1 px-3 rounded-md hover:bg-orange-600 shadow"
            disabled={loading}
          >
            {loading ? <LoadingOutlined /> : "YA"}
          </button>
        </div>
      </Modal>
      {/* End Hapus Modal */}
    </div>
  );
}
