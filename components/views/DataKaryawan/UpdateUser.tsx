"use client";
import { filterOption } from "@/components/utils/inputUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { User } from "@prisma/client";
import { Modal, Form, Input, Select } from "antd";
import { ReactNode, useEffect, useState } from "react";

export default function UpdateUser({
  getData,
  currData,
  editModal,
  setEditModal,
  cabang,
}: {
  getData: Function;
  currData: User;
  editModal: boolean;
  setEditModal: Function;
  cabang: { label: string | ReactNode; value: string }[];
}) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleUpdate = async (e: any) => {
    setLoading(true);
    const res = await fetch("/api/data-karyawan", {
      method: "PUT",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({
        ...e,
        id: currData.id,
        tanggal_lahir: e.tanggal_lahir
          ? new Date(e.tanggal_lahir)
          : currData.tanggal_lahir,
        mulai_kontrak: e.mulai_kontrak
          ? new Date(e.mulai_kontrak)
          : currData.mulai_kontrak,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      Modal.error({
        title: <span className="text-red-500">Internal Server Error</span>,
        footer: [],
        closable: true,
        children: <p>{data.msg}</p>,
      });
    } else {
      Modal.success({
        title: <span className="text-green-500">Berhasil</span>,
        footer: [],
        closable: true,
        children: <p>{data.msg}</p>,
      });
      setEditModal(false);
      await getData();
    }
    console.log(e);
    setLoading(false);
  };
  useEffect(() => {
    form.setFieldsValue({
      ...currData,
      password: null,
      masa_kontrak: currData.masa_kotrak,
    });
    console.log(currData);
  }, [currData]);
  return (
    <Modal
      title={"Tambah User"}
      footer={[]}
      open={editModal}
      onCancel={() => setEditModal(false)}
      onClose={() => setEditModal(false)}
      width={"80vw"}
      style={{ top: 10 }}
    >
      <Form labelCol={{ span: 6 }} onFinish={handleUpdate} form={form}>
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1">
            <Form.Item required label="Nama Depan" name={"first_name"}>
              <Input name="first_name" required />
            </Form.Item>
            <Form.Item label="Nama Belakang" name={"last_name"}>
              <Input name="last_name" />
            </Form.Item>
            <Form.Item label="NIP" required name={"nip"}>
              <Input name="nip" required />
            </Form.Item>
            <Form.Item label="NIK" required name={"nik"}>
              <Input name="nik" required />
            </Form.Item>
            <Form.Item label="Tempat Lahir" required name={"tempat_lahir"}>
              <Input name="tempat_lahir" required />
            </Form.Item>
            <Form.Item label="Tanggal Lahir" name={"tanggal_lahir"}>
              <Input name="tanggal_lahir" type="date" />
            </Form.Item>
            <Form.Item label="Alamat" name={"alamat"} required>
              <Input.TextArea name="alamat" required />
            </Form.Item>
            <Form.Item label="No Telepon" name={"no_telepon"} required>
              <Input name="no_telepon" required />
            </Form.Item>
            <Form.Item label="Posisi" required name={"posisi"}>
              <Input name="posisi" required />
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item label="Username" name={"username"} required>
              <Input name="username" required />
            </Form.Item>
            <Form.Item label="Email" name={"email"} required>
              <Input name="email" required />
            </Form.Item>
            <Form.Item label="Password" name={"password"}>
              <Input.Password name="password" />
            </Form.Item>
            <Form.Item label="Role" required name={"role"}>
              <Select
                options={[
                  { label: "MARKETING", value: "MARKETING" },
                  { label: "ENTRY DATA", value: "ENTRY_DATA" },
                  { label: "VERIFIKASI", value: "VERIFIKASI" },
                  { label: "OPERASIONAL", value: "OPERASIONAL" },
                  { label: "PEMBERKASAN", value: "PEMBERKASAN" },
                  { label: "BISNIS", value: "BISNIS" },
                ]}
                defaultValue={"MARKETING"}
              />
            </Form.Item>
            <Form.Item label="Status PKWT" required name={"status_pkwt"}>
              <Input name="status_pkwt" required />
            </Form.Item>
            <Form.Item label="Mulai Kontrak" name={"mulai_kontrak"}>
              <Input name="mulai_kontrak" type="date" />
            </Form.Item>
            <Form.Item label="Masa Kontrak" name={"masa_kontrak"}>
              <Input
                name="masa_kontrak"
                type="number"
                suffix={<span className="text-xs">Bulan</span>}
              />
            </Form.Item>
            <Form.Item label="Target" name={"target"}>
              <Input name="target" prefix="Rp" type="number" />
            </Form.Item>
            <Form.Item label="Cabang" required name={"unit_cabang_id"}>
              <Select
                showSearch
                options={cabang}
                filterOption={(input: string, option: any) =>
                  filterOption(input, option)
                }
              />
            </Form.Item>
          </div>
        </div>
        <div className="text-white flex justify-end">
          <button
            className="py-1 px-7 bg-blue-500 hover:bg-blue-600 rounded shadow"
            type="submit"
            disabled={loading}
            // onClick={() => handleUpdate(form.getFieldsValue())}
          >
            {loading ? <LoadingOutlined /> : "Submit"}
          </button>
        </div>
      </Form>
    </Modal>
  );
}
