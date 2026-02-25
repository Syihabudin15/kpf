"use client";

import { Image, Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { DataDataPengajuan } from "../Interfaces";
import moment from "moment";
import { IDRFormat } from "@/components/v1/appUtils";
import { getAngsuran } from "@/components/Utils";
moment.locale("id");

export default function PKHasamitra({ data }: { data: DataDataPengajuan }) {
  const angsBulan = getAngsuran(
    data.DataPembiayaan.plafond,
    data.DataPembiayaan.tenor,
    data.DataPembiayaan.mg_bunga,
    data.DataPembiayaan.pembulatan,
    data.jenis_margin,
  ).angsuran;
  const admin =
    data.DataPembiayaan.plafond *
    ((data.DataPembiayaan.by_admin + data.DataPembiayaan.by_admin_bank) / 100);
  const asuransi =
    data.DataPembiayaan.plafond * (data.DataPembiayaan.by_asuransi / 100);
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
      <View>
        <Image
          src={data.Bank.logo || ""}
          style={{ width: 120, marginBottom: 10 }}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text>Nomor : {data.nomor_akad}</Text>
        <Text style={{ textAlign: "right" }}>
          {data.DataPengajuanAlamat.kota
            ?.toLocaleLowerCase()
            .replace("kota", "")
            .replace("kabupaten", "")
            .toUpperCase()}
          , {moment(data.tanggal_cetak_akad).format("DD MMMM YYYY")}
        </Text>
      </View>
      <View style={{ margin: "8px 0px" }}>
        <Text>Kepada Yth.</Text>
        <Text>Sdr. {data.nama}</Text>
      </View>

      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
        Perihal : Surat Persetujuan Pemberian Kredit{" "}
      </Text>

      <Text style={{ marginBottom: 5 }}>
        Menunjuk surat permohonan kredit saudara kepada PT. BPR Hasa Mitra Jawa
        Barat, pada prinsipnya kredit saudara dapat kami setujui dengan
        ketentuan berikut :{" "}
      </Text>
      <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Text style={{ width: 8 }}>1.</Text>
        <Text style={{ width: 100 }}>Nominal Kredit</Text>
        <Text style={{ width: 5 }}>:</Text>
        <Text style={{ flex: 1 }}>
          Rp. {IDRFormat(data.DataPembiayaan.plafond)}
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Text style={{ width: 8 }}>2.</Text>
        <Text style={{ width: 100 }}>Jangka Waktu Kredit</Text>
        <Text style={{ width: 5 }}>:</Text>
        <Text style={{ flex: 1 }}>{data.DataPembiayaan.tenor} Bulan</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Text style={{ width: 8 }}>3.</Text>
        <Text style={{ width: 100 }}>Suku Bunga</Text>
        <Text style={{ width: 5 }}>:</Text>
        <Text style={{ flex: 1 }}>
          {data.DataPembiayaan.mg_bunga.toFixed(2)}% p.a
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Text style={{ width: 8 }}>4.</Text>
        <Text style={{ width: 100 }}>Angsuran Kredit</Text>
        <Text style={{ width: 5 }}>:</Text>
        <Text style={{ flex: 1 }}>Rp. {IDRFormat(angsBulan)}</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Text style={{ width: 8 }}>5.</Text>
        <Text style={{ width: 100 }}>Sistem Pembayaran</Text>
        <Text style={{ width: 5 }}>:</Text>
        <Text style={{ flex: 1 }}>LAINNYA</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Text style={{ width: 8 }}>6.</Text>
        <Text style={{ width: 100 }}>Jaminan Utama</Text>
        <Text style={{ width: 5 }}>:</Text>
        <Text style={{ flex: 1 }}>SKEP Pensiun</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Text style={{ width: 8 }}>7.</Text>
        <Text style={{ width: 100 }}>Jaminan Tambahan</Text>
        <Text style={{ width: 5 }}>:</Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <View
        style={{
          marginLeft: 20,
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <View style={{ flex: 1, border: "1px solid black" }}>
          <Text style={{ fontWeight: "bold", padding: 3 }}>
            DOKUMEN / NOMOR
          </Text>
          <Text style={{ borderTop: "1px solid black", padding: 3 }}>
            SKEP PENSIUN NOMOR {data.DataTaspen.no_skep}
          </Text>
        </View>
        <View style={{ width: 100, border: "1px solid black" }}>
          <Text style={{ fontWeight: "bold", padding: 3 }}>KEADAAN</Text>
          <Text style={{ borderTop: "1px solid black", padding: 3 }}>Asli</Text>
        </View>
      </View>
      <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 10 }}>
        <Text>
          Kredit saudara dapat dicairkan bilamana telah membayar biaya-biaya
          sebagai berikut :
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>1.</Text>
          <Text style={{ width: 100 }}>Biaya Provisi Kredit</Text>
          <Text style={{ width: 5 }}>:</Text>
          <Text style={{ width: 120, textAlign: "right" }}>
            Rp. {IDRFormat(data.DataPembiayaan.by_provisi)}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>2.</Text>
          <Text style={{ width: 100 }}>Biaya Administrasi Kredit</Text>
          <Text style={{ width: 5 }}>:</Text>
          <Text style={{ width: 120, textAlign: "right" }}>
            Rp. {IDRFormat(admin)}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>3.</Text>
          <Text style={{ width: 100 }}>Premi Asuransi</Text>
          <Text style={{ width: 5 }}>:</Text>
          <Text style={{ width: 120, textAlign: "right" }}>
            Rp. {IDRFormat(asuransi)}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>4.</Text>
          <Text style={{ width: 100 }}>Biaya Tatalaksana</Text>
          <Text style={{ width: 5 }}>:</Text>
          <Text style={{ width: 120, textAlign: "right" }}>
            Rp. {IDRFormat(data.DataPembiayaan.by_tatalaksana)}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>5.</Text>
          <Text style={{ width: 100 }}>Biaya Buka Rekening</Text>
          <Text style={{ width: 5 }}>:</Text>
          <Text style={{ width: 120, textAlign: "right" }}>
            Rp. {IDRFormat(data.DataPembiayaan.by_buka_rekening)}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>6.</Text>
          <Text style={{ width: 100 }}>Biaya Materai</Text>
          <Text style={{ width: 5 }}>:</Text>
          <Text style={{ width: 120, textAlign: "right" }}>
            Rp. {IDRFormat(data.DataPembiayaan.by_materai)}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>7.</Text>
          <Text style={{ width: 100 }}>Biaya Data Informasi</Text>
          <Text style={{ width: 5 }}>:</Text>
          <Text style={{ width: 120, textAlign: "right" }}>
            Rp.{" "}
            {IDRFormat(
              data.DataPembiayaan.by_epotpen + data.DataPembiayaan.by_flagging,
            )}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>8.</Text>
          <Text style={{ width: 100 }}>Biaya Mutasi</Text>
          <Text style={{ width: 5 }}>:</Text>
          <Text style={{ width: 120, textAlign: "right" }}>
            Rp. {IDRFormat(data.DataPembiayaan.by_mutasi)}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>9.</Text>
          <Text style={{ width: 100 }}>Biaya Notaris</Text>
          <Text style={{ width: 5 }}>:</Text>
          <Text style={{ width: 120, textAlign: "right" }}>Rp. 0</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>10.</Text>
          <Text style={{ width: 100 }}>Biaya Agency</Text>
          <Text style={{ width: 5 }}>:</Text>
          <Text
            style={{
              width: 120,
              textAlign: "right",
              borderBottom: "1px solid black",
            }}
          >
            Rp. 0
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            fontWeight: "bold",
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 100 }}>Total</Text>
          <Text style={{ width: 5 }}>:</Text>
          <Text style={{ width: 120, textAlign: "right" }}>
            Rp.{" "}
            {IDRFormat(
              data.DataPembiayaan.by_provisi +
                admin +
                asuransi +
                data.DataPembiayaan.by_tatalaksana +
                data.DataPembiayaan.by_buka_rekening +
                data.DataPembiayaan.by_materai +
                data.DataPembiayaan.by_epotpen +
                data.DataPembiayaan.by_flagging +
                data.DataPembiayaan.by_mutasi,
            )}
          </Text>
        </View>
      </View>
      <Text style={{ marginTop: 10, marginBottom: 20 }}>
        Demikian dari kami, bilamana saudara menyetujui syarat tersebut di atas
        harap menandatangani Surat Persetujuan Pemberian Kredit ini. Sekian dan
        Terimakasih.{" "}
      </Text>

      <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <View style={{ flex: 1 }}>
          <Text>Hormat Kami,</Text>
          <Text>PT. BPR Hasa Mitra Jawa Barat</Text>
          <View style={{ height: 80 }}></View>
          <Text style={{ textDecoration: "underline", fontWeight: "bold" }}>
            KETUT SUGIATA
          </Text>
          <Text>Direktur Utama</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text> </Text>
          <Text>Setuju dengan syarat tersebut </Text>
          <View style={{ height: 80 }}></View>
          <Text style={{ textDecoration: "underline", fontWeight: "bold" }}>
            {data.nama}
          </Text>
          <Text>Debitur</Text>
        </View>
      </View>
    </Page>
  );
}
