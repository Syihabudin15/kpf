"use client";
import { Input, Modal, Table, TableProps } from "antd";
import moment from "moment";
import {
  CloudUploadOutlined,
  LoadingOutlined,
  PrinterFilled,
} from "@ant-design/icons";
import { GetProp, Progress, Upload, UploadProps, message } from "antd";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CetakSuratBerkas from "../dataPdf/CetakSuratBerkas";
import { formatNumber } from "@/components/utils/inputUtils";
import {
  DataPenyerahanBerkas,
  DataPenyerahanJaminan,
} from "@/components/utils/Interfaces";

const CetakNominatifBerkas = dynamic(() => import("./CetakNominatifBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

const DeleteFile = dynamic(
  () => import("@/components/views/operasionals/news/DeleteFile"),
  { ssr: false, loading: () => <LoadingOutlined /> }
);
const ModalBerkas = dynamic(() => import("@/components/utils/ModalBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default function UploadJaminan() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DataPenyerahanJaminan>();
  const [name, setName] = useState<string>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<DataPenyerahanJaminan[]>();
  const [loading, setLoading] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);

  const handleAction = (record: DataPenyerahanJaminan) => {
    setSelected(record);
    setOpen(true);
  };

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/pemberkasan/upload-jaminan?page=${page}${
        name ? "&name=" + name : ""
      }`
    );
    const { data, total } = await res.json();
    setData(
      data.map((d: DataPenyerahanJaminan) => {
        return { ...d, key: d.id };
      })
    );
    setTotal(total);
    setModalUpload(false);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [name, page]);

  const columns: TableProps<DataPenyerahanJaminan>["columns"] = [
    {
      title: "NO",
      key: "no",
      dataIndex: "no",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 50,
      className: "text-center",
      render(value, record, index) {
        return <>{index + 1}</>;
      },
    },
    {
      title: "TANGGAL CETAK",
      key: "tanggal_cetak",
      dataIndex: "tanggal_cetak",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{moment(record.tanggal_cetak).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "NOMOR SURAT",
      key: "nomor_jaminan",
      dataIndex: "nomor_jaminan",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
    },
    {
      title: "SUMBER DANA",
      key: "sumber_dana",
      dataIndex: "sumber_dana",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.Bank.name}</>;
      },
    },
    {
      title: "UPLOAD SURAT",
      key: "upload",
      dataIndex: "upload",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <div>
            <div className="flex justify-center">
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded shadow border"
                disabled={record.jaminan ? true : false}
                style={{ opacity: record.jaminan ? 0.5 : 1 }}
                onClick={() => {
                  setSelected(record);
                  setModalUpload(true);
                }}
              >
                <CloudUploadOutlined />
              </button>
            </div>
          </div>
        );
      },
    },
    {
      title: "VIEW SURAT",
      key: "view",
      dataIndex: "view",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <ModalBerkas
            data={{
              url: record.jaminan || "",
              type: "application/pdf",
              title: "VIEW SURAT JAMINAN " + record.nomor_jaminan,
            }}
          />
        );
      },
    },
    // {
    //   title: "Cetak Surat",
    //   key: "cetak_surat",
    //   dataIndex: "cetak_surat",
    //   render(value, record, index) {
    //     return (
    //       <div className="flex justify-center">
    //         <button
    //           onClick={() => handleAction(record)}
    //           className="py-1 px-2 border rounded shadow"
    //         >
    //           <PrinterFilled />
    //         </button>
    //       </div>
    //     );
    //   },
    // },
    {
      title: "JUMLAH DEBITUR",
      key: "jumlah_debitur",
      dataIndex: "jumlah_debitur",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPengajuan.length}</>;
      },
    },
    {
      title: "JUMLAH PLADOND",
      key: "jumlah_plafon",
      dataIndex: "jumlah_plafon",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        let plaf = 0;
        record.DataPengajuan.forEach((p) => {
          plaf += p.DataPembiayaan.plafond;
        });
        return <>{formatNumber(plaf.toFixed(0))}</>;
      },
    },
    {
      title: "STATUS PENYERAHAN",
      key: "status_penyerahan",
      dataIndex: "status_penyerahan",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          <div className="flex justify-center text-xs font-bold italic">
            <div
              className={`bg-${
                record.jaminan ? "green" : "red"
              }-500 py-1 px-3 text-center text-white text-xs`}
            >
              {record.jaminan ? "UPLOADED" : "NOT UPLOAD"}
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="flex gap-5 my-1 mx-1">
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="p-2">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          bordered
          size="small"
          scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
          pagination={{
            pageSize: 20,
            total,
            onChange(page, pageSize) {
              setPage(page);
            },
          }}
        />
      </div>
      <Modal
        open={modalUpload}
        onCancel={() => setModalUpload(false)}
        title="UPLOAD SURAT JAMINAN"
        footer={[]}
      >
        <UploadBerkas
          kode_area={
            selected && selected.DataPengajuan.length >= 0
              ? selected.DataPengajuan[0].User.UnitCabang.number_code || "001"
              : "001"
          }
          url="/api/pemberkasan/upload-jaminan"
          dir="jaminan"
          id={selected?.id || ""}
          ext="pdf"
          fileType="application/pdf"
          filePath={selected?.jaminan || ""}
          getData={getData}
        />
      </Modal>
    </div>
  );
}

function UploadBerkas({
  kode_area,
  url,
  dir,
  id,
  ext,
  filePath,
  fileType,
  getData,
}: {
  kode_area: string | number;
  url: string;
  dir: string;
  id: string;
  ext: string;
  fileType: string;
  filePath: string | null;
  getData: Function;
}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currUrl, setCurrUrl] = useState<string>();

  const beforeUploadPDF = (file: FileType) => {
    const isJpgOrPng = file.type === fileType;
    if (!isJpgOrPng) {
      message.error("Format file tidak sesuai!");
    }
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
          kode_area: kode_area,
          file: base64,
          dir: dir,
          ext: ext,
        },
        {
          headers: { "Content-Type": "Application/json" },
          onUploadProgress: (event: any) => {
            setProgress(1);
            const percent = Math.floor((event.loaded / event.total) * 100);
            setProgress(percent);
            if (percent === 100) {
              setProgress(100);
            }
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );
      setCurrUrl(res.data.url);
      setLoading(false);
    } catch (err) {
      console.log(err);
      message.error("Upload Failed!");
      setLoading(false);
    }
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch(url, {
      headers: { "Content-Type": "Application/json" },
      method: "PUT",
      body: JSON.stringify({
        id: id,
        surat_berkas: currUrl,
        tanggal_surat_berkas: new Date().toISOString(),
      }),
    });
    if (res.ok) {
      message.success("Upload surat jaminan berhasil!");
      await getData();
    } else {
      message.error(`Gagal upload jaminan berkas!`);
    }
    await getData();
    setLoading(false);
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
    } else {
      message.error(`Gagal hapus ${name}!`);
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="flex justify-between px-3 py-1  items-center">
        <p>Upload Jaminan</p>
        <div>
          {progress === 0 && !currUrl ? (
            <Upload
              beforeUpload={beforeUploadPDF}
              accept={fileType}
              multiple={false}
              customRequest={(options) => handleUpload(options)}
              showUploadList={false}
            >
              <button className="bg-green-500 hover:bg-green-600 text-white border rounded shadow px-2 py-1">
                Browse <CloudUploadOutlined />
              </button>
            </Upload>
          ) : (progress === 0 || progress === 100) && currUrl ? (
            <div className="flex-1 flex gap-2 items-center justify-center flex-wrap">
              <span style={{ opacity: 0.7 }}>{currUrl}</span>
              <button
                className="bg-red-500 hover:bg-red-600 text-white rounded shadow border px-2 py-1"
                onChange={() => handleDelete()}
                disabled={loading}
              >
                {loading ? (
                  <LoadingOutlined />
                ) : (
                  <DeleteFile
                    data={{
                      url: currUrl || "",
                      title: "Konfirmasi Hapus File",
                      type: fileType,
                      pathUrl: filePath,
                      onClick: handleDelete,
                    }}
                  />
                )}
              </button>
            </div>
          ) : (
            <Progress percent={progress} />
          )}
        </div>
      </div>
      <div className="flex justify-end mt-5">
        <button
          className={`bg-orange-500 hover:bg-orange-600 text-white py-1 px-3 rounded shadow`}
          onClick={() => handleSave()}
        >
          {loading ? <LoadingOutlined /> : "Simpan"}
        </button>
      </div>
    </div>
  );
}
