"use client";
import { Modal } from "antd";

export default function BerkasOnly({
  url,
  type,
  title,
  open,
  setOpen,
}: {
  url: string;
  type: string;
  title: string;
  open: boolean;
  setOpen: Function;
}) {
  return (
    <div>
      <Modal
        title={title.toUpperCase()}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[]}
        width={"95vw"}
        style={{ top: 20 }}
      >
        <div style={{ width: "100%", height: "80vh" }}>
          <object data={url} type={type} width={"100%"} height={"100%"}>
            <div className="text-center">
              <p className="text-red-500">Browser tidak mendukung!</p>
              <p className="text-red-500">
                Mobile Device belum mendukung pembukaan file PDF!
              </p>
              <div className="flex justify-center">
                <a
                  href={url}
                  download={url}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 text-center text-xs"
                >
                  DOWNLOAD
                </a>
              </div>
            </div>
          </object>
        </div>
      </Modal>
    </div>
  );
}
