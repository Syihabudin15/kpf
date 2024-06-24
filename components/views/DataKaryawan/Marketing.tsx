"use client";
import CetakDataKaryawan from "@/components/utils/CetakDataKaryawan";
import { DataDataUser } from "@/components/utils/Interfaces";
import { Input, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export default function DataMarketing() {
  const [data, setData] = useState<DataDataUser[]>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [jumlah, setJumlah] = useState(0);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/data-karyawan?page=${page}${name ? "&name=" + name : ""}`
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
  }, [page, name]);

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
      </div>
      <div className="p-2">
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          bordered
          size="small"
          scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
          pagination={{
            pageSize: 20,
            onChange(page, pageSize) {
              setPage(page);
            },
            total: total,
          }}
        />
      </div>
    </div>
  );
}

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
    className: "text-center",
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
              {moment(record.created_at)
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
];
