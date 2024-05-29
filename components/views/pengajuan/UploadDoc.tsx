"use client";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { BerkasPengajuan } from "@prisma/client";
import { GetProp, Progress, Upload, UploadProps, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const beforeUploadPDF = (file: FileType) => {
  const isJpgOrPng = file.type === "application/pdf";
  if (!isJpgOrPng) {
    message.error("Hanya menerima PDF file!");
  }
  return isJpgOrPng;
};
const beforeUploadVideo = (file: FileType) => {
  const isJpgOrPng = file.type === "video/mp4";
  if (!isJpgOrPng) {
    message.error("Hanya menerima MP4 file!");
  }
  return isJpgOrPng;
};
const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

interface FileProps {
  fileName: string;
  progres: number;
}

export default function UploadDoc({
  setBerkas,
  currData,
}: {
  setBerkas: Function;
  currData?: BerkasPengajuan;
}) {
  const [berkasSlik, setBerkasSlik] = useState<FileProps>({
    fileName: "",
    progres: 0,
  });
  const [berkasPengajuan, setBerkasPengajuan] = useState<FileProps>({
    fileName: "",
    progres: 0,
  });
  const [berkasWawancara, setBerkasWawancara] = useState<FileProps>({
    fileName: "",
    progres: 0,
  });
  const [berkasAsuransi, setBerkasAsuransi] = useState<FileProps>({
    fileName: "",
    progres: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currData) {
      setBerkasSlik({
        fileName: currData.berkas_slik || "",
        progres: 100,
      });
      setBerkasPengajuan({
        fileName: currData.berkas_pengajuan || "",
        progres: 100,
      });
      setBerkasAsuransi({
        fileName: currData.video_asuransi || "",
        progres: 100,
      });
      setBerkasWawancara({
        fileName: currData.video_wawancara || "",
        progres: 100,
      });
    }
  }, []);

  const uploadSlik = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    try {
      setBerkasSlik({ fileName: "", progres: 1 });
      const base64 = await getBase64(file);
      const res = await axios.post(
        "/api/slik/berkas/slik",
        {
          file: base64,
          dir: "slik",
          ext: "pdf",
          id: "",
        },
        {
          headers: { "Content-Type": "Application/json" },
          onUploadProgress: (event: any) => {
            const percent = Math.floor((event.loaded / event.total) * 100);
            setBerkasSlik({ fileName: "", progres: percent });
            if (percent === 100) {
              setBerkasSlik({ fileName: "", progres: 100 });
            }
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );

      onSuccess("done");
      setBerkasSlik((prev) => {
        return {
          ...prev,
          fileName: res.data.url,
          progres: 100,
        };
      });
    } catch (err) {
      onError((error: any) => {
        setBerkasSlik({ fileName: "", progres: 0 });
      });
      message.error("Gagal upload berkas slik!. Coba lagi");
    }
  };
  const uploadPengajuan = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    try {
      setBerkasPengajuan({ fileName: "", progres: 1 });
      const base64 = await getBase64(file);
      const res = await axios.post(
        "/api/slik/berkas/pengajuan",
        {
          file: base64,
          type: "image",
          dir: "pengajuan",
          ext: "pdf",
        },
        {
          headers: { "Content-Type": "Application/json" },
          onUploadProgress: (event: any) => {
            const percent = Math.floor((event.loaded / event.total) * 100);
            setBerkasPengajuan({ fileName: "", progres: percent });
            if (percent === 100) {
              setBerkasPengajuan({ fileName: "", progres: 100 });
            }
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );

      onSuccess("done");
      setBerkasPengajuan((prev) => {
        return {
          ...prev,
          fileName: res.data.url,
          progres: 100,
        };
      });
    } catch (err) {
      onError((error: any) => {
        setBerkasPengajuan({ fileName: "", progres: 0 });
      });
      message.error("Gagal upload berkas pengajuan!. Coba lagi");
    }
  };
  const uploadWawancara = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    try {
      setBerkasWawancara({ fileName: "", progres: 1 });
      const base64 = await getBase64(file);
      const res = await axios.post(
        "/api/slik/berkas/wawancara",
        {
          file: base64,
          type: "video",
          dir: "wawancara",
          ext: "mp4",
        },
        {
          headers: { "Content-Type": "Application/json" },
          onUploadProgress: (event: any) => {
            const percent = Math.floor((event.loaded / event.total) * 100);
            setBerkasWawancara({ fileName: "", progres: percent });
            if (percent == 100) {
              setBerkasWawancara({ fileName: "", progres: 100 });
            }
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );

      onSuccess("done");
      setBerkasWawancara((prev) => {
        return {
          ...prev,
          fileName: res.data.url,
          progres: 100,
        };
      });
    } catch (err) {
      onError((error: any) => {
        setBerkasWawancara({ fileName: "", progres: 0 });
      });
      message.error("Gagal upload video wawancara!. Coba lagi");
    }
  };
  const uploadAsuransi = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    try {
      setBerkasAsuransi({ fileName: "", progres: 1 });
      const base64 = await getBase64(file);
      const res = await axios.post(
        "/api/slik/berkas/asuransi",
        {
          file: base64,
          type: "video",
          dir: "asuransi",
          ext: "mp4",
        },
        {
          headers: { "Content-Type": "Application/json" },
          onUploadProgress: (event: any) => {
            const percent = Math.floor((event.loaded / event.total) * 100);
            setBerkasAsuransi({ fileName: "", progres: percent });
            if (percent === 100) {
              setBerkasAsuransi({ fileName: "", progres: 100 });
            }
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );

      onSuccess("done");
      setBerkasAsuransi((prev) => {
        return {
          ...prev,
          fileName: res.data.url,
          progres: 100,
        };
      });
    } catch (err) {
      onError((error: any) => {
        setBerkasAsuransi({ fileName: "", progres: 0 });
      });
      message.error("Gagal upload video asuransi!. Coba lagi");
    }
  };

  const handleDelete = async (uri: string, setNull: Function, url: string) => {
    setLoading(true);
    const res = await fetch(uri, {
      headers: { "Content-Type": "Application/json" },
      method: "DELETE",
      body: JSON.stringify({ id: currData?.id, url: url }),
    });
    if (res.ok) {
      setNull({
        fileName: null,
        progres: 0,
      });
    } else {
      message.error(`Gagal hapus ${name}!`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (
      berkasSlik.fileName ||
      berkasPengajuan.fileName ||
      berkasWawancara.fileName ||
      berkasAsuransi.fileName
    ) {
      setBerkas({
        berkas_slik: berkasSlik.fileName ? berkasSlik.fileName : "",
        berkas_pengajuan: berkasPengajuan.fileName
          ? berkasPengajuan.fileName
          : "",
        video_wawancara: berkasWawancara.fileName
          ? berkasWawancara.fileName
          : "",
        video_asuransi: berkasAsuransi.fileName ? berkasAsuransi.fileName : "",
      });
    }
  }, [berkasAsuransi, berkasWawancara, berkasPengajuan, berkasSlik]);
  return (
    <div>
      {/* Slik */}
      <div className="py-2">
        <div className="flex flex-wrap justify-between">
          <p>Berkas Slik (PDF) :</p>
          <Upload
            accept="application/pdf"
            beforeUpload={beforeUploadPDF}
            showUploadList={false}
            multiple={false}
            customRequest={uploadSlik}
            disabled={berkasSlik.fileName ? true : false}
          >
            {!berkasSlik.fileName ? (
              <button
                className="bg-green-500 hover:bg-green-500 text-white py-1 px-2 rounded shadow"
                type="button"
              >
                <CloudUploadOutlined /> Browse
              </button>
            ) : (
              <div className="flex gap-2 flex-wrap">
                <span style={{ width: 200, textWrap: "wrap" }}>
                  {berkasSlik.fileName.toUpperCase()}
                </span>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded shadow"
                  type="button"
                  onClick={() =>
                    handleDelete(
                      "/api/slik/berkas/slik",
                      setBerkasSlik,
                      berkasSlik.fileName
                    )
                  }
                >
                  {loading ? <LoadingOutlined /> : <DeleteOutlined />}
                </button>
              </div>
            )}
          </Upload>
        </div>
        {berkasSlik.progres > 0 && <Progress percent={berkasSlik.progres} />}
      </div>
      {/* End Slik */}

      {/* Pengajuan */}
      <div className="py-2">
        <div className="flex flex-wrap justify-between">
          <p>Berkas Pengajuan (PDF) :</p>
          <Upload
            accept="application/pdf"
            beforeUpload={beforeUploadPDF}
            showUploadList={false}
            multiple={false}
            customRequest={uploadPengajuan}
            disabled={berkasPengajuan.fileName ? true : false}
          >
            {!berkasPengajuan.fileName ? (
              <button
                className="bg-green-500 hover:bg-green-500 text-white py-1 px-2 rounded shadow"
                type="button"
              >
                <CloudUploadOutlined /> Browse
              </button>
            ) : (
              <div className="flex gap-2 flex-wrap">
                <span style={{ width: 200, textWrap: "wrap" }}>
                  {berkasPengajuan.fileName.toUpperCase()}
                </span>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded shadow"
                  type="button"
                  onClick={() =>
                    handleDelete(
                      "/api/slik/berkas/pengajuan",
                      setBerkasPengajuan,
                      berkasPengajuan.fileName
                    )
                  }
                >
                  {loading ? <LoadingOutlined /> : <DeleteOutlined />}
                </button>
              </div>
            )}
          </Upload>
        </div>
        {berkasPengajuan.progres > 0 && (
          <Progress percent={berkasPengajuan.progres} />
        )}
      </div>
      {/* End Pengajuan*/}

      {/* Wawancara */}
      <div className="py-2">
        <div className="flex flex-wrap justify-between">
          <p>Video Wawancara (MP4) :</p>
          <Upload
            accept="video/mp4"
            beforeUpload={beforeUploadVideo}
            showUploadList={false}
            multiple={false}
            customRequest={uploadWawancara}
            disabled={berkasWawancara.fileName ? true : false}
          >
            {!berkasWawancara.fileName ? (
              <button
                className="bg-green-500 hover:bg-green-500 text-white py-1 px-2 rounded shadow"
                type="button"
              >
                <CloudUploadOutlined /> Browse
              </button>
            ) : (
              <div className="flex gap-2 flex-wrap">
                <span style={{ width: 200, textWrap: "wrap" }}>
                  {berkasWawancara.fileName.toUpperCase()}
                </span>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded shadow"
                  type="button"
                  onClick={() =>
                    handleDelete(
                      "/api/slik/berkas/wawancara",
                      setBerkasWawancara,
                      berkasWawancara.fileName
                    )
                  }
                >
                  {loading ? <LoadingOutlined /> : <DeleteOutlined />}
                </button>
              </div>
            )}
          </Upload>
        </div>
        {berkasWawancara.progres > 0 && (
          <Progress percent={berkasWawancara.progres} />
        )}
      </div>
      {/* End Wawancara */}

      {/* Asuransi */}
      <div className="py-2">
        <div className="flex flex-wrap justify-between">
          <p>Video Asuransi (MP4) :</p>
          <Upload
            accept="video/mp4"
            beforeUpload={beforeUploadVideo}
            showUploadList={false}
            multiple={false}
            customRequest={uploadAsuransi}
            disabled={berkasAsuransi.fileName ? true : false}
          >
            {!berkasAsuransi.fileName ? (
              <button
                className="bg-green-500 hover:bg-green-500 text-white py-1 px-2 rounded shadow"
                type="button"
              >
                <CloudUploadOutlined /> Browse
              </button>
            ) : (
              <div className="flex gap-2 flex-wrap">
                <span style={{ width: 200, textWrap: "wrap" }}>
                  {berkasAsuransi.fileName.toUpperCase()}
                </span>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded shadow"
                  type="button"
                  onClick={() =>
                    handleDelete(
                      "/api/slik/berkas/asuransi",
                      setBerkasAsuransi,
                      berkasAsuransi.fileName
                    )
                  }
                >
                  {loading ? <LoadingOutlined /> : <DeleteOutlined />}
                </button>
              </div>
            )}
          </Upload>
        </div>
        {berkasAsuransi.progres > 0 && (
          <Progress percent={berkasAsuransi.progres} />
        )}
      </div>
      {/* End Asuransi */}
    </div>
  );
}
