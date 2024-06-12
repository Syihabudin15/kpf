"use client";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import {
  formatNumber,
  inputTextToDecimal,
} from "@/components/utils/inputUtils";
import {
  CloudUploadOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Form,
  GetProp,
  Input,
  Modal,
  Progress,
  Select,
  Upload,
  UploadProps,
  message,
} from "antd";
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

export default function InputPelunasan({
  loading,
  dataPelunasan,
  getData,
}: {
  loading: boolean;
  dataPelunasan: DataDataPengajuan[];
  getData: Function;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DataDataPengajuan>();
  const [admPelunasan, setAdmPelunasan] = useState(5);
  const [form] = Form.useForm();
  const [url, setUrl] = useState<string>();
  const [currLoading, setCurrLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const beforeUploadPDF = (file: FileType) => {
    const isJpgOrPng = file.type === "application/pdf";
    if (!isJpgOrPng) {
      message.error("Format file tidak sesuai!. Hanya menerima PDF file");
    }
    return isJpgOrPng;
  };

  const handleUpload = async (options: any) => {
    setCurrLoading(true);
    const { onSuccess, onError, file, onProgress } = options;
    const base64 = await getBase64(file);
    try {
      const res = await axios.post(
        "/api/repayment/pelunasan",
        {
          file: base64,
          dir: "berkas_pelunasan",
          ext: "pdf",
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
      setUrl(res.data.url);
      setCurrLoading(false);
    } catch (err) {
      console.log(err);
      message.error("Upload Failed!");
      setCurrLoading(false);
    }
  };
  const handleDelete = async () => {
    setCurrLoading(true);
    const res = await fetch("/api/repayment/pelunasan", {
      headers: { "Content-Type": "Application/json" },
      method: "DELETE",
      body: JSON.stringify({ url: url }),
    });
    if (res.ok) {
      setUrl(undefined);
      setProgress(0);
    } else {
      message.error(`Gagal hapus file!`);
    }
    setCurrLoading(false);
  };

  const handleFinish = async (e: any) => {
    setCurrLoading(true);
    if (!selected) {
      message.error("Data pengajuan tidak ditemukan!");
      return;
    }
    if (!url || !e.type) {
      message.error("Mohon pilih status dan upload berkas pelunasan!");
      return;
    }
    const res = await fetch("/api/repayment", {
      method: "POST",
      body: JSON.stringify({
        type: e.type,
        by_admin: e.margin,
        sisa_pokok: inputTextToDecimal(e.sisa),
        no_rekening: e.no_rekening,
        nama_bank: e.nama_bank,
        keterangan: e.keterangan,
        tanggal_pelunasan: new Date(e.tanggal_pelunasan).toISOString(),
        berkas_pelunasan: url,
        dataPengajuanId: selected?.id,
      }),
    });
    if (res.ok) {
      message.success("Berhasil menambahkan pelunasan debitur");
      await getData();
      setOpen(false);
    } else {
      message.error("Gagal menambahkan pelunasan debitur!");
    }
    setCurrLoading(false);
  };

  useEffect(() => {
    if (!selected) return;
    let sisa = 0;
    selected.JadwalAngsuran.forEach((e) => {
      if (e.tanggal_pelunasan === null) {
        sisa += e.pokok;
      }
    });
    form.setFieldsValue({
      nama: selected.nama,
      plafond: `${formatNumber(selected.DataPembiayaan.plafond.toFixed(0))} / ${
        selected.DataPembiayaan.tenor
      }`,
      sisa: formatNumber(sisa.toFixed(0)),
      sumber_dana: selected.Bank.name,
      margin: selected.DataPembiayaan.mg_bunga,
      adm_pelunasan: admPelunasan,
      total_pelunasan: formatNumber(
        (sisa * (admPelunasan / 100) + sisa).toFixed(0)
      ),
    });
  }, [selected, admPelunasan]);

  return (
    <div>
      <button
        className="bg-green-500 hover:bg-green-600 text-white text-xs text-center p-2 rounded shadow"
        disabled={loading}
        style={{ opacity: loading ? 0.5 : 1 }}
        onClick={() => setOpen(true)}
      >
        Tambah {loading ? <LoadingOutlined /> : <PlusCircleOutlined />}
      </button>
      <Modal
        title="TAMBAH PELUNASAN BARU"
        open={open}
        onCancel={() => setOpen(!open)}
        width={"90vw"}
        footer={[]}
        style={{ top: 50 }}
      >
        <Form labelCol={{ span: 6 }} form={form} onFinish={handleFinish}>
          <div className="flex flex-wrap gap-2">
            <div className="md:flex-1">
              <Form.Item label="Nopen" name={"nopen"} required>
                <Select
                  options={dataPelunasan.map((e) => {
                    return {
                      label: e.nopen + " - " + e.nama,
                      value: e.id,
                    };
                  })}
                  showSearch
                  onChange={(e) => {
                    const filter = dataPelunasan.filter((p) => p.id === e);
                    setSelected(filter[0]);
                  }}
                />
              </Form.Item>
              <Form.Item label="Nama Debitur" name={"nama"}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="Plafond / Tenor" name={"plafond"}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="Sisa Pokok" name={"sisa"}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="Sumber Dana" name={"sumber_dana"}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="Margin" name={"margin"}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="Status Pelunasan" name={"type"} required>
                <Select
                  options={[
                    { label: "TOPUP", value: "TOPUP" },
                    { label: "LEPAS", value: "LEPAS" },
                    { label: "MENINGGAL DUNIA", value: "MENINGGAL_DUNIA" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Adm Pelunasan" name={"adm_pelunasan"} required>
                <Input
                  onChange={(e) => setAdmPelunasan(parseInt(e.target.value))}
                  type="number"
                  required
                />
              </Form.Item>
            </div>
            <div className="md:flex-1">
              <Form.Item label="Total Pelunasan" name={"total_pelunasan"}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="No Rekening" name={"no_rekening"} required>
                <Input required />
              </Form.Item>
              <Form.Item label="Nama Bank" name={"nama_bank"} required>
                <Input required />
              </Form.Item>
              <Form.Item
                label="Tanggal Pelunasan"
                name={"tanggal_pelunasan"}
                required
              >
                <Input type="date" required />
              </Form.Item>
              <Form.Item label="Keterangan" name={"keterangan"} required>
                <Input.TextArea style={{ height: 100 }} required />
              </Form.Item>
              <Form.Item label="Berkas Pelunasan">
                <div className="block sm:flex justify-between px-3 py-1 border-b border-gray-300 items-center">
                  <div>
                    {progress > 0 && progress < 100 ? (
                      <Progress percent={progress} />
                    ) : (
                      <div>
                        {url ? (
                          <div className="flex-1 flex gap-2 items-center justify-center flex-wrap">
                            <span style={{ opacity: 0.7 }}>{url}</span>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white rounded shadow border px-2 py-1"
                              onChange={() => handleDelete()}
                              disabled={loading || currLoading}
                              type="button"
                            >
                              {loading || currLoading ? (
                                <LoadingOutlined />
                              ) : (
                                <DeleteFile
                                  data={{
                                    url: url,
                                    title: "KONFIRMASI HAPUS FILE",
                                    type: "application/pdf",
                                    onClick: handleDelete,
                                  }}
                                />
                              )}
                            </button>
                          </div>
                        ) : (
                          <Upload
                            beforeUpload={beforeUploadPDF}
                            accept="application/pdf"
                            multiple={false}
                            customRequest={(options) => handleUpload(options)}
                            showUploadList={false}
                          >
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white border rounded shadow px-2 py-1 text-xs"
                              type="button"
                            >
                              Browse{" "}
                              {loading || currLoading ? (
                                <LoadingOutlined />
                              ) : (
                                <CloudUploadOutlined />
                              )}
                            </button>
                          </Upload>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-1">
                  <button
                    className={`bg-${process.env.NEXT_PUBLIC_APP_BG_BUTTON}-500 text-white text-xs py-2 px-5 rounded shadow`}
                    style={{ opacity: loading || currLoading ? 0.7 : 1 }}
                    disabled={loading || currLoading}
                    type="submit"
                  >
                    {loading || currLoading ? <LoadingOutlined /> : "Submit"}
                  </button>
                </div>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
