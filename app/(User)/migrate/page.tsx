"use client";

import { Button } from "antd";
import { useState } from "react";

export default function Page() {
  const [msg, setMsg] = useState<string | null>(null);
  const [load, setLoad] = useState(false);

  const starting = async () => {
    setLoad(true);
    await fetch("/api/migratefiles", { method: "POST" })
      .then((res) => res.json())
      .then((res) => {
        setMsg(res.msg);
      })
      .catch((err) => {
        setMsg(err.message || "Internal server Error");
      });
    setLoad(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button type="primary" loading={load} onClick={() => starting()}>
        Start Migration
      </Button>
      <div>
        <p>{msg}</p>
      </div>
    </div>
  );
}
