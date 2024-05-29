"use client";
import {
  CheckCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Maintenance } from "@prisma/client";
import { Input, Table, TableProps, message } from "antd";
import { useEffect, useState } from "react";

export default function MasterMaintenance() {
  const [page, setPage] = useState<number>(1);
  const [route, setRoute] = useState<string>();
  const [data, setData] = useState<Maintenance[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const result = await fetch(
      `/api/master/maintenance?page=${page}${route ? "&route=" + route : ""}`
    );
    const { data, total } = await result.json();
    setData(data);
    setTotal(total);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [page, route]);

  const updateStatus = async (record: Maintenance) => {
    setLoading(true);
    const res = await fetch("/api/master/maintenance", {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({
        id: record.id,
        is_maintenance: !record.is_maintenance,
      }),
    });
    const result = await res.json();
    message.success(result.msg);
    await getData();
    setLoading(false);
  };

  const columns: TableProps<Maintenance>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 50,
      render(value, record, index) {
        return <>{index + 1}</>;
      },
    },
    { title: "Route", dataIndex: "route", key: "route" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
          className: "example-class-in-td",
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-center">
            <div
              className={`text-center rounded py-1 px-5 bg-${
                record.is_maintenance ? "red" : "green"
              }-500 text-white`}
            >
              {record.is_maintenance ? "Maintenance" : "Active"}
            </div>
          </div>
        );
      },
    },
    // {title: "Waktu (menit)", key: "timeInMinutes", dataIndex: "timeInMinutes"},
    {
      title: "Aksi",
      width: 80,
      dataIndex: "id",
      key: "id",
      fixed: "right",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
          className: "example-class-in-td",
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-center">
            {record.is_maintenance ? (
              <button
                className="bg-red-500 text-white py-1 px-3 rounded shadow"
                onClick={() => updateStatus(record)}
              >
                <MinusCircleOutlined />
              </button>
            ) : (
              <button
                className="bg-green-500 text-white py-1 px-3 rounded shadow"
                onClick={() => updateStatus(record)}
              >
                <CheckCircleOutlined />
              </button>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="flex gap-3 py-2">
        <button className="bg-green-500 py-1 px-3 text-white text-center flex gap-2 rounded shadow items-center text-xs">
          <PlusCircleOutlined /> Tambah
        </button>
        <Input.Search
          onChange={(e) => setRoute(e.target.value)}
          style={{ width: 200 }}
        />
      </div>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        size="small"
        bordered
        scroll={{ x: 400 }}
        pagination={{
          pageSize: 20,
          total: total,
          onChange(page, pageSize) {
            setPage(page);
          },
        }}
      />
    </div>
  );
}
