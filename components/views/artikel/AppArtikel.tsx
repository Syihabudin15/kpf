"use client";

import { DataCategory } from "@/components/utils/Interfaces";
import { FormOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Blog } from "@prisma/client";
import { Button, Table, TableProps } from "antd";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import CreateCategory from "./CreateCategory";

export default function AppArtikel() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<DataCategory[]>([]);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(`/api/article?page=${page}`);
    const { data } = await res.json();
    setData(data);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [page]);

  const columns: TableProps<Blog>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 50,
      className: "text-center",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{index + 1}</>;
      },
    },
    {
      title: "TITLE",
      dataIndex: "title",
      key: "title",
      width: 150,
      className: "text-center",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.title}</>;
      },
    },
    {
      title: "CREATED AT",
      dataIndex: "create",
      key: "create",
      width: 100,
      className: "text-center",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{moment(record.created_at).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "UPDATED AT",
      dataIndex: "update",
      key: "update",
      width: 100,
      className: "text-center",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <>
            {record.updated_at &&
              moment(record.updated_at).format("DD-MM-YYYY")}
          </>
        );
      },
    },
    {
      title: "STATISTIC",
      dataIndex: "statistic",
      key: "statistic",
      className: "text-center",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      children: [
        {
          title: "VIEW",
          key: "view",
          dataIndex: "view",
          className: "text-center",
          width: 80,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return <>{record.view}</>;
          },
        },
        {
          title: "LIKE",
          key: "like",
          dataIndex: "like",
          className: "text-center",
          width: 80,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return <>{record.like}</>;
          },
        },
        {
          title: "DISLIKE",
          key: "dislike",
          dataIndex: "dislike",
          className: "text-center",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          width: 80,
          render(value, record, index) {
            return <>{record.dislike}</>;
          },
        },
      ],
    },
    {
      title: "STATUS",
      key: "status",
      dataIndex: "status",
      className: "text-center",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 100,
      render(value, record, index) {
        return (
          <>
            {record.is_active ? (
              <div className="bg-green-500 py-1 px-4 text-white font-bold italic text-xs">
                ACTIVE
              </div>
            ) : (
              <div className="bg-red-500 py-1 px-4 text-white font-bold italic text-xs">
                ACTIVE
              </div>
            )}
          </>
        );
      },
    },
    {
      title: "ACTION",
      key: "aksi",
      dataIndex: "aksi",
      className: "text-center",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 80,
      render(value, record, index) {
        return (
          <a
            className="flex justify-center"
            href={`/artikel/update/${record.slug}`}
          >
            <Button icon={<FormOutlined />} type="primary"></Button>
          </a>
        );
      },
    },
  ];

  return (
    <div>
      <div className="py-1 flex gap-2 items-center">
        <Link href={"/artikel/create"}>
          <button className="bg-green-500 hover:bg-green-600 text-white text-xs rounded shadow py-1 px-4">
            <PlusCircleOutlined /> New article
          </button>
        </Link>
        <CreateCategory getData={getData} />
      </div>
      <div>
        {data &&
          data.map((e, i) => (
            <div key={i}>
              <div
                className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 text-white font-bold italic p-2 text-xs text-center flex gap-3 justify-center items-center`}
              >
                <span>{e.name.toUpperCase()}</span>{" "}
                <CreateCategory data={e} key={e.id} getData={getData} />
              </div>
              <Table
                columns={columns}
                dataSource={e.Blog}
                loading={loading}
                bordered
                size="small"
                pagination={{
                  onChange(page, pageSize) {
                    setPage(page);
                  },
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
