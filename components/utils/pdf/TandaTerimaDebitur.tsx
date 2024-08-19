import { DataDataPengajuan } from "../Interfaces";
import { Image, Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";

export default function TandaTerimaDebitur({
  data,
}: {
  data: DataDataPengajuan;
}) {
  return (
    <Page size={"A4"} style={stylePdf.root}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <View style={{ alignSelf: "baseline" }}>
          <Image
            src={data.Bank.logo || process.env.NEXT_PUBLIC_APP_LOGO}
            style={{ width: 50 }}
          />
        </View>
        <Text style={{ fontSize: 10, fontWeight: "bold" }}>
          TANDA TERIMA UANG OLEH NASABAH
        </Text>
        <Text></Text>
      </View>
      <View style={{ lineHeight: 2 }}>
        <Text>
          Dengan ini telah diakui oleh yang bertandatangan dibawah ini :
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 50 }}>Nama</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text>....................................</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 50 }}>Pekerjaan</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text>....................................</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 50 }}>Alamat</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text>....................................</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 50 }}></Text>
          <Text style={{ width: 20 }}></Text>
          <Text>....................................</Text>
        </View>
      </View>
      <View style={{ marginTop: 30, lineHeight: 2 }}>
        <Text>Untuk dan atas nama sendiri :</Text>
        <Text>
          Bahwa saya telah menerima uang dari PT. BPR Bina Dana Swadaya sejumlah{" "}
          <Text style={{ fontWeight: "bold" }}>
            Rp. ...................................
            (...........................................................................)
          </Text>
        </Text>
        <Text>
          sebagai pinjaman dengan syarat-syarat yang tercantum dalam Perjanjian
          Kredit No: <Text style={{ marginLeft: 10 }}>/BDS-PK/KKM/</Text>
          <Text style={{ marginLeft: 10 }}> /</Text>
          <Text style={{ marginLeft: 10 }}> tanggal</Text>
        </Text>
      </View>
      <View
        style={{
          marginTop: 50,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View>
          <Text>Jakarta</Text>
        </View>
        <View
          style={{
            height: 90,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text>Materai</Text>
          <Text>Rp. 10.000</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: 100,
          }}
        >
          <Text style={{ width: 100, borderBottom: "1px solid #aaa" }}></Text>
          <Text>Debitur</Text>
        </View>
      </View>
    </Page>
  );
}
