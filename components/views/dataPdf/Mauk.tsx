"use client";

import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { Document, PDFViewer, Page, Text, View } from "@react-pdf/renderer";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";
import { stylePdf } from "@/components/utils/pdf/stylePdf";

export default function Mauk({ data }: { data: DataDataPengajuan }) {
  return (
    <PDFViewer className="w-full h-full">
      <Document
        title={`MAUK_${data.Bank.kode?.toUpperCase()}_${data.DataPembiayaan.name.toUpperCase()}`}
      >
        <Page size={"A4"} style={{ ...stylePdf.root }}>
          <View style={{ border: "1px solid #aaa" }}>
            <View
              style={{
                fontWeight: "bold",
                textAlign: "center",
                padding: 10,
                lineHeight: 1.4,
              }}
            >
              <Text>MEMORANDUM ANALISA DAN USULAN KREDIT</Text>
              <Text>KREDIT BARU / TAMBAHAN / PERPANJANGAN / RESTRUKTUR</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "center",
                }}
              >
                <Text>No.</Text>
                <Text>......</Text>
                <Text>
                  MK/{data.Bank.kode}/PP/{new Date().getMonth()}/
                  {new Date().getFullYear()}
                </Text>
              </View>
            </View>
            {/* BIODATA */}
            <View style={{ display: "flex", flexDirection: "row" }}>
              {/* LEFT */}
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    border: "1px solid #aaa",
                    padding: 5,
                    lineHeight: 1.4,
                  }}
                >
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>Nama</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      {data.DataPembiayaan.name.toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>Tempat, Tanggal Lahir</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      {data.DataPembiayaan.tempat_lahir},{" "}
                      {data.DataPembiayaan.tanggal_lahir}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>Status Kawin</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      {data.status_kawin?.split("_").join(" ").toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>No KTP</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>{data.nik}</Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>No NPWP</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>{data.npwp}</Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>Alamat KTP</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
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
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>Alamat Domisili</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      {data.DataPengajuanAlamat.alamat_domisili}{" "}
                      {data.DataPengajuanAlamat.rt_domisili}/
                      {data.DataPengajuanAlamat.rw_domisili},{" "}
                      {data.DataPengajuanAlamat.kelurahan_domisili}{" "}
                      {data.DataPengajuanAlamat.kecamatan_domisili},{" "}
                      {data.DataPengajuanAlamat.kota_domisili}{" "}
                      {data.DataPengajuanAlamat.provinsi_domisili}{" "}
                      {data.DataPengajuanAlamat.kode_pos_domisili}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>Nama Ibu Kanding</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      {data.nama_ibu_kandung}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>No Telepon/HP</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>{data.no_telepon}</Text>
                  </View>
                </View>
                <View
                  style={{
                    border: "1px solid #aaa",
                    padding: 5,
                    lineHeight: 1.4,
                  }}
                >
                  <View
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: 3,
                    }}
                  >
                    <Text style={{ marginBottom: 5 }}>
                      PENDAPATAN/PENGELUARAN/BULAN
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>Pendapatan</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      Rp.{" "}
                      {formatNumber(data.DataPembiayaan.gaji_bersih.toFixed(0))}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>
                      Angsuran Channeling {data.Bank.kode?.toUpperCase()}
                    </Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      Rp.{" "}
                      {formatNumber(
                        ceiling(
                          parseInt(
                            getAngsuranPerBulan(
                              data.Bank.margin_bank || 0,
                              data.DataPembiayaan.tenor,
                              data.DataPembiayaan.plafond
                            )
                          ),
                          parseInt(
                            process.env.NEXT_PUBLIC_APP_PEMBULATAN || "100"
                          )
                        ).toFixed(0)
                      )}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    border: "1px solid #aaa",
                    padding: 5,
                    lineHeight: 1.4,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      marginBottom: 5,
                      fontWeight: "bold",
                    }}
                  >
                    JAMINAN
                  </Text>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>No SK Pensiun</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      {data.nomor_sk_pensiun}
                    </Text>
                  </View>
                </View>
              </View>
              {/* RIGHT */}
              <View
                style={{
                  flex: 1,
                  textAlign: "justify",
                }}
              >
                <View
                  style={{
                    border: "1px solid #aaa",
                    padding: 5,
                    lineHeight: 1.4,
                  }}
                >
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>Nama</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      {data.DataPengajuanPasangan.nama_pasangan}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>Pekerjaan</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      {data.DataPengajuanPasangan.pekerjaan_pasangan}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>Alamat KTP</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      {data.DataPengajuanPasangan.alamat_pasangan}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>Tempat Tanggal Lahir</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      {data.DataPengajuanPasangan.tempat_lahir_pasangan},{" "}
                      {data.DataPengajuanPasangan.tanggal_lahir_pasangan}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ width: "40%" }}>No KTP</Text>
                    <Text style={{ width: "10%" }}>:</Text>
                    <Text style={{ width: "50%" }}>
                      {data.DataPengajuanPasangan.nik_pasangan}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    border: "1px solid #aaa",
                    lineHeight: 1.4,
                    padding: 5,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      marginBottom: 5,
                      fontWeight: "bold",
                    }}
                  >
                    TUJUAN PENGAJUAN PINJAMAN
                  </Text>
                  <Text>
                    Pemohon mengajukan pinjaman sebesar Rp
                    {formatNumber(data.DataPembiayaan.plafond.toFixed(0))} yang
                    dipergunakan untuk kebutuhan multiguna
                  </Text>
                </View>
                <View
                  style={{
                    border: "1px solid #aaa",
                    lineHeight: 1.4,
                    padding: 5,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      marginBottom: 5,
                      fontWeight: "bold",
                    }}
                  >
                    LATAR BELAKANG
                  </Text>
                  <View>
                    <Text>
                      {" "}
                      Pemohon adalah Pensiunan TASPEN dengan data sbb : No
                      Pensiun : {data.DataPembiayaan.nopen} No SK :{" "}
                      {data.nomor_sk_pensiun} Penerbit SK: {data.penerbit_sk}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* END BIODATA */}
          </View>
          <View
            style={{ lineHeight: 1.4, padding: 5, border: "1px solid #aaa" }}
          >
            <Text
              style={{
                textAlign: "center",
                marginBottom: 5,
                fontWeight: "bold",
              }}
            >
              USULAN DAN REKOMENDASI
            </Text>
            <Text>
              Mempertimbangkan hasil analisa dan data diatas maka kami
              mengusulkan kepada Komite Kredit untuk menyetujui Fasilitas kredit
              kepada calon debitur sebagai berikut:
            </Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}>Fasilitas</Text>
                  <Text style={{ width: "10%" }}>:</Text>
                  <Text style={{ width: "50%" }}>
                    Pinjaman Pensiun {data.DataPembiayaan.Produk.name}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}>Jenis</Text>
                  <Text style={{ width: "10%" }}>:</Text>
                  <Text style={{ width: "50%" }}>Angsuran Berjangka</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}>Plafond</Text>
                  <Text style={{ width: "10%" }}>:</Text>
                  <Text style={{ width: "50%" }}>
                    {formatNumber(data.DataPembiayaan.plafond.toFixed(0))}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}>Jangka Waktu</Text>
                  <Text style={{ width: "10%" }}>:</Text>
                  <Text style={{ width: "50%" }}>
                    {data.DataPembiayaan.tenor} Bulan
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}>Bunga</Text>
                  <Text style={{ width: "10%" }}>:</Text>
                  <Text style={{ width: "50%" }}>
                    {data.Bank.margin_bank} %
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}>Admin & Provisi</Text>
                  <Text style={{ width: "10%" }}>:</Text>
                  <Text style={{ width: "50%" }}>
                    Rp.{" "}
                    {formatNumber(
                      (
                        data.DataPembiayaan.plafond *
                          (data.DataPembiayaan.by_admin_bank / 100) +
                        data.DataPembiayaan.by_provisi
                      ).toFixed(0)
                    )}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}>Asuransi Jiwa</Text>
                  <Text style={{ width: "10%" }}>:</Text>
                  <Text style={{ width: "50%" }}>
                    Rp.{" "}
                    {formatNumber(
                      (
                        data.DataPembiayaan.plafond *
                        (data.DataPembiayaan.mg_bunga / 100)
                      ).toFixed(0)
                    )}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}>Angsuran Channeling BPR</Text>
                  <Text style={{ width: "10%" }}>:</Text>
                  <Text style={{ width: "50%" }}>
                    Rp.{" "}
                    {formatNumber(
                      ceiling(
                        parseInt(
                          getAngsuranPerBulan(
                            data.Bank.margin_bank || 0,
                            data.DataPembiayaan.tenor,
                            data.DataPembiayaan.plafond
                          )
                        ),
                        parseInt(
                          process.env.NEXT_PUBLIC_APP_PEMBULATAN || "100"
                        )
                      ).toFixed(0)
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              lineHeight: 1.4,
              border: "1px solid #aaa",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                textAlign: "center",
                padding: 5,
                flex: 1,
                border: "1px solid #aaa",
              }}
            >
              <Text>Diusulkan</Text>
              <View style={{ height: 60, border: "1px solid #aaa" }}></View>
              <Text>Account Officer</Text>
            </View>
            <View
              style={{
                textAlign: "center",
                padding: 5,
                flex: 1,
                border: "1px solid #aaa",
              }}
            >
              <Text>Direkomendasikan</Text>
              <View style={{ height: 60, border: "1px solid #aaa" }}></View>
              <Text>Team Credit Review</Text>
            </View>
            <View
              style={{
                textAlign: "center",
                padding: 5,
                flex: 1,
                border: "1px solid #aaa",
              }}
            >
              <Text>Disetujui / Ditolak</Text>
              <View style={{ height: 60, border: "1px solid #aaa" }}></View>
              <Text>Wakil Ketua KK</Text>
            </View>
            <View
              style={{
                textAlign: "center",
                padding: 5,
                flex: 1,
                border: "1px solid #aaa",
              }}
            >
              <Text>Disetujui / Ditolak</Text>
              <View style={{ height: 60, border: "1px solid #aaa" }}></View>
              <Text>Ketua Komite Kredit</Text>
            </View>
          </View>
          <View style={{ border: "1px solid #aaa", padding: 5 }}>
            <View style={{ marginBottom: 5 }}>
              <Text>Catatan</Text>
            </View>
            <View style={{ height: 80, border: "1px solid #aaa" }}></View>
            <Text style={{ marginTop: 2, marginBottom: 2 }}>
              Kepada: Bagian Adm. Kredit
            </Text>
            <Text>Mohon disiapkan pengikatan kredit ymk. pada tanggal:</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
