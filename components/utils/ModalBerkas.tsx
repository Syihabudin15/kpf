"use client";
import { FileFilled } from "@ant-design/icons";
import { Modal } from "antd";

export interface ModalBerkas {
  title?: string;
  url?: string;
  type: string;
}

export default function ModalBerkas({
  data,
  open,
  setOpen,
}: {
  data: ModalBerkas;
  open: boolean;
  setOpen: Function;
}) {
  return (
    <div>
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
            data={data.url}
            type={data.type}
            width={"100%"}
            height={"100%"}
          >
            <div className="text-center">
              <p className="text-red-500">Browser tidak mendukung!</p>
              <p className="text-red-500">
                Mobile Device belum mendukung pembukaan file PDF!
              </p>
              <div className="flex justify-center">
                <a
                  href={data.url}
                  download={data.url}
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
