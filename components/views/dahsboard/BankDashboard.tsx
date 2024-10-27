"use client";

import {
  DataDashboardBank,
  PengajuanBank,
} from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { LineProps } from "@/app/api/dashboard/master/route";
import ReactApexChart from "react-apexcharts";

export default function BankDashboard() {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState<any[]>();
  const [line, setLine] = useState<LineProps>();
  const [pie, setPie] = useState<LineProps>();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const resTable = await fetch("/api/dashboard/bank", {
        next: { revalidate: 60 },
      });
      const { dataTable, line, months, pie } = await resTable.json();
      setDataTable(dataTable);
      setLine({
        series: [line],
        options: {
          chart: {
            height: 350,
            type: "area",
            toolbar: {
              show: false,
            },
          },
          stroke: {
            curve: "smooth",
          },
          xaxis: {
            categories: months,
          },
          yaxis: {
            labels: {
              show: true,
              formatter: function (val: number) {
                return formatNumber(val.toFixed(0));
              },
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val: number) {
              return formatNumber(val.toFixed(0));
            },
            style: {
              fontSize: "10px",
            },
          },
        },
      });
      const { label, data } = pie;
      setPie({
        series: data,
        options: {
          chart: {
            width: 200,
            type: "donut",
          },
          dataLabels: {
            enabled: true,
            formatter: function (val: number) {
              return val.toFixed(2) + "%";
            },
            style: {
              fontSize: "10px",
            },
          },
          labels: label,
          legend: {
            show: true,
            position: "bottom",
            horizontalAlign: "center",
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
              },
            },
          ],
        },
      });
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-0">
      <Spin spinning={loading}>
        <div className="px-0">
          <div className="flex flex-col sm:flex-row justify-between gap-5">
            <div className="bg-white p-1 rounded shadow" style={{ flex: 1.2 }}>
              {line ? (
                <ReactApexChart
                  options={line.options}
                  series={line.series}
                  type="area"
                  height={350}
                />
              ) : (
                <LoadingOutlined />
              )}
            </div>
            <div className="bg-white p-1 rounded shadow" style={{ flex: 0.8 }}>
              {pie ? (
                <ReactApexChart
                  options={pie.options}
                  series={pie.series}
                  type="donut"
                />
              ) : (
                <LoadingOutlined />
              )}
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="mt-2">
          <div className="bg-orange-500 text-white p-3 text-center rounded">
            <p>DATA PENCAIRAN</p>
          </div>
          <div className="bg-white p-2">
            <Table
              columns={columns}
              dataSource={dataTable?.map((e: DataDashboardBank) => {
                return { ...e, key: e.id };
              })}
              bordered
              size="middle"
              scroll={{ x: "max-content", y: "calc(65vh - 100px)" }}
              loading={loading}
              pagination={false}
              expandable={{
                expandedRowRender: (record) => {
                  return (
                    <Table
                      columns={columnsExpand}
                      dataSource={record.DataPengajuan.map((e: any) => {
                        return { ...e, key: e.id };
                      })}
                      bordered
                      size="small"
                      scroll={{ x: 1000 }}
                      pagination={false}
                    />
                  );
                },
              }}
            />
          </div>
        </div>
        {/* End Table */}
      </Spin>
    </div>
  );
}
const columns: TableProps<DataDashboardBank>["columns"] = [
  {
    title: "PRODUK PEMBIAYAAN",
    dataIndex: "produk",
    key: "produk",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>{record.name}</>;
    },
  },
  {
    title: "NOA",
    dataIndex: "noa",
    key: "noa",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return <>{record.DataPengajuan.length}</>;
    },
  },
  {
    title: "PLAFON",
    dataIndex: "plafond",
    key: "plafond",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      let plaf = 0;
      record.DataPengajuan.forEach((p) => {
        plaf += p.DataPembiayaan.plafond;
      });
      return <>{formatNumber(plaf.toFixed(0))}</>;
    },
  },
];

const columnsExpand: TableProps<PengajuanBank>["columns"] = [
  {
    title: "TANGGAL PENCAIRAN",
    key: "tanggal_pencairan",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "tanggal_pencairan",
    render(value, record, index) {
      return (
        <>
          {record.tanggal_pencairan &&
            moment(record.tanggal_pencairan).format("DD-MM-YYYY")}
        </>
      );
    },
  },
  {
    title: "NOPEN",
    key: "nopen",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "nopen",
    render(value, record, index) {
      return <>{record.DataPembiayaan.nopen}</>;
    },
  },
  {
    title: "NAMA PEMOHON",
    key: "nama",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    dataIndex: "nama",
    render(value, record, index) {
      return <>{record.DataPembiayaan.name}</>;
    },
  },
  {
    title: "TENOR",
    key: "tenor",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "tenor",
    render(value, record, index) {
      return <>{record.DataPembiayaan.tenor}</>;
    },
  },
  {
    title: "PLAFOND",
    key: "plafond",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    fixed: "right",
    className: "text-center",
    dataIndex: "plafond",
    render(value, record, index) {
      return <>{formatNumber(record.DataPembiayaan.plafond.toFixed(0))}</>;
    },
  },
];
