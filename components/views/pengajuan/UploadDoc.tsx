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
  const [berkasIDPB, setBerkasIDPB] = useState<FileProps>({
    fileName: "",
    progres: 0,
  });
  const [berkasFlagging, setBerkasFlagging] = useState<FileProps>({
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
        progres: currData.berkas_slik ? 100 : 0,
      });
      setBerkasPengajuan({
        fileName: currData.berkas_pengajuan || "",
        progres: currData.berkas_pengajuan ? 100 : 0,
      });
      setBerkasIDPB({
        fileName: currData.berkas_idpb || "",
        progres: currData.berkas_idpb ? 100 : 0,
      });
      setBerkasFlagging({
        fileName: currData.berkas_flagging || "",
        progres: currData.berkas_flagging ? 100 : 0,
      });
      setBerkasAsuransi({
        fileName: currData.video_asuransi || "",
        progres: currData.video_asuransi ? 100 : 0,
      });
      setBerkasWawancara({
        fileName: currData.video_wawancara || "",
        progres: currData.video_wawancara ? 100 : 0,
      });
    }
  }, []);

  const uploadSlik = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    try {
      setBerkasSlik({ fileName: "", progres: 0 });
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
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );

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
      setBerkasPengajuan({ fileName: "", progres: 0 });
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
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );

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
  const uploadIDPB = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    try {
      setBerkasIDPB({ fileName: "", progres: 0 });
      const base64 = await getBase64(file);
      const res = await axios.post(
        "/api/slik/berkas/idpb",
        {
          file: base64,
          type: "image",
          dir: "idpb",
          ext: "pdf",
        },
        {
          headers: { "Content-Type": "Application/json" },
          onUploadProgress: (event: any) => {
            const percent = Math.floor((event.loaded / event.total) * 100);
            setBerkasIDPB({ fileName: "", progres: percent });
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );

      setBerkasIDPB((prev) => {
        return {
          ...prev,
          fileName: res.data.url,
          progres: 100,
        };
      });
    } catch (err) {
      onError((error: any) => {
        setBerkasIDPB({ fileName: "", progres: 0 });
      });
      message.error("Gagal upload berkas pengajuan!. Coba lagi");
    }
  };
  const uploadFlagging = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    try {
      setBerkasFlagging({ fileName: "", progres: 0 });
      const base64 = await getBase64(file);
      const res = await axios.post(
        "/api/slik/berkas/flagging",
        {
          file: base64,
          type: "image",
          dir: "berkas_flagging",
          ext: "pdf",
        },
        {
          headers: { "Content-Type": "Application/json" },
          onUploadProgress: (event: any) => {
            const percent = Math.floor((event.loaded / event.total) * 100);
            setBerkasFlagging({ fileName: "", progres: percent });
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );

      setBerkasFlagging((prev) => {
        return {
          ...prev,
          fileName: res.data.url,
          progres: 100,
        };
      });
    } catch (err) {
      onError((error: any) => {
        setBerkasFlagging({ fileName: "", progres: 0 });
      });
      message.error("Gagal upload berkas pengajuan!. Coba lagi");
    }
  };
  const uploadWawancara = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    try {
      setBerkasWawancara({ fileName: "", progres: 0 });
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
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );

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
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );

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
      berkasAsuransi.fileName ||
      berkasIDPB.fileName ||
      berkasFlagging.fileName
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
        berkas_idpb: berkasIDPB.fileName ? berkasIDPB.fileName : "",
        berkas_flagging: berkasFlagging.fileName ? berkasFlagging.fileName : "",
      });
    }
  }, [
    berkasAsuransi,
    berkasWawancara,
    berkasPengajuan,
    berkasSlik,
    berkasFlagging,
    berkasIDPB,
  ]);
  return (
    <div>
      {/* Slik */}
      <div className="py-2">
        <div className={`flex justify-between gap-2 item-center`}>
          <p style={{ width: 170 }}>Berkas Slik (PDF) :</p>
          <div>
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
                <div className="flex gap-2">
                  <span style={{ textWrap: "wrap" }}>
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
        </div>
        {berkasSlik.progres > 0 && <Progress percent={berkasSlik.progres} />}
      </div>
      {/* End Slik */}

      {/* Pengajuan */}
      <div className="py-2">
        <div className={`flex justify-between gap-2 item-center`}>
          <p style={{ width: 170 }}>Berkas Pengajuan (PDF) :</p>
          <div>
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
                <div className="flex gap-2">
                  <span style={{ textWrap: "wrap" }}>
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
        </div>
        {berkasPengajuan.progres > 0 && (
          <Progress percent={berkasPengajuan.progres} />
        )}
      </div>
      {/* End Pengajuan*/}

      {/* IDPB */}
      <div className="py-2 hidden">
        <div className="flex flex-wrap justify-between">
          <p style={{ width: 200 }}>Berkas IDPB (PDF) :</p>
          <div className={berkasIDPB.fileName ? "flex-1" : ""}>
            <Upload
              accept="application/pdf"
              beforeUpload={beforeUploadPDF}
              showUploadList={false}
              multiple={false}
              customRequest={uploadIDPB}
              disabled={berkasIDPB.fileName ? true : false}
            >
              {!berkasIDPB.fileName ? (
                <button
                  className="bg-green-500 hover:bg-green-500 text-white py-1 px-2 rounded shadow"
                  type="button"
                >
                  <CloudUploadOutlined /> Browse
                </button>
              ) : (
                <div className="flex gap-2 flex-wrap justify-end">
                  <span style={{ flex: 1.5, textWrap: "wrap" }}>
                    {berkasIDPB.fileName.toUpperCase()}
                  </span>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded shadow"
                    style={{ flex: 0.5 }}
                    type="button"
                    onClick={() =>
                      handleDelete(
                        "/api/slik/berkas/idpb",
                        setBerkasIDPB,
                        berkasIDPB.fileName
                      )
                    }
                  >
                    {loading ? <LoadingOutlined /> : <DeleteOutlined />}
                  </button>
                </div>
              )}
            </Upload>
          </div>
        </div>
        {berkasIDPB.progres > 0 && <Progress percent={berkasIDPB.progres} />}
      </div>
      {/* End IDPB */}

      {/* FLAFFING */}
      <div className="py-2 hidden">
        <div className="flex flex-wrap justify-between">
          <p style={{ width: 200 }}>Berkas Flagging (PDF) :</p>
          <div className={berkasFlagging.fileName ? "flex-1" : ""}>
            <Upload
              accept="application/pdf"
              beforeUpload={beforeUploadPDF}
              showUploadList={false}
              multiple={false}
              customRequest={uploadFlagging}
              disabled={berkasFlagging.fileName ? true : false}
            >
              {!berkasFlagging.fileName ? (
                <button
                  className="bg-green-500 hover:bg-green-500 text-white py-1 px-2 rounded shadow"
                  type="button"
                >
                  <CloudUploadOutlined /> Browse
                </button>
              ) : (
                <div className="flex gap-2 flex-wrap justify-end">
                  <span style={{ flex: 1.5, textWrap: "wrap" }}>
                    {berkasFlagging.fileName.toUpperCase()}
                  </span>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded shadow"
                    style={{ flex: 0.5 }}
                    type="button"
                    onClick={() =>
                      handleDelete(
                        "/api/slik/berkas/flagging",
                        setBerkasFlagging,
                        berkasFlagging.fileName
                      )
                    }
                  >
                    {loading ? <LoadingOutlined /> : <DeleteOutlined />}
                  </button>
                </div>
              )}
            </Upload>
          </div>
        </div>
        {berkasFlagging.progres > 0 && (
          <Progress percent={berkasFlagging.progres} />
        )}
      </div>
      {/* End Flagging */}

      {/* Wawancara */}
      <div className="py-2">
        <div className={`flex justify-between gap-2 item-center`}>
          <p style={{ width: 170 }}>Video Wawancara (MP4) :</p>
          <div>
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
                <div className="flex gap-2">
                  <span style={{ textWrap: "wrap" }}>
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
        </div>
        {berkasWawancara.progres > 0 && (
          <Progress percent={berkasWawancara.progres} />
        )}
      </div>
      {/* End Wawancara */}

      {/* Asuransi */}
      <div className="py-2">
        <div className={`flex justify-between gap-2 item-center`}>
          <p style={{ width: 170 }}>Video Asuransi (MP4) :</p>
          <div>
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
                <div className="flex gap-2">
                  <span style={{ textWrap: "wrap" }}>
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
        </div>
        {berkasAsuransi.progres > 0 && (
          <Progress percent={berkasAsuransi.progres} />
        )}
      </div>
      {/* End Asuransi */}
    </div>
  );
}
