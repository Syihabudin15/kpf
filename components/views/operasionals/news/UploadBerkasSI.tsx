"use client";

import { notifContext } from "@/components/NotifContext";
import { DataDataPencairan } from "@/components/utils/Interfaces";
import {
  CloudUploadOutlined,
  Loading3QuartersOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Modal, message } from "antd";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";

const UploadBerkas = dynamic(
  () => import("@/components/views/operasionals/news/UploadBerkas"),
  { ssr: false, loading: () => <LoadingOutlined /> }
);

export default function UploadBerkasSI({
  data,
  getData,
}: {
  data: DataDataPencairan;
  getData: Function;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currUrl, serCurrUrl] = useState<{
    berkas_si: string;
    tanggal_berkas_si: string | null | Date;
  }>();
  const notif = useContext(notifContext);

  useEffect(() => {
    if (data.berkas_si) {
      serCurrUrl({
        berkas_si: data.berkas_si,
        tanggal_berkas_si: data.tanggal_berkas_si,
      });
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await fetch("/api/ops/pengajuan-pencairan", {
      headers: { "Content-Type": "Application/json" },
      method: "PUT",
      body: JSON.stringify({ url: currUrl?.berkas_si, id: data.id }),
    });
    if (!res.ok) {
      message.error("Gagal upload surat pencairan!");
      setLoading(false);
      return;
    }
    message.success("Upload surat pencairan berhasil");
    await getData();
    await notif.getNotifFunction();
    setLoading(false);
    setOpen(false);
  };

  return (
    <div>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow border"
          // disabled={data.berkas_si ? true : false}
          // style={{ opacity: data.berkas_si ? 0.5 : 1 }}
          onClick={() => setOpen(true)}
        >
          {loading ? <Loading3QuartersOutlined /> : <CloudUploadOutlined />}
        </button>
      </div>
      <Modal
        title={`UPLOAD SURAT PENCAIRAN ${data.nomor_surat}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[]}
        wrapClassName="modalUploadSI"
        width={"100%"}
        // style={{ top: 20 }}
      >
        <div>
          <UploadBerkas
            pathName="berkas_si"
            name="Upload Berkas SI"
            url="/api/ops/pengajuan-pencairan"
            dir="si"
            id={data.id as string}
            ext="pdf"
            fileType="application/pdf"
            filePath={(currUrl && currUrl.berkas_si) || null}
            setUrl={serCurrUrl}
          />
        </div>
        <div className="w-full flex justify-end mt-10">
          <button
            className={`bg-orange-500 hover:bg-orange-600 text-white text-xs py-2 px-4 rounded shadow`}
            onClick={() => handleSave()}
          >
            {loading ? <Loading3QuartersOutlined /> : "Simpan"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
