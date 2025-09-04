"use client";

import { Image, Page, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { stylesFont } from "../CetakFormPengajuan";
import moment from "moment";

export default function FormPemotongan({ data }: { data: DataDataPengajuan }) {
  return (
    <Page
      size={"A4"}
      style={{ padding: "20px 40px", fontSize: 8, ...stylesFont.root }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 50,
          alignItems: "center",
          borderBottom: "2px solid #222",
        }}
      >
        <Image src={"/assets/images/app_logo.png"} style={{ width: 80 }} />
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 12, margin: "3px 0" }}>
            {process.env.NEXT_PUBLIC_APP_FULL_NAME}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 11 }}>
            UNIT LAYANAN :{" "}
            {data.User.UnitCabang ? data.User.UnitCabang.name : ""}
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          margin: "15px 0",
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 11, fontWeight: "bold" }}>
          SURAT KETERANGAN
        </Text>
        <Text style={{ textAlign: "center", fontSize: 11, fontWeight: "bold" }}>
          PERIHAL PEMOTONGAN GAJI DIATAS 70%
        </Text>
      </View>
      <Text style={{ margin: "10px 0", lineHeight: 1.5 }}>
        Saya yang bertanda tangan dibawah ini, menerangkan bahwa:
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
        <Text style={{ width: 100 }}>Nama</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
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
        <Text style={{ width: 100 }}>No. KTP</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>{data.nik}</Text>
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
        <Text style={{ width: 100 }}>Alamat</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
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
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 100 }}>Nomor Pensiun</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>{data.nopen}</Text>
        </View>
      </View>
      <Text style={{ margin: "10px 0" }}>
        Sehubungan saya memerlukan dana yang cukup besar, dengan ini saya
        menyatakan :
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 10 }}>1.</Text>
        <View style={{ flex: 1 }}>
          <Text>
            Bersedia membayar angsuran pembiayaan Koperasi diatas 70% gaji
            pensiun yang saya terima setiap bulan, karena :
          </Text>
          <View
            style={{
              margin: "3px 0",
              display: "flex",
              flexDirection: "row",
              gap: 5,
              marginLeft: 5,
            }}
          >
            <Text style={{ width: 5 }}>a.</Text>
            <Text style={{ flex: 1 }}>
              Saya memiliki penghasilan tetap dari usaha diluar gaji pensiun.*)
            </Text>
          </View>
          <View
            style={{
              margin: "3px 0",
              display: "flex",
              flexDirection: "row",
              gap: 5,
              marginLeft: 5,
            }}
          >
            <Text style={{ width: 5 }}>b.</Text>
            <Text style={{ flex: 1 }}>
              Saya mendapat tunjangan dari keluarga (anak-anak) setiap bulan
              yang jumlahnya dapat menutupi kekurangan jika sisa gaji pensiun
              tidak mencukupi untuk kebutuhan seharihari.*)
            </Text>
          </View>
          <View>
            <Text>*) Coret salah satu poin a atau b</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 10 }}>2.</Text>
        <View style={{ flex: 1 }}>
          <Text>
            Saya bertanggungjawab atas pengambilan sisa gaji saya setiap
            bulannya di Bank/Kantor Pos tempat gaji saya dibayarkan.
          </Text>
        </View>
      </View>
      <Text style={{ margin: 8 }}>
        Demikian surat pernyataan ini dibuat dengan sebenarnya dengan dilandasi
        itikad baik tanpa paksaan dari siapapun dan pihak manapun.
      </Text>
      <Text
        style={{
          marginTop: 8,
          textDecoration: "underline",
          textDecorationStyle: "dotted",
        }}
      >
        {data.User.UnitCabang
          ? data.User.UnitCabang.name === "PUSAT"
            ? "BANDUNG"
            : data.User.UnitCabang.name
          : ""}
        , {moment(data.DataPembiayaan.tanggal_input).format("DD - MM - YYYY")}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 30,
            alignItems: "center",
          }}
        >
          <Text>Yang membuat pernyataan,</Text>
          <Text style={{ textAlign: "center" }}>Materai 10.000</Text>
          <View style={{ width: 120 }}>
            <Text style={{ borderBottom: "1px solid black" }}>{data.nama}</Text>
            <Text>Debitur</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 30,
            alignItems: "center",
          }}
        >
          <Text>Mengetahui,</Text>
          <Text></Text>
          <View style={{ width: 120 }}>
            <Text style={{ borderBottom: "1px solid black" }}>
              {data.User.first_name} {data.User.last_name}
            </Text>
            <Text>SPV Kantor Layanan</Text>
          </View>
        </View>
      </View>
    </Page>
  );
}
