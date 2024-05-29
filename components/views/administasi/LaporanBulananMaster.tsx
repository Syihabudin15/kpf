"use client";

import { DataCost, DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { DatePicker, Spin, Table, TableProps } from "antd";
import { useEffect, useState } from "react";

export default function LaporanBulananMaster() {
  const [month, setMonth] = useState<string>();
  const [dataTable, setDataTable] = useState<DataDataPengajuan[]>();
  const [dataChart, setDataChart] = useState<number[]>();
  const [dataCost, setDataCost] = useState<DataCost[]>();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/administrasi/bulanan${month ? "?month=" + month : ""}`
    );
    const { dataTable, dataChart, dataCost } = await res.json();
    setDataTable(dataTable);
    setDataChart(dataChart);
    setDataCost(dataCost);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
      console.log({ dataChart, dataCost, dataTable });
    })();
  }, [month]);

  return (
    <Spin spinning={loading}>
      <div className="flex gap-2 my-1">
        <DatePicker
          picker="month"
          onChange={(date, datestring) => setMonth(datestring as string)}
          placeholder={`${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }`}
        />
      </div>
      <div>
        <div>
          <div className="p-2 text-xs text-white bg-blue-500 italic">
            <p>
              Data Pemsukan bulan{" "}
              {new Date(month ? `${month}-11` : new Date()).toLocaleString(
                "id-ID",
                {
                  month: "long",
                }
              )}{" "}
              {month ? month.split("-")[0] : new Date().getFullYear()}
            </p>
          </div>
          <div>
            <Table />
          </div>
        </div>
        <div className="mt-5">
          <div className="p-2 text-xs text-white bg-blue-500 italic">
            <p>
              Data Pengeluaran bulan{" "}
              {new Date(month ? `${month}-11` : new Date()).toLocaleString(
                "id-ID",
                {
                  month: "long",
                }
              )}{" "}
              {month ? month.split("-")[0] : new Date().getFullYear()}
            </p>
          </div>
          <div>
            <Table
              columns={columns}
              dataSource={dataCost}
              size="small"
              bordered
              pagination={false}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}

const columns: TableProps<DataCost>["columns"] = [
  {
    title: "NO",
    key: "no",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "no",
    width: 50,
    render(value, record, index) {
      return <>{index + 1}</>;
    },
  },
  {
    title: "NAMA",
    key: "name",
    dataIndex: "name",
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
    width: 200,
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
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "user",
    render(value, record, index) {
      return (
        <>
          {record.User.first_name} {record.User.last_name}
        </>
      );
    },
  },
];
