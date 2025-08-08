"use client";
import { DataDataPencairan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { stylePdf } from "@/components/utils/pdf/stylePdf";
import {
  Document,
  Image,
  PDFViewer,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import moment from "moment";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";

export default function SIBprSip({ data }: { data: DataDataPencairan }) {
  let totalPlafond = 0;
  data.DataPengajuan.forEach((e) => {
    totalPlafond += e.DataPembiayaan.plafond;
  });
  let totalDropping = 0;
  let totalAdmin = 0;
  let totalRekening = 0;
  let totalProvisi = 0;
  let totalAngsuran = 0;

  let tables = data.DataPengajuan.map((d, i) => {
    const admin =
      d.DataPembiayaan.plafond * (d.DataPembiayaan.by_admin_bank / 100);
    const newAdmin = admin;

    const rekening = d.DataPembiayaan.by_buka_rekening;
    totalAdmin += newAdmin;
    totalRekening += rekening;
    totalProvisi += d.DataPembiayaan.by_provisi;
    const angsuran =
      d.jenis_margin === "FLAT"
        ? ceiling(
            parseInt(
              getAngsuranPerBulan(
                d.DataPembiayaan.mg_bunga,
                d.DataPembiayaan.tenor,
                d.DataPembiayaan.plafond,
                false,
                true
              )
            ),
            d.DataPembiayaan.pembulatan
          )
        : ceiling(
            parseInt(
              getAngsuranPerBulan(
                d.DataPembiayaan.mg_bunga,
                d.DataPembiayaan.tenor,
                d.DataPembiayaan.plafond,
                false,
                false,
                d.Bank.kode
              )
            ),
            d.DataPembiayaan.pembulatan
          );
    let angs = angsuran * d.DataPembiayaan.blokir;
    totalAngsuran += angs;
    totalDropping +=
      d.DataPembiayaan.plafond -
      (newAdmin + rekening + d.DataPembiayaan.by_provisi + angs);
    return [
      { data: i + 1, width: 40 },
      { data: d.DataPembiayaan.nopen, width: 100 },
      { data: d.DataPembiayaan.name, width: 100 },
      { data: d.DataPembiayaan.Produk.name, width: 100 },
      { data: formatNumber(d.DataPembiayaan.plafond.toFixed(0)), width: 100 },
      { data: formatNumber(newAdmin.toFixed(0)), width: 100 },
      {
        data: formatNumber(d.DataPembiayaan.by_provisi.toFixed(0)),
        width: 100,
      },
      { data: "1 Bulan", width: 100 },
      {
        data: formatNumber(angs.toFixed(0)),
        width: 100,
      },
      {
        data: formatNumber(
          (
            d.DataPembiayaan.plafond -
            (newAdmin + rekening + d.DataPembiayaan.by_provisi + angs)
          ).toFixed(0)
        ),
        width: 100,
      },
    ];
  });
  return (
    <div className="w-full h-full">
      <PDFViewer className="w-full h-full">
        <Document title="Berkas SI">
          <Page size={"A4"} style={{ ...stylePdf.root, padding: 50 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
              }}
            >
              <Image
                src={process.env.NEXT_PUBLIC_APP_LOGO}
                style={{ width: 50 }}
              />
              <View style={{ fontWeight: "bold" }}>
                <Text style={{ fontSize: 10 }}>
                  {process.env.NEXT_PUBLIC_APP_FULL_NAME}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 30, lineHeight: 1.5 }}>
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <Text style={{ width: 50 }}>No</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text>{data.nomor_surat}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <Text style={{ width: 50 }}>Lampiran</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text>1 (satu) Daftar Permohonan Dropping</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <Text style={{ width: 50 }}>Perihal</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text style={{ fontWeight: "bold", width: 300 }}>
                  Permohonan Dropping Dana Pembiayaan Pensiun Periode Bulan{" "}
                  {new Date(data.tanggal_cetak).toLocaleString("id-ID", {
                    month: "long",
                  })}{" "}
                  Tahun {moment(data.tanggal_cetak).year()}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 30, lineHeight: 1.5 }}>
              <Text>Kepada Yth</Text>
              <Text>Direktur</Text>
              <Text style={{ fontWeight: "bold" }}>
                {data.Bank.name.toUpperCase()}
              </Text>
              <Text>Di tempat</Text>
            </View>
            <View style={{ marginTop: 5, width: 500, lineHeight: 1.5 }}>
              <Text>
                Bersama surat ini kami ajukan permohonan pencairan dan
                pemindahbukuan atas pengajuan yang sudah disetujui oleh komite
                bank. Adapun rekap dropping tersebut kami sampaikan sebagai
                berikut :
              </Text>
              <View
                style={{
                  marginLeft: 10,
                  marginTop: 15,
                  marginBottom: 15,
                  lineHeight: 1.5,
                }}
              >
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 10 }}
                >
                  <Text style={{ width: 8 }}>1. </Text>
                  <Text style={{ width: 150 }}>Jumlah Debitur</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text>{data.DataPengajuan.length}</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Text style={{ width: 8 }}>2. </Text>
                  <Text style={{ width: 150 }}>Jumlah Plafond</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text>Rp. {formatNumber(totalPlafond.toFixed(0))}</Text>
                </View>
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 10 }}
                >
                  <Text style={{ width: 8 }}>3. </Text>
                  <Text style={{ width: 150 }}>
                    Dropping Ke Rek.{" "}
                    {process.env.NEXT_PUBLIC_APP_FULL_NAME?.toUpperCase()}
                  </Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text>Rp. {formatNumber(totalDropping.toFixed(0))}</Text>
                </View>
              </View>
              <View style={{ lineHeight: 1.8 }}>
                <Text>
                  Rincian data kami lampirkan bersama dengan surat ini.
                </Text>
                <Text>
                  Dana tersebut pada butir 2. diatas mohon dapat disetorkan /
                  ditransfer kepada kami di :
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                    marginTop: 5,
                  }}
                >
                  <Text style={{ width: 100 }}>Nomor Rekening</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text>{process.env.NEXT_PUBLIC_APP_NO_REK}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                  <Text style={{ width: 100 }}>Atas Nama</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text>
                    {process.env.NEXT_PUBLIC_APP_ATAS_NAMA_BANK ||
                      "KOPERASI JASA FADILLAH AQILA SEJAHTRA"}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                  <Text style={{ width: 100 }}>Nama Bank</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text>{process.env.NEXT_PUBLIC_APP_NAMA_BANK}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>
                Demikian kami sampaikan dan atas perhatian serta kerjasama yang
                terjalin baik selama ini diucapkan terima kasih.
              </Text>
            </View>
            <View
              style={{
                marginTop: 50,
                width: 120,
                alignItems: "center",
              }}
            >
              <Text>
                BANDUNG, {moment(data.tanggal_cetak).format("DD-MM-YYYY")}
              </Text>
              <Text>A.N. PENGURUS</Text>
            </View>
            <View
              style={{
                display: "flex",
                textAlign: "center",
                width: 120,
              }}
            >
              <View
                style={{
                  height: 80,
                }}
              ></View>
              <View
                style={{
                  display: "flex",
                }}
              >
                <Text>ADHI SOFYAR PRAMUDYA</Text>
                <View
                  style={{ width: 120, borderBottom: "1px solid #888" }}
                ></View>
                <Text>Kepala Operasional</Text>
              </View>
            </View>
          </Page>
          <Page size={"A4"} style={{ ...stylePdf.root, padding: 20 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                padding: 30,
              }}
            >
              <Image
                src={process.env.NEXT_PUBLIC_APP_LOGO}
                style={{ width: 50 }}
              />
              <View style={{ fontWeight: "bold" }}>
                <Text style={{ fontSize: 10 }}>
                  {process.env.NEXT_PUBLIC_APP_FULL_NAME}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 30,
                lineHeight: 1.5,
                fontWeight: "bold",
                paddingLeft: 30,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text style={{ width: 80 }}>No Surat</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text>{data.nomor_surat}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text style={{ width: 80 }}>No Rekening</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text>{process.env.NEXT_PUBLIC_APP_NO_REK}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text style={{ width: 80 }}>Atas Nama</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text>{process.env.NEXT_PUBLIC_APP_ATAS_NAMA_BANK}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text style={{ width: 80 }}>Nama Bank</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text>{process.env.NEXT_PUBLIC_APP_NAMA_BANK}</Text>
              </View>
            </View>
            <View style={{ marginTop: 50 }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontWeight: "bold",
                }}
              >
                <View
                  style={{
                    width: 40,
                    border: "1px solid #aaa",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                  }}
                >
                  <Text>No</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    border: "1px solid #aaa",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                  }}
                >
                  <Text>Nopen</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    border: "1px solid #aaa",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                  }}
                >
                  <Text>Nama Debitur</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    border: "1px solid #aaa",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                  }}
                >
                  <Text>Jenis Produk</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    border: "1px solid #aaa",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                  }}
                >
                  <Text>Plafond (Rp)</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    border: "1px solid #aaa",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.5,
                    padding: 2,
                  }}
                >
                  <Text>Adm Bank (Rp)</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    border: "1px solid #aaa",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.5,
                    padding: 2,
                  }}
                >
                  <Text>Biaya Layanan</Text>
                  <Text>Kredit (Rp)</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    border: "1px solid #aaa",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.5,
                    padding: 2,
                  }}
                >
                  <Text>Bunga GP</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    border: "1px solid #aaa",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.5,
                    padding: 2,
                  }}
                >
                  <Text>Blokir</Text>
                  <Text>Angsuran (Rp)</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    border: "1px solid #aaa",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.5,
                    padding: 2,
                  }}
                >
                  <Text>Dropping</Text>
                  <Text>Koperasi (Rp)</Text>
                </View>
              </View>
              {tables.map((tab, ind) => (
                <View
                  key={ind}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  {tab.map((t, i) => (
                    <View
                      key={i}
                      style={{
                        border: "1px solid #aaa",
                        padding: 2,
                        width: t.width,
                        textAlign: "center",
                      }}
                    >
                      <Text>{t.data}</Text>
                    </View>
                  ))}
                </View>
              ))}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontWeight: "bold",
                }}
              >
                <View
                  style={{
                    width: 340,
                    padding: 2,
                    border: "1px solid #aaa",
                    textAlign: "center",
                  }}
                >
                  <Text>TOTAL</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    padding: 2,
                    border: "1px solid #aaa",
                    textAlign: "center",
                  }}
                >
                  <Text>{formatNumber(totalPlafond.toFixed(0))}</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    padding: 2,
                    border: "1px solid #aaa",
                    textAlign: "center",
                  }}
                >
                  <Text>{formatNumber(totalAdmin.toFixed(0))}</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    padding: 2,
                    border: "1px solid #aaa",
                    textAlign: "center",
                  }}
                >
                  <Text>{formatNumber(totalProvisi.toFixed(0))}</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    padding: 2,
                    border: "1px solid #aaa",
                    textAlign: "center",
                  }}
                >
                  <Text></Text>
                </View>
                <View
                  style={{
                    width: 100,
                    padding: 2,
                    border: "1px solid #aaa",
                    textAlign: "center",
                  }}
                >
                  <Text>{formatNumber(totalAngsuran.toFixed(0))}</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    padding: 2,
                    border: "1px solid #aaa",
                    textAlign: "center",
                  }}
                >
                  <Text>{formatNumber(totalDropping.toFixed(0))}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 50,
                display: "flex",
                flexDirection: "row",
                gap: 50,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Diproses Oleh</Text>
                <View style={{ height: 80 }}></View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Adhi Sofyar Pramudya</Text>
                  <View
                    style={{ width: 120, borderBottom: "1px solid #aaa" }}
                  ></View>
                  <Text>Kepala Operasional</Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Diperiksa Oleh</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={{ height: 80 }}></View>
                  <Text>{process.env.NEXT_PUBLIC_APP_MANAJER_KEUANGAN}</Text>
                  <View
                    style={{ width: 120, borderBottom: "1px solid #aaa" }}
                  ></View>
                  <Text>Manajer Keuangan</Text>
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
}
