import { DataDataPengajuan } from "../Interfaces";
import { Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import moment from "moment";

export default function PernyataanDebitur({
  data,
}: {
  data: DataDataPengajuan;
}) {
  return (
    <Page size={"A4"} wrap style={stylePdf.root}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
          marginBottom: 30,
          fontWeight: "bold",
          fontSize: 10,
        }}
      >
        <Text>SURAT PERNYATAAN DEBITUR</Text>
        <Text>MITRA KERJA PT POS INDONESIA (PERSERO)</Text>
      </View>
      <View>
        <Text>Yang bertanda tangan dibawah ini :</Text>
      </View>
      <View
        style={{
          marginTop: 10,
          marginBottom: 10,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          <Text>a.</Text>
          <Text style={{ width: 120 }}>Nama PNS/ Pensiunan</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text>{data.DataPembiayaan.name}</Text>
        </View>
      </View>
      <View
        style={{ lineHeight: 1.5, marginBottom: 10, marginTop: 20, width: 540 }}
      >
        <Text>
          Sehubungan dengan saya mengambil fasilitas kredit Pembiayaan Pensiun
          pada Mitra Kerja PT POS INDONESIA (PERSERO) Kantor Cabang
          __________________ dengan perjanjian kredit nomor {data.nomor_akad}{" "}
          maka dengan ini saya menyatakan:
        </Text>
        <View
          style={{
            paddingLeft: 5,
            width: 520,
            textAlign: "justify",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text>1. </Text>
            <Text>
              Pada saat penerimaan pembayaran Manfaat Tabungan Hari Tua (THT)
              dan/atau Pensiun saya setiap bulan dari *PT TASPEN (PERSERO), agar
              dibayarkan melalui rekening saya nomor:
              ___________________________ atas Nama:
              _______________________________ Pada PT POS INDONESIA (PERSERO),
              Kantor Cabang ___________________ sampai dengan kredit saya lunas.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text>2. </Text>
            <Text>
              Memberi kuasa kepada PT POS INDONESIA (PERSERO), Kantor Cabang
              __________________________________ untuk melakukan Pengecekan Data
              kepesertaan Saya dan sekaligus untuk mendaftarkan Flagging Data
              Saya pada PT TASPEN (PERSERO) selama jangka waktu kredit yang
              telah disetujui yaitu Tanggal ____ Bulan ____ Tahun ________
              sampai dengan Tanggal ____ Bulan ____ Tahun ________ .
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text>
          Demikian surat pernyataan dan kuasa ini saya buat, untuk dipergunakan
          sebagaimana mestinya.
        </Text>
      </View>
      <View
        style={{
          marginTop: 50,
          display: "flex",
          flexDirection: "row",
          gap: 10,
          lineHeight: 1.5,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold" }}>Catatan :</Text>
          <Text>1. Lembar 1 untuk PT TASPEN (PERSERO)</Text>
          <Text>2. Lembar 2 untuk PT POS INDONESIA (PERSERO)</Text>
          <Text>3. Lembar 3 untuk debitur</Text>
          <Text>4. Lembar 4 untuk arsip</Text>
        </View>
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>
            {data.User.unit_cabang_id ? data.User.UnitCabang.name : "BANDUNG"},{" "}
            {moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")}
          </Text>
          <Text>Yang menyatakan</Text>
          <View
            style={{
              height: 80,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Meterai Rp. 10.000,-</Text>
          </View>
          <Text>{data.DataPembiayaan.name}</Text>
        </View>
      </View>
      <View
        style={{
          opacity: 0.7,
          position: "absolute",
          textAlign: "center",
          left: 0,
          right: 0,
          bottom: 20,
        }}
      >
        <Text
          render={({ pageNumber, totalPages }) => `${pageNumber}`}
          fixed
        ></Text>
      </View>
    </Page>
  );
}
