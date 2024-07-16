"use client";
import { flagging } from "@prisma/client";
import { Input, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import CetakFlagging from "./CetakFlagging";

export default function Flagging() {
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<flagging[]>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/flagging?page=${page}${pageSize ? "&pageSize=" + pageSize : ""}${
        name ? "&name=" + name : ""
      }`
    );
    const { data, total } = await res.json();
    setData(data);
    setTotal(total);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [name, page, pageSize]);

  return (
    <div>
      <div className="m-1 block sm:flex sm:gap-5">
        <div className="pembiayaan">
          <Input.Search onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="pembiayaan">
          <CetakFlagging data={data || []} />
        </div>
      </div>
      <div>
        <Table
          dataSource={data}
          columns={columns}
          size="small"
          scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
          bordered
          loading={loading}
          pagination={{
            pageSize: pageSize,
            total: total,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </div>
    </div>
  );
}

const columns: TableProps<flagging>["columns"] = [
  {
    title: "No",
    key: "no",
    dataIndex: "no",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 50,
    render(value, record, index) {
      return <>{index + 1}</>;
    },
  },
  {
    title: "NOTAS",
    key: "notas",
    dataIndex: "notas",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 100,
  },
  {
    title: "NAMA PENERIMA",
    key: "nama_penerima",
    dataIndex: "nama_penerima",
    // className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 150,
  },
  {
    title: "TANGGAL LAHIR",
    key: "tgllahir_penerima",
    dataIndex: "tgllahir_penerima",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 150,
  },
  {
    title: "NIPNRP",
    key: "nipnrp",
    dataIndex: "nipnrp",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 100,
  },
  {
    title: "ALAMAT RUMAH",
    key: "alamatrumah",
    dataIndex: "alamatrumah",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 200,
  },
  {
    title: "KANTOR CABANG",
    key: "kantor_cabang",
    dataIndex: "kantor_cabang",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 100,
  },
  {
    title: "ALAMAT CABANG",
    key: "alamat_cabang",
    dataIndex: "alamat_cabang",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 200,
  },
  {
    title: "JANDA JUDA YP DARI",
    key: "jandadudaypdari",
    dataIndex: "jandadudaypdari",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 150,
  },
  {
    title: "TANGGAL LAHIR JANDA DUDA YP",
    key: "tgllahir_jandadudayp",
    dataIndex: "tgllahir_jandadudayp",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 150,
  },
  {
    title: "NOMOR SKEP",
    key: "noskep",
    dataIndex: "noskep",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 150,
  },
  {
    title: "JENIS DAPEM",
    key: "jnsdapem",
    dataIndex: "jnsdapem",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 150,
  },
  {
    title: "KANTOR BAYAR DAPEM",
    key: "ktrbaydapem",
    dataIndex: "ktrbaydapem",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    width: 150,
  },
];
