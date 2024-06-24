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

export default function FixedCost() {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState<string>();
  const [data, setData] = useState<DataCost[]>();
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(20);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/administrasi/fixed-cost?page=${page}${name ? "&name=" + name : ""}`
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
        return <>{(page - 1) * pageSize + (index + 1)}</>;
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
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-justify",
      width: 220,
    },
    {
      title: "NOMINAL",
      key: "nominal",
      dataIndex: "nominal",
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
        return <>{formatNumber(record.nominal.toFixed(0))}</>;
      },
    },
    {
      title: "PEMBUAT",
      key: "user",
      dataIndex: "user",
      width: 200,
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
      dataIndex: "aksi",
      width: 100,
      render(value, record, index) {
        return (
          <div className="flex gap-2 justify-center">
            <ModalCost
              isEdit={true}
              getData={getData}
              data={record}
              is_fixed={true}
            />
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
          <ModalCost isEdit={false} getData={getData} is_fixed={true} />
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
          scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
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
