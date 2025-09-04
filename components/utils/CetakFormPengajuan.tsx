"use client";

import { Document, Font, PDFViewer, StyleSheet } from "@react-pdf/renderer";
import { Modal } from "antd";
import FormPengajuan from "./pdf/FormPengajuan";
import { DataDataPengajuan } from "./Interfaces";
import FormIdeb from "./pdf/FormIdeb";
import FormPerbedaanIdentitas from "./pdf/PerbedaanIdentitas";
import FormPernyataanKuasa from "./pdf/FormPernyataanKuasa";
import FormPemotongan from "./pdf/FormPemotongan";
import FormFlagging from "./pdf/FormFlagging";
import FormTabungan from "./pdf/FormTabungan";
import FormPernyataanDebitur from "./pdf/FormPErnyataanDeb";
import FormMutasiTaspen from "./pdf/FormMutasiTaspen";
import FormSP3R from "./pdf/FormSP3R";
import FormAsabri from "./pdf/FormAsabri";

Font.register({
  family: "Times-Roman",
  fonts: [
    { src: "Times-Bold", fontStyle: "normal", fontWeight: "bold" },
    { src: "Times-Roman", fontStyle: "normal", fontWeight: "normal" },
    { src: "Times-Italic", fontStyle: "italic", fontWeight: "normal" },
    { src: "Times-Bold-Italic", fontStyle: "italic", fontWeight: "bold" },
  ],
});

Font.register({
  family: "SourceSansPro",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/sourcesanspro/v14/6xK3dSBYKcSV-LCoeQqfX1RYOo3aPw.ttf",
    }, // font-style: normal, font-weight: normal
    {
      src: "https://fonts.gstatic.com/s/sourcesanspro/v14/6xKydSBYKcSV-LCoeQqfX1RYOo3i54rAkA.ttf",
      fontWeight: 600,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/@openfonts/source-sans-pro_latin/files/source-sans-pro-latin-400-italic.woff",
      fontStyle: "italic",
    },
  ],
});

export const stylesFont = StyleSheet.create({
  normal: { fontFamily: "Times-Roman" },
  bold: { fontFamily: "Times-Bold" },
  italic: { fontFamily: "Times-Italic" },
  boldItalic: { fontFamily: "Times-BoldItalic" },
  root: {
    fontFamily: "SourceSansPro",
  },
});

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
            <Document
              title="FORM PERMOHONAN"
              style={{ fontFamily: "Times-Roman" }}
            >
              <FormIdeb data={data} />
              <FormPengajuan data={data} />
              <FormPerbedaanIdentitas data={data} />
              <FormPernyataanKuasa data={data} />
              <FormPemotongan data={data} />
              <FormFlagging data={data} />
              <FormTabungan data={data} />
              <FormPernyataanDebitur data={data} />
              <FormMutasiTaspen data={data} />
              <FormSP3R data={data} />
              <FormAsabri data={data} />
            </Document>
          </PDFViewer>
        </div>
      </Modal>
    </div>
  );
}

export function formatStatus(value: string): string {
  return value
    .toLowerCase() // "belum_kawin"
    .split("_") // ["belum", "kawin"]
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "); // "Belum Kawin"
}
