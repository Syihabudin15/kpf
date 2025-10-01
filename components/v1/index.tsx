"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

// PAGES
export const MonitoringUI = dynamic(() => import("./Monitoring"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export const KreditKaryawan = dynamic(() => import("./KreditKaryawan"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export const TagihanUI = dynamic(() => import("./Tagihan"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

// UTILS
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
export const FormInput = dynamic(
  () => import("./viewUtils").then((d) => d.FormInput),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
