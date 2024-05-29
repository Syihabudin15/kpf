"use client";
import {
  LineProps,
  DataMasterDashboard,
} from "@/app/api/dashboard/master/route";
import { formatNumber } from "@/components/utils/inputUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function MasterDashboard() {
  const [line, setLine] = useState<LineProps>();
  const [pie, setPie] = useState<LineProps>();
  const [dataTable, setDataTable] = useState<DataMasterDashboard[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/dashboard/master");
      const { banks, line, months, pie } = await res.json();
      setDataTable(banks);
      setLine({
        series: line,
        options: {
          chart: {
            height: 350,
            type: "area",
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
            enabled: false,
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
        <div className="mt-5 p-0 rounded shadow bg-white">
          <Table
            bordered
            size="small"
            pagination={false}
            columns={columns}
            dataSource={dataTable}
            loading={loading}
            scroll={{ x: 1000 }}
          />
        </div>
      </div>
    </Spin>
  );
}

const columns: TableProps<DataMasterDashboard>["columns"] = [
  {
    title: "SUMBER DANA",
    key: "sumdan",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    render(value, record, index) {
      return <>{record.name.toUpperCase()}</>;
    },
  },
  {
    title: "ANTRI",
    key: "antri",
    dataIndex: "antri",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    render(value, record, index) {
      let plafond = 0;
      record.DataPengajuan.forEach((p) => {
        if (
          p.status_pencairan !== "TRANSFER" &&
          p.status_pencairan !== "BATAL"
        ) {
          plafond += p.DataPembiayaan.plafond;
        }
      });
      return <>{formatNumber(plafond.toFixed(0))}</>;
    },
  },
  {
    title: "DITOLAK",
    key: "tolak",
    dataIndex: "tolak",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    render(value, record, index) {
      let plafond = 0;
      record.DataPengajuan.forEach((p) => {
        if (p.status_pencairan === "BATAL") {
          plafond += p.DataPembiayaan.plafond;
        }
      });
      return <>{formatNumber(plafond.toFixed(0))}</>;
    },
  },
  {
    title: "DROPPING",
    key: "dropping",
    dataIndex: "dropping",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    render(value, record, index) {
      let plafond = 0;
      record.DataPengajuan.forEach((p) => {
        if (p.status_pencairan === "TRANSFER") {
          plafond += p.DataPembiayaan.plafond;
        }
      });
      return <>{formatNumber(plafond.toFixed(0))}</>;
    },
  },
  {
    title: "OS",
    key: "os",
    dataIndex: "os",
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    render(value, record, index) {
      let plafond = 0;
      record.DataPengajuan.forEach((p) => {
        if (p.status_pencairan === "TRANSFER") {
          plafond +=
            p.DataPembiayaan.plafond -
            (p.DataPembiayaan.plafond * (p.DataPembiayaan.by_admin_bank / 100) +
              p.DataPembiayaan.by_buka_rekening);
        }
      });
      return <>{formatNumber(plafond.toFixed(0))}</>;
    },
  },
];
