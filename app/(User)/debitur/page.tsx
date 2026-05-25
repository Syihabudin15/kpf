"use client";

import { Button } from "antd";
import { useState } from "react";
import { ExportData } from "@/components/Utils";

export default function Page() {
  const [load, setLoad] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const starting = async () => {
    setLoad(true);
    const res = await fetch("/api/debitur");
    const { data } = await res.json();

    ExportData([{ sheetname: "dapem", data: data }], "mirations");
    setLoad(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Button type="primary" loading={load} onClick={() => starting()}>
          Start Export
        </Button>
        <div>
          <p>{msg}</p>
        </div>
      </div>
    </div>
  );
}
