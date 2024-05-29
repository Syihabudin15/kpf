"use client";

import { notifContext } from "@/components/NotifContext";
import { DataDataPencairan } from "@/components/utils/Interfaces";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  Loading3QuartersOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { GetProp, Modal, Progress, Upload, UploadProps, message } from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const beforeUploadPDF = (file: FileType) => {
  const isJpgOrPng = file.type === "application/pdf";
  if (!isJpgOrPng) {
    message.error("Hanya menerima PDF file!");
  }
  return isJpgOrPng;
};

export default function UploadBerkasSI({
  data,
  getData,
}: {
  data: DataDataPencairan;
  getData: Function;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currUrl, serCurrUrl] = useState<string>();
  const notif = useContext(notifContext);

  useEffect(() => {
    if (data.berkas_si) {
      serCurrUrl(data.berkas_si);
    }
  }, []);

  const handleOK = async (options: any) => {
    setLoading(true);
    const { onSuccess, onError, file, onProgress } = options;
    const base64 = await getBase64(file);
    try {
      const res = await axios.post(
        "/api/ops/pengajuan-pencairan",
        {
          file: base64,
          nomor: data.nomor_surat,
          dir: "si",
          ext: "pdf",
          id: data.id,
        },
        {
          headers: { "Content-Type": "Application/json" },
          onUploadProgress: (event: any) => {
            const percent = Math.floor((event.loaded / event.total) * 100);
            setProgress(percent);
            if (percent === 100) {
              setProgress(100);
            }
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );
      serCurrUrl(res.data.url);
      await notif.getNotifFunction();
      await getData();
      setLoading(false);
    } catch (err) {
      console.log(err);
      message.error("Upload Failed!");
      setLoading(false);
    }
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch("/api/ops/pengajuan-pencairan", {
      headers: { "Content-Type": "Application/json" },
      method: "PUT",
      body: JSON.stringify({ url: currUrl, id: data.id }),
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
  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch("/api/ops/pengajuan-pencairan", {
      headers: { "Content-Type": "Application/json" },
      method: "DELETE",
      body: JSON.stringify({
        id: data.id,
        url: currUrl,
      }),
    });
    if (res.ok) {
      serCurrUrl(undefined);
      setProgress(0);
    } else {
      message.error("Gagal hapus file berkas si!");
    }
    setLoading(false);
    return "OK";
  };
  return (
    <div>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow border"
          disabled={data.berkas_si ? true : false}
          style={{ opacity: data.berkas_si ? 0.5 : 1 }}
          onClick={() => setOpen(true)}
        >
          {loading ? <Loading3QuartersOutlined /> : <CloudUploadOutlined />}
        </button>
      </div>
      <Modal
        title="UPLOAD SURAT PENCAIRAN"
        open={open}
        onCancel={() => setOpen(false)}
        footer={[]}
        wrapClassName="modalUploadSI"
        width={"100%"}
        // style={{ top: 20 }}
      >
        <div className="mt-2 flex justify-between">
          <p>Upload Surat:</p>
          <div>
            {progress === 0 ? (
              <Upload
                beforeUpload={beforeUploadPDF}
                accept="application/pdf"
                multiple={false}
                customRequest={(options) => handleOK(options)}
                showUploadList={false}
              >
                <div className="w-32">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded shadow border py-1">
                    Browse <CloudUploadOutlined />
                  </button>
                </div>
              </Upload>
            ) : (
              <div>
                {progress === 100 ? (
                  <div className="flex gap-2">
                    <span>{currUrl}</span>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white rounded shadow border py-0 px-1"
                      onClick={() => handleDelete()}
                      disabled={loading}
                    >
                      {loading ? <LoadingOutlined /> : <DeleteOutlined />}
                    </button>
                  </div>
                ) : (
                  <Progress percent={progress} />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="w-full flex justify-end mt-10">
          <button
            disabled={data.berkas_si === currUrl ? true : loading}
            style={{ opacity: data.berkas_si === currUrl ? 0.5 : 1 }}
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
