"use client";

import { Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { DataDataPengajuan } from "../Interfaces";
import moment from "moment";
import { IDRFormat } from "@/components/v1/appUtils";
import { getAngsuran } from "@/components/Utils";
const angkaTerbilang = require("angka-menjadi-terbilang");

export default function PKSaga({ data }: { data: DataDataPengajuan }) {
  const angsBulan = getAngsuran(
    data.DataPembiayaan.plafond,
    data.DataPembiayaan.tenor,
    data.DataPembiayaan.mg_bunga,
    data.DataPembiayaan.pembulatan,
    data.jenis_margin,
  ).angsuran;
  const angssudan = getAngsuran(
    data.DataPembiayaan.plafond,
    data.DataPembiayaan.tenor,
    data.DataPembiayaan.margin_bank,
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
        lineHeight: 1.4,
        textAlign: "justify",
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: "bold", textAlign: "center" }}>
        PERJANJIAN KREDIT
      </Text>
      <Text style={{ textAlign: "center" }}>NOMOR : {data.nomor_akad}</Text>

      <Text style={{ marginTop: 20 }}>Yang bertanda tangan dibawah ini :</Text>
      <View style={{ display: "flex", gap: 2, flexDirection: "row" }}>
        <Text style={{ width: 8 }}>I.</Text>
        <View style={{ flex: 1 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Nama</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>Nandang Hermawan</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Jabatan</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>Direktur</Text>
          </View>
          <Text style={{ marginTop: 3, marginBottom: 5, textAlign: "justify" }}>
            Dalam hal ini bertindak untuk dan atas nama Pemberi Kuasa, PT. Surya
            Adhiguna Abadi, berdasarkan Surat Kuasa Nomor _______________
            tertanggal __________________, oleh karenanya berhak dan sah
            mewakili PT. Surya Arthaguna Abadi, yang selanjutnya disebut “BANK”.
          </Text>
        </View>
      </View>
      <View style={{ display: "flex", gap: 2, flexDirection: "row" }}>
        <Text style={{ width: 8 }}>II.</Text>
        <View style={{ flex: 1 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Nama</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>{data.nama}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>NIK</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>{data.nik}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Tempat/Tanggal Lahir</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>
              {data.DataPembiayaan.tempat_lahir},{" "}
              {data.DataPembiayaan.tanggal_lahir}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Pekerjaan</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>{data.pekerjaan_sekarang}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Alamat</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>
              {data.DataPengajuanAlamat.alamat} RT {data.DataPengajuanAlamat.rt}{" "}
              RW {data.DataPengajuanAlamat.rw} KELURAHAN{" "}
              {data.DataPengajuanAlamat.kelurahan} KECAMATAN{" "}
              {data.DataPengajuanAlamat.kecamatan}{" "}
              {data.DataPengajuanAlamat.kota}{" "}
              {data.DataPengajuanAlamat.provinsi}{" "}
              {data.DataPengajuanAlamat.kode_pos}
            </Text>
          </View>
          <Text style={{ marginTop: 3, marginBottom: 3 }}>
            Dan untuk tindakan hukum ini telah mendapat persetujuan
            suami/isteri/ahli warisnya :
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Nama</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>
              {data.DataPengajuanPasangan.nama_pasangan}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>NIK</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>
              {data.DataPengajuanPasangan.nik_pasangan}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Tempat/Tanggal Lahir</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>
              {data.DataPengajuanPasangan.tempat_lahir_pasangan},{" "}
              {moment(data.DataPengajuanPasangan.tanggal_lahir_pasangan).format(
                "DD-MM-YYYY",
              )}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Pekerjaan</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>
              {data.DataPengajuanPasangan.pekerjaan_pasangan}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Alamat</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>
              {data.DataPengajuanPasangan.alamat_pasangan} KELURAHAN{" "}
              {data.DataPengajuanPasangan.kelurahan_pasangan} KECAMATAN{" "}
              {data.DataPengajuanPasangan.kecamatan_pasangan}{" "}
              {data.DataPengajuanPasangan.kota_pasangan}{" "}
              {data.DataPengajuanPasangan.provinsi_pasangan}{" "}
              {data.DataPengajuanPasangan.kode_pos_pasangan}
            </Text>
          </View>
          <Text style={{ marginTop: 3 }}>selanjutnya disebut “DEBITUR”</Text>
        </View>
      </View>
      <Text style={{ margin: "3px 0px" }}>
        Selanjutnya BANK dan DEBITUR terlebih dahulu menerangkan dengan ini
        telah sepakat untuk mengadakan Perjanjian Kredit (selanjutnya disebut
        “Perjanjian”) dengan syarat-syarat dan ketentuan-ketentuan sebagai
        berikut:
      </Text>

      <View style={{ margin: "7px 0px" }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 1</Text>
        <Text
          style={{ marginBottom: 8, fontWeight: "bold", textAlign: "center" }}
        >
          FASILITAS KREDIT
        </Text>
        <Text>
          BANK dengan ini menyetujui memberikan suatu kredit kepada DEBITUR dan
          DEBITUR menyetujui untuk menerima fasilitas kredit yang disebut Kredit
          Channeling dengan Plafond Kredit sebesar Rp.{" "}
          {IDRFormat(data.DataPembiayaan.plafond)};- (
          {angkaTerbilang(data.DataPembiayaan.plafond)} rupiah)
        </Text>
      </View>

      <View style={{ margin: "7px 0px" }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 2</Text>
        <Text
          style={{ marginBottom: 8, fontWeight: "bold", textAlign: "center" }}
        >
          BUNGA KREDIT
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>1.</Text>
          <Text style={{ flex: 1 }}>
            Atas fasilitas kredit yang diberikan berdasarkan Perjanjian ini,
            Debitur wajib membayar bunga kepada Kreditur sebesar{" "}
            {data.DataPembiayaan.mg_bunga} % (
            {angkaTerbilang(data.DataPembiayaan.mg_bunga)} persen) per tahun
            yang dihitung berdasarkan saldo pokok terutang.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>2.</Text>
          <Text style={{ flex: 1 }}>
            Perhitungan bunga dilakukan dengan menggunakan metode Annuitas
            Efektif sesuai ketentuan Kreditur.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>3.</Text>
          <Text style={{ flex: 1 }}>
            Pembayaran bunga dilakukan bersamaan dengan pembayaran angsuran
            pokok sesuai jadwal yang telah disepakati Para Pihak.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>4.</Text>
          <Text style={{ flex: 1 }}>
            Besaran bunga sebagaimana dimaksud pada ayat (1) telah dijelaskan
            secara lengkap kepada Debitur dan Debitur menyatakan telah memahami
            mekanisme perhitungan bunga tersebut.
          </Text>
        </View>
      </View>

      <View style={{ margin: "7px 0px" }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 3</Text>
        <Text
          style={{ marginBottom: 8, fontWeight: "bold", textAlign: "center" }}
        >
          TUJUAN PENGGUNAAN & JANGKA WAKTU
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>a.</Text>
          <Text style={{ width: 100 }}>Jangka Waktu</Text>
          <Text style={{ width: 4 }}>:</Text>
          <Text style={{ flex: 1 }}>
            {data.DataPembiayaan.tenor} bulan, terhitung sejak{" "}
            {moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")} sampai dengan{" "}
            {moment(data.tanggal_cetak_akad)
              .add(data.DataPembiayaan.tenor, "month")
              .format("DD-MM-YYYY")}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>b.</Text>
          <Text style={{ width: 100 }}>Angsuran Perbulan</Text>
          <Text style={{ width: 4 }}>:</Text>
          <Text style={{ flex: 1 }}>Rp. {IDRFormat(angssudan)}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>c.</Text>
          <Text style={{ width: 100 }}>Fee Collection</Text>
          <Text style={{ width: 4 }}>:</Text>
          <Text style={{ flex: 1 }}>
            Rp. {IDRFormat(angsBulan - angssudan)}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>d.</Text>
          <Text style={{ width: 100 }}>Total Angsuran</Text>
          <Text style={{ width: 4 }}>:</Text>
          <Text style={{ flex: 1 }}>Rp. {IDRFormat(angsBulan)}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>e.</Text>
          <Text style={{ width: 100 }}>Tanggal Pembayaran</Text>
          <Text style={{ width: 4 }}>:</Text>
          <Text style={{ flex: 1 }}>25</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>f.</Text>
          <Text style={{ width: 100 }}>Suku Bunga</Text>
          <Text style={{ width: 4 }}>:</Text>
          <Text style={{ flex: 1 }}>
            {data.DataPembiayaan.mg_bunga}% p.a efektif.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>g.</Text>
          <Text style={{ width: 100 }}>Tujuan Penggunaan</Text>
          <Text style={{ width: 4 }}>:</Text>
          <Text style={{ flex: 1 }}>{data.tujuan_penggunaan1}</Text>
        </View>
      </View>

      <View style={{ margin: "7px 0px" }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 4</Text>
        <Text
          style={{ marginBottom: 8, fontWeight: "bold", textAlign: "center" }}
        >
          BIAYA – BIAYA
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>1.</Text>
          <Text style={{ flex: 1 }}>
            Bahwa untuk pembebanan angsuran,bunga, provisi, biaya-biaya, denda
            dan segala biaya lainnya yang terhutang berkenaan dengan pemberian
            kredit ini, DEBITUR memberi kuasa kepada BANK untuk mendebet
            rekening debitur yang ada pada BANK.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>2.</Text>
          <View style={{ flex: 1 }}>
            <Text>
              Bahwa DEBITUR dengan ini mengikatkan diri untuk menanggung seluruh
              biaya yang diperlukan berkenaan dengan pelaksanaan Akad ini
              sepanjang hal ini diberitahukan BANK kepada DEBITUR sebelum
              ditanda tangani Akad ini dan DEBITUR menyatakan persetujuannya.
              Adapun biaya-biaya tersebut adalah sebagai berikut :
            </Text>
            <View style={{ marginLeft: 20 }}>
              <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Text style={{ width: 8 }}>a.</Text>
                <Text style={{ width: 100 }}>Administrasi</Text>
                <Text style={{ width: 4 }}>:</Text>
                <Text style={{ width: 100, textAlign: "right" }}>
                  Rp. {IDRFormat(admin)}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Text style={{ width: 8 }}>b.</Text>
                <Text style={{ width: 100 }}>Asuransi</Text>
                <Text style={{ width: 4 }}>:</Text>
                <Text style={{ width: 100, textAlign: "right" }}>
                  Rp. {IDRFormat(asuransi)}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Text style={{ width: 8 }}>c.</Text>
                <Text style={{ width: 100 }}>Biaya Tatalaksana</Text>
                <Text style={{ width: 4 }}>:</Text>
                <Text style={{ width: 100, textAlign: "right" }}>
                  Rp. {IDRFormat(data.DataPembiayaan.by_tatalaksana)}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Text style={{ width: 8 }}>d.</Text>
                <Text style={{ width: 100 }}>Biaya Mutasi</Text>
                <Text style={{ width: 4 }}>:</Text>
                <Text style={{ width: 100, textAlign: "right" }}>
                  Rp. {IDRFormat(data.DataPembiayaan.by_mutasi)}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Text style={{ width: 8 }}>e.</Text>
                <Text style={{ width: 100 }}>Biaya Materai</Text>
                <Text style={{ width: 4 }}>:</Text>
                <Text style={{ width: 100, textAlign: "right" }}>
                  Rp. {IDRFormat(data.DataPembiayaan.by_materai)}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Text style={{ width: 8 }}>f.</Text>
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
                <Text style={{ width: 8 }}>g.</Text>
                <Text style={{ width: 100 }}>Biaya Pembukaan Rekening</Text>
                <Text style={{ width: 4 }}>:</Text>
                <Text style={{ width: 100, textAlign: "right" }}>
                  Rp. {IDRFormat(data.DataPembiayaan.by_buka_rekening)}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Text style={{ width: 8 }}></Text>
                <Text style={{ width: 100 }}></Text>
                <Text style={{ width: 4 }}>:</Text>
                <Text style={{ width: 100, textAlign: "right" }}>
                  ________________________(+)
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
                <Text style={{ width: 100 }}>Total Biaya</Text>
                <Text style={{ width: 4 }}>:</Text>
                <Text style={{ width: 100, textAlign: "right" }}>
                  Rp.{" "}
                  {IDRFormat(
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
          </View>
        </View>
        <Text>
          Segala biaya yang timbul sehubungan dengan Akad ini merupakan tanggung
          jawab dan wajib dibayar oleh DEBITUR.
        </Text>
      </View>

      <View style={{ margin: "7px 0px" }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 5</Text>
        <Text
          style={{ marginBottom: 8, fontWeight: "bold", textAlign: "center" }}
        >
          JAMINAN
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>1.</Text>
          <View style={{ flex: 1 }}>
            <Text>
              Bahwa guna menjamin lebih lanjut pembayaran kembali kewajiban
              DEBITUR kepada BANK seperti yang disebut pada perjanjian ini,
              perubahan dan/atau novasi atau Perjanjian Kredit yang dibuat
              dikemudian hari atau sebab apapun juga, maka DEBITUR menyerahkan
              jaminan kepada BANK berupa :
            </Text>
            <Text style={{ fontWeight: "bold" }}>
              Surat Keputusan Pensiun nomor : {data.nomor_sk_pensiun} yang
              selanjutnya disebut sebagai JAMINAN
            </Text>
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>2.</Text>
          <Text style={{ flex: 1 }}>
            Bahwa DEBITUR memberi kuasa kepada BANK untuk melakukan tindakan dan
            perbuatan hukum yang dianggap wajar dan perlu oleh BANK yang
            berkaitan dengan pemberian jaminan tersebut diatas.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>3.</Text>
          <Text style={{ flex: 1 }}>
            Bahwa DEBITUR dengan ini menyatakan dan menjamin bahwa JAMINAN
            tersebut diatas adalah benar dan milik DEBITUR, dan hanya DEBITUR
            sajalah yang berhak untuk menyerahkannya sebagai Jaminan, tidak
            sedang diberikan sebagai Jaminan untuk sesuatu hutang pada pihak
            lain dengan jalan bagaimanapun juga, tidak dalam keadaan sengketa
            serta bebas dari sitaan, serta belum dijual atau dijanjikan untuk
            dijual atau dialihkan kepada pihak lain dengan cara apapun juga
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>4.</Text>
          <Text style={{ flex: 1 }}>
            Bahwa DEBITUR menjamin bahwa mengenai hal – hal tersebut pada pasal
            4 ayat 4.1 diatas, baik sekarang maupun dikemudian hari, BANK tidak
            akan mendapat tuntutan atau gugatan dari pihak manapun juga yang
            menyatakan mempunyai hak terlebih dahulu atau turut mempunyai hak
            atas JAMINAN tersebut diatas
          </Text>
        </View>
      </View>

      <View style={{ margin: "7px 0px" }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 6</Text>
        <Text
          style={{ marginBottom: 8, fontWeight: "bold", textAlign: "center" }}
        >
          KEWAJIBAN DEBITUR
        </Text>
        <Text>
          Bahwa untuk lebih menjamin pelaksanaan Perjanjian ini, maka DEBITUR
          berkewajiban untuk :
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>a.</Text>
          <Text style={{ flex: 1 }}>
            Mempergunakan kredit tersebut semata-mata hanya sebagaimana yang
            tertera dalam pasal 1 Perjanjian ini
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>b.</Text>
          <Text style={{ flex: 1 }}>
            DEBITUR menyetujui dan wajib mengikat diri untuk menyerahkan semua
            surat dan dokumen apapun, yang asli serta sah dan membuktikan
            pemilikan atas segala benda yang dijadikan jaminan termasuk dalam
            Pasal 4 ayat 4.1 tersebut di atas kepada BANK guna dipergunakan
            untuk pelaksanaan pengikatan benda tersebut sebagai jaminan kredit,
            dan selanjutnya dikuasai oleh BANK sampai dilunasi seluruh jumlah
            hutangnya.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>c.</Text>
          <Text style={{ flex: 1 }}>
            DEBITUR Wajib mengikuti Asuransi Jiwa dan atau Asuransi Kredit.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>d.</Text>
          <Text style={{ flex: 1 }}>
            DEBITUR wajib memperpanjang masa pertanggungan termasuk bilamana
            masa berakhir, sampai lunasnya fasilitas kredit dibayar kembali oleh
            DEBITUR kepada BANK, apabila DEBITUR dengan alasan apapun tidak
            memperpanjang masa pertanggungan tersebut, maka segala resiko yang
            terjadi pada agunan tersebut menjadi resiko DEBITUR sendiri.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 8 }}>e.</Text>
          <Text style={{ flex: 1 }}>
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

      <View style={{ margin: "7px 0px" }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 7</Text>
        <Text
          style={{ marginBottom: 8, fontWeight: "bold", textAlign: "center" }}
        >
          PEMBAYARAN KEMBALI KREDIT
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>1).</Text>
          <Text style={{ flex: 1 }}>
            Pembayaran kembali kredit/pinjaman uang tersebut dilakukan secara
            angsuran bulanan, yang terdiri dari angsuran pokok kredit dan bunga
            dalam jumlah tetap. Jumlah-jumlah uang yang terutang oleh DEBITUR
            kepada BANK berdasarkan/sesuai dengan catatan-catatan dan/atau
            pembukuan BANK merupakan bukti yang mengikat bagi DEBITUR mengenai
            utang DEBITUR dibayar lunas, untuk itu DEBITUR tidak akan menyangkal
            dan/atau mengajukan keberatan-keberatan akan jumlah-jumlah uang yang
            terhutang oleh DEBITUR
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>2).</Text>
          <Text style={{ flex: 1 }}>
            Demikian pula apabila jangka waktu fasilitas kredit telah berakhir
            atau diakhiri sebelum jangka waktu berakhir dan ternyata masih
            terdapat sisa utang sebagai akibat perubahan tingkat suku bunga,
            maka DEBITUR wajib menandatangani perpanjangan Perjanjian Kredit
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>3).</Text>
          <Text style={{ flex: 1 }}>
            Setiap perubahan besarnya pembayaran bunga pinjaman selalu akan
            diberitahukan secara tertulis oleh BANK kepada DEBITUR. Dan surat
            pemberitahuan perubahan suku bunga tersebut, dan/atau jadwal
            angsuran pinjaman pokok dan bunga pinjaman, merupakan satu kesatuan
            dan tidak terpisahkan dari perjanjian ini, serta DEBITUR tidak akan
            menyangkal dalam bentuk apapun juga atas perubahan suku bunga
            tersebut.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>4).</Text>
          <Text style={{ flex: 1 }}>
            DEBITUR membayar angsuran pokok dan bunga pinjaman melalui
            pemotongan gaji yang dilakukan oleh{" "}
            {data.DataPembiayaan.juru_bayar_tujuan} berdasarkan surat kuasa
            pemotongan gaji sampai seluruh kewajibanya dinyatakan lunas oleh
            BANK.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>5).</Text>
          <Text style={{ flex: 1 }}>
            Semua pembayaran pada BANK harus dilakukan di tempat kedudukan BANK
            melalui rekening DEBITUR atau rekening lain yang ditentukan oleh
            BANK
          </Text>
        </View>
      </View>

      <View style={{ margin: "7px 0px" }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 8</Text>
        <Text
          style={{ marginBottom: 8, fontWeight: "bold", textAlign: "center" }}
        >
          SYARAT & KETENTUAN
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>1).</Text>
          <View style={{ flex: 1 }}>
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
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>a.</Text>
              <Text style={{ flex: 1 }}>
                Bilamana DEBITUR menggunakan fasilitas pinjaman ini menyimpang
                dari tujuan penggunaan yang telah disetujui oleh BANK;
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>b.</Text>
              <Text style={{ flex: 1 }}>
                Bilamana DEBITUR lalai atau tidak memenuhi syarat-syarat atau
                ketentuan-ketentuan / kewajiban-kewajiban yang dimaksud dalam
                Perjanjian ini dan atau perubahan/tambahan dan atau
                perjanjian-perjanjian pengikatan jaminan.
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>c.</Text>
              <Text style={{ flex: 1 }}>
                Bilamana menurut pertimbangan BANK keadaan keuangan, bonafiditas
                dan solvabilitas DEBITUR mundur sedemikian rupa sehingga DEBITUR
                tidak dapat membayar hutangnya;
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>d.</Text>
              <Text style={{ flex: 1 }}>
                Bilamana DEBITUR menanggung hutang pihak ketiga tanpa
                persetujuan tertulis terlebih dahulu dari BANK;
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>e.</Text>
              <Text style={{ flex: 1 }}>
                Bilamana pernyataan-pernyataan, surat-surat,
                keterangan-keterangan yang diberikan DEBITUR kepada BANK
                ternyata tidak benar;
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Text style={{ width: 10 }}>f.</Text>
              <Text style={{ flex: 1 }}>
                Bilamana menurut pertimbangan BANK ada hal-hal lain yang
                meragukan pengembalian pelunasan kredit tersebut;
              </Text>
            </View>
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>2).</Text>
          <Text style={{ flex: 1 }}>
            Bahwa segala pembukuan / catatan yang dibuat oleh BANK menjadi tanda
            bukti yang mengikat dan sah atas jumlah hutang DEBITUR kepada BANK.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>3).</Text>
          <Text style={{ flex: 1 }}>
            Apabila DEBITUR meninggal dunia, maka semua hutang dan kewajiban
            DEBITUR kepada BANK yang timbul berdasarkan Perjanjian ini berikut
            semua perubahannya dikemudian dan atau berdasarkan apapun juga tetap
            merupakan satu kesatuan hutang dari para ahli waris DEBITUR atau
            PENANGGUNG (jika ada).
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>4).</Text>
          <Text style={{ flex: 1 }}>
            Debitur dengan ini berjanji, akan tunduk kepada segala ketentuan dan
            sesuai dengan ketentuan peraturan perundang-undangan termasuk
            ketentuan peraturan Otoritas Jasa Keuangan.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>5).</Text>
          <Text style={{ flex: 1 }}>
            Perjanjian ini telah disesuaikan dengan ketentuan peraturan
            perundang-undangan termasuk ketentuan peraturan Otoritas Jasa
            Keuangan.
          </Text>
        </View>
      </View>

      <View style={{ margin: "7px 0px" }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 9</Text>
        <Text
          style={{ marginBottom: 8, fontWeight: "bold", textAlign: "center" }}
        >
          KOMUNIKASI & PEMBERITAHUAN
        </Text>
        <Text>
          Setiap pemberitahuan atau komunikasi lainnya yang berhubungan dengan
          Perjanjian Kredit ini dapat dikirimkan ke alamat sebagai berikut :
        </Text>
        <View style={{ margin: 5 }}>
          <Text style={{ fontWeight: "bold" }}>
            KOPERASI JASA FADILLAH AQILA SEJAHTRA
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 80 }}>UP</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>
              Adhi Sofyar Pramudya (HP: 0812-1302-2268)
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 80 }}>Alamat</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>
              Jl. Gading Barat II No. 18 Gading Regency Soekarno
              Hatta,Cisaranten Endah Arcamanik, Bandung Jawa Barat 40292
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 80 }}>Email</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>kopjasfas@kpfi.co.id</Text>
          </View>
        </View>
        <View style={{ margin: 5 }}>
          <Text style={{ fontWeight: "bold" }}>BPR SURYA ARTHAGUNA ABADI</Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 80 }}>UP</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>Arahman Suryanto</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 80 }}>Alamat</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>Jl. Raya Darmo no. 8 surabaya</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 80 }}>Email</Text>
            <Text style={{ width: 4 }}>:</Text>
            <Text style={{ flex: 1 }}>arahman.suryanto1984@gmail.com</Text>
          </View>
        </View>
      </View>

      <View style={{ margin: "7px 0px" }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>
          PASAL 10
        </Text>
        <Text
          style={{ marginBottom: 8, fontWeight: "bold", textAlign: "center" }}
        >
          PENYELESAIAN SENGKETA
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>1).</Text>
          <Text style={{ flex: 1 }}>
            Perjanjian ini tunduk pada dan karenanya harus ditafsirkan
            berdasarkan hukum Republik Indonesia.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>2).</Text>
          <Text style={{ flex: 1 }}>
            Setiap perselisihan atau sengketa yang timbul dari dan/atau
            sehubungan dengan pelaksanaan Perjanjian Kredit ini akan
            diselesaikan terlebih dahulu melalui mekanisme penanganan pengaduan
            internal Kreditur sesuai ketentuan peraturan perundang-undangan di
            bidang perlindungan konsumen sektor jasa keuangan.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>3).</Text>
          <Text style={{ flex: 1 }}>
            Untuk pelaksanaan Perjanjian ini dan segala akibatnya para pihak
            memilih tempat tinggal yang tetap dan tidak berubah di kantor
            Panitera Pengadilan Negeri Surabaya, dengan tidak mengurangi hak
            Kreditur untuk memohon pelaksanaan/eksekusi dari Perjanjian ini atau
            mengajukan tuntutan hukum terhadap Debitur melalui
            Pengadilan-Pengadilan Negeri lainnya dalam wilayah Republik
            Indonesia.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>4).</Text>
          <Text style={{ flex: 1 }}>
            Selama proses penyelesaian sengketa berlangsung, Debitur tetap wajib
            memenuhi kewajibannya berdasarkan Perjanjian Kredit ini.
          </Text>
        </View>
      </View>

      <View style={{ margin: "7px 0px" }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>
          PASAL 11
        </Text>
        <Text
          style={{ marginBottom: 8, fontWeight: "bold", textAlign: "center" }}
        >
          LAIN - LAIN
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>1).</Text>
          <Text style={{ flex: 1 }}>
            Debitur dengan ini menyatakan telah membaca, memahami, dan mengerti
            seluruh isi, maksud, dan konsekuensi hukum dari Perjanjian Kredit
            ini.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>2).</Text>
          <Text style={{ flex: 1 }}>
            Debitur menyatakan bahwa Perjanjian Kredit ini telah dijelaskan
            secara lengkap oleh Kreditur, termasuk namun tidak terbatas pada hak
            dan kewajiban Para Pihak, biaya, bunga, risiko, serta tata cara
            penyelesaian sengketa.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>3).</Text>
          <Text style={{ flex: 1 }}>
            Debitur menandatangani Perjanjian Kredit ini secara sadar, tanpa
            adanya paksaan, tekanan, atau pengaruh dari pihak manapun.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>4).</Text>
          <Text style={{ flex: 1 }}>
            Debitur menyatakan telah diberikan kesempatan yang cukup untuk
            mempelajari Perjanjian Kredit ini sebelum menandatanganinya.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>5).</Text>
          <Text style={{ flex: 1 }}>
            Debitur dengan ini melepaskan haknya untuk menyatakan bahwa Debitur
            tidak memahami isi Perjanjian Kredit ini dikemudian hari
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 30, fontWeight: "bold" }}>
        <Text>
          {data.DataPengajuanAlamat.kota
            ?.toLowerCase()
            .replace("kota", "")
            .replace("kabupaten", "")
            .toUpperCase()}
          , {moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
            textAlign: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>PT. BPR Surya Arthaguna Abadi</Text>
            <View style={{ height: 70 }}></View>
            <Text style={{ textDecoration: "underline" }}>
              Nandang Hermawan
            </Text>
            <Text>Direktur</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Debitur</Text>
            <View style={{ height: 70 }}>
              <Text style={{ fontSize: 7, opacity: 60, marginTop: 20 }}>
                Materai 10.000
              </Text>
            </View>
            <Text style={{ textDecoration: "underline" }}>{data.nama}</Text>
            <Text>Nama Penerima Pembiayaan</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Menyetujui</Text>
            <View style={{ height: 70 }}></View>
            <Text style={{ textDecoration: "underline" }}>
              {data.DataPengajuanPasangan.nama_pasangan}
            </Text>
            <Text>Suami/Istri/Ahliwaris</Text>
          </View>
        </View>
      </View>
    </Page>
  );
}
