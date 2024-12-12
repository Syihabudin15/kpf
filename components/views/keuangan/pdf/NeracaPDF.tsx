import { formatNumber } from "@/components/utils/inputUtils";
import { stylePdf } from "@/components/utils/pdf/stylePdf";
import { Document, Page, PDFViewer, Text, View } from "@react-pdf/renderer";
import moment from "moment";
moment.updateLocale("id", {
  months: [
    "JANUARI",
    "FEBRUARI",
    "MARET",
    "APRIL",
    "MEI",
    "JUNI",
    "JULI",
    "AGUSTUS",
    "SEPTEMBER",
    "OKTOBER",
    "NOVEMBER",
    "DESEMBER",
  ],
});

export default function NeracaPDF({
  dateString,
  pinjamanAnggota,
  pinjamanCalonAnggota,
  danaKematian,
  titipanSetoran,
  invent,
  ATIMotor,
  sewaBayar,
  simpananAnggota,
  simpananCalonAnggota,
}: {
  dateString: string;
  pinjamanAnggota: number;
  pinjamanCalonAnggota: number;
  danaKematian: number;
  titipanSetoran: number;
  invent: number;
  ATIMotor: number;
  sewaBayar: number;
  simpananAnggota: number;
  simpananCalonAnggota: number;
}) {
  return (
    <PDFViewer className="w-full h-full">
      <Document>
        <Page style={stylePdf.root} size={"A4"}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
              fontWeight: "bold",
            }}
          >
            <Text style={{ fontSize: 16 }}>KOPERASI PEMASARAN FADILLAH</Text>
            <Text style={{ fontSize: 14 }}>
              NERACA PER TANGGAL {dateString}
            </Text>
          </View>
          <View
            style={{
              marginTop: 40,
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  fontWeight: "bold",
                  borderTop: "1px solid black",
                  borderBottom: "1px solid black",
                  paddingTop: 2,
                  paddingBottom: 3,
                  fontSize: 9,
                }}
              >
                <Text>AKTIVA</Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>1010000</Text>
                <Text style={{ width: 200 }}>KAS</Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>1010100</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>Kas-Besar</Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>1020000</Text>
                <Text style={{ width: 200 }}>PENEMPATAN PADA BANK/KOP</Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                  fontWeight: "bold",
                }}
              >
                <Text style={{ width: 50 }}>1020100</Text>
                <Text style={{ width: 200, paddingLeft: 5 }}>GIRO</Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>1020101</Text>
                <Text style={{ width: 200, paddingLeft: 10 }}>
                  Giro Bank BRI
                </Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>1020102</Text>
                <Text style={{ width: 200, paddingLeft: 10 }}>
                  Giro Bank BNI
                </Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                  fontWeight: "bold",
                }}
              >
                <Text style={{ width: 50 }}>1020200</Text>
                <Text style={{ width: 200, paddingLeft: 5 }}>TABUNGAN</Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>1020201</Text>
                <Text style={{ width: 200, paddingLeft: 10 }}>
                  Tabungan Bank BRI
                </Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>1030000</Text>
                <Text style={{ width: 200 }}>PINJAMAN YANG DIBERIKAN</Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(
                    (pinjamanAnggota + pinjamanCalonAnggota).toFixed(0)
                  )}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>1030100</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>
                  Pinjaman Anggota
                </Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(pinjamanAnggota.toFixed(0))}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>1030200</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>
                  Pinjaman Calon Anggota
                </Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(pinjamanCalonAnggota.toFixed(0))}
                </Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>1040000</Text>
                <Text style={{ width: 200 }}>
                  CADANGAN PIUTANG RAGU_RAGU -/-
                </Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>1040100</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>
                  Cadangan Piutang Ragu-Ragu -/-
                </Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>1050000</Text>
                <Text style={{ width: 200 }}>AKTIVA TETAP DAN INVENTARIS</Text>
                <Text style={{ width: 70 }}>
                  {formatNumber((ATIMotor + invent).toFixed(0))}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>1050100</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>
                  ATI Kendaraan Bermotor
                </Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(ATIMotor.toFixed(0))}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>1050200</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>
                  ATI Inventaris Kantor
                </Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(invent.toFixed(0))}
                </Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>1060000</Text>
                <Text style={{ width: 200 }}>
                  AKU. PENY. AKT. TETAP DAN INVENTARIS
                </Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>1060100</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>
                  Ak. Peny. Kendaraan Bermotor -/-
                </Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>1060200</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>
                  Ak. Peny. Inventaris Kantor -/-
                </Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>1070000</Text>
                <Text style={{ width: 200 }}>RUPA-RUPA AKTIVA</Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(sewaBayar.toFixed(0))}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>1070100</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>
                  RRA Sewa bayar Dimuka
                </Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(sewaBayar.toFixed(0))}
                </Text>
              </View>
            </View>
            {/* PASIVA */}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  borderTop: "1px solid black",
                  borderBottom: "1px solid black",
                  paddingTop: 2,
                  paddingBottom: 3,
                  fontSize: 9,
                }}
              >
                <Text>PASIVA</Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>2010000</Text>
                <Text style={{ width: 200 }}>KEWAJIBAN SEGERA</Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(danaKematian.toFixed(0))}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>2010100</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>
                  KS Utang Dana Kematian
                </Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(danaKematian.toFixed(0))}
                </Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>2020000</Text>
                <Text style={{ width: 200 }}>SIMPANAN</Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(
                    (simpananAnggota + simpananCalonAnggota).toFixed(0)
                  )}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>2020100</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>
                  Simpanan Anggota
                </Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(simpananAnggota.toFixed(0))}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>2020200</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>
                  Simpanan Calon Anggota
                </Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(simpananCalonAnggota.toFixed(0))}
                </Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>2040000</Text>
                <Text style={{ width: 200 }}>RUPA-RUPA PASIVA</Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(titipanSetoran.toFixed(0))}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 5,
                }}
              >
                <Text style={{ width: 50 }}>2040100</Text>
                <Text style={{ paddingLeft: 5, width: 200 }}>
                  RRP Titipan Setoran
                </Text>
                <Text style={{ width: 70 }}>
                  {formatNumber(titipanSetoran.toFixed(0))}
                </Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>3010000</Text>
                <Text style={{ width: 200 }}>EKUITAS</Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                  fontWeight: "bold",
                }}
              >
                <Text style={{ width: 50 }}>3010100</Text>
                <Text style={{ width: 200, paddingLeft: 5 }}>SALDO LABA</Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>3010101</Text>
                <Text style={{ width: 200, paddingLeft: 10 }}>
                  SHU Tahun Lalu
                </Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ width: 50 }}>3010102</Text>
                <Text style={{ width: 200, paddingLeft: 10 }}>
                  SHU Tahun Berjalan
                </Text>
                <Text style={{ width: 70 }}>0</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              fontWeight: "bold",
              gap: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                paddingTop: 2,
                paddingBottom: 3,
                fontSize: 9,
              }}
            >
              <Text
                style={{
                  width: 251,
                  textAlign: "center",
                }}
              >
                TOTAL AKTIVA
              </Text>
              <Text style={{ width: 70 }}>
                {formatNumber(
                  (
                    pinjamanAnggota +
                    pinjamanCalonAnggota +
                    invent +
                    ATIMotor +
                    sewaBayar
                  ).toFixed(0)
                )}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                paddingTop: 2,
                paddingBottom: 3,
                fontSize: 9,
              }}
            >
              <Text style={{ width: 251, textAlign: "center" }}>
                TOTAL PASIVA
              </Text>
              <Text style={{ width: 70 }}>
                {formatNumber(
                  (
                    danaKematian +
                    titipanSetoran +
                    simpananAnggota +
                    simpananCalonAnggota
                  ).toFixed(0)
                )}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 20, marginBottom: 10 }}></View>
          {/* <View style={{  }}> */}
          <Text style={{ textAlign: "right", marginRight: 100 }}>
            BANDUNG, {moment().locale("id").format("DD MMMM YYYY")}
          </Text>
          {/* </View> */}
          <View
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              gap: 20,
            }}
          >
            <View style={{ width: 100, textAlign: "center" }}>
              <Text>Mengetahui</Text>
              <View style={{ height: 70 }}></View>
              <View>
                <Text>Eva Fajar Nurhasanah</Text>
                <Text
                  style={{
                    borderBottom: "1px solid #999",
                    marginTop: 2,
                    marginBottom: 1,
                  }}
                ></Text>
                <Text>Ketua Koperasi</Text>
              </View>
            </View>
            <View style={{ width: 100, textAlign: "center" }}>
              <View style={{ height: 80 }}></View>
              <View>
                <Text>Lulu Dwi Akhira</Text>
                <Text
                  style={{
                    borderBottom: "1px solid #999",
                    marginTop: 1,
                    marginBottom: 1,
                  }}
                ></Text>
                <Text>Manager Keuangan</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
