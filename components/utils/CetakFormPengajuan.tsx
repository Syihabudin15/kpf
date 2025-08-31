"use client";

import { Document, PDFViewer } from "@react-pdf/renderer";
import { Modal } from "antd";
import FormPengajuan from "./pdf/FormPengajuan";
import { DataDataPengajuan } from "./Interfaces";
import FormIdeb from "./pdf/FormIdeb";

export default function CetakForm({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: Function;
  data: DataDataPengajuan;
}) {
  return (
    <div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={[]}
        title="DOWNLOAD FORM PERMOHONAN"
        width={window && window.innerWidth > 600 ? "80vw" : "95vw"}
        style={{ top: 20 }}
      >
        <div className="h-[80vh] w-full">
          <PDFViewer className="h-full w-full">
            <Document title="FORM PERMOHONAN">
              <FormIdeb data={data} />
              <FormPengajuan data={data} />
            </Document>
          </PDFViewer>
        </div>
      </Modal>
    </div>
  );
}
