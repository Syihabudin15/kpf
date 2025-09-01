"use client";

import { Image, Page, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { formatStatus, stylesFont } from "../CetakFormPengajuan";
import moment from "moment";

export default function FormPernyataanDebitur({
  data,
}: {
  data: DataDataPengajuan;
}) {
  return (
    <Page size={"A4"} style={{ padding: "40px 60px", fontSize: 8 }}>
      <Image
        src="/assets/images/Header.png"
        style={{
          position: "absolute",
          width: "100vw",
          top: 0,
          left: 0,
          right: 0,
        }}
      />
      <Image
        src="/assets/images/Footer.png"
        style={{
          position: "absolute",
          width: "100vw",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
      <View style={{ marginTop: 100, marginBottom: 30 }}>
        <Text
          style={{
            textDecoration: "underline",
            ...stylesFont.bold,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          SURAT PERNYATAAN DEBITUR
        </Text>
      </View>
      <Text style={{ margin: "5px 0" }}>
        Yang bertanda tangan dibawah ini :
      </Text>
      <View
        style={{
          margin: "3px 0",
          display: "flex",
          gap: 5,
          flexDirection: "row",
        }}
      >
        <Text style={{ width: 100 }}>Nama Lengkap</Text>
        <Text>:</Text>
        <View
          style={{
            flex: 1,
            borderBottom: "1px solid #aaa",
            borderBottomStyle: "dotted",
          }}
        >
          <Text>{data.nama}</Text>
        </View>
      </View>
      <View
        style={{
          margin: "3px 0",
          display: "flex",
          gap: 5,
          flexDirection: "row",
        }}
      >
        <Text style={{ width: 100 }}>Tempat/Tanggal Lahir</Text>
        <Text>:</Text>
        <View
          style={{
            flex: 1,
            borderBottom: "1px solid #aaa",
            borderBottomStyle: "dotted",
          }}
        >
          <Text>
            {data.DataPembiayaan.tempat_lahir + ", "}{" "}
            {moment(data.DataPembiayaan.tanggal_lahir).format("DD - MM - YYYY")}
          </Text>
        </View>
      </View>
      <View
        style={{
          margin: "3px 0",
          display: "flex",
          gap: 5,
          flexDirection: "row",
        }}
      >
        <Text style={{ width: 100 }}>Alamat</Text>
        <Text>:</Text>
        <View
          style={{
            flex: 1,
            borderBottom: "1px solid #aaa",
            borderBottomStyle: "dotted",
          }}
        >
          <Text>
            {[
              `${data.DataPengajuanAlamat.alamat} RT ${data.DataPengajuanAlamat.rt} RW ${data.DataPengajuanAlamat.rw}`,
              `KEL. ${data.DataPengajuanAlamat.kelurahan} KEC. ${data.DataPengajuanAlamat.alamat}`,
              `KOTA/KAB. ${data.DataPengajuanAlamat.kota} PROVINSI ${data.DataPengajuanAlamat.provinsi} ${data.DataPengajuanAlamat.kode_pos}`,
            ].join(", ")}
          </Text>
        </View>
      </View>
      <View
        style={{
          margin: "3px 0",
          display: "flex",
          gap: 5,
          flexDirection: "row",
        }}
      >
        <Text style={{ width: 100 }}>Nomor NIK</Text>
        <Text>:</Text>
        <View
          style={{
            flex: 1,
            borderBottom: "1px solid #aaa",
            borderBottomStyle: "dotted",
          }}
        >
          <Text>{data.nik}</Text>
        </View>
      </View>
      <View
        style={{
          margin: "3px 0",
          display: "flex",
          gap: 5,
          flexDirection: "row",
        }}
      >
        <Text style={{ width: 100 }}>Nomor Pensiun</Text>
        <Text>:</Text>
        <View
          style={{
            flex: 1,
            borderBottom: "1px solid #aaa",
            borderBottomStyle: "dotted",
          }}
        >
          <Text>{data.nopen}</Text>
        </View>
      </View>
      <View
        style={{
          margin: "3px 0",
          display: "flex",
          gap: 5,
          flexDirection: "row",
        }}
      >
        <Text style={{ width: 100 }}>Nomor Telepon</Text>
        <Text>:</Text>
        <View
          style={{
            flex: 1,
            borderBottom: "1px solid #aaa",
            borderBottomStyle: "dotted",
          }}
        >
          <Text>{data.no_telepon}</Text>
        </View>
      </View>
      <View style={{ marginTop: 10 }}></View>
      <Text style={{ margin: "3px 0", lineHeight: 1.5, textAlign: "justify" }}>
        Saya menyatakan dengan sesungguhnya bahwa setelah dilakukan akad kredit
        di {process.env.NEXT_PUBLIC_APP_FULL_NAME} (
        {process.env.NEXT_PUBLIC_APP_HEADER_NAME}) saya tidak akan membatalkan
        kredit tersebut.
      </Text>
      <Text style={{ margin: "3px 0", lineHeight: 1.5, textAlign: "justify" }}>
        Dan apabila saya melakukan pembatalan kredit, maka saya bersedia dikenai
        penalty/denda atas pembatalan kredit tersebut sebesar 10% dari nominal
        plafond kredit.
      </Text>
      <Text style={{ margin: "3px 0", lineHeight: 1.5, textAlign: "justify" }}>
        Demikian surat pernyataan ini saya buat, terimakasih.
      </Text>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 35,
          marginTop: 20,
          width: 120,
          justifyContent: "flex-start",
        }}
      >
        <View>
          <Text
            style={{
              margin: "3px 0",
              lineHeight: 1.5,
              textAlign: "center",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            {data.User.UnitCabang ? data.User.UnitCabang.name : ""},{" "}
            {moment(data.DataPembiayaan.tanggal_input).format("DD - MM - YYYY")}
          </Text>
          <Text style={{ textAlign: "center" }}>Yang membuat pernyataan,</Text>
        </View>
        <Text style={{ textAlign: "center" }}>Materai 10.000</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>(</Text>
          <Text style={{ textAlign: "center" }}>{data.nama}</Text>
          <Text>)</Text>
        </View>
      </View>
    </Page>
  );
}
