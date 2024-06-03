"use client"
import { CloudUploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { GetProp, Progress, Upload, UploadProps, message } from "antd";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DeleteFile = dynamic(
  () => import("@/components/views/operasionals/news/DeleteFile"),
  { ssr: false, loading: () => <LoadingOutlined /> }
);

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default function UploadBerkas({
  url,
  dir,
  name,
  id,
  ext,
  filePath,
  fileType,
  pathName,
  setUrl,
}: {
  url: string;
  dir: string;
  name: string;
  id: string;
  ext: string;
  fileType: string | string[];
  filePath: string | null;
  pathName: string;
  setUrl: Function;
}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currUrl, setCurrUrl] = useState<string>();
  const [currExt, setCurrExt] = useState<string>();

  useEffect(() => {
    if (filePath) {
      setCurrUrl(filePath);
      setProgress(100);
      setCurrExt(ext);
    }
  }, [filePath]);

  const beforeUploadPDF = (file: FileType) => {
    const isJpgOrPng = fileType.includes(file.type);
    if (!isJpgOrPng) {
      message.error("Format file tidak sesuai!");
    }
    setCurrExt(file.type.split("/")[1]);
    return isJpgOrPng;
  };

  const handleUpload = async (options: any) => {
    setLoading(true);
    const { onSuccess, onError, file, onProgress } = options;
    const base64 = await getBase64(file);
    try {
      const res = await axios.post(
        url,
        {
          file: base64,
          dir: dir,
          ext: currExt,
          id: id,
        },
        {
          headers: { "Content-Type": "Application/json" },
          onUploadProgress: (event: any) => {
            setProgress(1);
            const percent = Math.floor((event.loaded / event.total) * 100);
            setProgress(percent);
            // if (percent === 100) {
            //   setProgress(100);
            // }
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );
      setUrl((prev: any) => {
        return {
          ...prev,
          [pathName]: res.data.url,
          [`tanggal_${
            pathName === "berkas_akad"
              ? "akad"
              : pathName === "video_penyerahan"
              ? "video_cair"
              : pathName
          }`]: new Date().toISOString(),
        };
      });
      setCurrUrl(res.data.url);
      setLoading(false);
    } catch (err) {
      console.log(err);
      message.error("Upload Failed!");
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch(url, {
      headers: { "Content-Type": "Application/json" },
      method: "DELETE",
      body: JSON.stringify({ id: id, url: currUrl }),
    });
    if (res.ok) {
      setCurrUrl(undefined);
      setProgress(0);
      setUrl((prev: any) => {
        return {
          ...prev,
          [pathName]: null,
          [`tanggal_${
            pathName === "berkas_akad"
              ? "akad"
              : pathName === "video_penyerahan"
              ? "video_cair"
              : pathName
          }`]: null,
        };
      });
    } else {
      message.error(`Gagal hapus ${name}!`);
    }
    setLoading(false);
  };
  return (
    <div className="block sm:flex justify-between px-3 py-1 border-b border-gray-300 items-center" key={pathName}>
      <p>{name}</p>
      <div>
        {progress > 0 && progress < 100 ? (
          <Progress percent={progress} />
        ) : (
          <div>
            {currUrl ? (
              <div className="flex-1 flex gap-2 items-center justify-center flex-wrap">
                <span style={{ opacity: 0.7 }}>{currUrl}</span>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white rounded shadow border px-2 py-1"
                  onChange={() => handleDelete()}
                  disabled={loading}
                  type="button"
                >
                  {loading ? (
                    <LoadingOutlined />
                  ) : (
                    <DeleteFile
                      data={{
                        url: currUrl,
                        title: "KONFIRMASI HAPUS FILE",
                        type: fileType as string,
                        onClick: handleDelete,
                      }}
                    />
                  )}
                </button>
              </div>
            ) : (
              <Upload
                beforeUpload={beforeUploadPDF}
                accept={
                  typeof fileType === "string" ? fileType : fileType.join(", ")
                }
                multiple={false}
                customRequest={(options) => handleUpload(options)}
                showUploadList={false}
              >
                <button
                  className="bg-green-500 hover:bg-green-600 text-white border rounded shadow px-2 py-1"
                  type="button"
                >
                  Browse{" "}
                  {loading ? <LoadingOutlined /> : <CloudUploadOutlined />}
                </button>
              </Upload>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
