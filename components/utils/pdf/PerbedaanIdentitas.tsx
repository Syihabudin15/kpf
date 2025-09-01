"use client";

import { Image, Page, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { formatStatus, stylesFont } from "../CetakFormPengajuan";
import moment from "moment";
import { TablePdf, TablePdfBodies, TablePdfHeaders } from "./TablePdf";

export default function FormPerbedaanIdentitas({
  data,
}: {
  data: DataDataPengajuan;
}) {
  const bodies: TablePdfBodies[] = [
    {
      dokumen: "KTP",
      nama: data.nama,
      ttl: `${data.DataPembiayaan.tempat_lahir + ","} ${moment(
        data.DataPembiayaan.tanggal_lahir
      ).format("DD - MM - YYYY")}`,
      statusKawin: formatStatus(data.status_kawin || ""),
      namaPasangan: "-",
      nik: data.nik,
      style: { textAlign: "left" },
    },
    {
      dokumen: "Kartu Keluarga",
      nama: "",
      ttl: "",
      statusKawin: "",
      namaPasangan: "",
      nik: "",
      style: { textAlign: "left" },
    },
    {
      dokumen: "SK Pensiun",
      nama: "",
      ttl: "",
      statusKawin: "",
      namaPasangan: "",
      nik: "",
      style: { textAlign: "left" },
    },
    {
      dokumen: "KARIP/Asabri",
      nama: "",
      ttl: "",
      statusKawin: "",
      namaPasangan: "",
      nik: "",
      style: { textAlign: "left" },
    },
    {
      dokumen: "Struk Gaji",
      nama: "",
      ttl: "",
      statusKawin: "",
      namaPasangan: "-",
      nik: "-",
      style: { textAlign: "left" },
    },
    {
      dokumen: "Buku Tabungan / Kwitansi Angsuran",
      nama: "",
      ttl: "",
      statusKawin: "-",
      namaPasangan: "-",
      nik: "-",
      style: { textAlign: "left" },
    },
  ];
  return (
    <Page size={"A4"} style={{ padding: "20px 40px", fontSize: 8 }}>
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
          <Text style={{ ...stylesFont.bold, fontSize: 12, margin: "3px 0" }}>
            {process.env.NEXT_PUBLIC_APP_FULL_NAME}
          </Text>
          <Text style={{ ...stylesFont.bold, fontSize: 11 }}>
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
          margin: "10px 0",
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 11 }}>
          SURAT KETERANGAN
        </Text>
        <Text style={{ textAlign: "center", fontSize: 11 }}>
          PERIHAL PERBEDAAN IDENTITAS
        </Text>
      </View>
      <Text style={{ margin: "10px 0", lineHeight: 1.5 }}>
        Saya yang bertanda tangan dibawah ini, menerangkan bahwa benar terdapat
        perbedaan data identitas saya pada dokumen sebagai berikut :
      </Text>
      <View>
        <TablePdf dataHeader={header} dataBodies={bodies} />
      </View>
      <Text style={{ margin: "10px 0", lineHeight: 1.5 }}>
        Dengan ini saya menerangkan bahwa atas perbedaan data identitas pada
        dokumen tersebut diatas, saya adalah orang yang sama. Adapun data
        identitas yang saya gunakan untuk permohonan pembiayaan ke{" "}
        {process.env.NEXT_PUBLIC_APP_FULL_NAME} adalah sebagai berikut :
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 120 }}>Nama KTP</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>{data.nama}</Text>
        </View>
        <Text style={stylesFont.italic}>
          (* Sesuai dengan yang tertera pada KTP)
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 120 }}>Nama Lengkap</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text></Text>
        </View>
        <Text style={stylesFont.italic}>
          (* isi jika ada SINGKATAN & singkatan Dipanjangkan)
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 120 }}>Tempat & Tanggal Lahir</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>
            {data.DataPembiayaan.tempat_lahir &&
              data.DataPembiayaan.tempat_lahir + ","}{" "}
            {moment(data.DataPembiayaan.tanggal_lahir).format("DD - MM - YYYY")}
          </Text>
        </View>
        <Text style={stylesFont.italic}>(* Mengacu pada KTP)</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 120 }}>Status Pernikahan</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>{formatStatus(data.status_kawin || "")}</Text>
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
        <Text style={{ width: 120 }}>Nama Pasangan</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>{data.DataPengajuanPasangan.nama_pasangan}</Text>
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
        <Text style={{ width: 120 }}>Alamat</Text>
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
        <Text style={stylesFont.italic}>(* Sesuai KTP)</Text>
      </View>
      <Text style={{ margin: "10px 0", lineHeight: 1.5 }}>
        Demikian Surat Keterangan ini saya buat dengan sebenar-benarnya untuk
        digunakan sebagai dokumen pendukung dalam permohonan pembiayaan saya ke{" "}
        {process.env.NEXT_PUBLIC_APP_FULL_NAME}.
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 120 }}>Dibuat Di</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>{data.User.UnitCabang ? data.User.UnitCabang.name : ""}</Text>
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
        <Text style={{ width: 120 }}>Tanggal</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>
            {moment(data.DataPembiayaan.tanggal_input).format("DD - MM - YYYY")}
          </Text>
        </View>
      </View>
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
            gap: 70,
            alignItems: "center",
          }}
        >
          <Text>Yang membuat pernyataan,</Text>
          <View style={{ width: 120 }}>
            <Text style={{ borderBottom: "1px solid black" }}>{data.nama}</Text>
            <Text>Debitur</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 70,
            alignItems: "center",
          }}
        >
          <Text>Mengetahui,</Text>
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

const header: TablePdfHeaders[] = [
  { title: "DOKUMEN", dataIndex: "dokumen", style: { textAlign: "center" } },
  {
    title: "NAMA PEMOHON",
    dataIndex: "nama",
    style: { textAlign: "center" },
  },
  {
    title: "TEMPAT/TANGGAL LAHIR PEMOHON",
    dataIndex: "ttl",
    style: { textAlign: "center" },
  },
  {
    title: "STATUS PERNIKAHAN PEMOHON",
    dataIndex: "statusKawin",
    style: { textAlign: "center" },
  },
  {
    title: "NAMA PASANGAN PEMOHON",
    dataIndex: "namaPasangan",
    style: { textAlign: "center" },
  },
  { title: "NOMOR NIK", dataIndex: "nik", style: { textAlign: "center" } },
];
