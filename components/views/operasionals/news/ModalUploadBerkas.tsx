"use client";

import { DataDataPencairan } from "@/components/utils/Interfaces";
import { CloudUploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";

const UploadBerkas = dynamic(() => import("./UploadBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function ModalUploadBerkas({
  data,
  handleUpload,
}: {
  data: DataDataPencairan;
  handleUpload: Function;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<any>();

  const upload = async () => {
    setLoading(true);
    await handleUpload(data.id, urls["bukti_transfer"]);
    setOpen(false);
    setLoading(false);
  };

  return (
    <div>
      <button
        className="py-1 px-2 border rounded shadow text-white bg-blue-500 hover:bg-blue-600"
        onClick={() => setOpen(true)}
      >
        {loading ? <LoadingOutlined /> : <CloudUploadOutlined />}
      </button>
      <Modal
        open={open}
        title={`BUKTI TRANSFER ${data.nomor_surat}`}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        footer={[]}
        key={data.id}
      >
        <div className="my-5">
          <UploadBerkas
            url="/api/ops/uploads/bukti_transfer"
            dir="bukti_transfer"
            name="Bukti Transfer"
            id={data.id}
            ext="pdf"
            fileType="application/pdf"
            filePath={data.bukti_transfer}
            pathName="bukti_transfer"
            setUrl={setUrls}
            key={data.id}
          />
        </div>
        <div className="flex justify-end mt-5">
          <button
            className={`text-white py-1 px-4 bg-orange-500 hover:bg-orange-600 rounded shadow text-sm`}
            disabled={!urls ? true : false}
            onClick={() => upload()}
          >
            Simpan {loading && <LoadingOutlined />}{" "}
          </button>
        </div>
      </Modal>
    </div>
  );
}
