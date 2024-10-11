"use client";
import { filterOption, formatNumber } from "@/components/utils/inputUtils";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Bank, Role, UnitCabang, UnitPelayanan, User } from "@prisma/client";
import {
  Form,
  Input,
  Modal,
  Select,
  Table,
  TableProps,
  Tag,
  Tooltip,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import UploadBerkas from "../../operasionals/news/UploadBerkas";
import moment from "moment";
interface CabangUnit extends UnitCabang {
  UnitPelayanan: UnitPelayanan;
}

interface DataType extends User {
  key: string | number;
  UnitCabang: CabangUnit;
  Bank: Bank;
}
interface DropdownPelayanan {
  label: string;
  value: string;
}
interface DropdownOptions extends DropdownPelayanan {
  options?: DropdownPelayanan[];
}
interface Pelayanan extends UnitPelayanan {
  UnitCabang: UnitCabang[];
}

export default function MasterUser() {
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openHapus, setOpenHapus] = useState(false);
  const [selected, setSelected] = useState<DataType>();
  const [formData] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>();
  const [dataBank, setDataBank] = useState<DropdownPelayanan[]>();
  const [optionUnit, setOptionUnit] = useState<DropdownOptions[]>();
  const [isBank, setIsBank] = useState(false);
  const [hideCabang, setHideCabang] = useState(false);
  const [role, setRole] = useState<Role>();
  const [upOption, setUpOption] = useState<DropdownPelayanan[]>();
  const [search, setSearch] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [url, setUrl] = useState<any>();

  const handleAction = (record: DataType, type: string) => {
    setSelected(record);
    if (record.bank_id) {
      setIsBank(true);
    } else {
      setIsBank(false);
    }
    setRole(record.role);
    if (type === "edit") {
      setOpenEdit(true);
    } else {
      setOpenHapus(true);
    }
  };

  const getDataUser = async () => {
    const res = await fetch(
      `/api/master/user?page=${page}${search ? "&search=" + search : ""}${
        pageSize ? "&pageSize=" + pageSize : ""
      }`
    );
    const { data, totalLength } = await res.json();
    const pelayanan = await fetch("/api/master/unit/pelayanan");
    const { result, total } = await pelayanan.json();
    let up: DropdownPelayanan[] = [];
    const dropdownPelayanan: DropdownOptions[] = result.map((e: Pelayanan) => {
      const cabang: DropdownPelayanan[] = e.UnitCabang.map((c) => {
        return { label: c.name, value: c.id };
      });
      if (e.UnitCabang.length > 0) {
        up.push({ label: e.name, value: e.UnitCabang[0].id });
      }
      return { label: e.name, value: e.id, options: cabang };
    });
    return { user: data, total: totalLength, pelayanan: dropdownPelayanan, up };
  };

  const handlePost = async (postData: DataType) => {
    postData.username.toLowerCase();
    setLoading(true);
    const result = await fetch("/api/master/user", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(
        url ? { ...postData, picture: url["picture"] } : { ...postData }
      ),
    });
    const res = await result.json();
    if (result.ok) {
      notification.success({ message: res.msg });
      setOpenTambah(false);
    } else {
      notification.error({ message: res.msg });
    }
    await getData();
  };

  const handlePut = async (putData: DataType) => {
    setLoading(true);
    putData.username.toLocaleLowerCase();
    const result = await fetch("/api/master/user", {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(
        url ? { ...putData, picture: url["picture"] } : { ...putData }
      ),
    });
    const res = await result.json();
    if (result.ok) {
      message.success(res.msg);
      setOpenEdit(false);
    } else {
      message.error(res.msg);
    }
    await getData();
  };

  const handleDelete = async (id: string | number) => {
    setLoading(true);
    const result = await fetch("/api/master/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    const res = await result.json();
    if (result.ok) {
      notification.success({ message: res.msg });
      setOpenHapus(false);
    } else {
      notification.error({ message: res.msg });
    }
    await getData();
  };

  const handleActivate = async (id: string) => {
    setLoading(true);
    const result = await fetch("/api/master/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    if (result.ok) {
      notification.success({ message: "Pengaktifan user berhasil" });
    } else {
      notification.error({ message: "Pengaktifan user gagal" });
    }
    await getData();
  };

  const handleRole = (e: string) => {
    if (
      e === Role.BANK ||
      e === Role.CHECKER ||
      e === Role.MAKER ||
      e === Role.APPROVAL
    ) {
      setIsBank(true);
      setHideCabang(true);
    } else {
      setIsBank(false);
      setHideCabang(false);
    }
  };

  useEffect(() => {
    if (!selected) return;
    formData.setFieldsValue({
      id: selected.id,
      first_name: selected.first_name,
      last_name: selected.last_name,
      username: selected.username,
      email: selected.email,
      no_telepon: selected.no_telepon,
      role: selected.role,
      unit_cabang_id: selected.unit_cabang_id,
      posisi: selected.posisi,
      status_pkwt: selected.status_pkwt,
      bank_id: selected.bank_id,
      nip: selected.nip,
      nik: selected.nik,
      alamat: selected.alamat,
      masa_kontrak: selected.masa_kotrak,
      target: selected.target,
      tempat_lahir: selected.tempat_lahir,
      tanggal_lahir: selected.tanggal_lahir
        ? moment(selected.tanggal_lahir).format("YYYY-MM-DD")
        : "",
    });
  }, [selected]);
  const getData = async () => {
    setLoading(true);
    const { user, total, up, pelayanan } = await getDataUser();
    const resultData: DataType[] = user.map((d: DataType) => {
      return {
        ...d,
        key: d.id,
        cabang: d.unit_cabang_id ? d.UnitCabang?.name : "-",
      };
    });
    setTotal(total);
    setUpOption(up);
    setData(resultData);
    setOptionUnit(pelayanan);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
      const res = await fetch("/api/master/bank");
      const result = await res.json();
      const optBank: DropdownOptions[] = result.result.map((bank: Bank) => {
        return { label: bank.name, value: bank.id };
      });
      setDataBank(optBank);
    })();
  }, [page, search, pageSize]);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "NAMA",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      fixed: window.innerWidth < 600 ? false : "left",
      dataIndex: "first_name",
      key: "firt_name",
      width: 200,
      render(value, record, index) {
        return (
          <>
            {record.first_name} {record.last_name}
          </>
        );
      },
    },
    {
      title: "NIP",
      dataIndex: "nip",
      key: "nip",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
    },
    {
      title: "NIK",
      dataIndex: "nik",
      key: "nik",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
    },
    {
      title: "USERNAME",
      dataIndex: "username",
      key: "username",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
    },
    {
      title: "NO TELEPON",
      dataIndex: "no_telepon",
      key: "no_telepon",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
    },
    {
      title: "STATUS PKWT",
      dataIndex: "status_pkwt",
      key: "status_pkwt",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
    },
    {
      title: "MASA KONTRAK",
      dataIndex: "masa_kotrak",
      key: "masa_kontrak",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
    },
    {
      title: "ROLE",
      dataIndex: "role",
      key: "role",
      width: 100,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "font-semibold text-center",
    },
    {
      title: "AREA PELAYANAN",
      dataIndex: "cabang",
      key: "unit_pelayanan",
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
        return (
          <>
            {record.unit_cabang_id ? record.UnitCabang.UnitPelayanan.name : "-"}
          </>
        );
      },
    },
    {
      title: "UNIT PELAYANAN",
      dataIndex: "cabang",
      width: 150,
      key: "cabang",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
    },
    {
      title: "BANK",
      dataIndex: "bank",
      key: "bank",
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
        return <>{record.bank_id && record.Bank.name}</>;
      },
    },
    {
      title: "TARGET",
      key: "target",
      dataIndex: "target",
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
        return <>{formatNumber(record.target.toFixed(0))}</>;
      },
    },
    {
      title: "STATUS",
      dataIndex: "status_active",
      key: "status_active",
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
        if (value) {
          return (
            <Tag color="green" className="font-semibold">
              ACTIVE
            </Tag>
          );
        } else {
          return (
            <Tag color="red" className="font-semibold">
              INACTIVE
            </Tag>
          );
        }
      },
    },
    {
      title: "AKSI",
      dataIndex: "status_active",
      key: "action",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      width: 100,
      fixed: window.innerWidth < 600 ? false : "right",
      render: (value, record, index) => (
        <div className="flex flex-wrap justify-center gap-2" key={index}>
          <button
            type="button"
            onClick={() => handleAction(record, "edit")}
            className="bg-blue-500 px-2 text-gray-100 rounded hover:bg-blue-600 shadow"
          >
            <Tooltip title="Edit User">{<EditOutlined />}</Tooltip>
          </button>
          {/*  */}
          {value ? (
            <button
              type="button"
              onClick={() => handleAction(record, "hapus")}
              className="bg-red-500 px-2 text-gray-100 rounded hover:bg-red-600 shadow"
            >
              <Tooltip title="Hapus data user">{<DeleteOutlined />}</Tooltip>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleActivate(record.id)}
              className="bg-green-500 px-2 text-gray-100 rounded hover:bg-green-600 shadow"
            >
              <Tooltip title="Update status aktif">
                {<CheckCircleOutlined />}
              </Tooltip>
            </button>
          )}
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="m-1 block sm:flex sm:gap-5">
        <div className="btn-action-top">
          <button
            className="border bg-green-500 text-gray-50 py-1 px-3 rounded-md hover:bg-green-600 text-xs shadow"
            onClick={() => setOpenTambah(true)}
          >
            <UserAddOutlined /> Tambah
          </button>
        </div>
        <div className="pembiayaan">
          <Input.Search
            placeholder="Cari Nama"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        scroll={{ x: "max-content", y: "calc(65vh - 100px)" }}
        size="small"
        pagination={{
          pageSize: pageSize,
          total: total,
          onChange(page, pageSize) {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        loading={loading}
      />

      {/* Modal Tambah */}
      <Modal
        open={openTambah}
        onCancel={() => setOpenTambah(false)}
        title="Tambah User Pengguna Sistem"
        wrapClassName="modal-create"
        width={"100%"}
        footer={[]}
        style={{ top: 20 }}
      >
        <Form onFinish={handlePost} className="my-5" labelCol={{ span: 8 }}>
          <div
            className="block md:flex"
            style={{ height: "73vh", overflowY: "auto" }}
          >
            <div className="flex-1">
              <Form.Item label="Role" name={"role"} required>
                <Select
                  showSearch
                  options={[
                    { value: "MASTER", label: "MASTER" },
                    { value: "ENTRY_DATA", label: "ENTRY DATA" },
                    { value: "VERIFIKASI", label: "VERIFIKASI" },
                    { value: "BANK", label: "SLIK" },
                    // { value: "CHECKER", label: "CHECKER" },
                    // { value: "MAKER", label: "MAKER" },
                    { value: "OPERASIONAL", label: "OPERASIONAL" },
                    { value: "APPROVAL", label: "APPROVAL" },
                    { value: "MARKETING", label: "MARKETING" },
                    { value: "PEMBERKKASAN", label: "PEMBERKASAN" },
                    { value: "KEUANGAN", label: "KEUANGAN" },
                    { value: "BISNIS", label: "BISNIS" },
                  ]}
                  onChange={(e) => handleRole(e)}
                />
              </Form.Item>
              <Form.Item label="Nama Depan" name={"first_name"} required>
                <Input required />
              </Form.Item>
              <Form.Item label="Nama Belakang" name={"last_name"} required>
                <Input required />
              </Form.Item>
              <Form.Item
                label="NIP"
                name={"nip"}
                required={!isBank}
                hidden={isBank}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="NIK"
                name={"nik"}
                required={!isBank}
                hidden={isBank}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Username" name={"username"} required>
                <Input required />
              </Form.Item>
              <Form.Item label="Email" name={"email"} required>
                <Input required />
              </Form.Item>
              <Form.Item label="No Telepon" name={"no_telepon"} required>
                <Input required />
              </Form.Item>
              <Form.Item
                label="Tempat Lahir"
                name={"tempat_lahir"}
                hidden={isBank}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Tanggal Lahir"
                name={"tanggal_lahir"}
                hidden={isBank}
              >
                <Input type="date" />
              </Form.Item>
              <Form.Item label="Password" name={"password"} required>
                <Input.Password required />
              </Form.Item>
              <Form.Item label="Alamat" name={"alamat"} hidden={isBank}>
                <Input.TextArea style={{ height: 70 }} />
              </Form.Item>
              <Form.Item label="Posisi" name={"posisi"}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Status PKWT"
                name={"status_pkwt"}
                hidden={isBank}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Cabang"
                name={"unit_cabang_id"}
                required={!isBank}
                hidden={isBank}
              >
                <Select
                  options={optionUnit}
                  showSearch
                  filterOption={filterOption}
                />
              </Form.Item>
              <Form.Item label="Bank" name={"bank_id"} hidden={!isBank}>
                <Select options={dataBank} />
              </Form.Item>
              <Form.Item
                label="Masa Kontrak"
                name={"masa_kontrak"}
                hidden={isBank}
              >
                <Input type="number" defaultValue={0} />
              </Form.Item>
              <Form.Item label="Target" name={"target"} hidden={isBank}>
                <Input type="number" defaultValue={0} />
              </Form.Item>
              <Form.Item className="md:ps-5">
                <UploadBerkas
                  dir="profile"
                  url="/api/ops/uploads/picture"
                  id=""
                  name="Picture"
                  ext="png"
                  filePath={null}
                  fileType={[
                    "image/png",
                    "image/jpg",
                    "image/jpeg",
                    "image/svg",
                  ]}
                  pathName="picture"
                  setUrl={setUrl}
                />
              </Form.Item>
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
        title="Edit Data User"
        wrapClassName="modal-create"
        width={"100%"}
        footer={[]}
        style={{ top: 20 }}
      >
        <Form
          onFinish={handlePut}
          className="my-5"
          labelCol={{ span: 8 }}
          form={formData}
        >
          <div
            className="block md:flex"
            style={{ height: "73vh", overflowY: "auto" }}
          >
            <div className="flex-1">
              <Form.Item label="ID " name={"id"} hidden>
                <Input />
              </Form.Item>
              <Form.Item label="Role" name={"role"} required>
                <Select
                  showSearch
                  options={[
                    { value: "MASTER", label: "MASTER" },
                    { value: "ENTRY_DATA", label: "ENTRY_DATA" },
                    { value: "VERIFIKASI", label: "VERIFIKASI" },
                    { value: "BANK", label: "SLIK" },
                    // { value: "CHECKER", label: "CHECKER" },
                    // { value: "MAKER", label: "MAKER" },
                    { value: "OPERASIONAL", label: "OPERASIONAL" },
                    { value: "APPROVAL", label: "APPROVAL" },
                    { value: "MARKETING", label: "MARKETING" },
                    { value: "PEMBERKASAN", label: "PEMBERKASAN" },
                    { value: "KEUANGAN", label: "KEUANGAN" },
                    { value: "BISNIS", label: "BISNIS" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Nama Depan" name={"first_name"} required>
                <Input required />
              </Form.Item>
              <Form.Item label="Nama Belakang" name={"last_name"} required>
                <Input required />
              </Form.Item>
              <Form.Item
                label="NIP"
                name={"nip"}
                required={!isBank}
                hidden={isBank}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="NIK"
                name={"nik"}
                required={!isBank}
                hidden={isBank}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Username" name={"username"} required>
                <Input required />
              </Form.Item>
              <Form.Item label="Email" name={"email"} required>
                <Input required />
              </Form.Item>
              <Form.Item label="No Telepon" name={"no_telepon"} required>
                <Input required />
              </Form.Item>
              <Form.Item
                label="Tempat Lahir"
                name={"tempat_lahir"}
                hidden={isBank}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Tanggal Lahir"
                name={"tanggal_lahir"}
                hidden={isBank}
              >
                <Input type="date" />
              </Form.Item>
              <Form.Item label="Posisi" name={"posisi"}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Status PKWT"
                name={"status_pkwt"}
                hidden={isBank}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Alamat" name={"alamat"} hidden={isBank}>
                <Input.TextArea style={{ height: 70 }} />
              </Form.Item>
              <Form.Item
                label="Masa Kontrak"
                name={"masa_kotrans"}
                hidden={isBank}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Password" name={"password"}>
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Cabang"
                name={"unit_cabang_id"}
                required={!isBank}
                hidden={isBank}
              >
                <Select
                  options={optionUnit}
                  showSearch
                  filterOption={filterOption}
                />
              </Form.Item>
              <Form.Item label="Bank" name={"bank_id"} hidden={!isBank}>
                <Select options={dataBank} />
              </Form.Item>
              <Form.Item label="Target" name={"target"} hidden={isBank}>
                <Input type="number" defaultValue={0} />
              </Form.Item>
              <Form.Item className="md:ps-5">
                <UploadBerkas
                  dir="profile"
                  url="/api/ops/uploads/picture"
                  id={selected?.id || ""}
                  name="Picture"
                  ext="png"
                  filePath={selected?.picture || null}
                  fileType={[
                    "image/png",
                    "image/jpg",
                    "image/jpeg",
                    "image/svg",
                  ]}
                  pathName="picture"
                  setUrl={setUrl}
                />
              </Form.Item>
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
        title="Konfirmasi Hapus User/Pengguna"
        footer={[]}
      >
        <p>
          Yakin hapus pengguna dengan username{" "}
          <span className="text-green-500">
            {selected && selected.username}
          </span>{" "}
          ?
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
