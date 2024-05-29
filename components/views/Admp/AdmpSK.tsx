"use client";
import { Table, TableProps } from "antd";

export default function AdmpSK() {
  return (
    <div>
      <div className="p-2">
        <Table
          columns={columns}
          dataSource={tempData}
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
    render(value, record, index) {
      return <>{record.periode}</>;
    },
  },
  {
    title: "SK",
    dataIndex: "sk",
    key: "sk",
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
        render(value, record, index) {
          return <>{record.noa}</>;
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
        render(value, record, index) {
          return <>{record.plafon}</>;
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
        render(value, record, index) {
          return <>{record.angsuran}</>;
        },
      },
    ],
  },
  {
    title: "Status Produk SK",
    dataIndex: "status_sk",
    key: "status_sk",
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
            render(value, record, index) {
              return <>{record.StatusProduk.Clear.noa}</>;
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
            render(value, record, index) {
              return <>{record.StatusProduk.Clear.persentase}</>;
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
            render(value, record, index) {
              return <>{record.StatusProduk.Clear.plafon}</>;
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
            render(value, record, index) {
              return <>{record.StatusProduk.NotClear.noa}</>;
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
            render(value, record, index) {
              return <>{record.StatusProduk.NotClear.persentase}</>;
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
            render(value, record, index) {
              return <>{record.StatusProduk.NotClear.plafon}</>;
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
        title: "MD SK",
        dataIndex: "md_sk",
        key: "md_sk",
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
            render(value, record, index) {
              return <>{record.StatusMD.noa}</>;
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
            render(value, record, index) {
              return <>{record.StatusMD.persentase}</>;
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
            render(value, record, index) {
              return <>{record.StatusMD.plafon}</>;
            },
          },
        ],
      },
    ],
  },
];

const tempData = [
  {
    periode: "Januari",
    noa: 10,
    plafon: 10000000,
    angsuran: 1000000,
    StatusProduk: {
      Clear: {
        noa: 12,
        persentase: 10,
        plafon: 10000000,
      },
      NotClear: {
        noa: 12,
        persentase: 10,
        plafon: 10000000,
      },
    },
    StatusMD: {
      noa: 12,
      persentase: 10,
      plafon: 10000000,
    },
  },
];
