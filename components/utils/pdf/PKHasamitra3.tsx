"use client";

import { Image, Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { DataDataPengajuan } from "../Interfaces";
import moment from "moment";
import { IDRFormat } from "@/components/v1/appUtils";
import { getAngsuran } from "@/components/Utils";
const angkaTerbilang = require("angka-menjadi-terbilang");
moment.locale("id");

export default function PKHasamitra3({ data }: { data: DataDataPengajuan }) {
  const angs = getAngsuran(
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
      <View
        style={{ textAlign: "center", fontWeight: "bold", marginBottom: 20 }}
      >
        <Text style={{ fontSize: 12 }}>PERJANJIAN KREDIT</Text>
        <Text>No. {data.nomor_akad}</Text>
      </View>

      <Text>
        Perjanjian Kredit ini (selanjutnya disebut {'"Perjanjian"'}) dibuat di
        pada hari ini {moment(data.tanggal_cetak_akad).format("DDDD")},tanggal{" "}
        {moment(data.tanggal_cetak_akad).format("DD MMMM YYYY")} oleh dan antara
        :
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          marginTop: 5,
          marginBottom: 5,
        }}
      >
        <Text style={{ width: 8 }}>I.</Text>
        <Text>
          {data.nama} pemegang Kartu Tanda Penduduk (KTP) No {data.nik},
          bertempat di {data.DataPengajuanAlamat.alamat} RT{" "}
          {data.DataPengajuanAlamat.rt} RW {data.DataPengajuanAlamat.rw}{" "}
          KELURAHAN {data.DataPengajuanAlamat.kelurahan} KECAMATAN{" "}
          {data.DataPengajuanAlamat.kecamatan} {data.DataPengajuanAlamat.kota}{" "}
          {data.DataPengajuanAlamat.provinsi}{" "}
          {data.DataPengajuanAlamat.kode_pos}, bertindak untuk dan atas nama
          diri sendiri. (Selanjutnya disebut {'"Debitur"'}).
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          marginTop: 5,
          marginBottom: 5,
        }}
      >
        <Text style={{ width: 8 }}>II.</Text>
        <Text>
          Nandang Hermawan dalam jabatannya selaku DIREKTUR KOPERASI JASA
          FADILLAH AQILA SEJAHTRA, berdasarkan Perjanjian Kerjasama No.
          027/FAS/PKS/II/2026 dan No. …………………………………………. tanggal ………… Februari
          2026 antara KOPERASI JASA FADILLAH AQILA SEJAHTRA dan PT. BPR SURYA
          ARTHAGUNA ABADI dan Surat Kuasa Nomor 15/BPR-HMJB/Dir/0226 tanggal 12
          Februari 2026, berwenang bertindak untuk dan atas nama PT. BPR SURYA
          ARTHAGUNA ABADI, berkedudukan di Surabaya. (Selanjutnya disebut{" "}
          {["Kreditur"]}).
        </Text>
      </View>
      <Text>
        Debitur dan Kreditur selanjutnya secara bersama-sama disebut{" "}
        {'"PARA PIHAK"'}. Para Pihak telah sepakat untuk membuat perjanjian ini
        dengan syarat dan ketentuan sebagai berikut :
      </Text>

      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 1</Text>
        <Text
          style={{ marginBottom: 10, fontWeight: "bold", textAlign: "center" }}
        >
          FASILITAS KREDIT
        </Text>

        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>1.</Text>
          <View style={{ flex: 1 }}>
            <Text>
              Atas permintaan Debitur, Kreditur setuju memberikan fasilitas
              kepada Debitur dengan ketentuan :
            </Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>a.</Text>
              <Text style={{ width: 100 }}>Jumlah hutang pokok</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                Rp. {IDRFormat(data.DataPembiayaan.plafond)}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>b.</Text>
              <Text style={{ width: 100 }}>Bunga</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                {data.DataPembiayaan.mg_bunga.toFixed(2)}% /tahun
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>c.</Text>
              <Text style={{ width: 100 }}>Biaya Administrasi</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                Rp. {IDRFormat(admin)}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>d.</Text>
              <Text style={{ width: 100 }}>Biaya Tatalaksana</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                Rp. {IDRFormat(data.DataPembiayaan.by_tatalaksana)}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>d.</Text>
              <Text style={{ width: 100 }}>Biaya Buka Rekening</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                Rp. {IDRFormat(data.DataPembiayaan.by_buka_rekening)}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>e.</Text>
              <Text style={{ width: 100 }}>Biaya Asuransi</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                Rp. {IDRFormat(asuransi)}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>f.</Text>
              <Text style={{ width: 100 }}>Biaya Mutasi</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                Rp. {IDRFormat(data.DataPembiayaan.by_mutasi)}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>g.</Text>
              <Text style={{ width: 100 }}>Biaya Materai</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                Rp. {IDRFormat(data.DataPembiayaan.by_materai)}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>h.</Text>
              <Text style={{ width: 100 }}>Biaya Data Informasi</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                Rp.{" "}
                {IDRFormat(
                  data.DataPembiayaan.by_epotpen +
                    data.DataPembiayaan.by_flagging,
                )}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>i.</Text>
              <Text style={{ width: 100 }}>Jenis Fasilitas</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                Kredit Mulitguna
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>j.</Text>
              <Text style={{ width: 100 }}>Bentuk Fasilitas</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                Installment
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>k.</Text>
              <Text style={{ width: 100 }}>Angsuran Perbulan</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                Rp. {IDRFormat(angs)}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>l.</Text>
              <Text style={{ width: 100 }}>Angsuran Dibayar Dimuka</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                {data.DataPembiayaan.blokir}X = Rp.{" "}
                {IDRFormat(angs * data.DataPembiayaan.blokir)}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>m.</Text>
              <Text style={{ width: 100 }}>Total Penerimaan</Text>
              <Text style={{ width: 4 }}>:</Text>
              <Text style={{ width: 100, textAlign: "right" }}>
                Rp.{" "}
                {IDRFormat(
                  data.DataPembiayaan.plafond -
                    (admin +
                      asuransi +
                      data.DataPembiayaan.by_tatalaksana +
                      data.DataPembiayaan.by_buka_rekening +
                      data.DataPembiayaan.by_mutasi +
                      data.DataPembiayaan.by_materai +
                      data.DataPembiayaan.by_epotpen +
                      data.DataPembiayaan.by_flagging),
                )}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>2.</Text>
          <Text style={{ flex: 1 }}>
            Dalam hal terjadi perubahan suku bunga yang menambah biaya Debitur
            sebagaimana dimaksud pada pasal 1.1 huruf b diatas, maka perubahan
            tersebut akan disampaikan secara tertulis oleh Kreditur kepada
            Debitur.
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 2</Text>
        <Text
          style={{ marginBottom: 10, fontWeight: "bold", textAlign: "center" }}
        >
          Jangka Waktu dan Jadwal Angsuran
        </Text>

        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>1.</Text>
          <Text style={{ flex: 1 }}>
            Jangka waktu fasilitas kredit {data.DataPembiayaan.tenor} bulan
            terhitung sejak tanggal
            {moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")} dan akan
            berakhir pada tanggal{" "}
            {moment(data.tanggal_cetak_akad)
              .add(data.DataPembiayaan.tenor, "month")
              .format("DD-MM-YYYY")}
            .
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>2.</Text>
          <Text style={{ flex: 1 }}>
            Angsuran bulanan sebesar Rp {IDRFormat(angs)};- (
            {angkaTerbilang(angs)}
            rupiah)/ bulan sesuai jadwal angsuran yang telah disepakati para
            pihak
          </Text>
        </View>
      </View>
    </Page>
  );
}
