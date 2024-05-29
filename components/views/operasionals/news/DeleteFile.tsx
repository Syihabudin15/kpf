"use client";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";

export interface DeleteFile {
  title?: string;
  url?: string;
  pathUrl?: string | null;
  type: string;
  onClick: Function;
}

export default function DeleteFile({ data }: { data: DeleteFile }) {
  const [open, setOpen] = useState(false);
  const [currData, setCurrData] = useState<DeleteFile>();
  useEffect(() => {
    setCurrData({
      url: data.url,
      type: data.type,
      onClick: data.onClick,
    });
  }, [open]);
  return (
    <div>
      <div className="flex justify-center">
        <button
          style={{ opacity: currData?.url ? 1 : 0.5 }}
          disabled={currData?.url ? false : true}
          onClick={() => setOpen(true)}
          type="button"
        >
          <DeleteOutlined />
        </button>
      </div>
      <Modal
        title={data.title?.toUpperCase()}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[]}
        width={"95vw"}
        style={{ top: 20 }}
      >
        <div style={{ width: "100%", height: "80vh" }}>
          <object
            data={currData?.url}
            type={currData?.type}
            width={"100%"}
            height={"98%"}
          >
            <div className="text-center">
              <p className="text-red-500">Browser tidak mendukung!</p>
              <p className="text-red-500">
                Mobile Device belum mendukung pembukaan file PDF!
              </p>
              {currData?.url && (
                <div className="flex justify-center">
                  <a
                    href={currData?.url}
                    download={data.title + currData?.url.split(".")[1]}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 text-center text-xs"
                  >
                    DOWNLOAD
                  </a>
                </div>
              )}
            </div>
          </object>
          <div className="mt-2 flex justify-end">
            <button
              className="py-1 px-3 rounded shadow bg-red-500 hover:bg-red-600 w-32 text-white"
              onClick={() => data.onClick()}
            >
              YA
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
