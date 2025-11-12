import { Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { DataDataPengajuan } from "../Interfaces";
import { AngsuranAnuitas, IDRFormat } from "@/components/v1/appUtils";
import moment from "moment";
const angkaTerbilang = require("angka-menjadi-terbilang");

const angka = [
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
];
export default function PKDassa({ data }: { data: DataDataPengajuan }) {
  return (
    <Page
      size={"A4"}
      style={{
        ...stylePdf.root,
        fontSize: 8,
        paddingVertical: 40,
        paddingHorizontal: 60,
        lineHeight: 1.5,
        textAlign: "justify",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Image
          src={"/assets/images/logo_kpf.jpg"}
          style={{ width: 50, height: 50 }}
        />
      </View>
      <View style={{ textAlign: "center", fontWeight: "bold", fontSize: 14 }}>
        <Text>DOKUMEN KREDIT PENSIUN</Text>
      </View>
      <View
        style={{
          margin: "20px 0px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 150 }}>Nama Debitur</Text>
          <Text style={{ width: 10 }}>:</Text>
          <Text>{data.nama}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 150 }}>Nopin</Text>
          <Text style={{ width: 10 }}>:</Text>
          <Text>{}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 150 }}>Nomor SK Pensiun</Text>
          <Text style={{ width: 10 }}>:</Text>
          <Text>{data.nomor_sk_pensiun}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 150 }}>Tgl Realisasi & No PK</Text>
          <Text style={{ width: 10 }}>:</Text>
          <Text>{}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 150 }}>Plafond & Jangka Waktu</Text>
          <Text style={{ width: 10 }}>:</Text>
          <Text>
            Rp. {IDRFormat(data.DataPembiayaan.plafond)} &{" "}
            {data.DataPembiayaan.tenor} Bulan
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 150 }}>Cabang</Text>
          <Text style={{ width: 10 }}>:</Text>
          <Text>
            {data.User.UnitCabang ? data.User.UnitCabang.name : "PUSAT"}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 150 }}>Bank Pendana</Text>
          <Text style={{ width: 10 }}>:</Text>
          <Text>{data.DataPembiayaan.Produk.Bank.name}</Text>
        </View>
      </View>
      <View
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 14,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Text>JENIS PENGAJUAN</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 4,
          justifyContent: "center",
        }}
      >
        {[
          "MUTASI",
          "MUTASI TAKE OVER",
          "TAKE OVER",
          "SK DI TANGAN",
          "REHAB/TOPUP",
        ].map((d) => (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              gap: 5,
            }}
            key={d}
          >
            <Checkbox />
            <Text>{d}</Text>
          </View>
        ))}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  separator: {
    width: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});

const Checkbox = ({ checked }: { checked?: any }) => (
  <View style={styles.checkboxContainer}>
    <View style={styles.box}>
      <Text>{checked}</Text>
    </View>
  </View>
);
