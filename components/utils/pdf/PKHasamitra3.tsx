"use client";

import { Page, Text, View } from "@react-pdf/renderer";
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
          Eva Dajar Nurhasanah dalam jabatannya selaku Ketua KOPERASI JASA
          FADILLAH AQILA SEJAHTRA, berdasarkan Perjanjian Kerjasama No.
          027/FAS/PKS/II/2026 dan No. 023/BPR-HM-JB/PKS/II/2026. tanggal
          …………………………………………………… antara KOPERASI JASA FADILLAH AQILA SEJAHTRA dan
          PT. BPR HASAMITRA JAWA BARAT dan Surat Kuasa Nomor
          15/BPR-HMJB/Dir/0226 tanggal 12 Februari 2026, berwenang bertindak
          untuk dan atas nama PT. BPR HASAMITRA JAWA BARAT, berkedudukan di
          Depok. (Selanjutnya disebut {["Kreditur"]}
          ).
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
            terhitung sejak tanggal{" "}
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
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>3.</Text>
          <Text style={{ flex: 1 }}>
            Pembayaran angsuran dilakukan dalam {data.DataPembiayaan.tenor} kali
            angsuran yang harus dibayar tiap tanggal 25 dan harus sudah lunas
            selambat- lambatnya tanggal 25
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>4.</Text>
          <Text style={{ flex: 1 }}>
            Denda keterlambatan pembayaran angsuran sebesar 4.00% perbulan dan
            harus dibayar dengan seketika dan sekaligus lunas bersamaan dengan
            pembayaran angsuran tertunggak.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>5.</Text>
          <Text style={{ flex: 1 }}>
            Untuk pelunasan dipercepat dikenakan denda sebesar 10% dari
            outstanding kredit (dikecualikan untuk Top Up kredit tidak dikenakan
            denda/penalty)
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>6.</Text>
          <Text style={{ flex: 1 }}>
            Debitur tidak diperkenankan melakukan pelunasan dipercepat sampai
            dengan jangka waktu kredit 1 tahun kecuali Top Up kredit,
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>7.</Text>
          <Text style={{ flex: 1 }}>
            Apabila pembayaran kewajiban yang harus dilakukan Debitur kepada
            Kreditur jatuh tempo bukan pada hari kerja, maka pembayaran harus
            dilakukan 1 (Satu) hari kerja sebelumnya.
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 3</Text>
        <Text
          style={{ marginBottom: 10, fontWeight: "bold", textAlign: "center" }}
        >
          Penarikan Fasilitas Kredit dan Pengakuan Hutang
        </Text>

        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>1.</Text>
          <Text style={{ flex: 1 }}>
            Penarikan fasilitas kredit yang diberikan Kreditur kepada Debitur
            dicairkan sekaligus, yaitu sebesar Rp.{" "}
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
            )}{" "}
            (
            {angkaTerbilang(
              data.DataPembiayaan.plafond -
                (admin +
                  asuransi +
                  data.DataPembiayaan.by_tatalaksana +
                  data.DataPembiayaan.by_buka_rekening +
                  data.DataPembiayaan.by_mutasi +
                  data.DataPembiayaan.by_materai +
                  data.DataPembiayaan.by_epotpen +
                  data.DataPembiayaan.by_flagging),
            )}{" "}
            rupiah), jumlah tersebut setelah dikurangi dengan angsuran dibayar
            dimuka dan biaya- biaya yang terkait dengan fasilitas kredit.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>2.</Text>
          <Text style={{ flex: 1 }}>
            Debitur menyetujui bahwa Dropping fasilitas kredit akan
            ditransaksikan paling lambat 5 (lima) hari kerja sejak Perjanjian
            Kredit ini ditandatangani.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>3.</Text>
          <Text style={{ flex: 1 }}>
            Penandatanganan Perjanjian ini merupakan tanda penerimaan yang sah
            atas seluruh jumlah hutang pokok sebagaimana dimaksud pasal 1 ayat 1
            huruf a, Perjanjian dan Debitur dengan ini mengaku benar-benar
            secara sah telah berhutang kepada Kreditur atas jumlah hutang pokok
            tersebut demikian berikut bunga, denda dan biaya-biaya lain serta
            lain-lain jumlah yang wajib dibayar oleh Debitur kepada Kreditur
            berdasarkan Perjanjian ini.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>4.</Text>
          <View style={{ flex: 1 }}>
            <Text>
              Debitur menyetujui bahwa jumlah yang terhutang oleh Debitur kepada
              Kreditur berdasarkan Perjanjian ini pada waktu-waktu tertentu akan
              terbukti dari:
            </Text>
            <View style={{ marginLeft: 10 }}>
              <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Text style={{ width: 10 }}>a.</Text>
                <Text style={{ flex: 1 }}>
                  Rekening Debitur yang dipegang dan dipelihara oleh Kreditur
                  dan/atau
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Text style={{ width: 10 }}>b.</Text>
                <Text style={{ flex: 1 }}>
                  Buku-buku, catatan-catatan yang dipegang dan dipelihara oleh
                  Kreditur; dan/atau
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Text style={{ width: 10 }}>c.</Text>
                <Text style={{ flex: 1 }}>
                  Surat-surat dan Dokumen-dokumen lain yang dikeluarkan oleh
                  Kreditur; dan/atau
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Text style={{ width: 10 }}>d.</Text>
                <Text style={{ flex: 1 }}>
                  Salinan/Kutipan rekening Debitur.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 4</Text>
        <Text
          style={{ marginBottom: 10, fontWeight: "bold", textAlign: "center" }}
        >
          Peristiwa Cidera Janji
        </Text>
        <Text>
          Dengan tetap memperhatikan ketentuan Pasal 2 ayat 1 Perjanjian ini,
          Kreditur berhak untuk sewaktu-waktu dengan mengesampingkan ketentuan
          Pasal 1266 kitab Undang-Undang Hukum Perdata, khususnya ketentuan yang
          mengatur keharusan untuk mengajukan permohonan pembatalan perjanjian
          melaluli pengadilan, sehingga tidak diperlukan suatu pemberitahuan
          (somasi) atau surat lain yang serupa dengan itu serta surat peringatan
          dari juru sita, menagih hutang hutang Debitur berdasarkan Perjanjian
          ini ata sisanya, berikut bunga-bunga, denda-denda dan biaya lain yang
          timbul berdasarkan Perjanjian dan wajib dibayar oleh Debitur dengan
          seketika dan sekaligus lunas, apabila terjadi salah satu atau lebih
          kejadiankejadian tersebut dibawah ini:
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>a.</Text>
          <Text style={{ flex: 1 }}>
            Debitur tidak atau lalai membayar lunas pada waktunya kepada
            Kreditur baik angsuran pokok, bunga-bunga, denda-denda dan biaya
            lainnya yang sudah jatuh tempo berdasarkan Perjanjian;
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>b.</Text>
          <Text style={{ flex: 1 }}>
            Debitur meninggal dunia atau berada dibawah pengampunan;
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>c.</Text>
          <Text style={{ flex: 1 }}>
            Debitur dinyatak pailit, diberikan penundaan membayar hutang-hutang
            (Surseance van betaling) atau bilamana Debitur dan/atau orang/pihak
            lain mengajukan permohonan kepada instansi yang berwenang agar
            Debitur dinyatakan dalam keadaan pailit;
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>d.</Text>
          <Text style={{ flex: 1 }}>
            Kekayaan Debitur baik sebagian maupun seluruhnya disita dan
            dinyatakan dalam sitaan oleh instansi yang berwenang;
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>e.</Text>
          <Text style={{ flex: 1 }}>
            Debitur lalai atau tidak memenuhi syarat-syarat dan
            ketentuan/kewajiban dalam Perjanjian ini dan setiap perubahannya;
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>f.</Text>
          <Text style={{ flex: 1 }}>
            Debitur lalai atau tidak memenuhi kewajibannya kepada pihak lain
            berdasarkan Perjanjian dengan pihak lain sehingga Debitur dinyatakan
            cidera janji;
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>g.</Text>
          <Text style={{ flex: 1 }}>
            Debitur tersangkut dalam suatu perkara hukum yang dapat menghalangi
            Debitur memenuhi kewajiban berdasarkan Perjanjian ini sebagaimana
            mestinya;
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>h.</Text>
          <Text style={{ flex: 1 }}>
            Apabila ternyata suatu pernyataan-pernyataan atau dokumen-dokumen
            atau keterangan-keterangan yang diberikan Debitur kepada Kreditur
            ternyata tidak benar atau tidak sesuai dengan kenyataan;
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 5</Text>
        <Text
          style={{ marginBottom: 10, fontWeight: "bold", textAlign: "center" }}
        >
          Jaminan
        </Text>
        <Text>
          Untuk menjamin pembayaran hutang pokok, bunga dan pembayaran lainnya
          sebagaimana tercantum dalam Perjanjian ini, Debitur setuju memberikan
          jaminan kepada Kreditur berupa uang pensiun Debitur setiap bulan, dan
          oleh karenanya Debitur dengan ini telah menyampaikan kepada Kreditur
          dokumen jaminan berupa:
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>a.</Text>
          <Text style={{ flex: 1 }}>
            Menyerahkan Asli Surat Keputusan (SK) Pensiunan Nomor :{" "}
            {data.nomor_sk_pensiun} atas nama {data.nama_skep}.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>b.</Text>
          <Text style={{ flex: 1 }}>
            Menyerahkan Asli Surat Pernyataan Kuasa Potong Gaji dari Debitur
            atas nama {data.nama}.
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 6</Text>
        <Text
          style={{ marginBottom: 10, fontWeight: "bold", textAlign: "center" }}
        >
          Pernyataan dan Jaminan
        </Text>
        <Text>
          Debitur dengan ini menyatakan dan menjamin kepada Kreditur hal-hal
          sebagai berikut:
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>a.</Text>
          <Text style={{ flex: 1 }}>
            Debitur mempunyai wewenang untuk menandatangani Perjanjian ini.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>b.</Text>
          <Text style={{ flex: 1 }}>
            Debitur dengan ini menyatakan dan menjamin bahwa Perjanjian ini
            tidak bertentangan dengan perjanjian apapun yang dibuat oleh Debitur
            kepada pihak ketiga.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>c.</Text>
          <Text style={{ flex: 1 }}>
            Debitur dengan ini menyatakan dan menjamin bahwa pada waktu ini
            tidak ada sesuatu hal atau peristiwa yang merupakan suatu kejadian
            kelalaian/pelanggaran sebagaimana dimaksudkan dalam pasal 4
            Perjanjian ini.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>d.</Text>
          <Text style={{ flex: 1 }}>
            Debitur dengan ini menyatakan dan menjamin akan mengganti segala
            kerugian yang diderita oleh kreditur sehubungan dengan adanya
            tuntutan atau gugatan dari pihak ketiga yang diakibatkan oleh karena
            adanya keterangan/pernyataan yang tidak benar yang disampaikan
            Debitur kepada Kreditur.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>e.</Text>
          <Text style={{ flex: 1 }}>
            Debitur dengan ini menyatakan dan menjamin bahwa apa yang dijaminkan
            dalam Perjanjian ini adalah benar merupakan hak Debitur sendiri dan
            tidak sedang terikat sebagai jaminan dan tidak akan dialihkan haknya
            pada pihak lain sampai dengan seluruh hutang Debitur dinyatakan
            lunas oleh Kreditur.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>f.</Text>
          <Text style={{ flex: 1 }}>
            Debitur dengan ini menyatakan bersedia untuk menyerahkan barang
            bergerak maupun tidak bergerak yang ada maupun yang akan ada kepada
            Kreditur untuk pelunasan hutang Debitur, berikut bunga-bunga,
            denda-denda dan biaya lain yang timbul berdasarkan Perjanjian ini,
            apabila terjadi peristiwa cidera janji sebagaimana dimaksud Pasal 4
            Perjanjian ini.
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 7</Text>
        <Text
          style={{ marginBottom: 10, fontWeight: "bold", textAlign: "center" }}
        >
          Pemberian Kuasa
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>1.</Text>
          <Text style={{ flex: 1 }}>
            Debitur dengan ini memberikan kuasa kepada Kreditur untuk mendebet
            dan menggunakan dana yang tersimpan pada Kreditur baik dari rekening
            tabungan/deposito milik Debitur guna pembayaran angsuran pokok
            maupun bunga, denda, premi asuransi, biaya-biaya lainnya yang
            mungkin timbul sehubungan dengan pemberian fasilitas kredit ini dan
            segala yang terhutang berkenaan dengan pemberian fasilitas kredit
            berdasarkan Perjanjian ini.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>2.</Text>
          <Text style={{ flex: 1 }}>
            Kreditur diberi kuasa oleh Debitur untuk menutup asuransi jiwa dan
            biaya premi menjadi beban Debitur, apabila Debitur meninggal dunia,
            maka uang klaim asuransi untuk menjamin pelunasan seluruh kewajiban
            Debitur.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>3.</Text>
          <Text style={{ flex: 1 }}>
            Kuasa-kuasa yang diberikan Debitur kepada Kreditur berdasarkan
            Perjanjian ini kata demi kata harus telah dianggap telah termaktub
            dalam Perjanjian ini dan merupakan satu kesatuan serta bagian yang
            tidak terpisahkan dengan Perjanjian ini yang tidak dibuat tanpa
            adanya kuasa tersebut, dan oleh karenanya kuasa-kuasa tersebut tidak
            akan dicabut dan tidak akan berakhir oleh karena sebab apapun juga,
            termasuk oleh sebab-sebab berakhirnya kuasa sebagaimana dimaksud
            dalam pasal 1813, 1814 dan 1816 kitab Undang-Undang Hukum Perdata.
            Namun demikian, apabila ternyata terdapat suatu ketentuan hukum yang
            mengharuskan adanya suatu kuasa khusus untuk melaksanakan hak
            Kreditur berdasarkan Perjanjian, maka Debitur atas permintaan
            pertama dari Kreditur wajib untuk memberikan kuasa khusus dimaksud
            kepada Kreditur .
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 8</Text>
        <Text
          style={{ marginBottom: 10, fontWeight: "bold", textAlign: "center" }}
        >
          Lain - lain
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>1.</Text>
          <Text style={{ flex: 1 }}>
            Debitur menyetujui dan dengan ini memberi kuasa kepada Kreditur
            untuk sewaktu-waktu menjual, mengalihkan, menjaminkan atau dengan
            cara apapun memindahkan piutang/tagihan-tagihan Kreditur kepada
            Debitur berdasarkan Perjanjian ini kepada pihak ketiga lainnya
            dengan siapa Kreditur membuat perjanjian kerja sama berikut semua
            hak, kekuasaan-kekuasaan dan jaminan-jaminan yang ada pada Kreditur
            berdasarkan Perjanjian ini atau Perjanjian Jaminan, dengan
            syarat-syarat dan ketentuan ketentuan yang dianggap baik oleh
            Kreditur.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>2.</Text>
          <Text style={{ flex: 1 }}>
            Debitur tidak diperkenankan untuk mengalihkan hak-hak dan
            kewajibannya berdasarkan Perjanjian ini kepada pihak manapun tanpa
            persetujuan tertulis terlebih dahulu dari Kreditur.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>3.</Text>
          <Text style={{ flex: 1 }}>
            Selama fasilitas kredit belum lunas, Debitur tidak diperkenankan
            untuk menerima pinjaman dari bank/pihak ketiga lainnya tanpa
            persetujuan dari Kreditur.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>4.</Text>
          <Text style={{ flex: 1 }}>
            Selama fasilitas kredit belum lunas, Debitur tidak diperkenankan
            untuk menunda pengambilan gajinya setiap bulan untuk memenuhi
            pembayaran angsuran kepada Kreditur dan mengalihkan lokasi
            pembayaran uang pensiun Debitur ketempat lain selain{" "}
            {data.Bank.name} yang telah menerima surat kuasa pemotongan uang
            pensiun Debitur.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>5.</Text>
          <Text style={{ flex: 1 }}>
            Debitur wajib mengizinkan Kreditur untuk melakukan pemeriksaan atas
            kekayaan dan/usaha Debitur serta dan memeriksa pembukuan, catatan
            catatan dan administrasi Debitur dan membuat salinan-salinan atau
            foto copy atau catatan-catatan dari padanya.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>6.</Text>
          <Text style={{ flex: 1 }}>
            Seluruh lampiran-lampiran Perjanjian ini termasuk namun tidak
            terbatas pada Perjanjian Kerjasama, surat kuasa pemotongan uang
            pensiun, merupakan suatu kesatuan dan bagian yang tidak terpisahkan
            dengan Perjanjian.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>7.</Text>
          <Text style={{ flex: 1 }}>
            Hal-hal yang belum diatur dalam Perjanjian ini serta perubahan
            dan/atau penambahan akan ditentukan kemudian antara para pihak serta
            dituangkan secara tertulis dalam suatu Addendum yang ditandatangani
            bersama oleh para pihak serta merupakan bagian dan satu kesatuan
            yang tidak dapat dipisahkan dan mempunyai kekuatan hukum yang sama
            dengan Perjanjian ini.
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>PASAL 9</Text>
        <Text
          style={{ marginBottom: 10, fontWeight: "bold", textAlign: "center" }}
        >
          Hukum Yang Berlaku Dan Domisili Hukum
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>1.</Text>
          <Text style={{ flex: 1 }}>
            Perjanjian ini tunduk pada dan karenanya harus ditafsirkan
            berdasarkan hukum Republik Indonesia.
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 10 }}>2.</Text>
          <Text style={{ flex: 1 }}>
            Untuk pelaksanaan Perjanjian ini dan segala akibatnya para pihak
            memilih tempat tinggal yang tetap dan tidak berubah di kantor
            Panitera Pengadilan Negeri Surabaya di Surabaya, dengan tidak
            mengurangi hak Kreditur untuk memohon pelaksanaan/eksekusi dari
            Perjanjian ini atau mengajukan tuntutan hukum terhadap Debitur
            melalui Pengadilan-Pengadilan Negeri lainnya dalam wilayah Republik
            Indonesia.
          </Text>
        </View>
      </View>
      <Text>
        Demikian Perjanjian ini dibuat dan ditandatangani oleh para pihak pada
        hari ini dan tanggal sebagaimana disebutkan diawal Perjanjian ini.
      </Text>

      <View style={{ marginTop: 20 }}>
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
            <Text>KOPERASI JASA FADILLAH AQILA SEJAHTRA</Text>
            <View style={{ height: 70 }}></View>
            <Text style={{ textDecoration: "underline" }}>
              EVA FAJAR NURHASANAH
            </Text>
            <Text>Ketua </Text>
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
