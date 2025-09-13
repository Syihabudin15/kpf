"use client";

import { formatNumber } from "@/components/utils/inputUtils";
import { DataDataPencairan } from "@/components/utils/Interfaces";
import { Button, Modal } from "antd";
import { useState } from "react";

export default function ModalProsesCair({
  data,
  handleProses,
}: {
  data: DataDataPencairan;
  handleProses: Function;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const proses = async () => {
    setLoading(true);
    await handleProses(data.id);
    setOpen(false);
    setLoading(false);
  };
  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        disabled={loading ? true : data.status ? true : false}
        style={{
          opacity: data.status ? 0.5 : 1,
        }}
        type="primary"
        size="small"
      >
        PROSES
      </Button>
      <Modal
        title={`Proses Pencairan ${data.nomor_surat}`}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        open={open}
        width={"80vw"}
        key={data.id}
        footer={[
          <Button
            type="primary"
            onClick={() => proses()}
            loading={loading}
            disabled={loading}
            key={data.id}
          >
            Proses
          </Button>,
        ]}
      >
        <p>
          Konfirmasi proses pencairan nomor SI {data.nomor_surat} dengan data
          nasabah sebagai berikut:
        </p>
        <div className="flex gap-2 my-5">
          {data.DataPengajuan.map((d, i) => (
            <div
              className={`flex-1 flex flex-col gap-1 ${
                i + 1 !== data.DataPengajuan.length
                  ? "border-r border-gray"
                  : ""
              }`}
              key={i}
            >
              <div className="flex">
                <p className="w-[130px]">Nama Pemohon</p>
                <p className="w-[20px]">:</p>
                <p>{d.nama}</p>
              </div>
              <div className="flex">
                <p className="w-[130px]">Nopen</p>
                <p className="w-[20px]">:</p>
                <p>{d.nopen}</p>
              </div>
              <div className="flex">
                <p className="w-[130px]">Plafond</p>
                <p className="w-[20px]">:</p>
                <p>{formatNumber(d.DataPembiayaan.plafond.toFixed(0))}</p>
              </div>
              <div className="flex">
                <p className="w-[130px]">Tenor</p>
                <p className="w-[20px]">:</p>
                <p>{d.DataPembiayaan.tenor}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
