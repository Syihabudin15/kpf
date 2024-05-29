"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Spin } from "antd";

export default function ChartBank() {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/entry_data", { method: "PUT" });
    const { data, labels } = await res.json();
    setData({
      options: {
        chart: {
          id: "DashboardEntry",
        },
        xaxis: {
          categories: labels,
        },
      },
      series: [
        {
          name: "Dropping",
          data: data,
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
