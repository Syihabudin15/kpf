"use client";

import {
  FormOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Form, Input, InputNumber, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { DataCost } from "./Interfaces";

export default function ModalCost({
  isEdit,
  data,
  getData,
  is_fixed,
}: {
  isEdit: boolean;
  data?: DataCost;
  getData: Function;
  is_fixed?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit && data) {
      form.setFieldsValue({
        name: data.name,
        keterangan: data.keterangan,
        nominal: data.nominal,
        user: data.User.first_name + " " + data.User.last_name,
      });
    }
  }, []);

  const handleSubmit = async (e: any) => {
    setLoading(true);
    let bodies: any = {
      name: e.name,
      keterangan: e.keterangan,
      nominal: e.nominal,
    };
    if (isEdit) {
      bodies["id"] = data?.id;
    }

    const res = await fetch(
      is_fixed
        ? "/api/administrasi/fixed-cost"
        : "/api/administrasi/alternatif-cost",
      {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(bodies),
      }
    );
    const result = await res.json();
    if (res.ok) {
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
    setLoading(false);
    setOpen(false);
    await getData();
  };

  return (
    <div>
      <button
        className={`bg-${isEdit ? "green" : "blue"}-500 hover:bg-${
          isEdit ? "green" : "blue"
        }-600 text-white text-xs py-1 sm:py-2 px-2 rounded shadow`}
        onClick={() => setOpen(true)}
      >
        {!isEdit && "Tambah"}{" "}
        {isEdit ? <FormOutlined /> : <PlusCircleOutlined />}
      </button>

      <Modal
        title={isEdit ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
        onCancel={() => setOpen(false)}
        footer={[]}
        open={open}
      >
        <Form
          form={form}
          labelCol={{ span: 5 }}
          onFinish={handleSubmit}
          style={{ marginTop: 5, marginBottom: 5 }}
        >
          <Form.Item label="Nama" name={"name"} required>
            <Input required />
          </Form.Item>
          <Form.Item label="Keterangan" name={"keterangan"} required>
            <Input required />
          </Form.Item>
          <Form.Item label="Nominal" name={"nominal"} required>
            <InputNumber
              style={{ width: 300 }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
            />
          </Form.Item>
          <Form.Item label="User" name={"user"} hidden={!isEdit}>
            <Input disabled />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              style={{ opacity: loading ? 0.5 : 1 }}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs py-2 px-4 rounded shadow"
            >
              Submit {loading && <LoadingOutlined />}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
