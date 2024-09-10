"use client";
import { DataCategory } from "@/components/utils/Interfaces";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  FormOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  GetProp,
  Input,
  message,
  Modal,
  Progress,
  Upload,
  UploadProps,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CreateCategory({
  getData,
  data,
}: {
  getData: Function;
  data?: DataCategory;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currImg, setCurrImg] = useState({ filename: "", progress: 0 });
  const [currExt, setCurrExt] = useState("");

  const handleSubmit = async (e: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/article", {
        method: "POST",
        headers: { "Content-type": "Application/json" },
        body: JSON.stringify({
          name: e.name,
          slug: e.name.replace(" ", "-").toLowerCase(),
          image: currImg.filename,
          description: e.description,
        }),
      });
      if (!res.ok) {
        return message.error("Gagal membuat category baru!");
      }
      message.success("Berhasil membuat category baru");
      setLoading(false);
      setOpen(false);
      await getData();
    } catch (err) {
      console.log(err);
      message.error("Gagal membuat category!");
      setLoading(false);
    }
  };

  const beforeUploadPDF = (file: FileType) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("Hanya bisa mengupload image/gambar!");
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
        "/api/article/upload/category",
        {
          file: base64,
          dir: "category",
          ext: currExt,
          id: "",
        },
        {
          headers: { "Content-Type": "Application/json" },
          onUploadProgress: (event: any) => {
            const percent = Math.floor((event.loaded / event.total) * 100);
            setCurrImg({ filename: "", progress: percent });
            if (percent === 100) {
              setCurrImg({ filename: "", progress: 100 });
            }
            onProgress({ percent: (event.loaded / event.total) * 100 });
          },
        }
      );
      console.log(res.data.url);
      setCurrImg({ filename: res.data.url, progress: 100 });
      setLoading(false);
    } catch (err) {
      console.log(err);
      message.error("Upload gagal. coba lagi!");
      setCurrImg({ filename: "", progress: 0 });
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch("/api/article/upload/category", {
        method: "DELETE",
        body: JSON.stringify({ url: currImg.filename }),
      });
      setCurrImg({ filename: "", progress: 0 });
      setLoading(false);
    } catch (err) {
      console.log(err);
      message.error("Hapus file gagal!");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (data) {
      setCurrImg({ filename: data.image, progress: 100 });
    }
  }, []);

  return (
    <div>
      <Button
        loading={loading}
        onClick={() => setOpen(true)}
        size="small"
        type="primary"
        className="text-xs"
      >
        {data ? (
          <FormOutlined />
        ) : (
          <>
            <PlusCircleOutlined /> New category
          </>
        )}
      </Button>
      <Modal
        open={open}
        title="Add Category"
        onCancel={() => setOpen(false)}
        footer={[]}
      >
        <div className="my-3">
          <Form onFinish={handleSubmit} labelCol={{ span: 5 }}>
            <Form.Item label="Name" name={"name"}>
              <Input defaultValue={data?.name} />
            </Form.Item>
            <Form.Item label="Description" name={"description"}>
              <Input.TextArea
                defaultValue={data?.description || ""}
              ></Input.TextArea>
            </Form.Item>
            <Form.Item label="Image" name={"image"}>
              {currImg.progress === 0 ? (
                <Upload
                  beforeUpload={beforeUploadPDF}
                  accept={"image/jpg,image/png,image/jpeg"}
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
              ) : (
                <div>
                  {currImg.filename ? (
                    <div className="flex gap-4">
                      <span>{currImg.filename}</span>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        type="primary"
                        loading={loading}
                        onClick={() => handleDelete()}
                      ></Button>
                    </div>
                  ) : (
                    <div>
                      <Progress percent={currImg.progress} />
                    </div>
                  )}
                </div>
              )}
            </Form.Item>
            <div>
              <Button block type="primary" htmlType="submit" loading={loading}>
                SUBMIT
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
