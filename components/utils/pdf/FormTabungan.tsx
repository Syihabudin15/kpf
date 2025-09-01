"use client";

import { Image, Page, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { formatStatus, stylesFont } from "../CetakFormPengajuan";
import moment from "moment";

export default function FormTabungan({ data }: { data: DataDataPengajuan }) {
  return (
    <Page size={"A4"} style={{ padding: "40px 60px", fontSize: 8 }}>
      <View
        style={{
          display: "flex",
          justifyContent: "space-around",
          gap: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          src={"/assets/images/kopnas.png"}
          style={{ width: 50, height: 50 }}
        />
        <View style={{ flex: 1, lineHeight: 1.5 }}>
          <Text
            style={{ textAlign: "center", fontSize: 11, ...stylesFont.bold }}
          >
            FORMULIR PENDAFTARAN ANGGOTA
          </Text>
          <Text
            style={{ textAlign: "center", fontSize: 11, ...stylesFont.bold }}
          >
            {process.env.NEXT_PUBLIC_APP_FULL_NAME}
          </Text>
          <Text
            style={{ textAlign: "center", fontSize: 10, ...stylesFont.bold }}
          >
            ({process.env.NEXT_PUBLIC_APP_NAME_HEADER})
          </Text>
        </View>
        <Image
          src={"/assets/images/app_logo.png"}
          style={{ width: 70, height: 50 }}
        />
      </View>
      <View style={{ margin: 15 }}></View>
      <Text style={{ margin: "5px 0" }}>
        Saya yang bertanda tangan di bawah ini :{" "}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
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
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 100 }}>Jenis Kelamin</Text>
        <Text>:</Text>
        <View
          style={{
            flex: 1,
            borderBottom: "1px solid #aaa",
            borderBottomStyle: "dotted",
          }}
        >
          <Text>{formatStatus(data.jenis_kelamin || "").toUpperCase()}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
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
            {data.DataPembiayaan.tempat_lahir + ","}{" "}
            {moment(data.DataPembiayaan.tanggal_lahir).format("DD - MM - YYYY")}
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 100 }}>Alamat Rumah</Text>
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
      <Text
        style={{
          marginTop: 10,
          marginBottom: 5,
          textAlign: "justify",
          lineHeight: 1.5,
        }}
      >
        Dengan ini mendaftar menjadi Anggota{" "}
        {process.env.NEXT_PUBLIC_APP_FULL_NAME} (
        {process.env.NEXT_PUBLIC_APP_NAME_HEADER}), dengan memenuhi syarat yang
        sudah ditentukan serta memahami dan tunduk pada aturan yang ada di
        Anggaran Dasar / Anggaran Rumah Tangga{" "}
        {process.env.NEXT_PUBLIC_APP_NAME_HEADER}.
      </Text>
      <Text style={{ marginBottom: 20, textAlign: "justify", lineHeight: 1.5 }}>
        Semua keterangan yang saya berikan adalah benar dan sebagai syarat
        kelengkapan persetujuan keanggotaan bersama ini saya lampirkan bukti
        identitas diri yang masih berlaku ( KTP) serta membayar Simpanan Pokok
        (SP) sekali selama jadi anggota sebesar Rp.100.000,- (Seratus Ribu
        Rupiah).
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          gap: 20,
        }}
      >
        <View
          style={{
            width: 100,
            display: "flex",
            flexDirection: "column",
            gap: 70,
          }}
        >
          <View>
            <Text
              style={{
                margin: "5px 0",
                textDecoration: "underline",
                textDecorationStyle: "dotted",
                textAlign: "center",
                height: 5,
              }}
            >
              {data.User.UnitCabang ? data.User.UnitCabang.name : ""},{" "}
              {moment(data.DataPembiayaan.tanggal_input).format(
                "DD - MM - YYYY"
              )}
            </Text>
            <Text style={{ textAlign: "center" }}>Calon Anggota</Text>
          </View>
          <View
            style={{
              borderBottom: "1px solid #aaa",
              borderBottomStyle: "dotted",
            }}
          >
            <Text style={{ textAlign: "center" }}>{data.nama}</Text>
          </View>
        </View>
        <View
          style={{
            width: 100,
            display: "flex",
            flexDirection: "column",
            gap: 70,
          }}
        >
          <View>
            <Text
              style={{
                margin: "5px 0",
                textDecoration: "underline",
                textDecorationStyle: "dotted",
                textAlign: "center",
                height: 5,
                alignItems: "center",
              }}
            ></Text>
            <Text style={{ textAlign: "center" }}>Ketua Koperasi</Text>
          </View>
          <View
            style={{
              borderBottom: "1px solid #aaa",
              borderBottomStyle: "dotted",
            }}
          >
            <Text style={{ textAlign: "center" }}>Eva Fajar Nurhasanah</Text>
          </View>
        </View>
      </View>
    </Page>
  );
}
