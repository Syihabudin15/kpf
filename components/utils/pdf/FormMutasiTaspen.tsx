"use client";

import { Image, Page, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { formatStatus, stylesFont } from "../CetakFormPengajuan";
import moment from "moment";

export default function FormMutasiTaspen({
  data,
}: {
  data: DataDataPengajuan;
}) {
  return (
    <>
      <Page size={"A4"} style={{ padding: "50px 80px", fontSize: 8 }}>
        <Image
          src={"/assets/images/taspen.png"}
          style={{ position: "absolute", left: 50, top: 30, width: 80 }}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            ...stylesFont.bold,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          PERMOHONAN MUTASI FINANSIAL DAN NON FINANSIAL
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 10 }}>A.</Text>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <View style={{ flex: 1, display: "flex", flexDirection: "row" }}>
              <Text style={{ ...stylesFont.bold, width: 120 }}>
                JENIS MUTASI:
              </Text>
              <View style={{ flex: 1, borderBottom: "1px solid #555" }}></View>
            </View>
            <View style={{ flex: 1, display: "flex", flexDirection: "row" }}>
              <Text style={{ ...stylesFont.bold, width: 120 }}>
                MUTASI FINANSIAL
              </Text>
              <View style={{ flex: 1, borderBottom: "1px solid #555" }}>
                <Text>Tujangan Keluarga</Text>
                <Text>Lainnya</Text>
              </View>
            </View>
            <View style={{ flex: 1, display: "flex", flexDirection: "row" }}>
              <Text style={{ ...stylesFont.bold, width: 120 }}>
                MUTASI NON FINANSIAL
              </Text>
              <View style={{ flex: 1, borderBottom: "1px solid #555" }}>
                <Text>Mutasi Keluar kantor cabang</Text>
                <Text>Mutasi Kantor Bayar</Text>
                <Text>Mutasi Alamat</Text>
                <Text>Ganti Nomor Rekening</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
      <Page size={"A4"} style={{ padding: "40px 60px", fontSize: 8 }}>
        PAGE 2
      </Page>
    </>
  );
}
