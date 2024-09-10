"use client";

import { DataBlog, DataCategory } from "@/components/utils/Interfaces";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  GetProp,
  Input,
  message,
  Progress,
  Select,
  Upload,
  UploadProps,
} from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreateArticle() {
  const [loading, setLoading] = useState(false);
  const [currImg, setCurrImg] = useState({ filename: "", progress: 0 });
  const [currExt, setCurrExt] = useState("");
  const [dataCategory, setDataCategory] = useState<DataCategory[]>([]);
  const router = useRouter();

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];
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
        "/api/article/upload",
        {
          file: base64,
          dir: "blog",
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
      await fetch("/api/article/upload", {
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
  const onSubmit = async (e: any) => {
    setLoading(true);
    try {
      console.log({ currImg });
      const res = await fetch("/api/article/blogs/blog", {
        method: "POST",
        headers: { "Content-type": "Application/json" },
        body: JSON.stringify({
          title: e.title,
          slug: e.title.replace(" ", "-").toLowerCase(),
          image: currImg.filename,
          description: e.description,
          body: e.body,
          keyword: e.keyword,
          blogCategoryId: e.blogCategoryId,
        }),
      });
      if (!res.ok) {
        return message.error("Gagal membuat artikel baru!");
      }
      message.success("Berhasil membuat artikel baru");
      router.push("/artikel");
      setLoading(false);
    } catch (err) {
      console.log(err);
      message.error("Gagal membuat artikel!");
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      const res = await fetch("/api/article");
      const { data } = await res.json();
      setDataCategory(data);
    })();

    setLoading(false);
  }, []);
  return (
    <div className="p-5">
      <p className="text-center text-xl font-bold italic my-5">
        Create Article
      </p>
      <Form onFinish={onSubmit} layout="vertical">
        <Form.Item label="Title" name={"title"}>
          <Input />
        </Form.Item>
        <Form.Item label="Category" name={"blogCategoryId"}>
          <Select
            options={dataCategory.map((e) => {
              return { label: e.name, value: e.id };
            })}
            allowClear
          />
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
                Browse {loading ? <LoadingOutlined /> : <CloudUploadOutlined />}
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
        <Form.Item label="Description" name={"description"}>
          <Input.TextArea></Input.TextArea>
        </Form.Item>
        <Form.Item label="Keywords" name={"keyword"}>
          <Input />
        </Form.Item>
        <Form.Item label="Article" name={"body"} className="text-editor">
          <ReactQuill modules={modules} formats={formats} />
        </Form.Item>
        <div className="flex gap-3">
          <div className="flex-1">
            <Link href={"/artikel"}>
              <Button
                block
                type="primary"
                danger
                htmlType="button"
                loading={loading}
              >
                CANCEL
              </Button>
            </Link>
          </div>
          <div className="flex-1">
            <Button block type="primary" htmlType="submit" loading={loading}>
              SUBMIT
            </Button>
          </div>
        </div>
      </Form>
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
