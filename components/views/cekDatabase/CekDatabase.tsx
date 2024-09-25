"use client";
import { flagging } from "@prisma/client";
import { Input, notification, Spin } from "antd";
import { useEffect, useState } from "react";

export default function CekDatabase() {
  const [data, setData] = useState<flagging>();
  const [loading, setLoading] = useState(false);
  const [nopen, setNopen] = useState<string>();
  const [tempNopen, setTempNopen] = useState<string>();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(
        `/api/flagging/cek-nopen${nopen ? "?nopen=" + nopen : ""}`
      );
      if (!res.ok && nopen) {
        setLoading(false);
        return notification.info({ message: "Maaf nopen tidak ditemukan" });
      }
      const { data } = await res.json();
      setData(data);
      setLoading(false);
    })();
  }, [nopen]);

  return (
    <div className="bg-white px-2 py-5">
      <div className="flex justify-center gap-5 w-full sm:w-2/3 mx-auto mb-8">
        <Input
          placeholder="Nopen"
          onChange={(e) => setTempNopen(e.target.value)}
        />{" "}
        <button
          className="bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded shadow"
          onClick={() => setNopen(tempNopen)}
        >
          Cek
        </button>
      </div>
      <Spin spinning={loading}>
        <div className="flex gap-5 my-2">
          <div className="flex-1 border p-1">
            <div className="my-3 flex gap-2">
              <span style={{ width: 120 }}>Nama</span>
              <span style={{ width: 10 }}>:</span>
              <span style={{ width: 300 }}>{data && data.nama_penerima}</span>
            </div>
            <div className="my-3 flex gap-2">
              <span style={{ width: 120 }}>Alamat</span>
              <span style={{ width: 10 }}>:</span>
              <span style={{ width: 300 }}>{data && data.alamatrumah}</span>
            </div>
            <div className="my-3 flex gap-2">
              <span style={{ width: 120 }}>No SKEP</span>
              <span style={{ width: 10 }}>:</span>
              <span style={{ width: 300 }}>{data && data.noskep}</span>
            </div>
            <div className="my-3 flex gap-2">
              <span style={{ width: 120 }}>Tanggal SKEP</span>
              <span style={{ width: 10 }}>:</span>
              <span style={{ width: 300 }}>{data && data.tglskep}</span>
            </div>
            <div className="my-3 flex gap-2">
              <span style={{ width: 120 }}>TMT Pensiun</span>
              <span style={{ width: 10 }}>:</span>
              <span style={{ width: 300 }}>{data && data.tmtpens}</span>
            </div>
            <div className="my-3 flex gap-2">
              <span style={{ width: 120 }}>Tanggal Lahir</span>
              <span style={{ width: 10 }}>:</span>
              <span style={{ width: 300 }}>
                {data && data.tgllahir_penerima}
              </span>
            </div>
          </div>
          <div className="flex-1 border p-1">
            <div className="my-3 flex gap-2">
              <span style={{ width: 120 }}>Jenis Pensiun</span>
              <span style={{ width: 10 }}>:</span>
              <span style={{ width: 300 }}>{data && data.jnspens}</span>
            </div>
            <div className="my-3 flex gap-2">
              <span style={{ width: 120 }}>Kantor Bayar</span>
              <span style={{ width: 10 }}>:</span>
              <span style={{ width: 300 }}>{data && data.ktrbaydapem}</span>
            </div>
            <div className="my-3 flex gap-2">
              <span style={{ width: 120 }}>No Dosir</span>
              <span style={{ width: 10 }}>:</span>
              <span style={{ width: 300 }}>{data && data.nodosir}</span>
            </div>
            <div className="my-3 flex gap-2">
              <span style={{ width: 120 }}>Pangkat</span>
              <span style={{ width: 10 }}>:</span>
              <span style={{ width: 300 }}>{data && data.pangkat}</span>
            </div>
            <div className="my-3 flex gap-2">
              <span style={{ width: 120 }}>Pensiun Pokok</span>
              <span style={{ width: 10 }}>:</span>
              <span style={{ width: 300 }}>{data && data.penpok}</span>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
}
