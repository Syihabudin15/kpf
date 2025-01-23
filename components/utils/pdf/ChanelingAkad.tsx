"use client";
import { DataDataPengajuan } from "../Interfaces";
import { Image, Page, Text, View } from "@react-pdf/renderer";
import moment from "moment";
import { formatNumber } from "../inputUtils";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";
import { ceiling } from "./pdfUtil";
import { stylePdf } from "./stylePdf";
const angkaTerbilang = require("angka-menjadi-terbilang");
moment.updateLocale("id", {
  months: [
    "January",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],
});

export default function ChanelingAkad({ data }: { data: DataDataPengajuan }) {
  const byAdmin =
    data.DataPembiayaan.plafond *
    ((data.DataPembiayaan.by_admin +
      data.DataPembiayaan.by_admin_bank +
      data.DataPembiayaan.by_lainnya) /
      100);
  const byAsuransi =
    data.DataPembiayaan.plafond * (data.DataPembiayaan.by_asuransi / 100);
  const byLainLain =
    data.DataPembiayaan.by_flagging +
    data.DataPembiayaan.by_epotpen +
    data.DataPembiayaan.by_tatalaksana +
    data.DataPembiayaan.by_mutasi;

  const angsuranBulanan = ceiling(
    parseInt(
      getAngsuranPerBulan(
        data.DataPembiayaan.mg_bunga,
        data.DataPembiayaan.tenor,
        data.DataPembiayaan.plafond
      )
    ),
    data.DataPembiayaan.pembulatan
  ).toString();
  const angsuranPokok = ceiling(
    data.DataPembiayaan.plafond / data.DataPembiayaan.tenor,
    data.DataPembiayaan.pembulatan
  ).toString();
  const angsuranBank = ceiling(
    parseInt(
      getAngsuranPerBulan(
        data.DataPembiayaan.margin_bank || 0,
        data.DataPembiayaan.tenor,
        data.DataPembiayaan.plafond
      )
    ),
    data.DataPembiayaan.pembulatan
  ).toString();

  const colfee = (parseInt(angsuranBulanan) - parseInt(angsuranBank)).toFixed(
    0
  );

  return (
    <>
      <Page
        size={"A4"}
        style={{
          ...stylePdf.root,
          width: "80%",
          margin: "0 auto",
          textAlign: "justify",
          lineHeight: 1.3,
        }}
        wrap
      >
        <View
          fixed
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            padding: "0 10px",
          }}
        >
          <View>
            <Image
              src={data.Bank.logo || "/assets/images/logo_kpf.jpg"}
              style={{ width: 50 }}
            />
          </View>
          <View
            style={{
              fontWeight: "bold",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 10 }}>PERJANJIAN KREDIT</Text>
            <Text style={{ fontSize: 8 }}>
              NO AKAD : {data.nomor_akad ? data.nomor_akad : ""}
            </Text>
          </View>
          <View>
            <Image
              src={process.env.NEXT_PUBLIC_APP_LOGO}
              style={{ width: 50 }}
            />
          </View>
        </View>
        <Text>Yang bertanda tangan di bawah ini :</Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          <Text style={{ padding: "5px 0" }}>I. </Text>
          <View>
            <View>
              <View
                style={{
                  padding: "5px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                    fontWeight: "bold",
                  }}
                >
                  <Text style={{ width: 100 }}>Nama</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text>
                    {process.env.NEXT_PUBLIC_APP_DIREKTUR ||
                      "Lodewijk HF Lantang"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  <Text style={{ width: 100 }}>Jabatan</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text>{process.env.NEXT_PUBLIC_APP_JABATAN}</Text>
                </View>
                <View
                  style={{
                    textAlign: "justify",
                    lineHeight: 1.2,
                    width: 490,
                  }}
                >
                  <Text>
                    Bertindak dalam hal ini berdasarkan Perjanjian Kerjasama
                    tentang pemberian kredit kepada pensiunan dalam bentuk
                    penerusan (Channeling) {data.Bank.sk_akad}, yang selanjutnya
                    disebut{" "}
                    <View style={{ fontWeight: "bold" }}>
                      <Text style={{ fontWeight: "bold" }}>{'"BANK"'}</Text>
                    </View>
                    .
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,
                    marginTop: 8,
                    lineHeight: 1.2,
                  }}
                >
                  <Text> </Text>
                  <View>
                    <Text>I.</Text>
                  </View>
                  <View>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Text style={{ width: 100 }}>Nama</Text>
                      <Text style={{ width: 20 }}>:</Text>
                      <Text>{data.DataPembiayaan.name}</Text>
                    </View>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Text style={{ width: 100 }}>NIK</Text>
                      <Text style={{ width: 20 }}>:</Text>
                      <Text>{data.nik}</Text>
                    </View>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Text style={{ width: 100 }}>Tempat/Tanggal Lahir</Text>
                      <Text style={{ width: 20 }}>:</Text>
                      <Text>
                        {data.DataPembiayaan.tempat_lahir}
                        {", "}
                        {data.DataPembiayaan.tanggal_lahir}
                      </Text>
                    </View>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Text style={{ width: 100 }}>Alamat</Text>
                      <Text style={{ width: 20 }}>:</Text>
                      <Text style={{ width: 300 }}>
                        {data.DataPengajuanAlamat.alamat}{" "}
                        {data.DataPengajuanAlamat.rt}/
                        {data.DataPengajuanAlamat.rw},{" "}
                        {data.DataPengajuanAlamat.kelurahan}{" "}
                        {data.DataPengajuanAlamat.kecamatan},{" "}
                        {data.DataPengajuanAlamat.kota}{" "}
                        {data.DataPengajuanAlamat.provinsi}{" "}
                        {data.DataPengajuanAlamat.kode_pos}
                      </Text>
                    </View>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Text style={{ width: 100 }}>Pekerjaan</Text>
                      <Text style={{ width: 20 }}>:</Text>
                      <Text>{data.pekerjaan_sekarang}</Text>
                    </View>

                    {/* Data Istri */}
                    <Text style={{ marginTop: 5 }}>
                      Dan untuk tindakan hukum ini telah mendapat persetujuan
                      suami/isterinya :
                    </Text>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Text style={{ width: 100 }}>Nama</Text>
                      <Text style={{ width: 20 }}>:</Text>
                      <Text>{data.DataPengajuanPasangan.nama_pasangan}</Text>
                    </View>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Text style={{ width: 100 }}>NIK</Text>
                      <Text style={{ width: 20 }}>:</Text>
                      <Text>{data.DataPengajuanPasangan.nik_pasangan}</Text>
                    </View>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Text style={{ width: 100 }}>Tempat/Tanggal Lahir</Text>
                      <Text style={{ width: 20 }}>:</Text>
                      <Text>
                        {data.DataPengajuanPasangan.tempat_lahir_pasangan}{" "}
                        {data.DataPengajuanPasangan.tanggal_lahir_pasangan}
                      </Text>
                    </View>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Text style={{ width: 100 }}>Alamat</Text>
                      <Text style={{ width: 20 }}>:</Text>
                      <Text style={{ width: 300 }}>
                        {data.DataPengajuanPasangan.alamat_pasangan}
                      </Text>
                    </View>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Text style={{ width: 100 }}>Pekerjaan</Text>
                      <Text style={{ width: 20 }}>:</Text>
                      <Text>
                        {data.DataPengajuanPasangan.pekerjaan_pasangan}
                      </Text>
                    </View>
                    <View style={{ margin: "8px 0" }}>
                      <Text>
                        Selanjutnya disebut{" "}
                        <View style={{ fontWeight: "bold" }}>
                          <Text style={{ fontWeight: "bold" }}>
                            {'"DEBITUR"'}
                          </Text>
                        </View>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ width: 490, lineHeight: 1.2 }}>
              <Text>
                Selanjutnya BANK dan DEBITUR terlebih dahulu menerangkan dengan
                ini telah sepakat untuk mengadakan Perjanjian Kredit
                (selanjutnya disebut “Perjanjian”) dengan syarat-syarat dan
                ketentuan-ketentuan sebagai berikut:
              </Text>
              <View
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 10,
                  marginBottom: 3,
                  padding: "3px 0",
                }}
              >
                <Text>Pasal 1</Text>
                <Text>FASILITAS KREDIT</Text>
              </View>
              <View>
                <Text>
                  BANK dengan ini menyetujui memberikan suatu kredit kepada
                  DEBITUR dan DEBITUR menyetujui untuk menerima fasilitas kredit
                  yang disebut Kredit Channeling dengan Plafond Kredit sebesar{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    Rp. {formatNumber(data.DataPembiayaan.plafond.toFixed(0))} (
                    {angkaTerbilang(data.DataPembiayaan.plafond)
                      .split(" ")
                      .map(function (word: string) {
                        return word
                          .charAt(0)
                          .toUpperCase()
                          .concat(word.substr(1));
                      })
                      .join(" ")}{" "}
                    Rupiah).
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 10,
                  marginBottom: 3,
                  padding: "3px 0",
                }}
              >
                <Text>Pasal 2</Text>
                <Text>TUJUAN PENGGUNAAN & JANGKA WAKTU</Text>
              </View>
              {/* <View>
                <Text>
                  Bahwa perjanjian ini berlaku unutk masa{" "}
                  {data.DataPembiayaan.tenor} (
                  {angkaTerbilang(data.DataPembiayaan.tenor)
                    .split(" ")
                    .map(function (word: string) {
                      return word
                        .charAt(0)
                        .toUpperCase()
                        .concat(word.substr(1));
                    })
                    .join(" ")}
                  ) bulan, terhitung sejak ditandatanganinya perjanjian ini
                  tanggal {moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")}{" "}
                  dan akan berkhir pada tanggal{" "}
                  {"25-" +
                    moment(data.tanggal_cetak_akad)
                      .add(data.DataPembiayaan.tenor, "M")
                      .format("MM-YYYY")}
                </Text>
                <Text>
                  Bahwa untuk jumlah pinjaman tersebut akan dikenakan bunga
                  pinjaman kepada debitur dan harus dibayar oleh debitur sebesar{" "}
                  {data.DataPembiayaan.mg_bunga}% Eff (
                  {angkaTerbilang(data.DataPembiayaan.mg_bunga)
                    .split(" ")
                    .map(function (word: string) {
                      return word
                        .charAt(0)
                        .toUpperCase()
                        .concat(word.substr(1));
                    })
                    .join(" ")}{" "}
                  Persen) untuk {data.DataPembiayaan.tenor} (
                  {angkaTerbilang(data.DataPembiayaan.tenor)
                    .split(" ")
                    .map(function (word: string) {
                      return word
                        .charAt(0)
                        .toUpperCase()
                        .concat(word.substr(1));
                    })
                    .join(" ")}
                  ) bulan dari jumlah nominal pinjaman menurut perjanjian ini
                  yang dihitung secara eff sehingga jumlah seluruh pinjaman yang
                  harus dibayar kembali oleh debitur kepada Bank menjadi sebesar
                  Rp. {formatNumber(data.DataPembiayaan.plafond.toFixed(0))} (
                  {angkaTerbilang(data.DataPembiayaan.plafond)
                    .split(" ")
                    .map(function (word: string) {
                      return word
                        .charAt(0)
                        .toUpperCase()
                        .concat(word.substr(1));
                    })
                    .join(" ")}{" "}
                  Rupiah). Bahwa besarnya suku bunga tersebut diatas
                  sewaktu-waktu dapat dirubah oleh pihak Bank.
                </Text>
                <Text>
                  Bahwa pembayaran kembali pinjaman ini akan dilakukan oleh
                  DEBITUR kepada BANK dalam {data.DataPembiayaan.tenor}(
                  {angkaTerbilang(data.DataPembiayaan.tenor)
                    .split(" ")
                    .map(function (word: string) {
                      return word
                        .charAt(0)
                        .toUpperCase()
                        .concat(word.substr(1));
                    })
                    .join(" ")}
                  ) kali angsuran dengan jumlah masing-masing angsuran sebesar
                  Rp. {formatNumber(angsuranBulanan)} (
                  {angkaTerbilang(parseInt(angsuranBulanan))
                    .split(" ")
                    .map(function (word: string) {
                      return word
                        .charAt(0)
                        .toUpperCase()
                        .concat(word.substr(1));
                    })
                    .join(" ")}{" "}
                  Rupiah) yang terdiri dari pokok pinjaman berikut bunganya dan
                  telah disetujui oleh kedua belah pihak bahwa masing-masing
                  angsuran akan dibulatkan keatas lima ribu rupiah terdekat.
                  Dimana pembulatan tersebut diperhitungkan sebagai bunga.
                </Text>
              </View> */}
              {/* <View>
                <Text>
                  Bahwa perjanjian ini berlaku unutk masa{" "}
                  {data.DataPembiayaan.tenor} (
                  {angkaTerbilang(data.DataPembiayaan.tenor)
                    .split(" ")
                    .map(function (word: string) {
                      return word
                        .charAt(0)
                        .toUpperCase()
                        .concat(word.substr(1));
                    })
                    .join(" ")}
                  ) bulan, terhitung sejak ditandatanganinya perjanjian ini
                  tanggal ................... dan akan berkhir pada tanggal
                  ...................
                </Text>
                <Text style={{ marginTop: 7, marginBottom: 7 }}>
                  Bahwa untuk jumlah pinjaman tersebut akan dikenakan bunga
                  pinjaman kepada debitur dan harus dibayar oleh debitur sebesar{" "}
                  ........... % Eff ( ............................. Persen)
                  untuk ............ ( ..................... ) bulan dari jumlah
                  nominal pinjaman menurut perjanjian ini yang dihitung secara
                  eff sehingga jumlah seluruh pinjaman yang harus dibayar
                  kembali oleh debitur kepada Bank menjadi sebesar Rp.
                  .................... (..................................).
                  Bahwa besarnya suku bunga tersebut diatas sewaktu-waktu dapat
                  dirubah oleh pihak Bank.
                </Text>
                <Text>
                  Bahwa pembayaran kembali pinjaman ini akan dilakukan oleh
                  DEBITUR kepada BANK dalam ..............
                  (...............................) kali angsuran dengan jumlah
                  masing-masing angsuran sebesar Rp. ................
                  (.................................) yang terdiri dari pokok
                  pinjaman berikut bunganya dan telah disetujui oleh kedua belah
                  pihak bahwa masing-masing angsuran akan dibulatkan keatas lima
                  ribu rupiah terdekat. Dimana pembulatan tersebut
                  diperhitungkan sebagai bunga.
                </Text>
              </View> */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 7,
                }}
              >
                <Text style={{ width: 20 }}>2.1</Text>
                <Text style={{ width: 100, fontWeight: "bold" }}>
                  Jangka Waktu
                </Text>
                <Text style={{ width: 20 }}>:</Text>
                <View>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {data.DataPembiayaan.tenor}
                    </Text>{" "}
                    Bulan sejak (
                    <Text style={{ fontWeight: "bold" }}>
                      {moment(data.tanggal_cetak_akad).format("DD/MM/YYYY")}
                    </Text>{" "}
                    -{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {`25/${moment(data.tanggal_cetak_akad)
                        .add(data.DataPembiayaan.tenor, "M")
                        .format("MM/YYYY")}`}
                    </Text>
                    )
                  </Text>
                </View>
              </View>
              <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>2.2</Text>
                <Text style={{ width: 100, fontWeight: "bold" }}>Angsuran</Text>
                <Text style={{ width: 20 }}>:</Text>
                <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
                  <Text style={{ width: 50, fontWeight: "bold" }}>Rp.</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {formatNumber(angsuranBulanan)} / Bulan
                  </Text>
                </View>
              </View>
              {data.Bank.kode !== "BPR SIP" && (
                <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
                  <Text style={{ width: 20 }}>2.3</Text>
                  <Text style={{ width: 100 }}>Fee Collection</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <View
                    style={{ display: "flex", gap: 5, flexDirection: "row" }}
                  >
                    <Text style={{ width: 50 }}></Text>
                    <Text>{formatNumber(colfee)} / Bulan</Text>
                  </View>
                </View>
              )}
              <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>2.3</Text>
                <Text style={{ width: 100, fontWeight: "bold" }}>GP</Text>
                <Text style={{ width: 20 }}>:</Text>
                <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
                  <Text>1 Bulan</Text>
                  {/* <Text style={{ width: 50, fontWeight: "bold" }}>
                    {formatNumber(angsuranPokok)}
                  </Text> */}
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: 5,
                  flexDirection: "row",
                }}
              >
                <Text style={{ width: 20 }}>2.4</Text>
                <Text style={{ width: 100, fontWeight: "bold" }}>
                  Tanggal Pembayaran
                </Text>
                <Text style={{ width: 20 }}>:</Text>
                <View style={{ fontWeight: "bold" }}>
                  <Text>
                    {`25/${moment(data.tanggal_cetak_akad)
                      .add(1, "M")
                      .format("MM/YYYY")}`}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: 5,
                  flexDirection: "row",
                }}
              >
                <Text style={{ width: 20 }}>2.5</Text>
                <Text style={{ width: 100, fontWeight: "bold" }}>
                  Suku Bunga {data.jenis_margin === "FLAT" ? "Flat" : "Efektif"}
                </Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text style={{ fontWeight: "bold" }}>
                  {data.DataPembiayaan.mg_bunga}% / Tahun
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: 5,
                  flexDirection: "row",
                }}
              >
                <Text style={{ width: 20 }}>2.6</Text>
                <Text style={{ width: 100, fontWeight: "bold" }}>
                  Tujuan Penggunaan
                </Text>
                <Text style={{ width: 20 }}>:</Text>
                <View style={{ fontWeight: "bold" }}>
                  <Text>
                    {data.tujuan_penggunaan1 && `- ${data.tujuan_penggunaan1}`}
                  </Text>
                  {data.tujuan_penggunaan2 &&
                    data.tujuan_penggunaan2 !== "-" && (
                      <Text>- {data.tujuan_penggunaan2}</Text>
                    )}
                </View>
              </View>
              <View
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 10,
                  marginBottom: 3,
                  padding: "3px 0",
                }}
              >
                <Text>Pasal 3</Text>
                <Text>BIAYA - BIAYA</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: 5,
                  width: 470,
                  flexDirection: "row",
                }}
              >
                <Text style={{ width: 20 }}>3.1</Text>
                <View>
                  <Text>
                    DEBITUR berjanji dan dengan ini mengikat diri untuk
                    menanggung seluruh biaya yang diperlukan berkenaan dengan
                    pelaksanaan Akad ini sepanjang hal ini diberitahukan BANK
                    kepada DEBITUR sebelum ditandatangani Akad ini dan DEBITUR
                    menyatakan persetujuannya. Adapun biaya-biaya tersebut
                    adalah sebagai berikut
                  </Text>
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 5 }}
                  >
                    <Text>a. </Text>
                    <Text style={{ width: 130 }}>Administrasi</Text>
                    <Text>:</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        fontWeight: "bold",
                      }}
                    >
                      <Text style={{ width: 50 }}>Rp.</Text>
                      <Text>{formatNumber(byAdmin.toFixed(0))}</Text>
                    </View>
                  </View>
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 5 }}
                  >
                    <Text>b. </Text>
                    <Text style={{ width: 130 }}>Asuransi Jiwa / Kredit</Text>
                    <Text>:</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        fontWeight: "bold",
                      }}
                    >
                      <Text style={{ width: 50 }}>Rp.</Text>
                      <Text>{formatNumber(byAsuransi.toFixed(0))}</Text>
                    </View>
                  </View>
                  {data.Bank.kode === "BPR SIP" ? (
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Text>c. </Text>
                      <Text style={{ width: 130 }}>Layanan Kredit</Text>
                      <Text>:</Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 10,
                          fontWeight: "bold",
                        }}
                      >
                        <Text style={{ width: 50 }}>Rp.</Text>
                        <Text>
                          {formatNumber(
                            data.DataPembiayaan.by_provisi.toFixed(0)
                          )}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Text>c. </Text>
                      <Text style={{ width: 130 }}>Pembukaan Tabungan</Text>
                      <Text>:</Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 10,
                          fontWeight: "bold",
                        }}
                      >
                        <Text style={{ width: 50 }}>Rp.</Text>
                        <Text>
                          {formatNumber(
                            data.DataPembiayaan.by_buka_rekening.toFixed(0)
                          )}
                        </Text>
                      </View>
                    </View>
                  )}
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 5 }}
                  >
                    <Text>d. </Text>
                    <Text style={{ width: 130 }}>Materai</Text>
                    <Text>:</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        fontWeight: "bold",
                      }}
                    >
                      <Text style={{ width: 50 }}>Rp.</Text>
                      <Text>
                        {formatNumber(
                          data.DataPembiayaan.by_materai.toFixed(0)
                        )}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 5 }}
                  >
                    <Text>e. </Text>
                    <Text style={{ width: 130 }}>Biaya Lain-lain</Text>
                    <Text>:</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        fontWeight: "bold",
                      }}
                    >
                      <Text style={{ width: 50 }}>Rp.</Text>
                      <Text>
                        {data.Bank.kode === "BPR SIP"
                          ? formatNumber(
                              (
                                byLainLain +
                                data.DataPembiayaan.by_buka_rekening
                              ).toFixed(0)
                            )
                          : formatNumber(
                              (
                                byLainLain + data.DataPembiayaan.by_provisi
                              ).toFixed(0)
                            )}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 5 }}
                  >
                    <Text style={{ width: 7 }}> </Text>
                    <Text style={{ width: 130 }}> </Text>
                    <Text>:</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        fontWeight: "bold",
                      }}
                    >
                      <Text
                        style={{
                          width: 85,
                          textDecoration: "underline",
                          borderBottom: "1px solid #888",
                        }}
                      ></Text>
                      <Text>+</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      fontWeight: "bold",
                    }}
                  >
                    <Text style={{ width: 7 }}> </Text>
                    <Text style={{ width: 130 }}>Total Biaya</Text>
                    <Text>:</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Text style={{ width: 50 }}>Rp.</Text>
                      <Text>
                        {formatNumber(
                          (
                            byAdmin +
                            byAsuransi +
                            byLainLain +
                            data.DataPembiayaan.by_buka_rekening +
                            data.DataPembiayaan.by_materai +
                            data.DataPembiayaan.by_provisi
                          ).toFixed(0)
                        )}
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginTop: 5 }}>
                    <Text>
                      Segala biaya yang timbul sehubungan dengan Akad ini
                      merupakan tanggung jawab dan wajib dibayar oleh{" "}
                      <Text style={{ fontWeight: "bold" }}>DEBITUR.</Text>
                    </Text>
                  </View>
                </View>
              </View>
              {/* Pasal 4 */}
              <View
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 15,
                  marginBottom: 3,
                  padding: "3px 0",
                }}
              >
                <Text>Pasal 4</Text>
                <Text>JAMINAN</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: 5,
                  width: 470,
                  flexDirection: "row",
                }}
              >
                <Text style={{ width: 20 }}>4.1</Text>
                <View
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}
                >
                  <Text>
                    Bahwa guna menjamin lebih lanjut pembayaran kembali
                    kewajiban DEBITUR kepada BANK seperti yang disebut pada
                    perjanjian ini, perubahan dan/atau novasi atau Perjanjian
                    Kredit yang dibuat dikemudian hari atau sebab apapun juga,
                    maka DEBITUR menyerahkan jaminan kepada BANK berupa :
                  </Text>
                  <View style={{ display: "flex", flexDirection: "column" }}>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 10 }}
                    >
                      <Text>a.</Text>
                      <Text>
                        Asli{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          Surat Keputusan (SK) Pensiun : Nomor{" "}
                          {data.nomor_sk_pensiun}
                        </Text>{" "}
                        tertanggal :{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {moment(data.tanggal_sk_pensiun).format("DD-MM-YYYY")}{" "}
                        </Text>
                        atas nama :{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {data.DataPembiayaan.name}
                        </Text>
                      </Text>
                    </View>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 10 }}
                    >
                      <Text>b.</Text>
                      <Text>
                        Asli{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          Surat Pernyataan Kuasa Potong Gaji
                        </Text>{" "}
                        atas nama :{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {data.DataPembiayaan.name}
                        </Text>
                      </Text>
                    </View>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 10 }}
                    >
                      <Text>c.</Text>
                      <Text>
                        Asli{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          Bukti Flagging Pos
                        </Text>{" "}
                        atas nama :{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {data.DataPembiayaan.name}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: 5,
                  width: 470,
                  flexDirection: "row",
                }}
              >
                <Text style={{ width: 20 }}>4.2</Text>
                <View>
                  <Text>
                    DEBITUR memberi kuasa kepada BANK untuk melakukan tindakan
                    dan perbuatan hukum yang dianggap wajar dan perlu oleh BANK
                    yang berkaitan dengan pemberian jaminan tersebut diatas.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            opacity: 0.7,
            position: "absolute",
            textAlign: "center",
            left: 0,
            right: 0,
            bottom: 20,
          }}
        >
          <Text
            render={({ pageNumber, totalPages }) => `${pageNumber}`}
            fixed
          ></Text>
        </View>
      </Page>
      {/* Page 2 */}
      <Page
        size={"A4"}
        style={{
          ...stylePdf.root,
          width: "80%",
          margin: "0 auto",
          textAlign: "justify",
          lineHeight: 1.3,
          marginLeft: 10,
        }}
        wrap
      >
        <View
          fixed
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            padding: "0 10px",
          }}
        >
          <View>
            <Image
              src={data.Bank.logo || "/assets/images/logo_kpf.jpg"}
              style={{ width: 50 }}
            />
          </View>
          <View
            style={{
              fontWeight: "bold",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 10 }}>PERJANJIAN KREDIT</Text>
            <Text style={{ fontSize: 8 }}>
              NO AKAD : {data.nomor_akad ? data.nomor_akad : ""}
            </Text>
          </View>
          <View>
            <Image
              src={process.env.NEXT_PUBLIC_APP_LOGO}
              style={{ width: 50 }}
            />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>4.3</Text>
          <View>
            <Text>
              DEBITUR dengan ini menyatakan dan menjamin bahwa JAMINAN tersebut
              diatas adalah benar dan milik DEBITUR, dan hanya DEBITUR sajalah
              yang berhak untuk menyerahkannya sebagai Jaminan, tidak sedang
              diberikan sebagai Jaminan untuk sesuatu hutang pada pihak lain
              dengan jalan bagaimanapun juga, tidak dalam keadaan sengketa serta
              bebas dari sitaan, serta belum dijual atau dijanjikan untuk dijual
              atau dialihkan kepada pihak lain dengan cara apapun juga.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>4.4</Text>
          <View>
            <Text>
              DEBITUR menjamin bahwa mengenai hal – hal tersebut pada pasal 4
              ayat 4.1 diatas, baik sekarang maupun dikemudian hari, BANK tidak
              akan mendapat tuntutan atau gugatan dari pihak manapun juga yang
              menyatakan mempunyai hak terlebih dahulu atau turut mempunyai hak
              atas JAMINAN tersebut diatas.
            </Text>
          </View>
        </View>
        {/* Pasal 4 */}
        {/* Pasal 5 */}
        <View
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 10,
            marginBottom: 3,
            padding: "3px 0",
          }}
        >
          <Text>Pasal 5</Text>
          <Text>KEWAJIAN DEBITUR</Text>
        </View>
        <View>
          <Text>
            Untuk lebih menjamin pelaksanaan Perjanjian ini oleh DEBITUR, maka
            DEBITUR berkewajiban untuk :
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>5.1</Text>
          <View>
            <Text>
              Mempergunakan kredit tersebut semata-mata hanya sebagaimana yang
              tertera dalam pasal 1 Perjanjian ini.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>5.2</Text>
          <View>
            <Text>
              DEBITUR menyetujui dan wajib mengikat diri untuk menyerahkan semua
              surat dan dokumen apapun, yang asli serta sah dan membuktikan
              pemilikan atas segala benda yang dijadikan jaminan termasuk dalam
              Pasal 4 ayat 4.1 tersebut di atas kepada BANK guna dipergunakan
              untuk pelaksanaan pengikatan benda tersebut sebagai jaminan
              kredit, dan selanjutnya dikuasai oleh BANK sampai dilunasi seluruh
              jumlah hutangnya.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>5.3</Text>
          <View>
            <Text>
              DEBITUR Wajib mengikuti Asuransi Jiwa dan atau Asuransi Kredit.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>5.4</Text>
          <View>
            <Text>
              DEBITUR wajib memperpanjang masa pertanggungan termasuk bilamana
              masa berakhir, sampai lunasnya fasilitas kredit dibayar kembali
              oleh DEBITUR kepada BANK, apabila DEBITUR dengan alasan apapun
              tidak memperpanjang masa pertanggungan tersebut, maka segala
              resiko yang terjadi pada agunan tersebut menjadi resiko DEBITUR
              sendiri.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>5.5</Text>
          <View>
            <Text>
              DEBITUR wajib membayar premi-premi dan lain-lain biaya asuransi
              tepat pada waktunya dan menyerahkan asli dari setiap polis atau
              setiap perpanjangannya dan setiap tanda-tanda pembayarannya kepada
              BANK. BANK dengan ini diberi kuasa oleh DEBITUR untuk menutup dan
              memperpanjang asuransi yang dimaksud di atas, satu dan lain atas
              biaya DEBITUR, yakni bilamana DEBITUR lalai menutup atau
              memperpanjang berlakunya asuransi tersebut.
            </Text>
          </View>
        </View>
        {/* Pasal 5 */}
        {/* Pasal 6 */}
        <View
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 10,
            marginBottom: 3,
            padding: "3px 0",
          }}
        >
          <Text>Pasal 6</Text>
          <Text>PEMBAYARAN KEMBALI KREDIT</Text>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>6.1</Text>
          <View>
            <Text>
              Pembayaran kembali kredit/pinjaman uang tersebut dilakukan secara
              angsuran bulanan, yang terdiri dari angsuran pokok kredit dan
              bunga dalam jumlah tetap. Jumlah-jumlah uang yang terutang oleh
              DEBITUR kepada BANK berdasarkan/sesuai dengan catatan-catatan
              dan/atau pembukuan BANK merupakan bukti yang mengikat bagi DEBITUR
              mengenai utang DEBITUR dibayar lunas, untuk itu DEBITUR tidak akan
              menyangkal dan/atau mengajukan keberatan-keberatan akan
              jumlah-jumlah uang yang terhutang oleh DEBITUR.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>6.2</Text>
          <View>
            <Text>
              Demikian pula apabila jangka waktu fasilitas kredit telah berakhir
              atau diakhiri sebelum jangka waktu berakhir dan ternyata masih
              terdapat sisa utang sebagai akibat perubahan tingkat suku bunga,
              maka DEBITUR wajib menandatangani perpanjangan Perjanjian Kredit.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>6.3</Text>
          <View>
            <Text>
              Setiap perubahan besarnya pembayaran bunga pinjaman selalu akan
              diberitahukan secara tertulis oleh BANK kepada DEBITUR. Dan surat
              pemberitahuan perubahan suku bunga tersebut, dan/atau jadwal
              angsuran pinjaman pokok dan bunga pinjaman, merupakan satu
              kesatuan dan tidak terpisahkan dari perjanjian ini, serta DEBITUR
              tidak akan menyangkal dalam bentuk apapun juga atas perubahan suku
              bunga tersebut.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>6.4</Text>
          <View>
            <Text>
              DEBITUR membayar angsuran pokok dan bunga pinjaman melalui
              pemotongan gaji yang dilakukan oleh{" "}
              {data.DataPembiayaan.juru_bayar_tujuan?.toUpperCase() || "PT POS"}{" "}
              berdasarkan surat kuasa pemotongan gaji sampai seluruh kewajibanya
              dinyatakan lunas oleh BANK.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>6.5</Text>
          <View>
            <Text>
              Semua pembayaran pada BANK harus dilakukan di tempat kedudukan
              BANK melalui rekening DEBITUR atau rekening lain yang ditentukan
              oleh BANK.
            </Text>
          </View>
        </View>
        {/* Pasal 6 */}
        {/* Pasal 7 */}
        <View
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 10,
            marginBottom: 3,
            padding: "3px 0",
          }}
        >
          <Text>Pasal 7</Text>
          <Text>DENDA KETERLAMBATAN & PINALTY</Text>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>7.1</Text>
          <View>
            <Text>
              Bahwa atas setiap keterlambatan pembayaran cicilan/angsuran oleh
              DEBITUR kepada BANK, maka DEBITUR dikenakan denda menurut
              ketentuan BANK yang berlaku pada saat ditandatanganinya Perjanjian
              ini, yaitu sebesar 0,3%,- (nol koma tiga persen) perhari.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>7.2</Text>
          <View>
            <Text>
              Pelunasan sebagian atau seluruh pinjaman sebelum jatuh tempo dapat
              dilakukan DEBITUR dengan ketentuan bahwa setiap pelunasan baik
              sebagian atau seluruh pinjaman tersebut DEBITUR dikenakan penalty
              sebesar 7% (tujuh perseratus) yang dihitung dari sisa Pokok
              Pinjaman DEBITUR yang tertera pada pembukuan pihak BANK.
            </Text>
          </View>
        </View>
        {/* Pasal 7 */}
        {/* Pasal 8 */}
        <View
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 10,
            marginBottom: 3,
            padding: "3px 0",
          }}
        >
          <Text>Pasal 8</Text>
          <Text>SYARAT & KETENTUAN</Text>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
          wrap
        >
          <Text style={{ width: 20 }}>8.1</Text>
          <View style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <Text>
              BANK berhak untuk sewaktu-waktu menghentikan dan memutuskan
              perjanjian ini dengan mengesampingkan ketentuan-ketentuan Pasal
              1266 dan Pasal 1267 Kitab Undang-Undang Hukum Perdata sehingga
              tidak diperlukan lagi suatu surat pemberitahuan (Somasi) atau
              surat peringatan dari juru sita atau surat lain yang serupa itu,
              dalam hal demikian seluruh hutang DEBITUR kepada BANK harus
              dibayar seketika dan sekaligus, yaitu dalam hal terjadi salah satu
              kejadian dibawah ini :
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: 450,
                marginTop: 5,
                marginBottom: 5,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text>a.</Text>
                <Text>
                  Bilamana DEBITUR menggunakan fasilitas pinjaman ini menyimpang
                  dari tujuan penggunaan yang telah disetujui oleh BANK.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text>b.</Text>
                <Text>
                  Bilamana DEBITUR lalai atau tidak memenuhi syarat-syarat atau
                  ketentuan-ketentuan / kewajiban-kewajiban yang dimaksud dalam
                  Perjanjian ini dan atau perubahan/tambahan dan atau
                  perjanjian-perjanjian pengikatan jaminan.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text>c.</Text>
                <Text>
                  Bilamana menurut pertimbangan BANK keadaan keuangan,
                  bonafiditas dan solvabilitas DEBITUR mundur sedemikian rupa
                  sehingga DEBITUR tidak dapat membayar hutangnya.
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            opacity: 0.7,
            position: "absolute",
            textAlign: "center",
            left: 0,
            right: 0,
            bottom: 20,
          }}
        >
          <Text
            render={({ pageNumber, totalPages }) => `${pageNumber}`}
            fixed
          ></Text>
        </View>
      </Page>
      {/* Page 3 */}
      <Page
        size={"A4"}
        style={{
          ...stylePdf.root,
          width: "80%",
          margin: "0 auto",
          textAlign: "justify",
          lineHeight: 1.3,
          marginLeft: 10,
        }}
        wrap
      >
        <View
          fixed
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            padding: "0 10px",
          }}
        >
          <View>
            <Image
              src={data.Bank.logo || "/assets/images/logo_kpf.jpg"}
              style={{ width: 50 }}
            />
          </View>
          <View
            style={{
              fontWeight: "bold",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 10 }}>PERJANJIAN KREDIT</Text>
            <Text style={{ fontSize: 8 }}>
              NO AKAD : {data.nomor_akad ? data.nomor_akad : ""}
            </Text>
          </View>
          <View>
            <Image
              src={process.env.NEXT_PUBLIC_APP_LOGO}
              style={{ width: 50 }}
            />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: 450,
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 10,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Text>d.</Text>
            <Text>
              Bilamana DEBITUR menanggung hutang pihak ketiga tanpa persetujuan
              tertulis terlebih dahulu dari BANK.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Text>e.</Text>
            <Text>
              Bilamana pernyataan-pernyataan, surat-surat, keterangan-keterangan
              yang diberikan DEBITUR kepada BANK ternyata tidak benar.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Text>f.</Text>
            <Text>
              Bilamana menurut pertimbangan BANK ada hal-hal lain yang meragukan
              pengembalian pelunasan kredit tersebut.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>8.2</Text>
          <View>
            <Text>
              Bahwa segala pembukuan / catatan yang dibuat oleh BANK menjadi
              tanda bukti yang mengikat dan sah atas jumlah hutang DEBITUR
              kepada BANK.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>8.3</Text>
          <View>
            <Text>
              Apabila DEBITUR meninggal dunia, maka semua hutang dan kewajiban
              DEBITUR kepada BANK yang timbul berdasarkan Perjanjian ini berikut
              semua perubahannya dikemudian dan atau berdasarkan apapun juga
              tetap merupakan satu kesatuan hutang dari para ahli waris DEBITUR
              atau PENANGGUNG (jika ada).
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>8.4</Text>
          <View>
            <Text>
              Debitur dengan ini berjanji, akan tunduk kepada segala ketentuan
              dan sesuai dengan ketentuan peraturan perundang-undangan termasuk
              ketentuan peraturan Otoritas Jasa Keuangan.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>8.5</Text>
          <View>
            <Text>
              Perjanjian ini telah disesuaikan dengan ketentuan peraturan
              perundang-undangan termasuk ketentuan peraturan Otoritas Jasa
              Keuangan.
            </Text>
          </View>
        </View>
        {/* Pasal 8 */}
        {/* Pasal 9 */}
        <View
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 10,
            marginBottom: 3,
            padding: "3px 0",
          }}
        >
          <Text>Pasal 9</Text>
          <Text>KOMUNIKASI & PEMBERITAHUAN</Text>
        </View>
        <View>
          <Text>
            Setiap pemberitahuan atau komunikasi lainnya yang berhubungan dengan
            Perjanjian Kredit ini dapat dikirimkan ke alamat sebagai berikut :
          </Text>
        </View>
        <View style={{ padding: "5px 10px" }}>
          <Text style={{ fontWeight: "bold" }}>
            {process.env.NEXT_PUBLIC_APP_ATAS_NAMA_BANK ||
              "KOPERASI PEMASARAN FADILLAH"}
          </Text>
          <View style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Up</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>
                {process.env.NEXT_PUBLIC_APP_DIREKTUR || "Lodewijk HF Lantang"}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>No. Telepon</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>{process.env.NEXT_PUBLIC_APP_NO_TELEPON || ""}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Alamat</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text style={{ width: 300 }}>
                {process.env.NEXT_PUBLIC_APP_ALAMAT || ""}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Email</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text style={{ width: 300 }}>
                {process.env.NEXT_PUBLIC_APP_EMAIL || ""}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ padding: "5px 10px" }}>
          <Text style={{ fontWeight: "bold" }}>
            {data.Bank.name.toUpperCase()}
          </Text>
          <View style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Up</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text style={{ width: 300 }}>{data.Bank.up_direktur}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>No Telepon</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>{data.Bank.no_telepon}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Alamat</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>{data.Bank.alamat}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Email</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>{data.Bank.email}</Text>
            </View>
          </View>
        </View>

        {/* Pasal 9 */}
        {/* Pasal 10 */}
        <View
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 10,
            marginBottom: 3,
            padding: "3px 0",
          }}
        >
          <Text>Pasal 10</Text>
          <Text>DOMISILI HUKUM</Text>
        </View>
        <View
          style={{
            width: 490,
          }}
        >
          <Text>
            Mengenai perjanjian ini dan segala akibat serta pelaksanaannya kedua
            belah pihak menerangkan telah memilih tempat kedudukan hukum yang
            tetap dan umum di Kantor Panitera Pengadilan Negeri Bandung,
            demikian dengan tidak mengurangi hak dari BANK untuk memohon gugatan
            atau pelaksanaan eksekusi dari perjanjian ini melalui Peradilan
            lainnya dalam wilayah Republik Indonesia.
          </Text>
        </View>
        {/* Pasal 10 */}
        {/* Pasal 10 */}
        <View
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 15,
            marginBottom: 3,
            padding: "3px 0",
          }}
        >
          <Text>Pasal 11</Text>
          <Text>LAIN-LAIN</Text>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>11.1</Text>
          <View>
            <Text>
              Sebelum Akad ini ditandatangani oleh DEBITUR, DEBITUR mengakui
              dengan sebenarnya, bahwa DEBITUR telah membaca dengan cermat atau
              dibacakan kepada DEBITUR, sehingga oleh karena itu DEBITUR
              memahami sepenuhnya segala yang akan menjadi akibat hukum setelah
              DEBITUR menandatangani Perjanjian Kredit ini.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>11.2</Text>
          <View>
            <Text>
              Apabila ada hal-hal yang belum diatur atau belum cukup diatur
              dalam Perjanjian Kredit ini, maka DEBITUR dan BANK akan
              mengaturnya Bersama secara musyawarah untuk mufakat dalam suatu
              Addendum.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 470,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>11.3</Text>
          <View>
            <Text>
              Setiap Addendum dari Perjanjian Kredit ini merupakan satu kesatuan
              yang tidak dapat dipisahkan dari Perjanjian Kredit ini
            </Text>
          </View>
        </View>
        {/* Pasal 10 */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "bold" }}>
            Bandung,{" "}
            {moment(data.tanggal_cetak_akad)
              .locale("id")
              .format("DD MMMM YYYY")}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
                border: "1px solid #aaa",
                padding: 5,
                fontWeight: "bold",
              }}
            >
              <Text>
                {process.env.NEXT_PUBLIC_APP_FULL_NAME || "KOPJAS FAS"}
              </Text>
              <View style={{ height: 50 }}></View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    borderBottom: "1px solid #aaa",
                    width: 120,
                    textAlign: "center",
                    margin: "0 auto",
                  }}
                >
                  {process.env.NEXT_PUBLIC_APP_DIREKTUR ||
                    "Lodewijk HF Lantang"}
                </Text>
                <Text>{process.env.NEXT_PUBLIC_APP_JABATAN}</Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #aaa",
                padding: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>DEBITUR</Text>
              <View
                style={{
                  height: 50,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text>Materai</Text>
                <Text>Rp. 10.000</Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    borderBottom: "1px solid #aaa",
                    width: 120,
                    textAlign: "center",
                    margin: "0 auto",
                  }}
                >
                  {data.DataPembiayaan.name || ""}
                </Text>
                <Text>Debitur</Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
                border: "1px solid #aaa",
                padding: 5,
                fontWeight: "bold",
              }}
            >
              <Text style={{ flex: 1 }}>MENYETUJUI</Text>
              <View style={{ flex: 1, height: 50 }}></View>
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text style={{ height: 10 }}>
                  {data.DataPengajuanPasangan.nama_pasangan || " "}
                </Text>
                <Text
                  style={{
                    borderTop: "1px solid #aaa",
                    width: 120,
                    textAlign: "center",
                    margin: "0 auto",
                  }}
                >
                  Suami / Istri / Ahli Waris*
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            opacity: 0.7,
            position: "absolute",
            textAlign: "center",
            left: 0,
            right: 0,
            bottom: 20,
          }}
        >
          <Text
            render={({ pageNumber, totalPages }) => `${pageNumber}`}
            fixed
          ></Text>
        </View>
      </Page>
    </>
  );
}
