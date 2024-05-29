"use client";
import { Table, TableProps } from "antd";

export default function AdmpExpress() {
  return (
    <div>
      <div className="p-2">
        <Table
          columns={columns}
          bordered
          size="small"
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
}

const columns: TableProps<any>["columns"] = [
  {
    title: "Periode",
    key: "periode",
    dataIndex: "periode",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
  },
  {
    title: "Express",
    dataIndex: "express",
    key: "express",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          background: "#dc2626",
          color: "#f3f4f6",
          textAlign: "center",
        },
      };
    },
    children: [
      {
        title: "NOA",
        dataIndex: "noa",
        key: "noa",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              background: "#dc2626",
              color: "#f3f4f6",
              textAlign: "center",
            },
          };
        },
      },
      {
        title: "Plafon",
        dataIndex: "plafon",
        key: "plafon",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              background: "#dc2626",
              color: "#f3f4f6",
              textAlign: "center",
            },
          };
        },
      },
      {
        title: "Angsuran",
        dataIndex: "angsuran",
        key: "angsuran",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              background: "#dc2626",
              color: "#f3f4f6",
              textAlign: "center",
            },
          };
        },
      },
    ],
  },
  {
    title: "Status Produk Express",
    dataIndex: "status_express",
    key: "status_express",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          background: "#172554",
          color: "#f3f4f6",
          textAlign: "center",
        },
      };
    },
    children: [
      {
        title: "Clear",
        dataIndex: "clear",
        key: "clear",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              background: "#172554",
              color: "#f3f4f6",
              textAlign: "center",
            },
          };
        },
        children: [
          {
            title: "NOA",
            key: "noa",
            dataIndex: "noa",
            onHeaderCell: (text, record) => {
              return {
                ["style"]: {
                  background: "#172554",
                  color: "#f3f4f6",
                  textAlign: "center",
                },
              };
            },
          },
          {
            title: "%",
            key: "%",
            dataIndex: "%",
            onHeaderCell: (text, record) => {
              return {
                ["style"]: {
                  background: "#172554",
                  color: "#f3f4f6",
                  textAlign: "center",
                },
              };
            },
          },
          {
            title: "Plafon",
            key: "plafon",
            dataIndex: "plafon",
            onHeaderCell: (text, record) => {
              return {
                ["style"]: {
                  background: "#172554",
                  color: "#f3f4f6",
                  textAlign: "center",
                },
              };
            },
          },
        ],
      },
      {
        title: "Not Clear",
        dataIndex: "not_clear",
        key: "not_clear",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              background: "#991b1b",
              color: "#f3f4f6",
              textAlign: "center",
            },
          };
        },
        children: [
          {
            title: "NOA",
            key: "noa",
            dataIndex: "noa",
            onHeaderCell: (text, record) => {
              return {
                ["style"]: {
                  background: "#991b1b",
                  color: "#f3f4f6",
                  textAlign: "center",
                },
              };
            },
          },
          {
            title: "%",
            key: "%",
            dataIndex: "%",
            onHeaderCell: (text, record) => {
              return {
                ["style"]: {
                  background: "#991b1b",
                  color: "#f3f4f6",
                  textAlign: "center",
                },
              };
            },
          },
          {
            title: "Plafon",
            key: "plafon",
            dataIndex: "plafon",
            onHeaderCell: (text, record) => {
              return {
                ["style"]: {
                  background: "#991b1b",
                  color: "#f3f4f6",
                  textAlign: "center",
                },
              };
            },
          },
        ],
      },
    ],
  },
  {
    title: "Status Produk MD",
    dataIndex: "status_md",
    key: "status_md",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          background: "#dc2626",
          color: "#f3f4f6",
          textAlign: "center",
        },
      };
    },
    children: [
      {
        title: "MD Express",
        dataIndex: "md_express",
        key: "md_express",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              background: "#dc2626",
              color: "#f3f4f6",
              textAlign: "center",
            },
          };
        },
        children: [
          {
            title: "NOA",
            key: "noa",
            dataIndex: "noa",
            onHeaderCell: (text, record) => {
              return {
                ["style"]: {
                  background: "#dc2626",
                  color: "#f3f4f6",
                  textAlign: "center",
                },
              };
            },
          },
          {
            title: "%",
            key: "%",
            dataIndex: "%",
            onHeaderCell: (text, record) => {
              return {
                ["style"]: {
                  background: "#dc2626",
                  color: "#f3f4f6",
                  textAlign: "center",
                },
              };
            },
          },
          {
            title: "Plafon",
            key: "plafon",
            dataIndex: "plafon",
            onHeaderCell: (text, record) => {
              return {
                ["style"]: {
                  background: "#dc2626",
                  color: "#f3f4f6",
                  textAlign: "center",
                },
              };
            },
          },
        ],
      },
    ],
  },
];
