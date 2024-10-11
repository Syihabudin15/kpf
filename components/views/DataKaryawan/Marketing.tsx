"use client";
import CetakDataKaryawan from "@/components/utils/CetakDataKaryawan";
import { filterOption } from "@/components/utils/inputUtils";
import { Cabang, DataDataUser, UP } from "@/components/utils/Interfaces";
import {
  DeleteOutlined,
  FormOutlined,
  LoadingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Form, Input, Modal, Select, Table, TableProps } from "antd";
import moment from "moment";
import { ReactNode, useEffect, useState } from "react";
import UpdateUser from "./UpdateUser";

export default function DataMarketing() {
  const [data, setData] = useState<DataDataUser[]>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [jumlah, setJumlah] = useState(0);
  const [selected, setSelected] = useState<DataDataUser>();
  const [editModal, setEditModal] = useState(false);
  const [hapusModal, setHapusModal] = useState(false);
  const [tambahModal, setTambahModal] = useState(false);
  const [cabang, setCabang] = useState<
    { label: string | ReactNode; value: string }[]
  >([]);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/data-karyawan?page=${page}${name ? "&name=" + name : ""}${
        pageSize ? "&pageSize=" + pageSize : ""
      }`
    );
    const { data, total, jumlah } = await res.json();
    setTotal(total);
    setData(data);
    setJumlah(jumlah);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [page, name, pageSize]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/master/unit/pelayanan");
      const { result, total } = await res.json();
      let Unit: Cabang[] = [];
      result.forEach((e: UP) => {
        if (e.UnitCabang.length !== 0) {
          return Unit.push(...e.UnitCabang);
        }
      });
      setCabang(
        Unit.map((unit) => {
          return { label: unit.name, value: unit.id };
        })
      );
      setLoading(false);
    })();
  }, []);

  const columns: TableProps<DataDataUser>["columns"] = [
    {
      title: "AREA PELAYANAN",
      key: "area",
      dataIndex: "area",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      width: 150,
      render(value, record, index) {
        return (
          <>
            {record.unit_cabang_id
              ? record.UnitCabang.UnitPelayanan.name
              : "JAWA BARAT"}
          </>
        );
      },
    },
    {
      title: "UNIT PELAYANAN",
      key: "cabang",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      width: 150,
      dataIndex: "cabang",
      render(value, record, index) {
        return <>{record.unit_cabang_id ? record.UnitCabang.name : "PUSAT"}</>;
      },
    },
    {
      title: "NAMA LENGKAP",
      key: "nama_lengkap",
      dataIndex: "nama_lengkap",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      fixed: window.innerWidth < 600 ? false : "left",
      render(value, record, index) {
        return <>{record.first_name + " " + record.last_name}</>;
      },
    },
    {
      title: "NIP",
      key: "nip",
      dataIndex: "nip",
      width: 100,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.nip}</>;
      },
    },
    {
      title: "NIK",
      key: "nik",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      dataIndex: "nik",
      width: 150,
      render(value, record, index) {
        return <>{record.nik}</>;
      },
    },
    {
      title: "POSISI",
      key: "posisi",
      dataIndex: "posisi",
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
        return <>{record.posisi}</>;
      },
    },
    {
      title: "NO TELEPON",
      key: "no_telp",
      dataIndex: "no_telp",
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
        return <>{record.no_telepon}</>;
      },
    },
    {
      title: "USERNAME",
      key: "username",
      dataIndex: "username",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      width: 150,
      render(value, record, index) {
        return <>{record.username}</>;
      },
    },
    {
      title: "EMAIL",
      key: "email",
      dataIndex: "email",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.email}</>;
      },
    },
    {
      title: "ALAMAT",
      key: "alamat",
      dataIndex: "alamat",
      width: 300,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      // className: "text-center",
      render(value, record, index) {
        return <>{record.alamat}</>;
      },
    },
    {
      title: "PKWT",
      key: "pkwt",
      dataIndex: "pkwt",
      children: [
        {
          title: "STATUS",
          key: "status",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          dataIndex: "status_pkwt",
          render(value, record, index) {
            return <>{record.status_pkwt}</>;
          },
        },
        {
          title: "TANGGAL MASUK",
          key: "tanggal_masuk",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          dataIndex: "tanggal_masuk",
          render(value, record, index) {
            return <>{moment(record.created_at).format("DD-MM-YYYY")}</>;
          },
        },
        {
          title: "MULAI KONTRAK",
          key: "mulai-kontrak",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          dataIndex: "mulai-kontrak",
          render(value, record, index) {
            return <>{moment(record.mulai_kontrak).format("DD-MM-YYYY")}</>;
          },
        },
        {
          title: "MASA KONTRAK",
          key: "masa_kontrak",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          dataIndex: "masa_kontrak",
          render(value, record, index) {
            return <>{record.masa_kotrak}</>;
          },
        },
        {
          title: "HABIS KONTRAK",
          key: "habis_kontrak",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          dataIndex: "habis_kontrak",
          render(value, record, index) {
            return (
              <>
                {moment(record.mulai_kontrak)
                  .add(record.masa_kotrak, "M")
                  .format("DD-MM-YYYY")}
              </>
            );
          },
        },
      ],
    },
    {
      title: "STATUS AKTIF",
      key: "status_active",
      width: 100,
      dataIndex: "status_active",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-center text-xs font-bold italic">
            <div
              className={`bg-${
                record.status_active === true ? "green" : "red"
              }-500 text-white py-1 px-3`}
            >
              {record.status_active === true ? "ACTIVE" : "INACTIVE"}
            </div>
          </div>
        );
      },
    },
    {
      title: "AKSI",
      key: "aksi",
      width: 100,
      dataIndex: "aksi",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <div
            className="flex justify-center gap-3 items-center text-white"
            key={record.id}
          >
            <button
              className="bg-green-500 py-1 px-2 rounded shadow hover:bg-green-600"
              onClick={() => {
                setSelected(record);
                setEditModal(true);
              }}
            >
              <FormOutlined />
            </button>
            <button className="bg-red-500 py-1 px-2 rounded shadow hover:bg-red-600">
              <DeleteOutlined
                onClick={() => {
                  setSelected(record);
                  setHapusModal(true);
                }}
              />
            </button>
          </div>
        );
      },
    },
  ];

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch("/api/data-karyawan", {
      method: "DELETE",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({ id: selected?.id }),
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
      setHapusModal(false);
      await getData();
    }
    setLoading(false);
  };
  const handleAddNew = async (e: any) => {
    setLoading(true);
    const res = await fetch("/api/data-karyawan", {
      method: "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify(e),
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
      setTambahModal(false);
      await getData();
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex gap-5 my-1 mx-1">
        <Input.Search
          style={{ width: 200 }}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <CetakDataKaryawan data={data || []} />
        </div>
        <div className="justify-self-end text-xs flex items-center bg-green-500 text-white px-2">
          <span>Jumlah : {jumlah}</span>
        </div>
        <button
          className="bg-blue-500 py-1 px-2 rounded shadow text-white text-xs hover:bg-blue-600"
          onClick={() => setTambahModal(true)}
        >
          <UserAddOutlined /> Baru
        </button>
      </div>
      <div className="px-2 py-0">
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          bordered
          size="small"
          scroll={{ x: "max-content", y: "calc(60vh - 100px)" }}
          pagination={{
            pageSize: pageSize,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
            total: total,
          }}
        />
      </div>
      <Modal
        title={"Tambah User"}
        footer={[]}
        open={tambahModal}
        onCancel={() => setTambahModal(false)}
        onClose={() => setTambahModal(false)}
        width={"80vw"}
        style={{ top: 10 }}
      >
        <Form labelCol={{ span: 6 }} onFinish={handleAddNew}>
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
              <Form.Item label="Tanggal Lahir" required name={"tanggal_lahir"}>
                <Input name="tanggal_lahir" type="date" required />
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
              <Form.Item label="Password" required name={"password"}>
                <Input.Password name="password" required />
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
              <Form.Item label="Mulai Kontrak" required name={"mulai_kontrak"}>
                <Input name="mulai_kontrak" type="date" required />
              </Form.Item>
              <Form.Item label="Masa Kontrak" required name={"masa_kontrak"}>
                <Input
                  name="masa_kontrak"
                  type="number"
                  defaultValue={0}
                  required
                  suffix={<span className="text-xs">Bulan</span>}
                />
              </Form.Item>
              <Form.Item label="Target" required name={"target"}>
                <Input
                  name="target"
                  prefix="Rp"
                  type="number"
                  defaultValue={0}
                  required
                />
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
            >
              {loading ? <LoadingOutlined /> : "Submit"}
            </button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={<span className="text-red-500">Hapus Data User</span>}
        footer={[]}
        open={hapusModal}
        onCancel={() => setHapusModal(false)}
        onClose={() => setHapusModal(false)}
      >
        <p className="mt-5">Yakin untuk menghapus data ini ?</p>
        <p>
          dengan menyetujui penghapusan akun, data {selected?.first_name}{" "}
          {selected?.last_name} akan hilang dari sistem!
        </p>
        <div className="mt-10 text-white flex justify-end">
          <button
            disabled={loading}
            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded shadow"
            onClick={() => handleDelete()}
          >
            {loading ? <LoadingOutlined /> : "OK"}
          </button>
        </div>
      </Modal>
      {selected && (
        <UpdateUser
          getData={getData}
          currData={selected}
          editModal={editModal}
          setEditModal={setEditModal}
          cabang={cabang}
        />
      )}
    </div>
  );
}
