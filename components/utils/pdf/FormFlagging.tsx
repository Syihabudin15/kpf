"use client";

import { Image, Page, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { stylesFont } from "../CetakFormPengajuan";
import moment from "moment";

export default function FormFlagging({ data }: { data: DataDataPengajuan }) {
  return (
    <Page
      size={"A4"}
      style={{ padding: "20px 40px", fontSize: 8, ...stylesFont.root }}
    >
      <View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 12,
            margin: "3px 0",
            textAlign: "center",
          }}
        >
          SURAT PERNYATAAN DEBITUR
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 11, textAlign: "center" }}>
          MITRA KERJA PT. POS INDONESIA (PERSERO)
        </Text>
      </View>
      <View style={{ margin: 15 }}></View>
      <Text style={{ margin: "3px" }}>Yang bertanda tangan dibawah ini: </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 8 }}>a)</Text>
        <Text style={{ width: 100 }}>Nama PNS/ Pensiunan</Text>
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
        <Text style={{ width: 8 }}>b)</Text>
        <Text style={{ width: 100 }}>Nomor Induk Kependudukan</Text>
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
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 8 }}>c)</Text>
        <Text style={{ width: 100 }}>TUK/NRP/NIP/NPP/NOTAS</Text>
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
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 8 }}>d)</Text>
        <Text style={{ width: 100 }}>Tempat & Tanggal Lahir </Text>
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
            {moment(data.DataPembiayaan.tanggal_lahir, "DD-MM-YYYY").format(
              "DD - MM - YYYY"
            )}
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
        <Text style={{ width: 8 }}>e)</Text>
        <Text style={{ width: 100 }}>Alamat Lengkap</Text>
        <Text>:</Text>
        <View
          style={{
            flex: 1,
            borderBottom: "1px solid #aaa",
            borderBottomStyle: "dotted",
          }}
        >
          <Text>
            {data.DataPengajuanAlamat.alamat} RT {data.DataPengajuanAlamat.rt}{" "}
            RW {data.DataPengajuanAlamat.rw}
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
        <Text style={{ width: 8 }}></Text>
        <Text style={{ width: 100 }}>Kelurahan</Text>
        <Text>:</Text>
        <View
          style={{
            flex: 1,
            borderBottom: "1px solid #aaa",
            borderBottomStyle: "dotted",
          }}
        >
          <Text>{data.DataPengajuanAlamat.kelurahan}</Text>
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
        <Text style={{ width: 8 }}></Text>
        <Text style={{ width: 100 }}>Kecamatan</Text>
        <Text>:</Text>
        <View
          style={{
            flex: 1,
            borderBottom: "1px solid #aaa",
            borderBottomStyle: "dotted",
          }}
        >
          <Text>{data.DataPengajuanAlamat.kecamatan}</Text>
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
        <Text style={{ width: 8 }}></Text>
        <Text style={{ width: 100 }}>Kabupaten/Kodya</Text>
        <Text>:</Text>
        <View
          style={{
            flex: 1,
            borderBottom: "1px solid #aaa",
            borderBottomStyle: "dotted",
            display: "flex",
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text style={{ flex: 1 }}>{data.DataPengajuanAlamat.kota}</Text>
          <View
            style={{ flex: 1.2, display: "flex", flexDirection: "row", gap: 5 }}
          >
            <Text style={{ width: 80 }}>Kode Pos</Text>
            <Text>:</Text>
            <Text>{data.DataPengajuanAlamat.kode_pos}</Text>
          </View>
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
        <Text style={{ width: 8 }}></Text>
        <Text style={{ width: 100 }}>Provinsi</Text>
        <Text>:</Text>
        <View
          style={{
            flex: 1,
            borderBottom: "1px solid #aaa",
            borderBottomStyle: "dotted",
            display: "flex",
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text style={{ flex: 1 }}>{data.DataPengajuanAlamat.provinsi}</Text>
          <View
            style={{ flex: 1.2, display: "flex", flexDirection: "row", gap: 5 }}
          >
            <Text style={{ width: 80 }}>No. Handphone</Text>
            <Text>:</Text>
            <Text>{data.no_telepon}</Text>
          </View>
        </View>
      </View>
      <View style={{ margin: "10px 0" }}></View>
      <Text style={{ margin: 3, lineHeight: 1.5, textAlign: "justify" }}>
        Sehubungan dengan saya mengambil fasilitas kredit Pensiun pada Mitra
        Kerja PT POS INDONESIA (PERSERO) Kantor Cabang{" "}
        {data.User.UnitCabang && data.User.UnitCabang.name}. dengan perjanjian
        kredit nomor ………………….maka dengan ini saya menyatakan:
      </Text>
      <View
        style={{
          margin: "3px 0",
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text style={{ width: 5 }}>1.</Text>
        <Text style={{ flex: 1, textAlign: "justify", lineHeight: 1.5 }}>
          Pada saat menerima pembayaran Manfaat Tabungan Hari Tua (THT) dan/atau
          Pensiun saya setiap bulan dari PT {data.jenis_pensiun} (PERSERO), agar
          dibayarkan melalui rekening saya Nomor:{" "}
          <Text
            style={{
              borderBottom: "1px solid #aaa",
              borderBottomStyle: "dotted",
              padding: "0px 2px 0px 2px",
            }}
          >
            {data.DataPembiayaan.no_rekening}
          </Text>{" "}
          atas Nama{" "}
          <Text
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            {data.nama}
          </Text>
          . pada PT POS INDONESIA (PERSERO), Kantor Cabang{" "}
          <Text
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            ................
          </Text>{" "}
          sampai dengan kredit saya lunas.
        </Text>
      </View>
      <View
        style={{
          margin: "3px 0",
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text style={{ width: 5 }}>2.</Text>
        <Text style={{ flex: 1, textAlign: "justify", lineHeight: 1.5 }}>
          Memberi kuasa kepada PT POS INDONESIA (PERSERO), Kantor Cabang{" "}
          <Text
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            ...................
          </Text>{" "}
          untuk melakukan Pengecekan Data kepesertaan Saya dan sekaligus untuk
          mendaftarkan flagging Data Saya pada PT {data.jenis_pensiun} (PERSERO)
          selama jangka waktu kredit yang telah disetujui yaitu Tanggal{" "}
          <Text
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            {moment(data.DataPembiayaan.tanggal_input)
              .get("date")
              .toString()
              .padStart(2, "0")}
          </Text>{" "}
          Bulan{" "}
          <Text
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            {moment(data.DataPembiayaan.tanggal_input)
              .get("month")
              .toString()
              .padStart(2, "0")}
          </Text>{" "}
          Tahun{" "}
          <Text
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            {moment(data.DataPembiayaan.tanggal_input)
              .get("year")
              .toString()
              .padStart(4, "0")}
          </Text>{" "}
          sampai dengan Tanggal{" "}
          <Text
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            {moment(data.DataPembiayaan.tanggal_input)
              .add(data.DataPembiayaan.tenor, "month")
              .get("date")
              .toString()
              .padStart(2, "0")}
          </Text>{" "}
          Bulan{" "}
          <Text
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            {moment(data.DataPembiayaan.tanggal_input)
              .add(data.DataPembiayaan.tenor, "month")
              .get("month")
              .toString()
              .padStart(2, "0")}
          </Text>{" "}
          Tahun{" "}
          <Text
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            {moment(data.DataPembiayaan.tanggal_input)
              .add(data.DataPembiayaan.tenor, "month")
              .get("year")
              .toString()
              .padStart(4, "0")}
          </Text>
          .
        </Text>
      </View>
      <Text style={{ margin: "5px 0" }}>
        Demikian surat pernyataan dan kuasa ini saya buat, untuk dipergunakan
        sebagaimana mestinya.{" "}
      </Text>
      <View style={{ marginTop: 20 }}></View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <View
          style={{ flex: 2, display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Text>Catatan:</Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 10 }}>1.</Text>
            <Text style={{ flex: 1 }}>
              Lembar 1 untuk PT {data.jenis_pensiun} (PERSERO){" "}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 10 }}>2.</Text>
            <Text style={{ flex: 1 }}>
              Lembar 2 untuk PT POS INDONESIA (PERSERO)
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 10 }}>3.</Text>
            <Text style={{ flex: 1 }}>Lembar 3 untuk debitur</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 10 }}>4.</Text>
            <Text style={{ flex: 1 }}>Lembar 4 untuk arsip</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dotted",
              margin: "8px 0",
              textAlign: "right",
            }}
          >
            {data.User.UnitCabang
              ? data.User.UnitCabang.name === "PUSAT"
                ? "BANDUNG"
                : data.User.UnitCabang.name
              : ""}
            ,{" "}
            {moment(data.DataPembiayaan.tanggal_input).format("DD - MM - YYYY")}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 30,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ textAlign: "center" }}>Yang menyatakan,</Text>
            <Text style={{ textAlign: "center", fontSize: 6 }}>
              Materai 10.000
            </Text>
            <Text style={{ textAlign: "center" }}>{data.nama}</Text>
          </View>
        </View>
      </View>
    </Page>
  );
}
