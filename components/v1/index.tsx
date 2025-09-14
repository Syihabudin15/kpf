"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

export const MonitoringUI = dynamic(() => import("./Monitoring"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});
export const ViewBerkas = dynamic(
  () => import("./viewUtils").then((d) => d.ViewBerkas),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
export const ViewBerkasPengajuan = dynamic(
  () => import("./viewUtils").then((d) => d.ViewBerkasPengajuan),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
