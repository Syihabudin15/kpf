import { DataDataPengajuan } from "../Interfaces";
import { Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatNumber } from "../inputUtils";
import { ceiling } from "./pdfUtil";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";
import moment from "moment";
import { stylePdf } from "./stylePdf";
const angkaTerbilang = require("angka-menjadi-terbilang");

export default function PerjanjianKreditFlashPage1({
  data,
  page,
}: {
  data: DataDataPengajuan;
  page: number;
}) {
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
    data.DataPembiayaan.by_mutasi +
    data.DataPembiayaan.by_provisi;

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
    <Page
      style={{ ...styles.page, ...stylePdf.root, lineHeight: 1.1 }}
      wrap
      size="A4"
    >
      {/* Header */}
      <View
        fixed
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 5,
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
            marginTop: 30,
          }}
        >
          <Text style={{ fontSize: 10 }}>PERJANJIAN KREDIT</Text>
          {data.nomor_akad ? (
            <Text style={{ fontSize: 8 }}>NO AKAD : {data.nomor_akad}</Text>
          ) : (
            <Text>NO: ____/{data.Bank.kode}-PK/____/____/____/2024</Text>
          )}
        </View>
        <View>
          <Image src={process.env.NEXT_PUBLIC_APP_LOGO} style={{ width: 50 }} />
        </View>
      </View>
      {/* End Header */}

      <View style={[styles.row]} wrap>
        <View style={styles.left} wrap>
          <Text>Yang bertanda tangan di bawah ini : </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View>
              <Text>I.</Text>
            </View>
            <View style={{ lineHeight: 1.1 }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontWeight: "bold",
                  marginTop: 8,
                }}
              >
                <Text style={{ width: 50 }}>Nama</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text>{data.Bank.direktur || "Lodewijk HF Lantang"}</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Text style={{ width: 50 }}>Posisi</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text>Kepala Operasional</Text>
              </View>
              <View style={{ marginTop: 8, marginBottom: 2 }}>
                <Text>
                  {data.Bank.sk_akad}, yang selanjutnya disebut{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {`"${process.env.NEXT_PUBLIC_APP_FULL_NAME?.toUpperCase()}"`}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  marginBottom: 8,
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "row",
                  lineHeight: 1.1,
                  gap: 5,
                }}
              >
                <Text>I.</Text>
                <View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Nama</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {data.DataPembiayaan.name}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>NIK</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>{data.nik}</Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Tempat / Tanggal Lahir</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>
                      {data.DataPembiayaan.tempat_lahir},{" "}
                      {data.DataPembiayaan.tanggal_lahir}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Pekerjaan</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>{data.pekerjaan_sekarang}</Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Alamat</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>{data.DataPengajuanAlamat.alamat}</Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>RT/RW</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>
                      {data.DataPengajuanAlamat.rt} /{" "}
                      {data.DataPengajuanAlamat.rw}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Kelurahan</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>{data.DataPengajuanAlamat.kelurahan}</Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Kecamatan</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>{data.DataPengajuanAlamat.kecamatan}</Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Kota/Kabupaten</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>{data.DataPengajuanAlamat.kota}</Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Provinsi</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>
                      {data.DataPengajuanAlamat.provinsi}{" "}
                      {data.DataPengajuanAlamat.kode_pos}
                    </Text>
                  </View>
                  <View style={{ marginTop: 8, marginBottom: 5 }}>
                    <Text>
                      Dan untuk tindakan hukum ini telah mendapat persetujuan
                      suami/isterinya :
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Nama</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {data.DataPengajuanPasangan.nama_pasangan}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>NIK</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>{data.DataPengajuanPasangan.nik_pasangan}</Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Tempat / Tanggal Lahir</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>
                      {data.DataPengajuanPasangan.tempat_lahir_pasangan &&
                        data.DataPengajuanPasangan.tempat_lahir_pasangan +
                          ","}{" "}
                      {data.DataPengajuanPasangan.tanggal_lahir_pasangan}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Pekerjaan</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>{data.DataPengajuanPasangan.pekerjaan_pasangan}</Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Alamat</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>{data.DataPengajuanPasangan.alamat_pasangan}</Text>
                  </View>
                </View>
              </View>
              <View style={{ marginBottom: 8, marginTop: 8 }}>
                <Text>
                  Yang selanjutnya disebut{" "}
                  <Text style={{ fontWeight: "bold" }}>{'"PEMINJAM"'}.</Text>
                </Text>
              </View>
              <View>
                <Text>
                  Selanjutnya KOPERASI dan PEMINJAM terlebih dahulu menerangkan
                  dengan ini telah sepakat untuk mengadakan Perjanjian Kredit
                  (selanjutnya disebut “Perjanjian”)dengan syarat-syarat dan
                  ketentuan-ketentuan sebagai berikut:
                </Text>
              </View>
              {/* PASAL 1 */}
              <View
                style={{
                  fontWeight: "bold",
                  marginTop: 5,
                  marginBottom: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>PASAL 1</Text>
                <Text>FASILITAS KREDIT</Text>
              </View>
              <View>
                <Text>
                  KOPERASI dengan ini menyetujui memberikan suatu kredit kepada
                  PEMINJAM dan PEMINJAM menyetujui untuk menerima fasilitas
                  kredit yang disebut Kredit Channeling dengan Plafon Kredit
                  sebesar{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    Rp.{formatNumber(data.DataPembiayaan.plafond.toFixed(0))},-
                    (
                    {angkaTerbilang(data.DataPembiayaan.plafond)
                      .split(" ")
                      .map(function (word: string) {
                        return word
                          .charAt(0)
                          .toUpperCase()
                          .concat(word.substr(1));
                      })
                      .join(" ")}{" "}
                    Rupiah)
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  marginTop: 5,
                  marginBottom: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>PASAL 2</Text>
                <Text>TUJUAN PENGGUNAAN & JANGKA WAKTU</Text>
              </View>
              <View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: 20 }}>2.1</Text>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Jangka Waktu</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>{data.DataPembiayaan.tenor} Bulan</Text>
                  </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: 20 }}>2.2</Text>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Angsuran Perbulan</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>Rp. {formatNumber(angsuranBank)} / Bulan</Text>
                  </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: 20 }}>2.3</Text>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Biaya Adm. Angsuran</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>Rp. {formatNumber(colfee)} / Bulan</Text>
                  </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: 20 }}>2.4</Text>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Total Angsuran</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>Rp. {formatNumber(angsuranBulanan)} / Bulan</Text>
                  </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: 20 }}>2.5</Text>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Tanggal Pembayaran</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>
                      {moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")}
                    </Text>
                  </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: 20 }}>2.6</Text>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>
                      Suku Bunga{" "}
                      {data.jenis_margin === "FLAT" ? "Flat" : "Efektif"}
                    </Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text>{data.DataPembiayaan.mg_bunga}% Pertahun</Text>
                  </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: 20 }}>2.7</Text>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: 100 }}>Tujuan Penggunaan</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Text>- {data.tujuan_penggunaan1}</Text>
                      {data.tujuan_penggunaan2 && (
                        <Text>-{data.tujuan_penggunaan2}</Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                  marginTop: 5,
                  marginBottom: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>PASAL 3</Text>
                <Text>BIAYA-BIAYA</Text>
              </View>
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "92%",
                  }}
                >
                  <Text style={{ width: 20 }}>3.1</Text>
                  <Text>
                    Untuk pembebanan angsuran,bunga, provisi, biaya-biaya, denda
                    dan segala biaya lainnya yang terhutang berkenaan dengan
                    pemberian kredit ini, PEMINJAM memberi kuasa kepada KOPERASI
                    untuk mendebet rekening Peminjam yang ada pada KOPERASI
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "92%",
                  }}
                >
                  <Text style={{ width: 20 }}>3.2</Text>
                  <View>
                    <Text>
                      PEMINJAM berjanji dan dengan ini mengikat diri untuk
                      menanggung seluruh biaya yang diperlukan berkenaan dengan
                      pelaksanaan Akad ini sepanjang hal ini diberitahukan
                      KOPERASI kepada PEMINJAM sebelum ditandatangani Akad ini
                      dan PEMINJAM menyatakan persetujuannya. Adapun biaya-biaya
                      tersebut adalah sebagai berikut :
                    </Text>
                    <View style={{ marginTop: 5 }}>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                        }}
                      >
                        <Text style={{ width: 8 }}>a.</Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                          }}
                        >
                          <Text style={{ width: 100 }}>Administrasi</Text>
                          <Text style={{ width: 10 }}>:</Text>
                          <Text style={{ width: 20 }}>Rp</Text>
                          <Text>{formatNumber(byAdmin.toFixed(0))}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                        }}
                      >
                        <Text style={{ width: 8 }}>b.</Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                          }}
                        >
                          <Text style={{ width: 100 }}>
                            Asuransi Jiwa/Kredit
                          </Text>
                          <Text style={{ width: 10 }}>:</Text>
                          <Text style={{ width: 20 }}>Rp</Text>
                          <Text>{formatNumber(byAsuransi.toFixed(0))}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                        }}
                      >
                        <Text style={{ width: 8 }}>c.</Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                          }}
                        >
                          <Text style={{ width: 100 }}>Tatalaksana</Text>
                          <Text style={{ width: 10 }}>:</Text>
                          <Text style={{ width: 20 }}>Rp</Text>
                          <Text>
                            {formatNumber(
                              data.DataPembiayaan.by_tatalaksana.toFixed(0)
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.right} wrap>
          <View style={{ marginTop: 5, marginBottom: 5, paddingLeft: 15 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Text style={{ width: 8 }}>d.</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                <Text style={{ width: 100 }}>Pembukaan Tabungan</Text>
                <Text style={{ width: 10 }}>:</Text>
                <Text style={{ width: 20 }}>Rp</Text>
                <Text>
                  {formatNumber(
                    data.DataPembiayaan.by_buka_rekening.toFixed(0)
                  )}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Text style={{ width: 8 }}>e.</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                <Text style={{ width: 100 }}>Materai</Text>
                <Text style={{ width: 10 }}>:</Text>
                <Text style={{ width: 20 }}>Rp</Text>
                <Text>
                  {formatNumber(data.DataPembiayaan.by_materai.toFixed(0))}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Text style={{ width: 8 }}>f.</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                <Text style={{ width: 100 }}>Data Informasi</Text>
                <Text style={{ width: 10 }}>:</Text>
                <Text style={{ width: 20 }}>Rp</Text>
                <Text>
                  {formatNumber(
                    (
                      data.DataPembiayaan.by_epotpen +
                      data.DataPembiayaan.by_flagging
                    ).toFixed(0)
                  )}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Text style={{ width: 8 }}> </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                <Text style={{ width: 100 }}> </Text>
                <Text style={{ width: 10 }}> </Text>
                <Text
                  style={{
                    borderBottom: "1px solid black",
                    width: 80,
                  }}
                ></Text>
                <Text>+</Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Text style={{ width: 8 }}></Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                <Text style={{ width: 100, fontWeight: "bold" }}>
                  Total Biaya
                </Text>
                <Text style={{ width: 10 }}>:</Text>
                <Text style={{ width: 20 }}>Rp</Text>
                <Text>
                  {formatNumber(
                    (
                      byAdmin +
                      byAsuransi +
                      data.DataPembiayaan.by_buka_rekening +
                      data.DataPembiayaan.by_materai +
                      byLainLain
                    ).toFixed(0)
                  )}
                </Text>
              </View>
            </View>
            <Text>
              Segala biaya yang timbul sehubungan dengan Akad ini merupakan
              tanggung jawab dan wajib dibayar oleh PEMINJAM.
            </Text>
          </View>
          {/* Pasal 4 */}
          <View
            style={{
              fontWeight: "bold",
              marginTop: 5,
              marginBottom: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>PASAL 4</Text>
            <Text>JAMINAN</Text>
          </View>
          <View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ width: 20 }}>4.1</Text>
              <View>
                <Text>
                  Bahwa guna menjamin lebih lanjut pembayaran kembali kewajiban
                  PEMINJAM kepada KOPERASI seperti yang disebut pada perjanjian
                  ini, Perubahan dan/atau novasi atau Perjanjian Kredit yang
                  dibuat dikemudian hari atau sebab apapun juga, maka PEMINJAM
                  menyerahkan jaminan kepada KOPERASI berupa :
                </Text>
                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                  <Text style={{ width: 10 }}>a.</Text>
                  <Text>Surat Keterangan Sisa Uang Pensiun (SKSUP)</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                  <Text style={{ width: 10 }}>b.</Text>
                  <Text>
                    Asli Slip Gaji Bulan : _________________ atas nama :{" "}
                    {data.DataPembiayaan.name}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                  <Text style={{ width: 10 }}>d.</Text>
                  <Text>
                    Bukti Flagging Pos atas nama : {data.DataPembiayaan.name}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ width: 20 }}>4.2</Text>
              <Text>
                PEMINJAM memberi kuasa kepada KOPERASI untuk melakukan tindakan
                danperbuatan hukum yang dianggap wajar dan perlu oleh KOPERASI
                yang berkaitandengan pemberian jaminan tersebut diatas
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ width: 20 }}>4.3</Text>
              <Text>
                PEMINJAM dengan ini menyatakan dan menjamin bahwa JAMINAN
                tersebut diatasadalah benar dan milik PEMINJAM, dan hanya
                PEMINJAM sajalah yang berhak untuk menyerahkannya sebagai
                Jaminan, tidak sedang diberikan sebagai Jaminan untuk sesuatu
                hutang pada pihak lain dengan jalan bagaimanapun juga, tidak
                dalam keadaan sengketa serta bebas dari sitaan, serta belum
                dijual atau dijanjikan untukdijual atau dialihkan kepada pihak
                lain dengan cara apapun juga.
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ width: 20 }}>4.4</Text>
              <Text>
                PEMINJAM menjamin bahwa mengenai hal – hal tersebut pada pasal 4
                ayat 4.1 diatas, baik sekarang maupun dikemudian hari, KOPERASI
                tidak akan mendapat tuntutan atau gugatan dari pihak manapun
                juga yang menyatakan mempunyai hak terlebih dahulu atau turut
                mempunyai hak atas JAMINAN tersebut diatas
              </Text>
            </View>
          </View>
          {/* Pasal 5 */}
          <View
            style={{
              fontWeight: "bold",
              marginTop: 5,
              marginBottom: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>PASAL 5</Text>
            <Text>KEWAJIBAN PEMINJAM</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>5.1</Text>
            <Text>
              Mempergunakan kredit tersebut semata-mata hanya sebagaimana yang
              tertera dalam pasal 1 perjanjian ini.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>5.2</Text>
            <Text>
              PEMINJAM menyetujui dan wajib mengikat diri untuk menyerahkan
              semua surat dan dokumen apapun, yang asli serta sah dan
              membuktikan pemilikan atas segala benda yang dijadikan jaminan
              termasuk dalam Pasal 4 ayat 4.1 tersebut di atas kepada KOPERASI
              guna dipergunakan untuk pelaksanaan pengikatan benda tersebut
              sebagai jaminan kredit, dan selanjutnya dikuasai oleh KOPERASI
              sampai dilunasiseluruh jumlah hutangnya.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>5.3</Text>
            <Text>
              PEMINJAM Wajib mengikuti Asuransi Jiwa dan atau Asuransi Kredit
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>5.4</Text>
            <Text>
              PEMINJAM wajib memperpanjang masa pertanggungan termasuk bilamana
              masa berakhir, sampai lunasnya fasilitas kredit dibayar kembali
              oleh PEMINJAM kepada KOPERASI, apabila PEMINJAM dengan alasan
              apapun tidak memperpanjang masa pertanggungan tersebut, maka
              segala resiko yang terjadi pada agunan tersebut menjadi resiko
              PEMINJAM sendiri.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>5.5</Text>
            <Text>
              PEMINJAM wajib membayar premi-premi dan lain-lain biaya asuransi
              tepat pada waktunya dan menyerahkan asli dari setiap polis atau
              setiap perpanjangannya dan setiap tanda -tanda pembayarannya
              kepada KOPERASI. KOPERASI dengan ini diberi kuasaoleh PEMINJAM
              untuk menutup dan memperpanjang asuransi yang dimaksud di atas,
              satu dan lain atas biaya PEMINJAM, yakni bilamana PEMINJAM lalai
              menutup atau memperpanjang berlakunya asuransi tersebut.
            </Text>
          </View>
          {/* Pasal 6 */}
          <View
            style={{
              fontWeight: "bold",
              marginTop: 5,
              marginBottom: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>PASAL 6</Text>
            <Text>PEMBAYARAN KEMBALI KREDIT</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>6.1</Text>
            <Text>
              Pembayaran kembali kredit/pinjaman uang tersebut dilakukan secara
              angsuran bulanan, yang terdiri dari angsuran pokok kredit dan
              bunga dalam jumlah tetap. Jumla h-jumlah uang yang terutang oleh
              PEMINJAM kepada KOPERASI berdasarkan/sesuai dengan catatan-catatan
              dan/atau pembukuan KOPERASI merupakan bukti yang mengikat bagi
              PEMINJAM mengenai utang PEMINJAM dibayar lunas, untuk itu PEMINJAM
              tidak akan menyangkal dan/atau mengajukan keberatan-keberatan akan
              jumlah-jumlah uang yang terhutang oleh PEMINJAM.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>6.2</Text>
            <Text>
              Demikian pula apabila jangka waktu fasilitas kredit telah berakhir
              atau diakhiri sebelum jangka waktu berakhir dan ternyata masih
              terdapat sisa hutang sebagai akibat perubahan tingkat suku bunga,
              maka PEMINJAM wajib menandatangani perpanjangan Perjanjian Kredit.
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
          render={({ pageNumber, totalPages }) =>
            `${pageNumber < page ? page + pageNumber : pageNumber}`
          }
        ></Text>
      </View>
    </Page>
  );
}
const styles = StyleSheet.create({
  page: {
    padding: "20px 30px",
    fontSize: 8,
  },
  row: {
    flex: 1,
    gap: 20,
    flexDirection: "row",
  },
  left: {
    width: "47%",
    padding: 5,
    textAlign: "justify",
    lineHeight: 1,
  },

  right: {
    width: "47%",
    padding: 5,
    textAlign: "justify",
    lineHeight: 1.1,
  },
});
