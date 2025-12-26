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
  const byProvisi =
    data.DataPembiayaan.plafond * (data.DataPembiayaan.by_provisi / 100);
  const byAsuransi =
    data.DataPembiayaan.plafond * (data.DataPembiayaan.by_asuransi / 100);
  const byLainLain =
    data.DataPembiayaan.by_flagging +
    data.DataPembiayaan.by_epotpen +
    data.DataPembiayaan.by_tatalaksana +
    data.DataPembiayaan.by_mutasi;

  const angsuranBulanan =
    data.jenis_margin === "FLAT"
      ? ceiling(
          parseInt(
            getAngsuranPerBulan(
              data.DataPembiayaan.mg_bunga,
              data.DataPembiayaan.tenor,
              data.DataPembiayaan.plafond,
              false,
              true
            )
          ),
          data.DataPembiayaan.pembulatan
        ).toString()
      : ceiling(
          parseInt(
            getAngsuranPerBulan(
              data.DataPembiayaan.mg_bunga,
              data.DataPembiayaan.tenor,
              data.DataPembiayaan.plafond,
              false,
              false,
              data.Bank.kode,
              data.DataPembiayaan.pembulatanKhusus
            )
          ),
          data.DataPembiayaan.pembulatan
        ).toString();
  const angsuranPokok = ceiling(
    data.DataPembiayaan.plafond / data.DataPembiayaan.tenor,
    data.DataPembiayaan.pembulatan
  ).toString();
  const angsuranBank =
    data.jenis_margin === "FLAT"
      ? ceiling(
          parseInt(
            getAngsuranPerBulan(
              data.DataPembiayaan.margin_bank,
              data.DataPembiayaan.tenor,
              data.DataPembiayaan.plafond,
              false,
              true
            )
          ),
          data.DataPembiayaan.pembulatan
        ).toString()
      : ceiling(
          parseInt(
            getAngsuranPerBulan(
              data.DataPembiayaan.margin_bank,
              data.DataPembiayaan.tenor,
              data.DataPembiayaan.plafond,
              false,
              false,
              data.Bank.kode,
              data.DataPembiayaan.pembulatanKhusus
            )
          ),
          data.DataPembiayaan.pembulatan
        ).toString();

  const colfee = (
    parseInt(angsuranBulanan as string) - parseInt(angsuranBank as string)
  ).toFixed(0);

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
            marginBottom: 15,
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
              marginTop: 12,
            }}
          >
            <Text style={{ fontSize: 10 }}>PERJANJIAN KREDIT</Text>
            <Text style={{ fontSize: 8 }}>
              NO AKAD : {data.nomor_akad ? data.nomor_akad : "             "}
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
              <Text>Nandang Hermawan</Text>
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
              <Text>Direktur Pengelola</Text>
            </View>
            <View
              style={{
                textAlign: "justify",
                lineHeight: 1.2,
                width: 490,
              }}
            >
              <Text>
                Dalam hal ini bertindak untuk dan atas nama Pemberi Kuasa, PT.
                BPR Bekasi Binatanjung Makmur, berdasarkan Surat Kuasa
                tertanggal 18 Desember 2025, oleh karenanya berhak dan sah
                mewakilkan PT. BPR Bekasi Binatanjung Makmur yang berkedudukan
                di Kota Bekasi, yang selanjutnya disebut{" "}
                <View style={{ fontWeight: "bold" }}>
                  <Text style={{ fontWeight: "bold" }}>{'"BANK"'}</Text>
                </View>
                .
              </Text>
            </View>
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          <Text style={{ padding: "5px 0" }}>II. </Text>
          <View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Nama</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>{data.DataPembiayaan.name}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>NIK</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>{data.nik}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Tempat/Tanggal Lahir</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>
                {data.DataPembiayaan.tempat_lahir}
                {", "}
                {data.DataPembiayaan.tanggal_lahir}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Pekerjaan</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>{data.pekerjaan_sekarang}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Alamat</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text style={{ width: 300 }}>
                {data.DataPengajuanAlamat.alamat} {data.DataPengajuanAlamat.rt}/
                {data.DataPengajuanAlamat.rw},{" "}
                {data.DataPengajuanAlamat.kelurahan}{" "}
                {data.DataPengajuanAlamat.kecamatan},{" "}
                {data.DataPengajuanAlamat.kota}{" "}
                {data.DataPengajuanAlamat.provinsi}{" "}
                {data.DataPengajuanAlamat.kode_pos}
              </Text>
            </View>

            {/* Data Istri */}
            <Text style={{ marginTop: 5 }}>
              Dan untuk tindakan hukum ini telah mendapat persetujuan
              suami/isteri/ahli warisnya :
            </Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Nama</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>{data.DataPengajuanPasangan.nama_pasangan}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>NIK</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>{data.DataPengajuanPasangan.nik_pasangan}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Tempat/Tanggal Lahir</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>
                {data.DataPengajuanPasangan.tempat_lahir_pasangan}{" "}
                {data.DataPengajuanPasangan.tanggal_lahir_pasangan}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Pekerjaan</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>{data.DataPengajuanPasangan.pekerjaan_pasangan}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Alamat</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text style={{ width: 300 }}>
                {data.DataPengajuanPasangan.alamat_pasangan}
              </Text>
            </View>
            <View style={{ margin: "8px 0" }}>
              <Text>
                Selanjutnya disebut{" "}
                <View style={{ fontWeight: "bold" }}>
                  <Text style={{ fontWeight: "bold" }}>{'"NASABAH"'}</Text>
                </View>
              </Text>
            </View>
          </View>
        </View>
        <View style={{ width: 490, lineHeight: 1.2 }}>
          <Text>
            Selanjutnya BANK dan NASABAH terlebih dahulu menerangkan dengan ini
            telah sepakat untuk mengadakan Perjanjian Kredit (selanjutnya
            disebut “Perjanjian”) dengan syarat-syarat dan ketentuan-ketentuan
            sebagai berikut:
          </Text>
          <View
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 5,
              marginBottom: 3,
              padding: "3px 0",
            }}
          >
            <Text>Pasal 1</Text>
            <Text>FASILITAS KREDIT</Text>
          </View>
          <View>
            <Text>
              BANK dengan ini menyetujui memberikan suatu kredit kepada NASABAH
              dan NASABAH menyetujui untuk menerima fasilitas kredit yang
              disebut Kredit dengan Plafond Kredit sebesar{" "}
              <Text style={{ fontWeight: "bold" }}>
                Rp. {formatNumber(data.DataPembiayaan.plafond.toFixed(0))} (
                {angkaTerbilang(data.DataPembiayaan.plafond)
                  .split(" ")
                  .map(function (word: string) {
                    return word.charAt(0).toUpperCase().concat(word.substr(1));
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
              marginTop: 5,
              marginBottom: 3,
              padding: "3px 0",
            }}
          >
            <Text>Pasal 2</Text>
            <Text>TUJUAN PENGGUNAAN & JANGKA WAKTU</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              marginTop: 7,
            }}
          >
            <Text style={{ width: 20 }}>2.1</Text>
            <Text style={{ width: 100, fontWeight: "bold" }}>Jangka Waktu</Text>
            <Text style={{ width: 20 }}>:</Text>
            <View>
              <Text>
                <Text style={{ fontWeight: "bold" }}>
                  {data.DataPembiayaan.tenor}
                </Text>{" "}
                bulan sejak .......................... sampai dengan
                ..........................
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
                {formatNumber(angsuranBulanan)}
              </Text>
            </View>
          </View>
          <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
            <Text style={{ width: 20 }}>2.3</Text>
            <Text style={{ width: 100 }}>Fee Collection</Text>
            <Text style={{ width: 20 }}>:</Text>
            <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
              <Text style={{ width: 50 }}>Rp. </Text>
              <Text>{formatNumber(colfee)}</Text>
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
              <Text>25</Text>
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
              {data.tujuan_penggunaan2 && data.tujuan_penggunaan2 !== "-" && (
                <Text>- {data.tujuan_penggunaan2}</Text>
              )}
            </View>
          </View>
          <View
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 5,
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
              width: 490,
              flexDirection: "row",
            }}
          >
            <Text style={{ width: 20 }}>3.1</Text>
            <View>
              <Text>
                Untuk pembebanan angsuran, bunga, provisi, biaya-biaya, denda
                dan segala biaya lainnya yang terhutang berkenaan dengan
                pemberian kredit ini, NASABAH memberi kuasa kepada BANK untuk
                mendebet rekening NASABAH yang ada pada BANK.
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              gap: 5,
              width: 490,
              flexDirection: "row",
            }}
          >
            <Text style={{ width: 20 }}>3.2</Text>
            <View>
              <Text>
                NASABAH berjanji dan dengan ini mengikat diri untuk menanggung
                seluruh biaya yang diperlukan berkenaan dengan pelaksanaan Akad
                ini sepanjang hal ini diberitahukan BANK kepada NASABAH sebelum
                ditandatangani Akad ini dan NASABAH menyatakan persetujuannya.
                Adapun biaya-biaya tersebut adalah sebagai berikut :
              </Text>
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
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
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <Text>a. </Text>
                <Text style={{ width: 130 }}>Provisi</Text>
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
                  <Text>{formatNumber(byProvisi.toFixed(0))}</Text>
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
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
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
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
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
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
                    {formatNumber(data.DataPembiayaan.by_materai.toFixed(0))}
                  </Text>
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
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
                  <Text>{formatNumber(byLainLain.toFixed(0))}</Text>
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
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
                        byProvisi +
                        byAsuransi +
                        byLainLain +
                        data.DataPembiayaan.by_buka_rekening +
                        data.DataPembiayaan.by_materai
                      ).toFixed(0)
                    )}
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 5 }}>
                <Text>
                  Segala biaya yang timbul sehubungan dengan Akad ini merupakan
                  tanggung jawab dan wajib dibayar oleh{" "}
                  <Text style={{ fontWeight: "bold" }}>NASABAH.</Text>
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
              width: 490,
              flexDirection: "row",
            }}
          >
            <Text style={{ width: 20 }}>4.1</Text>
            <View style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <Text>
                Bahwa guna menjamin lebih lanjut pembayaran kembali kewajiban
                NASABAH kepada BANK seperti yang disebut pada perjanjian ini,
                perubahan dan/atau novasi atau Perjanjian Kredit yang dibuat
                dikemudian hari atau sebab apapun juga, maka NASABAH menyerahkan
                jaminan kepada BANK berupa :
              </Text>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 10 }}
                >
                  <Text>1.</Text>
                  <Text>
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
                  <Text>2.</Text>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>
                      Salinan Kartu Identitas Pensiun
                      (KARIP/E-KARIP/IDPB/BUKUASABRI/SKPP) dengan nomor pensiun
                      :{data.nopen}
                    </Text>{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      (a.n {data.DataPembiayaan.name})
                    </Text>
                  </Text>
                </View>
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 10 }}
                >
                  <Text>3.</Text>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>
                      Salinan surat kuasa pemotongan gaji (Plagging)
                    </Text>
                  </Text>
                </View>
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 10 }}
                >
                  <Text>4.</Text>
                  Asli{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    Polis Individu yang tercover oleh Asuransi.
                  </Text>
                </View>
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 10 }}
                >
                  <Text></Text>
                  <Text>yang selanjutnya disebut sebagai JAMINAN.</Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              gap: 5,
              width: 490,
              flexDirection: "row",
            }}
          >
            <Text style={{ width: 20 }}>4.2</Text>
            <View>
              <Text>
                NASABAH memberi kuasa kepada BANK untuk melakukan tindakan dan
                perbuatan hukum yang dianggap wajar dan perlu oleh BANK yang
                berkaitan dengan pemberian jaminan tersebut diatas.
              </Text>
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
            marginBottom: 12,
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
              marginTop: 12,
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
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>4.3</Text>
          <View>
            <Text>
              NASABAH dengan ini menyatakan dan menjamin bahwa JAMINAN tersebut
              diatas adalah benar dan milik NASABAH, dan hanya NASABAH sajalah
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
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>4.4</Text>
          <View>
            <Text>
              NASABAH menjamin bahwa mengenai hal – hal tersebut pada pasal 4
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
            marginTop: 3,
            marginBottom: 3,
            padding: "3px 0",
          }}
        >
          <Text>Pasal 5</Text>
          <Text>KEWAJIAN NASABAH</Text>
        </View>
        <View>
          <Text>
            Untuk lebih menjamin pelaksanaan Perjanjian ini oleh NASABAH, maka
            NASABAH berkewajiban untuk :
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
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
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>5.2</Text>
          <View>
            <Text>
              NASABAH menyetujui dan wajib mengikat diri untuk menyerahkan semua
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
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>5.3</Text>
          <View>
            <Text>
              NASABAH Wajib mengikuti Asuransi Jiwa dan atau Asuransi Kredit.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>5.4</Text>
          <View>
            <Text>
              NASABAH wajib memperpanjang masa pertanggungan termasuk bilamana
              masa berakhir, sampai lunasnya fasilitas kredit dibayar kembali
              oleh NASABAH kepada BANK, apabila NASABAH dengan alasan apapun
              tidak memperpanjang masa pertanggungan tersebut, maka segala
              resiko yang terjadi pada agunan tersebut menjadi resiko NASABAH
              sendiri.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>5.5</Text>
          <View>
            <Text>
              NASABAH wajib membayar premi-premi dan lain-lain biaya asuransi
              tepat pada waktunya dan menyerahkan asli dari setiap polis atau
              setiap perpanjangannya dan setiap tanda-tanda pembayarannya kepada
              BANK. BANK dengan ini diberi kuasa oleh NASABAH untuk menutup dan
              memperpanjang asuransi yang dimaksud di atas, satu dan lain atas
              biaya NASABAH, yakni bilamana NASABAH lalai menutup atau
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
            marginTop: 3,
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
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>6.1</Text>
          <View>
            <Text>
              Pembayaran kembali kredit/pinjaman uang tersebut dilakukan secara
              angsuran bulanan, yang terdiri dari angsuran pokok kredit dan
              bunga dalam jumlah tetap. Jumlah-jumlah uang yang terutang oleh
              NASABAH kepada BANK berdasarkan/sesuai dengan catatan-catatan
              dan/atau pembukuan BANK merupakan bukti yang mengikat bagi NASABAH
              mengenai utang NASABAH dibayar lunas, untuk itu NASABAH tidak akan
              menyangkal dan/atau mengajukan keberatan-keberatan akan
              jumlah-jumlah uang yang terhutang oleh NASABAH.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>6.2</Text>
          <View>
            <Text>
              Demikian pula apabila jangka waktu fasilitas kredit telah berakhir
              atau diakhiri sebelum jangka waktu berakhir dan ternyata masih
              terdapat sisa utang sebagai akibat perubahan tingkat suku bunga,
              maka NASABAH wajib menandatangani perpanjangan Perjanjian Kredit.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>6.3</Text>
          <View>
            <Text>
              Setiap perubahan besarnya pembayaran bunga pinjaman selalu akan
              diberitahukan secara tertulis oleh BANK kepada NASABAH. Dan surat
              pemberitahuan perubahan suku bunga tersebut, dan/atau jadwal
              angsuran pinjaman pokok dan bunga pinjaman, merupakan satu
              kesatuan dan tidak terpisahkan dari perjanjian ini, serta NASABAH
              tidak akan menyangkal dalam bentuk apapun juga atas perubahan suku
              bunga tersebut.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>6.4</Text>
          <View>
            <Text>
              NASABAH membayar angsuran pokok dan bunga pinjaman melalui
              pemotongan gaji yang dilakukan oleh KANTOR POS , PT. BPR DP TASPEN
              dan atau BANK MANDIRI TASPEN berdasarkan surat kuasa pemotongan
              gaji sampai seluruh kewajibanya dinyatakan lunas oleh BANK.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>6.5</Text>
          <View>
            <Text>
              Semua pembayaran pada BANK harus dilakukan di tempat kedudukan
              BANK melalui rekening NASABAH atau rekening lain yang ditentukan
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
            marginTop: 3,
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
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>7.1</Text>
          <View>
            <Text>
              Bahwa atas setiap keterlambatan pembayaran cicilan/angsuran oleh
              NASABAH kepada BANK, maka NASABAH dikenakan denda menurut
              ketentuan BANK yang berlaku pada saat ditandatanganinya Perjanjian
              ini, yaitu sebesar 0,3%,- (nol koma tiga persen) perhari.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>7.2</Text>
          <View>
            <Text>
              Pelunasan sebagian atau seluruh pinjaman sebelum jatuh tempo dapat
              dilakukan NASABAH dengan ketentuan bahwa setiap pelunasan baik
              sebagian atau seluruh pinjaman tersebut NASABAH dikenakan penalty
              sebesar 5% (tujuh perseratus) yang dihitung dari sisa Pokok
              Pinjaman NASABAH yang tertera pada pembukuan pihak BANK.
            </Text>
          </View>
        </View>
        {/* Pasal 7 */}
        {/* Pasal 8 */}
        <View
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 3,
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
            width: 490,
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
              dalam hal demikian seluruh hutang NASABAH kepada BANK harus
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
                  Bilamana NASABAH menggunakan fasilitas pinjaman ini menyimpang
                  dari tujuan penggunaan yang telah disetujui oleh BANK.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text>b.</Text>
                <Text>
                  Bilamana NASABAH lalai atau tidak memenuhi syarat-syarat atau
                  ketentuan-ketentuan / kewajiban-kewajiban yang dimaksud dalam
                  Perjanjian ini dan atau perubahan/tambahan dan atau
                  perjanjian-perjanjian pengikatan jaminan.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text>c.</Text>
                <Text>
                  Bilamana menurut pertimbangan BANK keadaan keuangan,
                  bonafiditas dan solvabilitas NASABAH mundur sedemikian rupa
                  sehingga NASABAH tidak dapat membayar hutangnya.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text>d.</Text>
                <Text>
                  Bilamana NASABAH menanggung hutang pihak ketiga tanpa
                  persetujuan tertulis terlebih dahulu dari BANK.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text>e.</Text>
                <Text>
                  Bilamana pernyataan-pernyataan, surat-surat,
                  keterangan-keterangan yang diberikan NASABAH kepada BANK
                  ternyata tidak benar.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text>f.</Text>
                <Text>
                  Bilamana menurut pertimbangan BANK ada hal-hal lain yang
                  meragukan pengembalian pelunasan kredit tersebut.
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>8.2</Text>
          <View>
            <Text>
              Bahwa segala pembukuan / catatan yang dibuat oleh BANK menjadi
              tanda bukti yang mengikat dan sah atas jumlah hutang NASABAH
              kepada BANK.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>8.3</Text>
          <View>
            <Text>
              Apabila NASABAH meninggal dunia, maka semua hutang dan kewajiban
              NASABAH kepada BANK yang timbul berdasarkan Perjanjian ini berikut
              semua perubahannya dikemudian dan atau berdasarkan apapun juga
              tetap merupakan satu kesatuan hutang dari para ahli waris NASABAH
              atau PENANGGUNG (jika ada).
            </Text>
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
            marginBottom: 12,
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
              marginTop: 12,
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
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>8.4</Text>
          <View>
            <Text>
              NASABAH dengan ini berjanji, akan tunduk kepada segala ketentuan
              dan sesuai dengan ketentuan peraturan perundang-undangan termasuk
              ketentuan peraturan Otoritas Jasa Keuangan.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
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
            marginTop: 3,
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
            Perjanjian Pembiayaan ini dapat dikirimkan ke alamat sebagai berikut
            :
          </Text>
        </View>
        <View style={{ padding: "5px 10px" }}>
          <Text style={{ fontWeight: "bold" }}>
            KOPERASI JASA FADILLAH AQILA SEJAHTRA
          </Text>
          <View style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Up</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>Nandang Hermawan</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Alamat</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text style={{ width: 300 }}>
                {process.env.NEXT_PUBLIC_APP_ALAMAT || ""}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>No. Telepon</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>{process.env.NEXT_PUBLIC_APP_NO_TELEPON || ""}</Text>
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
              <View style={{ width: 300 }}>
                <Text>Samuel (HP : 0821 98 347 250)</Text>
                <Text>Siti Fatimah (HP :085 774 442 303)</Text>
              </View>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Alamat</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>JL IR Juanda No. 171 D-E Bekasi Timur</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>No Telepon</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>(021) 8827958 (HP : 0895-3844-45794)</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text style={{ width: 100 }}>Email</Text>
              <Text style={{ width: 20 }}>:</Text>
              <Text>bprbbtm@gmail.com</Text>
            </View>
          </View>
        </View>

        {/* Pasal 9 */}
        {/* Pasal 10 */}
        <View
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 3,
            marginBottom: 3,
            padding: "3px 0",
          }}
        >
          <Text>Pasal 10</Text>
          <Text>DOMISILI HUKUM</Text>
        </View>
        <View
          style={{
            width: 510,
          }}
        >
          <Text>
            Segala perselisihan dan perbedaan pendapat yang mungkin timbul di
            antara Para Pihak dalam melaksanakan Perjanjian ini, akan
            diselesaikan terlebih dahulu secara musyawarah untuk mencapai
            mufakat. Namun apabila tidak berhasil mencapai mufakat, maka Para
            Pihak sepakat akan menyelesaikan perselisihan tersebut melalui
            Pengadilan. Para Pihak sepakat memilih tempat kedudukan hukum yang
            tetap dan seumumnya di Kantor Kepaniteraan Pengadilan Negeri Bekasi,
            namun tidak mengurangi hak BANK untuk mengajukan tuntutan hukum
            kepada DEBITUR untuk mengajukan gugatan atau memohon pelaksanaan
            eksekusi jaminan berdasarkan Perjanjian ini melalui pengadilan lain
            di dalam wilayah negara Republik Indonesia.
          </Text>
        </View>
        <View
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 3,
            marginBottom: 3,
            padding: "3px 0",
          }}
        >
          <Text>Pasal 11</Text>
          <Text>KEADAAN MEMAKSA (FORCE MAJEURE)</Text>
        </View>
        <View
          style={{
            width: 510,
          }}
        >
          <Text>
            Terjadinya peristiwa yang diluar kekuasaan kemampuan PT. BPR Bekasi
            Binatanjung Makmur (Force Majeure atau Overmacht) antara lain
            keadaan yang diakibatkan bencana alam dan non bencana alam seperti
            keadaan krisis atau kemacetan likuiditas sebagai akibat dari
            perubahan kebijakan pemerintah dibidang moneter dan fiskal atau
            telah sesuai dengan unsur-unsur keadaan memaksa (Force Majeure) dan
            peraturan tentang keadaan memaksa (Force Majeure) yakni pasal 1244
            dan pasal 1245 Kitab Undang-Undang Hukum Perdata (KUHP), dimana
            peraturan dimaksud tersebut terlebih dahulu harus diumumkan
            pemerintah (Regulator) secara resmi.
          </Text>
        </View>
        {/* Pasal 10 */}
        {/* Pasal 10 */}
        <View
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 3,
            marginBottom: 3,
            padding: "3px 0",
          }}
        >
          <Text>Pasal 12</Text>
          <Text>LAIN-LAIN</Text>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>11.1</Text>
          <View>
            <Text>
              Sebelum Akad ini ditandatangani oleh NASABAH, NASABAH mengakui
              dengan sebenarnya, bahwa NASABAH telah membaca dengan cermat atau
              dibacakan kepada NASABAH, sehingga oleh karena itu NASABAH
              memahami sepenuhnya segala yang akan menjadi akibat hukum setelah
              NASABAH menandatangani Perjanjian Pembiayaan ini.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>11.2</Text>
          <View>
            <Text>
              Apabila ada hal-hal yang belum diatur atau belum cukup diatur
              dalam Perjanjian Pembiayan ini, maka NASABAH dan BANK akan
              mengaturnya Bersama secara musyawarah untuk mufakat dalam suatu
              Addendum.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>11.3</Text>
          <View>
            <Text>
              Setiap Addendum dari Perjanjian Pembiayaan ini merupakan satu
              kesatuan yang tidak dapat dipisahkan dari Perjanjian Pembiayaan
              ini
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>11.4</Text>
          <View>
            <Text>
              NASABAH memberi instruksi atau kuasa kepada BANK untuk
              melaksanakan pemotongan saldo tabungan untuk pembayaran angsuran
              setiap bulan sebesar Rp {formatNumber(angsuranBulanan)}(
              {angkaTerbilang(data.DataPembiayaan.plafond)
                .split(" ")
                .map(function (word: string) {
                  return word.charAt(0).toUpperCase().concat(word.substr(1));
                })
                .join(" ")}{" "}
              Rupiah) sampai kredit dinyatakan lunas oleh BANK.
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            width: 490,
            flexDirection: "row",
          }}
        >
          <Text style={{ width: 20 }}>11.5</Text>
          <View>
            <Text>
              Perjanjian ini dapat diubah atau diperbaharui dengan syarat adanya
              persetujuan dari Para Pihak terlebih dahulu dan akan dibuatkan
              perubahan perjanjian atau addendum yang menjadi satu kesatuan dan
              tidak terpisahkan dari Perjanjian ini.
            </Text>
          </View>
        </View>
        {/* Pasal 10 */}
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: "bold" }}>
            ............., ...................
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
                {data.Bank.name || "KOPERASI JASA FADILLAH AQILA SEJAHTRA"}
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
                  NANDANG HERMAWAN
                </Text>
                <Text>Direktur Pengelolas</Text>
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
              <Text style={{ fontWeight: "bold" }}>Debitur</Text>
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
                <Text>Penerima Pembiayaan</Text>
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
              <Text style={{ flex: 1 }}>Menyetujui</Text>
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
