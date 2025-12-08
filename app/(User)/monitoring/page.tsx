"use client";

import { IDapem, IPageData } from "@/components/IInterfaces";
import { ReadOutlined } from "@ant-design/icons";
import { JePem, Sumdan } from "@prisma/client";
import { App, Card } from "antd";
import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<IPageData<IDapem>>({
    loading: false,
    page: 1,
    limit: 50,
    data: [],
    total: 0,
    upsert: false,
    delete: false,
    selected: undefined,
    search: null,
    backdate: null,
    jePemId: null,
    final_status: null,
  });
  const [sumdans, setSumdans] = useState<Sumdan[]>([]);
  const [jeniss, setJeniss] = useState<JePem[]>([]);
  const { modal } = App.useApp();

  const getData = async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const params = new URLSearchParams();
    params.append("page", data.page.toString());
    params.append("limit", data.limit.toString());
    if (data.search) {
      params.append("search", data.search);
    }
    if (data.sumdanId) {
      params.append("sumdanId", data.sumdanId);
    }
    if (data.jePemId) {
      params.append("jePemId", data.jePemId);
    }
    if (data.final_status) {
      params.append("final_status", data.final_status);
    }
    if (data.backdate) {
      params.append("backdate", data.backdate);
    }
    await fetch(`/api/dapem?${params.toString()}`)
      .then((res) => res.json())
      .then((res) => {
        setData((prev) => ({ ...prev, data: res.data, total: res.total }));
      });
    setData((prev) => ({ ...prev, loading: true }));
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [
    data.page,
    data.limit,
    data.search,
    data.sumdanId,
    data.jePemId,
    data.final_status,
    data.backdate,
  ]);

  useEffect(() => {
    (async () => {
      await fetch("/api/sumdan")
        .then((res) => res.json())
        .then((res) => setSumdans(res.data));
      await fetch("/api/jenis")
        .then((res) => res.json())
        .then((res) => setJeniss(res.data));
    })();
  }, []);

  return (
    <Card
      title={
        <div>
          <ReadOutlined /> Monitoring Pembiayaan
        </div>
      }
      styles={{ body: { padding: 2 } }}
    >
      <p>Isis Monitoring</p>
    </Card>
  );
}
