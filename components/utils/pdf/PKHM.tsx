"use client";

import { Image, Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { DataDataPengajuan } from "../Interfaces";
import moment from "moment";
import { IDRFormat } from "@/components/v1/appUtils";
import { getAngsuran } from "@/components/Utils";
const angkaTerbilang = require("angka-menjadi-terbilang");

export default function PKHM({ data }: { data: DataDataPengajuan }) {
  const angsBulan = getAngsuran(
    data.DataPembiayaan.plafond,
    data.DataPembiayaan.tenor,
    data.DataPembiayaan.mg_bunga,
    data.DataPembiayaan.pembulatan,
    data.jenis_margin,
  ).angsuran;
  const angsSudan = getAngsuran(
    data.DataPembiayaan.plafond,
    data.DataPembiayaan.tenor,
    data.DataPembiayaan.margin_bank,
    1,
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
        style={{
          marginBottom: 10,
          borderBottom: "2px solid black",
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
        }}
      >
        <View>
          <Image src={data.Bank.logo || ""} style={{ width: 80 }} />
        </View>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 14 }}>
            PT. BPR HARTA MULIA
          </Text>
          <Text>Jl. Gajah Mada No. 62</Text>
          <Text>Telp. 0361811236</Text>
          <Text>Tabanan 82113</Text>
        </View>
      </View>
      <View style={{ textAlign: "center", marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>
          PERJANJIAN KREDIT
        </Text>
        <Text>No : {data.nomor_akad}</Text>
      </View>
      <View>
        <Text>Yang bertanda tangan dibawah ini :</Text>
        <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
          <Text style={{ width: 5 }}>I.</Text>
          <View>
            <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
              <Text style={{ width: 100 }}>Nama</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>Nandang Hermawan</Text>
            </View>
            <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
              <Text style={{ width: 100 }}>Jabatan</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>Direktur Pengelola</Text>
            </View>
            <Text>
              berkedudukan di kota Jalan Perum Pondok Permai Lestari Blok G-4 No
              09 Kelurahan Penenjoan Kecamatan Cicalengka, Kabupaten Bandung.
              Dalam hal ini bertindak untuk dan atas nama Pemberi Kuasa, PT. BPR
              Harta Mulia, berdasarkan Surat Kuasa No 022 A/BHM/I/2026
              tertanggal 15 Januari 2026, oleh karenanya berhak dan sah
              mewakilkan PT. BPR Harta Mulia yang berkedudukan di Jalan Gajah
              Mada No 62 Kabupaten Tabanan Provinsi Bali, yang selanjutnya
              disebut “BANK”
            </Text>
          </View>
        </View>
        <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
          <Text>II.</Text>
          <View>
            <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
              <Text style={{ width: 100 }}>Nama</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>{data.nama}</Text>
            </View>
            <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
              <Text style={{ width: 100 }}>NIK</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>{data.nik}</Text>
            </View>
            <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
              <Text style={{ width: 100 }}>Tempat/Tanggal Lahir</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>
                {data.DataPembiayaan.tempat_lahir},{" "}
                {moment(data.DataPembiayaan.tanggal_lahir).format(
                  "DD - MM - YYYY",
                )}
              </Text>
            </View>
            <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
              <Text style={{ width: 100 }}>Pekerjaan</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>{data.pekerjaan_sekarang}</Text>
            </View>
            <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
              <Text style={{ width: 100 }}>Alamat</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text style={{ width: 300 }}>
                {data.DataPengajuanAlamat.alamat} RT{" "}
                {data.DataPengajuanAlamat.rt} RW {data.DataPengajuanAlamat.rw}{" "}
                KELURAHAN {data.DataPengajuanAlamat.kelurahan} KECAMATAN{" "}
                {data.DataPengajuanAlamat.kecamatan}{" "}
                {data.DataPengajuanAlamat.kota}{" "}
                {data.DataPengajuanAlamat.provinsi}{" "}
                {data.DataPengajuanAlamat.kode_pos}
              </Text>
            </View>
            <View>
              <Text>
                Dan untuk tindakan hukum ini telah mendapat persetujuan
                suami/isteri/ahli warisnya :{" "}
              </Text>
            </View>
            <View style={{ display: "flex", gap: 2, flexDirection: "row" }}>
              <Text style={{ width: 100 }}>Nama</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text></Text>
            </View>
            <View style={{ display: "flex", gap: 2, flexDirection: "row" }}>
              <Text style={{ width: 100 }}>NIK</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text></Text>
            </View>
            <View style={{ display: "flex", gap: 2, flexDirection: "row" }}>
              <Text style={{ width: 100 }}>Tempat/Tanggal Lahir</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text></Text>
            </View>
            <View style={{ display: "flex", gap: 2, flexDirection: "row" }}>
              <Text style={{ width: 100 }}>Pekerjaan</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text></Text>
            </View>
            <View
              style={{
                display: "flex",
                gap: 2,
                flexDirection: "row",
                marginBottom: 5,
              }}
            >
              <Text style={{ width: 100 }}>Alamat</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text></Text>
            </View>
            <View style={{ margin: "10px 0px" }}>
              <Text>
                selanjutnya disebut “NASABAH”. Selanjutnya BANK dan NASABAH
                terlebih dahulu menerangkan dengan ini telah sepakat untuk
                mengadakan Perjanjian Kredit (selanjutnya disebut “Perjanjian”)
                dengan syarat-syarat dan ketentuan-ketentuan sebagai berikut:
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}>
            <Text>Pasal 1</Text>
            <Text>FASILITAS KREDIT</Text>
          </View>
          <View>
            <Text>
              BANK dengan ini menyetujui memberikan suatu kredit kepada NASABAH
              dan NASABAH menyetujui untuk menerima fasilitas kredit yang
              disebut Kredit dengan Plafond Kredit sebesar Rp{" "}
              {IDRFormat(data.DataPembiayaan.plafond)} (
              {angkaTerbilang(data.DataPembiayaan.plafond)} rupiah)
            </Text>
          </View>
        </View>

        <View>
          <View style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}>
            <Text>Pasal 2</Text>
            <Text>TUJUAN PENGGUNAAN & JANGKA WAKTU</Text>
          </View>
          <View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>1.</Text>
              <Text style={{ width: 100 }}>Jangka Waktu</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>
                {data.DataPembiayaan.tenor} bulan terhitung sejak tanggal{" "}
                {moment(data.tanggal_cetak_akad).format("DD/MM/YYYY")} sampai
                dengan{" "}
                {moment(data.tanggal_cetak_akad)
                  .add(data.DataPembiayaan.tenor, "month")
                  .format("DD/MM/YYYY")}
              </Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>2.</Text>
              <Text style={{ width: 100 }}>Angsuran Perbulan</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>Rp. {IDRFormat(angsSudan)}</Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>3.</Text>
              <Text style={{ width: 100 }}>Fee Collection</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>Rp. {IDRFormat(angsBulan - angsSudan)}</Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>4.</Text>
              <Text style={{ width: 100 }}>Total Angsuran</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>Rp. {IDRFormat(angsBulan)}</Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>5.</Text>
              <Text style={{ width: 100 }}>Tanggal Bayar</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>25</Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>6.</Text>
              <Text style={{ width: 100 }}>Suku Bunga Anuitas</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>{data.DataPembiayaan.margin_bank}%/tahun</Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>7.</Text>
              <Text style={{ width: 100 }}>Tujuan Penggunaan</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>{data.tujuan_penggunaan1}</Text>
            </View>
          </View>
        </View>

        <View>
          <View style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}>
            <Text>Pasal 3</Text>
            <Text>BIAYA - BIAYA</Text>
          </View>
          <View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>1.</Text>
              <Text>
                Untuk pembebanan angsuran, bunga, provisi, biaya-biaya, denda
                dan segala biaya lainnya yang terhutang berkenaan dengan
                pemberian kredit ini, NASABAH memberi kuasa kepada BANK untuk
                mendebet rekening NASABAH yang ada pada BANK.
              </Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>2.</Text>
              <Text>
                NASABAH berjanji dan dengan ini mengikat diri untuk menanggung
                seluruh biaya yang diperlukan berkenaan dengan pelaksanaan Akad
                ini sepanjang hal ini diberitahukan BANK kepada NASABAH sebelum
                ditandatangani Akad ini dan NASABAH menyatakan persetujuannya.
                Adapun biaya-biaya tersebut adalah sebagai berikut
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                gap: 4,
                marginLeft: 30,
                flexDirection: "row",
              }}
            >
              <Text style={{ width: 20 }}>a.</Text>
              <Text style={{ width: 100 }}>Administrasi</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>Rp. {IDRFormat(admin)}</Text>
            </View>
            <View
              style={{
                display: "flex",
                gap: 4,
                marginLeft: 30,
                flexDirection: "row",
              }}
            >
              <Text style={{ width: 20 }}>b.</Text>
              <Text style={{ width: 100 }}>Provisi</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>Rp. {IDRFormat(data.DataPembiayaan.by_provisi)}</Text>
            </View>
            <View
              style={{
                display: "flex",
                gap: 4,
                marginLeft: 30,
                flexDirection: "row",
              }}
            >
              <Text style={{ width: 20 }}>c.</Text>
              <Text style={{ width: 100 }}>Asuransi Jiwa/Kredit</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>Rp. {IDRFormat(asuransi)}</Text>
            </View>
            <View
              style={{
                display: "flex",
                gap: 4,
                marginLeft: 30,
                flexDirection: "row",
              }}
            >
              <Text style={{ width: 20 }}>d.</Text>
              <Text style={{ width: 100 }}>Pembukaan Tabungan</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>Rp. {IDRFormat(data.DataPembiayaan.by_buka_rekening)}</Text>
            </View>
            <View
              style={{
                display: "flex",
                gap: 4,
                marginLeft: 30,
                flexDirection: "row",
              }}
            >
              <Text style={{ width: 20 }}>e.</Text>
              <Text style={{ width: 100 }}>Materai</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>Rp. {IDRFormat(data.DataPembiayaan.by_materai)}</Text>
            </View>
            <View
              style={{
                display: "flex",
                gap: 4,
                marginLeft: 30,
                flexDirection: "row",
              }}
            >
              <Text style={{ width: 20 }}>f.</Text>
              <Text style={{ width: 100 }}>Biaya Lain-lain</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>
                Rp.{" "}
                {IDRFormat(
                  data.DataPembiayaan.by_mutasi +
                    data.DataPembiayaan.by_epotpen +
                    data.DataPembiayaan.by_flagging +
                    data.DataPembiayaan.by_tatalaksana,
                )}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                gap: 4,
                marginLeft: 30,
                flexDirection: "row",
              }}
            >
              <Text style={{ width: 20 }}></Text>
              <Text style={{ width: 100 }}></Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>_________________________(+)</Text>
            </View>
            <View
              style={{
                display: "flex",
                gap: 4,
                marginLeft: 30,
                flexDirection: "row",
              }}
            >
              <Text style={{ width: 20 }}></Text>
              <Text style={{ width: 100 }}>Total Biaya</Text>
              <Text style={{ width: 5 }}>:</Text>
              <Text>
                Rp.{" "}
                {IDRFormat(
                  data.DataPembiayaan.by_mutasi +
                    data.DataPembiayaan.by_epotpen +
                    data.DataPembiayaan.by_flagging +
                    data.DataPembiayaan.by_materai +
                    data.DataPembiayaan.by_buka_rekening +
                    data.DataPembiayaan.by_provisi +
                    data.DataPembiayaan.by_tatalaksana +
                    admin +
                    asuransi,
                )}
              </Text>
            </View>
            <Text>
              Segala biaya yang timbul sehubungan dengan Akad ini merupakan
              tanggung jawab dan wajib dibayar oleh NASABAH.
            </Text>
          </View>
        </View>

        <View>
          <View style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}>
            <Text>Pasal 4</Text>
            <Text>JAMINAN</Text>
          </View>
          <View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>1.</Text>
              <Text>
                Bahwa guna menjamin lebih lanjut pembayaran kembali kewajiban
                NASABAH kepada BANK seperti yang disebut pada perjanjian ini,
                perubahan dan/atau novasi atau Perjanjian Kredit yang dibuat
                dikemudian hari atau sebab apapun juga, maka NASABAH menyerahkan
                jaminan kepada BANK berupa:
              </Text>
            </View>
            <Text style={{ fontWeight: "bold", marginLeft: 30 }}>
              Surat Keputusan Pensiun nomor : {data.nomor_sk_pensiun} yang
              selanjutnya disebut sebagai JAMINAN
            </Text>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>2.</Text>
              <Text>
                NASABAH wajib menyerahkan dokumen jaminan yang akan disimpan
                oleh BANK berupa:
              </Text>
            </View>
            <View style={{ marginLeft: 30 }}>
              <View>
                <Text>a. Asli surat keputusan pensiun;</Text>
                <Text>b. Salinan Kartu Registrasi Induk Pensiun (KARIP);</Text>
                <Text>
                  c. Asli polis pertanggungan asuransi debitur baik secara
                  kelompok atau individu;
                </Text>
              </View>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>3.</Text>
              <Text>
                NASABAH memberi kuasa kepada BANK untuk melakukan tindakan dan
                perbuatan hukum yang dianggap wajar dan perlu oleh BANK yang
                berkaitan dengan pemberian jaminan tersebut diatas.
              </Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>4.</Text>
              <Text>
                NASABAH dengan ini menyatakan dan menjamin bahwa JAMINAN
                tersebut diatas adalah benar dan milik NASABAH, dan hanya
                NASABAH sajalah yang berhak untuk menyerahkannya sebagai
                Jaminan, tidak sedang diberikan sebagai Jaminan untuk sesuatu
                hutang pada pihak lain dengan jalan bagaimanapun juga, tidak
                dalam keadaan sengketa serta bebas dari sitaan, serta belum
                dijual atau dijanjikan untuk dijual atau dialihkan kepada pihak
                lain dengan cara apapun juga.
              </Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>5.</Text>
              <Text>
                NASABAH menjamin bahwa mengenai hal – hal tersebut pada pasal 4
                ayat 1 diatas, baik sekarang maupun dikemudian hari, BANK tidak
                akan mendapat tuntutan atau gugatan dari pihak manapun juga yang
                menyatakan mempunyai hak terlebih dahulu atau turut mempunyai
                hak atas JAMINAN tersebut diatas.
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}>
            <Text>Pasal 5</Text>
            <Text>KEWAJIBAN NASABAH</Text>
          </View>
          <View>
            <Text>
              Untuk lebih menjamin pelaksanaan Perjanjian ini oleh NASABAH, maka
              NASABAH berkewajiban untuk :
            </Text>
            <View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>1.</Text>
                <Text>
                  Mempergunakan kredit tersebut semata-mata hanya sebagaimana
                  yang tertera dalam pasal 1 Perjanjian ini.
                </Text>
              </View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>2.</Text>
                <Text>
                  NASABAH menyetujui dan wajib mengikat diri untuk menyerahkan
                  semua surat dan dokumen apapun, yang asli serta sah dan
                  membuktikan pemilikan atas segala benda yang dijadikan jaminan
                  termasuk dalam Pasal 4 ayat 1 tersebut di atas kepada BANK
                  guna dipergunakan untuk pelaksanaan pengikatan benda tersebut
                  sebagai jaminan kredit, dan selanjutnya dikuasai oleh BANK
                  sampai dilunasi seluruh jumlah hutangnya.
                </Text>
              </View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>3.</Text>
                <Text>
                  NASABAH Wajib mengikuti Asuransi Jiwa dan atau Asuransi
                  Kredit.
                </Text>
              </View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>4.</Text>
                <Text>
                  NASABAH wajib memperpanjang masa pertanggungan termasuk
                  bilamana masa berakhir, sampai lunasnya fasilitas kredit
                  dibayar kembali oleh NASABAH kepada BANK, apabila NASABAH
                  dengan alasan apapun tidak memperpanjang masa pertanggungan
                  tersebut, maka segala resiko yang terjadi pada agunan tersebut
                  menjadi resiko NASABAH sendiri.
                </Text>
              </View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>5.</Text>
                <Text>
                  NASABAH wajib membayar premi-premi dan lain-lain biaya
                  asuransi tepat pada waktunya dan menyerahkan asli dari setiap
                  polis atau setiap perpanjangannya dan setiap tanda-tanda
                  pembayarannya kepada BANK. BANK dengan ini diberi kuasa oleh
                  NASABAH untuk menutup dan memperpanjang asuransi yang dimaksud
                  di atas, satu dan lain atas biaya NASABAH, yakni bilamana
                  NASABAH lalai menutup atau memperpanjang berlakunya asuransi
                  tersebut
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <View style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}>
            <Text>Pasal 6</Text>
            <Text>KEWAJIBAN NASABAH</Text>
          </View>
          <View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>1.</Text>
              <Text>
                Pembayaran kembali kredit/pinjaman uang tersebut dilakukan
                secara angsuran bulanan, yang terdiri dari angsuran pokok kredit
                dan bunga dalam jumlah tetap. Jumlah-jumlah uang yang terutang
                oleh NASABAH kepada BANK berdasarkan/sesuai dengan
                catatan-catatan dan/atau pembukuan BANK merupakan bukti yang
                mengikat bagi NASABAH mengenai utang NASABAH dibayar lunas,
                untuk itu NASABAH tidak akan menyangkal dan/atau mengajukan
                keberatan-keberatan akan jumlah-jumlah uang yang terhutang oleh
                NASABAH.
              </Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>2.</Text>
              <Text>
                Demikian pula apabila jangka waktu fasilitas kredit telah
                berakhir atau diakhiri sebelum jangka waktu berakhir dan
                ternyata masih terdapat sisa utang sebagai akibat perubahan
                tingkat suku bunga, maka NASABAH wajib menandatangani
                perpanjangan Perjanjian Kredit
              </Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>3.</Text>
              <Text>
                Setiap perubahan besarnya pembayaran bunga pinjaman selalu akan
                diberitahukan secara tertulis oleh BANK kepada NASABAH. Dan
                surat pemberitahuan perubahan suku bunga tersebut, dan/atau
                jadwal angsuran pinjaman pokok dan bunga pinjaman, merupakan
                satu kesatuan dan tidak terpisahkan dari perjanjian ini, serta
                NASABAH tidak akan menyangkal dalam bentuk apapun juga atas
                perubahan suku bunga tersebutnga, maka NASABAH wajib
                menandatangani perpanjangan Perjanjian Kredit
              </Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>4.</Text>
              <Text>
                NASABAH membayar angsuran pokok dan bunga pinjaman melalui
                pemotongan gaji yang dilakukan oleh KANTOR POS berdasarkan surat
                kuasa pemotongan gaji sampai seluruh kewajibanya dinyatakan
                lunas oleh BANK.
              </Text>
            </View>
            <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
              <Text style={{ width: 20 }}>5.</Text>
              <Text>
                Semua pembayaran pada BANK harus dilakukan di tempat kedudukan
                BANK melalui rekening NASABAH atau rekening lain yang ditentukan
                oleh BANK
              </Text>
            </View>
          </View>

          <View>
            <View
              style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}
            >
              <Text>Pasal 7</Text>
              <Text>DENDA KETERLAMBATAN & PINALTY</Text>
            </View>
            <View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>1.</Text>
                <Text>
                  Bahwa atas setiap keterlambatan pembayaran cicilan/angsuran
                  oleh NASABAH kepada BANK, maka NASABAH dikenakan denda menurut
                  ketentuan BANK yang berlaku pada saat ditandatanganinya
                  Perjanjian ini, yaitu sebesar 0,33%,- (nol koma tiga puluh
                  tiga persen) perhari.
                </Text>
              </View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>2.</Text>
                <Text>
                  Pelunasan sebagian atau seluruh pinjaman sebelum jatuh tempo
                  dapat dilakukan NASABAH dengan ketentuan bahwa setiap
                  pelunasan baik sebagian atau seluruh pinjaman tersebut NASABAH
                  dikenakan penalty sebesar 1% (satu perseratus) yang dihitung
                  dari sisa Pokok Pinjaman NASABAH yang tertera pada pembukuan
                  pihak BANK.
                </Text>
              </View>
            </View>
          </View>

          <View>
            <View
              style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}
            >
              <Text>Pasal 8</Text>
              <Text>SYARAT & KETENTUAN</Text>
            </View>
            <View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>1.</Text>
                <View>
                  <Text>
                    BANK berhak untuk sewaktu-waktu menghentikan dan memutuskan
                    perjanjian ini dengan mengesampingkan ketentuan-ketentuan
                    Pasal 1266 dan Pasal 1267 Kitab Undang-Undang Hukum Perdata
                    sehingga tidak diperlukan lagi suatu surat pemberitahuan
                    (Somasi) atau surat peringatan dari juru sita atau surat
                    lain yang serupa itu, dalam hal demikian seluruh hutang
                    NASABAH kepada BANK harus dibayar seketika dan sekaligus,
                    yaitu dalam hal terjadi salah satu kejadian dibawah ini :
                  </Text>
                  <View
                    style={{ display: "flex", gap: 4, flexDirection: "row" }}
                  >
                    <Text style={{ width: 20 }}>a.</Text>
                    <Text>
                      Bilamana NASABAH menggunakan fasilitas pinjaman ini
                      menyimpang dari tujuan penggunaan yang telah disetujui
                      oleh BANK;
                    </Text>
                  </View>
                  <View
                    style={{ display: "flex", gap: 4, flexDirection: "row" }}
                  >
                    <Text style={{ width: 20 }}>b.</Text>
                    <Text>
                      b. Bilamana NASABAH lalai atau tidak memenuhi
                      syarat-syarat atau ketentuan-ketentuan /
                      kewajibankewajiban yang dimaksud dalam Perjanjian ini dan
                      atau perubahan/tambahan dan atau perjanjian-perjanjian
                      pengikatan jaminan;
                    </Text>
                  </View>
                  <View
                    style={{ display: "flex", gap: 4, flexDirection: "row" }}
                  >
                    <Text style={{ width: 20 }}>c.</Text>
                    <Text>
                      Bilamana menurut pertimbangan BANK keadaan keuangan,
                      bonafiditas dan solvabilitas NASABAH mundur sedemikian
                      rupa sehingga NASABAH tidak dapat membayar hutangnya;
                    </Text>
                  </View>
                  <View
                    style={{ display: "flex", gap: 4, flexDirection: "row" }}
                  >
                    <Text style={{ width: 20 }}>d.</Text>
                    <Text>
                      Bilamana NASABAH menanggung hutang pihak ketiga tanpa
                      persetujuan tertulis terlebih dahulu dari BANK;
                    </Text>
                  </View>
                  <View
                    style={{ display: "flex", gap: 4, flexDirection: "row" }}
                  >
                    <Text style={{ width: 20 }}>e.</Text>
                    <Text>
                      Bilamana pernyataan-pernyataan, surat-surat,
                      keterangan-keterangan yang diberikan NASABAH kepada BANK
                      ternyata tidak benar;
                    </Text>
                  </View>
                  <View
                    style={{ display: "flex", gap: 4, flexDirection: "row" }}
                  >
                    <Text style={{ width: 20 }}>f.</Text>
                    <Text>
                      Bilamana menurut pertimbangan BANK ada hal-hal lain yang
                      meragukan pengembalian pelunasan kredit tersebut;
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>2.</Text>
                <Text>
                  Bahwa segala pembukuan/catatan yang dibuat oleh BANK menjadi
                  tanda bukti yang mengikat dan sah atas jumlah hutang NASABAH
                  kepada BANK
                </Text>
              </View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>3.</Text>
                <Text>
                  Apabila NASABAH meninggal dunia, maka semua hutang dan
                  kewajiban NASABAH kepada BANK yang timbul berdasarkan
                  Perjanjian ini berikut semua perubahannya dikemudian dan atau
                  berdasarkan apapun juga tetap merupakan satu kesatuan hutang
                  dari para ahli waris NASABAH atau PENANGGUNG (jika ada).
                </Text>
              </View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>4.</Text>
                <Text>
                  NASABAH dengan ini berjanji, akan tunduk kepada segala
                  ketentuan dan sesuai dengan ketentuan peraturan
                  perundang-undangan termasuk ketentuan peraturan Otoritas Jasa
                  Keuangan.
                </Text>
              </View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>5.</Text>
                <Text>
                  Perjanjian ini telah disesuaikan dengan ketentuan peraturan
                  perundang-undangan termasuk ketentuan peraturan Otoritas Jasa
                  Keuangan.
                </Text>
              </View>
            </View>
          </View>

          <View>
            <View
              style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}
            >
              <Text>Pasal 9</Text>
              <Text>KOMUNIKASI & PEMBERITAHUAN</Text>
            </View>
            <View>
              <Text>
                Setiap pemberitahuan atau komunikasi lainnya yang berhubungan
                dengan Perjanjian Pembiayaan ini dapat dikirimkan ke alamat
                sebagai berikut :
              </Text>
              <View style={{ margin: "5px 0px" }}>
                <Text>KOPERASI JASA FADILLAH AQILA SEJAHTRA</Text>
                <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                  <Text style={{ width: 100 }}>UP</Text>
                  <Text style={{ width: 5 }}>:</Text>
                  <Text style={{ width: 400 }}>
                    Nandang Hermawan (HP : 022 6317 5461)
                  </Text>
                </View>
                <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                  <Text style={{ width: 100 }}>Alamat</Text>
                  <Text style={{ width: 5 }}>:</Text>
                  <Text style={{ width: 400 }}>
                    Jalan Perum Pondok Permai Lestari Blok G-4 No 09, Panenjoan
                    Cicalengka, Bandung
                  </Text>
                </View>
                <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                  <Text style={{ width: 100 }}>Email</Text>
                  <Text style={{ width: 5 }}>:</Text>
                  <Text style={{ width: 400 }}>kopjasfas@kpfi.co.id</Text>
                </View>
              </View>
              <View style={{ margin: "5px 0px" }}>
                <Text>BANK PEREKONOMIAN RAKYAT HARTA MULIA</Text>
                <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                  <Text style={{ width: 100 }}>UP</Text>
                  <Text style={{ width: 5 }}>:</Text>
                  <View style={{ width: 400 }}>
                    <Text>I Made Juniada Dwi Negara (HP : 0822 3769 8979)</Text>
                    <Text>I Putu Teguh Santosa (HP : 0812 3650 721)</Text>
                  </View>
                </View>
                <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                  <Text style={{ width: 100 }}>Alamat</Text>
                  <Text style={{ width: 5 }}>:</Text>
                  <Text style={{ width: 400 }}>
                    JL Gajah Mada No 62 Tabanan
                  </Text>
                </View>
                <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                  <Text style={{ width: 100 }}>Telp</Text>
                  <Text style={{ width: 5 }}>:</Text>
                  <Text style={{ width: 400 }}>0361 811236</Text>
                </View>
                <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                  <Text style={{ width: 100 }}>Email</Text>
                  <Text style={{ width: 5 }}>:</Text>
                  <Text style={{ width: 400 }}>bprhartamulia@gmail.com</Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            <View
              style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}
            >
              <Text>Pasal 10</Text>
              <Text>DOMISILI HUKUM</Text>
            </View>
            <View>
              <Text>
                Segala perselisihan dan perbedaan pendapat yang mungkin timbul
                di antara Para Pihak dalam melaksanakan Perjanjian ini, akan
                diselesaikan terlebih dahulu secara musyawarah untuk mencapai
                mufakat. Namun apabila tidak berhasil mencapai mufakat, maka
                Para Pihak sepakat akan menyelesaikan perselisihan tersebut
                melalui Pengadilan. Para Pihak sepakat memilih tempat kedudukan
                hukum yang tetap dan seumumnya di Kantor Kepaniteraan Pengadilan
                Negeri Tabanan, namun tidak mengurangi hak BANK untuk mengajukan
                tuntutan hukum kepada DEBITUR untuk mengajukan gugatan atau
                memohon pelaksanaan eksekusi jaminan berdasarkan Perjanjian ini
                melalui pengadilan lain di dalam wilayah negara Republik
                Indonesia.
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}
            >
              <Text>Pasal 11</Text>
              <Text>KEADAAN MEMAKSA (FORCE MAJEURE)</Text>
            </View>
            <View>
              <Text>
                Terjadinya peristiwa yang diluar kekuasaan kemampuan PT. BPR
                Harta Mulia (Force Majeure atau Overmacht) antara lain keadaan
                yang diakibatkan bencana alam dan non bencana alam seperti
                keadaan krisis atau kemacetan likuiditas sebagai akibat dari
                perubahan kebijakan pemerintah dibidang moneter dan fiskal atau
                telah sesuai dengan unsur-unsur keadaan memaksa (Force Majeure)
                dan peraturan tentang keadaan memaksa (Force Majeure) yakni
                pasal 1244 dan pasal 1245 Kitab Undang-Undang Hukum Perdata
                (KUHP), dimana peraturan dimaksud tersebut terlebih dahulu harus
                diumumkan pemerintah (Regulator) secara resmi.
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}
            >
              <Text>Pasal 12</Text>
              <Text>LAIN - LAIN</Text>
            </View>
            <View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>1.</Text>
                <Text>
                  Sebelum Akad ini ditandatangani oleh NASABAH, NASABAH mengakui
                  dengan sebenarnya, bahwa NASABAH telah membaca dengan cermat
                  atau dibacakan kepada NASABAH, sehingga oleh karena itu
                  NASABAH memahami sepenuhnya segala yang akan menjadi akibat
                  hukum setelah NASABAH menandatangani Perjanjian Pembiayaan
                  ini.
                </Text>
              </View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>2.</Text>
                <Text>
                  Apabila ada hal-hal yang belum diatur atau belum cukup diatur
                  dalam Perjanjian Pembiayaan ini, maka NASABAH dan BANK akan
                  mengaturnya Bersama secara musyawarah untuk mufakat dalam
                  suatu Addendum.
                </Text>
              </View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>3.</Text>
                <Text>
                  Mengenai Perjanjian ini dan segala dokumen yang berhubungan
                  dan yang timbul akibat Perjanjian ini, termasuk namun tidak
                  terbatas pada perjanjian-perjanjian jaminan, ditafsirkan dan
                  tunduk pada ketentuan hukum Negara Republik Indonesia.
                </Text>
              </View>
              <View style={{ display: "flex", gap: 4, flexDirection: "row" }}>
                <Text style={{ width: 20 }}>4.</Text>
                <Text>
                  Perjanjian ini dapat diubah atau diperbaharui dengan syarat
                  adanya persetujuan dari Para Pihak terlebih dahulu dan akan
                  dibuatkan perubahan perjanjian atau addendum yang menjadi satu
                  kesatuan dan tidak terpisahkan dari Perjanjian ini.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text>
          {data.User.UnitCabang.name},
          {moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")}
        </Text>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            textAlign: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>PT. BPR HARTA MULIA</Text>
            <View style={{ height: 95 }}></View>
            <View
              style={{ width: "100%", borderBottom: "1px solid #eee" }}
            ></View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>Debitur</Text>
            <View style={{ height: 80 }}>
              <Text style={{ fontSize: 8, opacity: 0.6, marginTop: 20 }}>
                Materai Rp. 10.000
              </Text>
            </View>
            <Text style={{ borderBottom: "1px solid #eee" }}>{data.nama}</Text>
            <Text>Penerima Pembiayaan</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>Menyetujui</Text>
            <View style={{ height: 80 }}></View>
            <View
              style={{
                width: "100%",
                borderBottom: "1px solid #eee",
                height: 12,
              }}
            ></View>
            <Text>Suami/Istri/Ahli Waris</Text>
          </View>
        </View>
      </View>
    </Page>
  );
}
