"use client";

import { DataCost } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Input, Table, TableProps } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ModalCost = dynamic(() => import("@/components/utils/ModalCost"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function AlternatifCost() {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState<string>();
  const [data, setData] = useState<DataCost[]>();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/administrasi/alternatif-cost?page=${page}${
        name ? "&name=" + name : ""
      }`
    );
    const { data, total } = await res.json();
    setTotal(total);
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [page, name]);

  const columns: TableProps<DataCost>["columns"] = [
    {
      title: "NO",
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
      title: "NAMA",
      key: "name",
      dataIndex: "name",
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
      title: "KETERANGAN",
      key: "keterangan",
      dataIndex: "keterangan",
      width: 220,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-justify",
    },
    {
      title: "NOMINAL",
      key: "nominal",
      width: 150,
      dataIndex: "nominal",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.nominal.toFixed(0))}</>;
      },
    },
    {
      title: "PEMBUAT",
      key: "user",
      width: 200,
      dataIndex: "user",
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
            {record.User.first_name} {record.User.last_name}
          </>
        );
      },
    },
    {
      title: "AKSI",
      key: "aksi",
      width: 100,
      dataIndex: "aksi",
      render(value, record, index) {
        return (
          <div className="flex gap-2 justify-center">
            <ModalCost isEdit={true} getData={getData} data={record} />
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded shadow text-xs"
              disabled
              style={{ opacity: 0.5 }}
            >
              <DeleteOutlined />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="m-1 block sm:flex sm:gap-5">
        <div>
          <ModalCost isEdit={false} getData={getData} />
        </div>
        <div className="pembiayaan">
          <Input.Search onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
      <div>
        <Table
          dataSource={data}
          columns={columns}
          size="small"
          scroll={{ x: "max-content", y: "calc(65vh - 100px)" }}
          bordered
          loading={loading}
          pagination={{
            pageSize: 20,
            total: total,
            onChange(page, pageSize) {
              setPage(page);
            },
          }}
        />
      </div>
    </div>
  );
}
