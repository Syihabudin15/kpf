"use client";
import { CloudUploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Upload } from "antd";
import { useState } from "react";

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      resolve(reader.result);
    };
    reader.onerror = (info) => {
      console.log(info);
      reject;
    };
  });

export default function TagihanDebitur() {
  const [loading, setLoading] = useState(false);
  // const [month, setMonth] = useState<string>(moment().format("YYYY-MM"));
  // const [data, setData] = useState<Tagihan[]>([]);
  const [result, setResult] = useState<string[]>([]);

  const handleUpload = async (options: any) => {
    setLoading(true);
    const base = await getBase64(options.file);
    await fetch("/api/tagihan-debitur", {
      method: "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({ url: base }),
    })
      .then((res) =>
        res.json().then((res) => {
          setResult(res.result.messages);
        })
      )
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  return (
    <div>
      <div className="p-1 flex gap-2">
        {/* <button
          className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-4 rounded shadow"
          // onClick={() => handleCetak()}
        >
          Cetak
        </button> */}
        {/* <Upload
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv"
          customRequest={handleUpload}
          showUploadList={false}
          multiple={false}
        >
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-4 rounded shadow">
            <CloudUploadOutlined />
          </button>
        </Upload> */}
        {/* <DatePicker
          picker="month"
          onChange={(_, e) => setMonth(moment(e).format("YYYY-MM"))}
        /> */}
      </div>
      <div className="p-1">
        {result.length === 0 ? (
          <div className="border rounded-sm w-full h-full flex justify-center items-center p-5">
            <Upload
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv"
              customRequest={handleUpload}
              showUploadList={false}
              multiple={false}
            >
              <Button
                icon={<CloudUploadOutlined />}
                type="dashed"
                loading={loading}
              >
                Upload Tagihan
              </Button>
            </Upload>
          </div>
        ) : (
          <div className="text-xs">
            {result.map((r) => (
              <p className="border-b" key={r}>
                {r}
              </p>
            ))}
            <div className="flex justify-end m-5">
              <Button type="primary" size="small" onClick={() => setResult([])}>
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
