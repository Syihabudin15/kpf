"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

import { Spin } from "antd";

export default function ChartMarketing() {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/marketing", { method: "PUT" });
    const { dataChart, labels } = await res.json();
    setData({
      options: {
        chart: {
          id: "DashboardMarketing",
        },
        xaxis: {
          categories: labels,
        },
      },
      series: [
        {
          name: "Dropping",
          data: dataChart,
        },
      ],
    });
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  return (
    <Spin spinning={loading}>
      {data ? (
        <Chart
          options={data.options}
          series={data.series}
          type="bar"
          height={300}
        />
      ) : (
        <div className="flex justify-center">
          Loading Chart <LoadingOutlined />
        </div>
      )}
    </Spin>
  );
}
