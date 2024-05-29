"use client";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { UnitCabang, UnitPelayanan, User } from "@prisma/client";
import {
  Form,
  Input,
  Modal,
  Select,
  Table,
  TableProps,
  Tag,
  Tooltip,
  notification,
} from "antd";
import { useEffect, useState } from "react";

interface DataType extends UnitPelayanan {
  key: string;
  UnitCabang: DataTypeCabang[];
}
interface DataTypeCabang extends UnitCabang {
  key: string;
  User: User[];
}

const columnsUser: TableProps<User>["columns"] = [
  {
    key: "name",
    title: "NAMA",
    dataIndex: "id",
    render(value, record, index) {
      return (
        <>
          {record.first_name} {record.last_name}
        </>
      );
    },
  },
  { key: "username", title: "USERNAME", dataIndex: "username" },
  { key: "email", title: "EMAIL", dataIndex: "email" },
  { key: "role", title: "ROLE", dataIndex: "role" },
  {
    key: "status_active",
    title: "STATUS",
    dataIndex: "status_active",
    render(value, record, index) {
      return (
        <Tag color={record.status_active ? "green" : "red"}>
          {record.status_active ? "ACTIVE" : "INACTIVE"}
        </Tag>
      );
    },
  },
];
interface DataOption {
  label: string;
  value: string;
  key?: string;
}
export default function UnitPelayananView() {
  const [modalUPTambah, setModalUPTambah] = useState(false);
  const [modalUPEdit, setModalUPEdit] = useState(false);
  const [modalUPHapus, setModalUPHapus] = useState(false);
  const [modalCabangTambah, setModalCabangTambah] = useState(false);
  const [modalCabangEdit, setModalCabangEdit] = useState(false);
  const [modalCabangHapus, setModalCabangHapus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUP, setSelectedUP] = useState<UnitPelayanan>();
  const [selectedCabang, setSelectedCabang] = useState<UnitCabang>();
  const [data, setData] = useState<DataType[]>();
  const [dataInactive, setDataInactive] = useState<DataType[]>();
  const [dataOption, setDataOption] = useState<DataOption[]>();
  const [selectenArea, setSelectedArea] = useState<string>();
  const [modalActivate, setModalActivate] = useState(false);
  const [formUP] = Form.useForm();
  const [formCabang] = Form.useForm();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const handleActionUP = (record: DataType, type: string) => {
    setSelectedUP(record);
    if (type == "edit") {
      setModalUPEdit(true);
    } else {
      setModalUPHapus(true);
    }
  };
  const handleActionCabang = (record: DataTypeCabang, type: string) => {
    setSelectedCabang(record);
    if (type == "edit") {
      setModalCabangEdit(true);
    } else {
      setModalCabangHapus(true);
    }
  };
  const handleTambahUp = async (postData: UnitPelayanan) => {
    setLoading(true);
    const result = await fetch("/api/master/unit/pelayanan", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        name: postData.name,
        kode_area: postData.kode_area,
        is_active: true,
      }),
    });
    const resMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resMsg.msg });
      setModalUPTambah(false);
      await getDataAktif();
    } else {
      notification.error({ message: resMsg.msg });
    }
    await getDataAktif();
    setLoading(false);
  };
  const handleEditUp = async (putData: UnitPelayanan) => {
    setLoading(true);
    const result = await fetch("/api/master/unit/pelayanan", {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        id: putData.id,
        name: putData.name,
        kode_area: putData.kode_area,
        is_active: true,
      }),
    });
    const resMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resMsg.msg });
      setModalUPEdit(false);
      await getDataAktif();
    } else {
      notification.error({ message: resMsg.msg });
    }
    setLoading(false);
  };
  const handleHapusUp = async () => {
    setLoading(true);
    const result = await fetch("/api/master/unit/pelayanan", {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ id: selectedUP?.id }),
    });
    const resMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resMsg.msg });
      setModalUPHapus(false);
      await getDataAktif();
      await getDataInactive();
    } else {
      notification.error({ message: resMsg.msg });
    }
    setLoading(false);
  };
  // End UP Function
  const handleTambahCabang = async (postData: UnitCabang) => {
    setLoading(true);
    const result = await fetch("/api/master/unit/cabang", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        name: postData.name,
        kode_area: postData.kode_area,
        unit_pelayanan_id: postData.unit_pelayanan_id,
        is_active: true,
      }),
    });
    const resMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resMsg.msg });
      setModalCabangTambah(false);
      await getDataAktif();
    } else {
      notification.error({ message: resMsg.msg });
    }
    setLoading(false);
  };
  const handleEditCabang = async (putData: UnitCabang) => {
    setLoading(true);
    const result = await fetch("/api/master/unit/cabang", {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        id: putData.id,
        name: putData.name,
        kode_area: putData.kode_area,
        unit_pelayanan_id: putData.unit_pelayanan_id,
        is_active: true,
      }),
    });
    const resMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resMsg.msg });
      setModalCabangEdit(false);
      await getDataAktif();
    } else {
      notification.error({ message: resMsg.msg });
    }
    setLoading(false);
  };
  const handleHapusCabang = async () => {
    setLoading(true);
    const result = await fetch("/api/master/unit/cabang", {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ id: selectedCabang?.id }),
    });
    const resMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resMsg.msg });
      setModalCabangHapus(false);
      await getDataAktif();
    } else {
      notification.error({ message: resMsg.msg });
    }
    await getDataInactive();
    setLoading(false);
  };
  // End Cabang Function
  const getDataAktif = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/master/unit/pelayanan?page=${page}${selectenArea ? "&area=" + selectenArea : ""
      }`
    );
    const { result, total } = await res.json();
    const unit: DataType[] = await result;
    const tmpOption: DataOption[] = [];

    const resultData: DataType[] = unit.map((e) => {
      tmpOption.push({ label: e.name, value: e.id, key: e.id });
      const cabang: DataTypeCabang[] =
        e.UnitCabang &&
        e.UnitCabang.map((c) => {
          const usr: User[] =
            c.User &&
            c.User.map((u) => {
              return { ...u, key: u.id };
            });
          return { ...c, key: c.id, User: usr };
        });
      return { ...e, key: e.id, UnitCabang: cabang };
    });
    setDataOption(tmpOption);
    setData(resultData);
    setTotal(total);
    setLoading(false);
  };
  const getDataInactive = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/master/unit/pelayanan?inactive=true&page=${page}`
    );
    const { result, total } = await res.json();
    const unit: DataType[] = result;

    const resultData: DataType[] = unit.map((e) => {
      const cabang: DataTypeCabang[] =
        e.UnitCabang &&
        e.UnitCabang.map((c) => {
          const usr: User[] =
            c.User &&
            c.User.map((u) => {
              return { ...u, key: u.id };
            });
          return { ...c, key: c.id, User: usr };
        });
      return { ...e, key: e.id, UnitCabang: cabang };
    });
    setDataInactive(resultData);
    setTotal(total);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getDataAktif();
      await getDataInactive();
    })();
  }, [selectenArea]);
  useEffect(() => {
    if (!selectedUP) return;
    formUP.setFieldsValue({
      id: selectedUP.id,
      name: selectedUP.name,
      kode_area: selectedUP.kode_area,
    });
    formCabang.setFieldsValue({
      id: selectedCabang?.id,
      name: selectedCabang?.name,
      kode_area: selectedCabang?.kode_area,
      unit_pelayanan_id: selectedCabang?.unit_pelayanan_id,
    });
  }, [selectedUP, selectedCabang]);
  const columns: TableProps<DataType>["columns"] = [
    { title: "Nama Area", dataIndex: "name", key: "name" },
    { title: "Kode Area", dataIndex: "kode_area", key: "kode" },
    {
      title: "Aksi",
      dataIndex: "id",
      key: "id",
      render: (value, record, index) => (
        <div className="flex flex-wrap gap-2" key={value}>
          <button
            type="button"
            onClick={() => handleActionUP(record, "edit")}
            className="bg-blue-500 px-2 text-gray-100 rounded hover:bg-blue-600 shadow"
          >
            <Tooltip title="Edit Bank">{<EditOutlined />}</Tooltip>
          </button>
          {/*  */}
          <button
            type="button"
            onClick={() => handleActionUP(record, "hapus")}
            className="bg-red-500 px-2 text-gray-100 rounded hover:bg-red-600 shadow"
          >
            <Tooltip title="Hapus Bank">{<DeleteOutlined />}</Tooltip>
          </button>
        </div>
      ),
    },
  ];
  const columnsExpanded: TableProps<DataTypeCabang>["columns"] = [
    { title: "AREA", dataIndex: "name", key: "name" },
    {
      title: "AKSI",
      dataIndex: "id",
      key: "id",
      render: (value, record, index) => (
        <div className="flex flex-wrap gap-2" key={value}>
          <button
            type="button"
            onClick={() => handleActionCabang(record, "edit")}
            className="bg-blue-500 px-2 text-gray-100 rounded hover:bg-blue-600 shadow"
          >
            <Tooltip title="Edit Bank">{<EditOutlined />}</Tooltip>
          </button>
          {/*  */}
          <button
            type="button"
            onClick={() => handleActionCabang(record, "hapus")}
            className="bg-red-500 px-2 text-gray-100 rounded hover:bg-red-600 shadow"
          >
            <Tooltip title="Hapus Bank">{<DeleteOutlined />}</Tooltip>
          </button>
        </div>
      ),
    },
  ];
  const columnsInactive: TableProps<DataType>["columns"] = [
    { title: "AREA", dataIndex: "name", key: "name" },
    {
      title: "AKSI",
      dataIndex: "id",
      key: "id",
      render: (value, record, index) => (
        <div className="flex flex-wrap gap-2" key={value}>
          <button
            type="button"
            onClick={() => handleActionUP(record, "hapus")}
            className="bg-green-500 px-2 text-gray-100 rounded hover:bg-green-600 shadow"
          >
            <Tooltip title="Hapus Bank">{<CheckCircleOutlined />}</Tooltip>
          </button>
        </div>
      ),
    },
  ];
  const columnsExpandedInactive: TableProps<DataTypeCabang>["columns"] = [
    { title: "AREA", dataIndex: "name", key: "name" },
    { title: "AKSI", dataIndex: "id", key: "id" },
  ];
  return (
    <div>
      <div className="my-3 mx-2 block sm:flex sm:gap-5">
        <div className="btn-action-top">
          <button
            className="border bg-green-500 text-gray-50 py-1 px-3 rounded-md hover:bg-green-600 text-xs shadow"
            onClick={() => setModalUPTambah(true)}
          >
            <PlusCircleOutlined /> Tambah UP
          </button>
          <button
            className="border bg-green-500 text-gray-50 py-1 px-3 rounded-md hover:bg-green-600 text-xs shadow"
            onClick={() => setModalCabangTambah(true)}
          >
            <PlusCircleOutlined /> Tambah Cabang
          </button>
        </div>
        <div>
          <Select
            style={{ width: 200 }}
            placeholder="Pilih data area"
            options={dataOption}
            onChange={(e) => setSelectedArea(e)}
          />
        </div>
      </div>
      <Table
        size="middle"
        loading={loading}
        bordered
        columns={columns}
        dataSource={data}
        scroll={{ x: 400, y: 320 }}
        pagination={{
          total: total,
          pageSize: 20,
          onChange(page, pageSize) {
            setPage(page);
          },
        }}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <Table
                columns={columnsExpanded}
                dataSource={record.UnitCabang}
                size="small"
                pagination={false}
                expandable={{
                  expandedRowRender: (record) => {
                    return (
                      <Table
                        columns={columnsUser}
                        dataSource={record.User}
                        size="small"
                        pagination={false}
                      />
                    );
                  },
                }}
              />
            );
          },
        }}
      />

      <div className="my-20">
        <div className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 p-3 text-gray-100 rounded`}>
          <h1 className="font-bold text-sm">
            Data Unit Pelayanan dan cabang (NONAKTIF)
          </h1>
          <div className="text-xs">
            Manajemen data unit pelayanan dan cabang (NONAKTIF)
          </div>
        </div>
        <Table
          size="middle"
          bordered
          columns={columnsInactive}
          dataSource={dataInactive}
          scroll={{ x: 400, y: 320 }}
          loading={loading}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <Table
                  columns={columnsExpandedInactive}
                  dataSource={record.UnitCabang}
                  size="small"
                  pagination={false}
                  expandable={{
                    expandedRowRender: (record) => {
                      return (
                        <Table
                          columns={columnsUser}
                          dataSource={record.User}
                          size="small"
                          pagination={false}
                        />
                      );
                    },
                  }}
                />
              );
            },
          }}
        />
      </div>

      {/* MODAL UP */}
      <Modal
        open={modalUPTambah}
        onCancel={() => setModalUPTambah(false)}
        footer={[]}
        title="Tambah Unit Pelayanan"
      >
        <Form onFinish={handleTambahUp} labelCol={{ span: 5 }}>
          <Form.Item label="Nama Area" name={"name"} required>
            <Input required />
          </Form.Item>
          <Form.Item label="Kode Area" name={"kode_area"} required>
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

      <Modal
        open={modalUPEdit}
        onCancel={() => setModalUPEdit(false)}
        footer={[]}
        title="Edit Unit Pelayanan"
      >
        <Form onFinish={handleEditUp} form={formUP} labelCol={{ span: 5 }}>
          <Form.Item label="ID" name={"id"} required hidden>
            <Input required />
          </Form.Item>
          <Form.Item label="Nama Area" name={"name"} required>
            <Input required />
          </Form.Item>
          <Form.Item label="Kode Area" name={"kode_area"} required>
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

      <Modal
        open={modalUPHapus}
        onCancel={() => setModalUPHapus(false)}
        title="Konfirmasi Hapus Unit Pelayanan"
        footer={[]}
      >
        <p>
          Yakin hapus unit pelayanan{" "}
          <span className="text-green-500">
            {selectedUP && selectedUP.name}
          </span>{" "}
          ?
        </p>
        <p>
          Dengan menghapus unit pelayanan akan menghapus data cabang dan user
          yang terkait dengan unit pelayanan{" "}
          <span className="text-green-500">
            {selectedUP && selectedUP.name}
          </span>
        </p>
        <p>Lanjutkan Hapus?</p>
        <div className="flex justify-end gap-5">
          <button
            onClick={() => setModalUPHapus(false)}
            type="button"
            className="border bg-blue-500 text-gray-50 py-1 px-3 rounded-md hover:bg-blue-600 shadow"
          >
            {loading ? <LoadingOutlined /> : "Batalkan"}
          </button>
          <button
            onClick={() => handleHapusUp()}
            type="button"
            className="border bg-orange-500 text-gray-50 py-1 px-3 rounded-md hover:bg-orange-600 shadow"
          >
            {loading ? <LoadingOutlined /> : "Ya"}
          </button>
        </div>
      </Modal>
      {/* END MODAL UP */}

      {/* MODAL CABANG */}
      <Modal
        open={modalCabangTambah}
        onCancel={() => setModalCabangTambah(false)}
        footer={[]}
        title="Tambah Unit Cabang"
      >
        <Form onFinish={handleTambahCabang} labelCol={{ span: 6 }}>
          <Form.Item label="Nama Area" name={"name"} required>
            <Input required />
          </Form.Item>
          <Form.Item label="Kode Area" name={"kode_area"} required>
            <Input required />
          </Form.Item>
          <Form.Item label="Unit Pelayanan" name={"unit_pelayanan_id"}>
            <Select
              style={{ width: 200 }}
              placeholder="Pilih data Unit Pelayanan"
              options={dataOption}
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

      <Modal
        open={modalCabangEdit}
        onCancel={() => setModalCabangEdit(false)}
        footer={[]}
        title="Edit Unit Cabang"
      >
        <Form
          form={formCabang}
          onFinish={handleEditCabang}
          labelCol={{ span: 6 }}
        >
          <Form.Item label="ID" name={"id"} required hidden>
            <Input required />
          </Form.Item>
          <Form.Item label="Nama Area" name={"name"} required>
            <Input required />
          </Form.Item>
          <Form.Item label="Kode Area" name={"kode_area"} required>
            <Input required />
          </Form.Item>
          <Form.Item label="Unit Pelayanan" name={"unit_pelayanan_id"}>
            <Select
              style={{ width: 200 }}
              placeholder="Pilih data Unit Pelayanan"
              options={dataOption}
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

      <Modal
        open={modalCabangHapus}
        onCancel={() => setModalCabangHapus(false)}
        title="Konfirmasi Hapus Unit Cabang"
        footer={[]}
      >
        <p>
          Yakin hapus unit cabang{" "}
          <span className="text-green-500">
            {selectedCabang && selectedCabang.name}
          </span>{" "}
          ?
        </p>
        <p>
          Dengan menghapus unit cabang akan menonaktifkan semua user yang
          terkait dengan cabang{" "}
          <span className="text-green-500">
            {selectedCabang && selectedCabang.name}
          </span>
        </p>
        <p>Lanjutkan hapus cabang?</p>
        <div className="flex justify-end">
          <button
            onClick={() => handleHapusCabang()}
            type="button"
            className="border bg-orange-500 text-gray-50 py-1 px-3 rounded-md hover:bg-orange-600 shadow"
          >
            {loading ? <LoadingOutlined /> : "Ya"}
          </button>
        </div>
      </Modal>
      {/* END MODAL CABANG */}

      {/* Modal Activate */}
      <Modal
        open={modalActivate}
        onCancel={() => setModalActivate(false)}
        title="Konfirmasi Aktivasi Unit Pelayanan"
        footer={[]}
      >
        <p>
          Yakin ingin mengaktifkan unit pelayanan{" "}
          <span className="text-green-500">
            {selectedCabang && selectedCabang.name}
          </span>{" "}
          ?
        </p>
        <p>
          Dengan mengaktifkan unit pelayanan akan mengaktifkan kembali semua
          cabang dan user yang terkait dengan unit pelayanan{" "}
          <span className="text-green-500">
            {selectedCabang && selectedCabang.name}
          </span>
        </p>
        <p>Lanjutkan aktivasi Unit Pelayanan?</p>
        <div className="flex justify-end">
          <button
            onClick={() => handleHapusUp()}
            type="button"
            className="border bg-green-500 text-gray-50 py-1 px-3 rounded-md hover:bg-green-600 shadow"
          >
            {loading ? <LoadingOutlined /> : "Ya"}
          </button>
        </div>
      </Modal>
      {/* End Modal Activate */}
    </div>
  );
}
