"use client";
import { AngsuranDebitur } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { stylePdf } from "@/components/utils/pdf/stylePdf";
import { PrinterOutlined } from "@ant-design/icons";
import {
  Document,
  Image,
  PDFViewer,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import { Modal } from "antd";
import moment from "moment";
import { useState } from "react";
import {
  TablePdfBodies,
  TablePdfHeaders,
  TablePdf,
} from "@/components/utils/pdf/TablePdf";
import { JadwalAngsuran } from "@prisma/client";

export default function CetakPdfAngsuranDebitur({
  data,
}: {
  data: AngsuranDebitur;
}) {
  const [open, setOpen] = useState(false);
  const header: TablePdfHeaders[] = [
    {
      title: "No",
      dataIndex: "angsuran_ke",
      style: { textAlign: "center" },
    },
    {
      title: "Tanggal Bayar",
      dataIndex: "tanggal_bayar",
      style: { textAlign: "center" },
    },
    {
      title: "Angsuran",
      dataIndex: "angsuran",
      style: { textAlign: "center" },
    },
    {
      title: "Pokok",
      dataIndex: "pokok",
      style: { textAlign: "center" },
    },
    {
      title: "Margin",
      dataIndex: "margin",
      style: { textAlign: "center" },
    },
    {
      title: "Tanggal Pelunasan",
      dataIndex: "tanggal_pelunasan",
      style: { textAlign: "center" },
    },
    {
      title: "Sisa",
      dataIndex: "sisa",
      style: { textAlign: "center" },
    },
  ];
  const tableBodies: TablePdfBodies[] = data.JadwalAngsuran.map(
    (d: JadwalAngsuran) => {
      return {
        angsuran_ke: d.angsuran_ke,
        tanggal_bayar: moment(d.tanggal_bayar).format("DD-MM-YYYY"),
        angsuran: formatNumber(d.angsuran.toFixed(0)),
        pokok: formatNumber(d.pokok.toFixed(0)),
        margin: formatNumber(d.margin.toFixed(0)),
        tanggal_pelunasan: d.tanggal_pelunasan
          ? moment(d.tanggal_pelunasan).format("DD-MM-YYYY")
          : "",
        sisa: formatNumber(d.sisa.toFixed(0)),
      };
    }
  );

  return (
    <div>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded shadow"
          onClick={() => setOpen(true)}
        >
          PDF <PrinterOutlined />
        </button>
      </div>
      <Modal
        style={{ height: "80vh", top: 20 }}
        width={"95vw"}
        title={`Angsuran ${data.DataPembiayaan.name}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[]}
      >
        <div style={{ height: "80vh", width: "100%" }}>
          <PDFViewer style={{ width: "100%", height: "100%" }}>
            <Document title={`Angsuran ${data.DataPembiayaan.name}`}>
              <Page size={"A4"} style={stylePdf.root}>
                <View fixed>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Image
                      src={process.env.NEXT_PUBLIC_APP_LOGO}
                      style={{ width: 50 }}
                    />
                    <View
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      <Text>JADWAL ANGSURAN</Text>
                    </View>
                    <Image
                      src={process.env.NEXT_PUBLIC_APP_LOGO}
                      style={{ width: 50 }}
                    />
                  </View>
                  <View
                    style={{
                      marginBottom: 10,
                      paddingLeft: 10,
                      paddingRight: 10,
                      lineHeight: 1.2,
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: 80 }}>NOPEN</Text>
                        <Text style={{ width: 20 }}>:</Text>
                        <Text style={{ width: 150 }}>
                          {data.DataPembiayaan.nopen}
                        </Text>
                      </View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: 80 }}>NAMA</Text>
                        <Text style={{ width: 20 }}>:</Text>
                        <Text style={{ width: 150 }}>
                          {data.DataPembiayaan.name || ""}
                        </Text>
                      </View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: 80 }}>TANGGAL AKAD</Text>
                        <Text style={{ width: 20 }}>:</Text>
                        <Text style={{ width: 150 }}>
                          {moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")}
                        </Text>
                      </View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: 80 }}>TANGGAL LUNAS</Text>
                        <Text style={{ width: 20 }}>:</Text>
                        <Text style={{ width: 150 }}>
                          {moment(data.tanggal_cetak_akad).add(data.DataPembiayaan.tenor, "M").format("DD-MM-YYYY")}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: 80 }}>PLAFOND</Text>
                        <Text style={{ width: 20 }}>:</Text>
                        <Text style={{ width: 150 }}>
                          {formatNumber(data.DataPembiayaan.plafond.toFixed(0))}
                        </Text>
                      </View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: 80 }}>TENOR</Text>
                        <Text style={{ width: 20 }}>:</Text>
                        <Text style={{ width: 150 }}>{data.DataPembiayaan.tenor} Bulan</Text>
                      </View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: 80 }}>PRODUK PEMBIAYAAN</Text>
                        <Text style={{ width: 20 }}>:</Text>
                        <Text style={{ width: 150 }}>
                          {data.DataPembiayaan.Produk.name}
                        </Text>
                      </View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: 80 }}>JENIS PEMBIAYAAN</Text>
                        <Text style={{ width: 20 }}>:</Text>
                        <Text style={{ width: 150 }}>
                          {data.DataPembiayaan.jenis_pembiayaan_id ? data.DataPembiayaan.JenisPembiayaan.name : "Sisa Gaji"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View>
                  <TablePdf dataHeader={header} dataBodies={tableBodies} />
                </View>
              </Page>
            </Document>
          </PDFViewer>
        </div>
      </Modal>
    </div>
  );
}
