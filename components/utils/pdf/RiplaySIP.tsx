import { Document, Page, PDFViewer, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { stylePdf } from "./stylePdf";
import { formatNumber } from "../inputUtils";
import moment from "moment";
import { ceiling } from "./pdfUtil";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";

export default function RiplaySIP({ data }: { data: DataDataPengajuan }) {
  const angsuran =
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
        )
      : ceiling(
          parseInt(
            getAngsuranPerBulan(
              data.DataPembiayaan.mg_bunga,
              data.DataPembiayaan.tenor,
              data.DataPembiayaan.plafond,
              false,
              false,
              data.Bank.kode
            )
          ),
          data.DataPembiayaan.pembulatan
        );
  const admin =
    data.DataPembiayaan.plafond *
    ((data.DataPembiayaan.by_admin +
      data.DataPembiayaan.by_admin_bank +
      data.DataPembiayaan.by_lainnya) /
      100);
  const asuransi =
    data.DataPembiayaan.plafond * (data.DataPembiayaan.by_asuransi / 100);
  const informasi =
    data.DataPembiayaan.by_epotpen + data.DataPembiayaan.by_flagging;
  const totalBiaya =
    admin +
    asuransi +
    data.DataPembiayaan.by_tatalaksana +
    data.DataPembiayaan.by_mutasi +
    data.DataPembiayaan.by_provisi +
    data.DataPembiayaan.by_materai +
    data.DataPembiayaan.by_buka_rekening +
    informasi;
  const kotor = data.DataPembiayaan.plafond - totalBiaya;
  const pelunasan = data.DataPembiayaan.pelunasan + data.DataPembiayaan.bpp;
  const blokir = angsuran * data.DataPembiayaan.blokir;
  const bersih = kotor - (pelunasan + blokir);
  return (
    <PDFViewer className="w-full h-full">
      <Document title={`RIPLAY_${data.nama}`}>
        <Page size={"A4"} style={{ ...stylePdf.root }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              borderBottom: "1px solid #aaa",
              paddingBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 12 }}>
              RINGKASAN INFORMASI PRODUK DAN LAYANAN (RIPLAY)
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 30,
              marginTop: 5,
            }}
          >
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <Text style={{ width: 80 }}>Nama Penerbit</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text style={{ width: 150 }}>
                  PT. BPR Sentral Investasi Prima
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <Text style={{ width: 80 }}>Nama Produk</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text style={{ width: 150 }}>
                  {data.DataPembiayaan.Produk.name}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <Text style={{ width: 80 }}>Jenis Produk</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text style={{ width: 150 }}>
                  {data.DataPembiayaan.jenis_pembiayaan_id
                    ? data.DataPembiayaan.JenisPembiayaan.name
                    : "Sisa Gaji"}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <Text style={{ width: 80 }}>Mata Uang</Text>
                <Text style={{ width: 20 }}>:</Text>
                <Text style={{ width: 150 }}>Rupiah</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 5, marginBottom: 5, lineHeight: 1.3 }}>
            <Text>
              Kredit Pensiunan adalah pinjaman kepada pensiunan PNS , pensiunan
              TNI. Pensiunan PORLI yang pembayaran dana pensiunya melalui Pos
              Indonesia dan atau kantor bayar lain yang telah mengikat kerjasama
              dengan Koperasi Pemasaran Fadillah.
            </Text>
          </View>
          {/* BIAYA */}
          <View style={{ border: "1px solid #aaa" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: "#929292",
                paddingTop: 2,
                paddingBottom: 2,
                fontWeight: "bold",
              }}
            >
              <Text style={{ color: "white" }}>
                Fitur Utama Kredit dan Biaya
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: 2,
              }}
            >
              <View
                style={{
                  flex: 1,
                  border: "1px solid #aaa",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: 5,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Pokok Pinjaman</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(data.DataPembiayaan.plafond.toFixed(0))}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Suku bunga * pertahun eff</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {data.DataPembiayaan.mg_bunga} %
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Jangka waktu / tenor</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {data.DataPembiayaan.tenor} Bulan
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}></Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    (
                    {moment(data.tanggal_cetak_akad)
                      .add(1, "M")
                      .format("DD-MM-YYYY")}{" "}
                    - 25-
                    {moment(data.tanggal_cetak_akad)
                      .add(data.DataPembiayaan.tenor, "M")
                      .format("MM-YYYY")}
                    )
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Grace Periode</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    1 Bulan (pokok)
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Angsuran Perbulan</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(angsuran.toFixed(0))}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Biaya Administrasi</Text>
                  <Text style={{ width: 30 }}>
                    {data.DataPembiayaan.by_admin +
                      data.DataPembiayaan.by_admin_bank +
                      data.DataPembiayaan.by_lainnya}
                    %
                  </Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(admin.toFixed(0))}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Premi Asuransi</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(asuransi.toFixed(0))}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Biaya Tatalaksana</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(
                      data.DataPembiayaan.by_tatalaksana.toFixed(0)
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Biaya Mutasi</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(data.DataPembiayaan.by_mutasi.toFixed(0))}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>
                    Biaya{" "}
                    {data.Bank.kode === "BPR SIP" ? "Pelayanan" : "Provisi"}
                  </Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(data.DataPembiayaan.by_provisi.toFixed(0))}
                  </Text>
                </View>
                {data.Bank.kode !== "BPR SIP" && (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    <Text style={{ width: 150 }}>Biaya Buka Rekening</Text>
                    <Text style={{ width: 20 }}>:</Text>
                    <Text style={{ width: 150, textAlign: "right" }}>
                      {formatNumber(
                        data.DataPembiayaan.by_buka_rekening.toFixed(0)
                      )}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Biaya Materai</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(data.DataPembiayaan.by_materai.toFixed(0))}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Biaya Data Informasi</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(informasi.toFixed(0))}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}></Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: "right",
                      borderTop: "1px solid #aaa",
                      borderBottom: "1px solid #aaa",
                    }}
                  >
                    {formatNumber(totalBiaya.toFixed(0))}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  border: "1px solid #aaa",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: 5,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  <Text>Yang Diterima Nasabah</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Pokok</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(data.DataPembiayaan.plafond.toFixed(0))}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Biaya Biaya</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(totalBiaya.toFixed(0))}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Angsuran Dimuka</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(blokir.toFixed(0))}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Pelunasan TO</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text style={{ width: 150, textAlign: "right" }}>
                    {formatNumber(pelunasan.toFixed(0))}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ width: 150 }}>Yanng Diterima Nasabah</Text>
                  <Text style={{ width: 20 }}>:</Text>
                  <Text
                    style={{
                      width: 150,
                      textAlign: "right",
                      borderTop: "1px solid #aaa",
                      borderBottom: "1px solid #aaa",
                    }}
                  >
                    {formatNumber(bersih.toFixed(0))}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 20,
                    textAlign: "center",
                    padding: 5,
                    borderTop: "1px solid #aaa",
                    lineHeight: 1.3,
                  }}
                >
                  <Text>
                    Seluruh biaya kredit wajib dibayar sekaligus oleh debitur
                    segera setelah perjanjian kredit ditandatangani dengan
                    memotong langsung dari jumlah kredit yang dicairkan
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                padding: 5,
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
                }}
              >
                <Text style={{ width: 10 }}>1.</Text>
                <Text>
                  Setiap keterlambatan angsuran dikenakan denda sebesar 0,3% (
                  nol koma 3 persen ) perhari setelah tiga hari kerja.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  textAlign: "justify",
                }}
              >
                <Text style={{ width: 10 }}>2.</Text>
                <Text>
                  Angsuran kredit dipotong langsung dari gaji bulanan yang
                  diterima debitur di PT pos Indonesia.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  textAlign: "justify",
                }}
              >
                <Text style={{ width: 10 }}>3.</Text>
                <Text>
                  Asuransi di ikat dengan asuransi jiwa ( meninggal dunia ).
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  textAlign: "justify",
                }}
              >
                <Text style={{ width: 10 }}>4.</Text>
                <Text>
                  Pelunasan kredit dipercepat dikenakan pinalty sebesar 7 % dari
                  sisa pokok pinjaman.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  textAlign: "justify",
                }}
              >
                <Text style={{ width: 10 }}>*</Text>
                <Text>Berlaku pada tanggal dokumen diterbitkan.</Text>
              </View>
            </View>
            {/* MANFAAT & RESIKO */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: 2,
              }}
            >
              <View style={{ flex: 1, border: "1px solid #aaa" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: "#929292",
                    padding: 2,
                    fontWeight: "bold",
                  }}
                >
                  <Text style={{ color: "white" }}>MANFAAT</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: 2,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>1. </Text>
                    <Text style={{ width: 230 }}>
                      Memenuhi kebutuhan Pensiunan baik untuk kebutuhan berbagai
                      macam kebutuhan baik primer maupun sekunder.
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>2. </Text>
                    <Text style={{ width: 230 }}>
                      Peminjam dilindungi oleh asuransi jiwa sehingga jika
                      debitur meninggal maka sisa kewajiban di Bank BPR SIP
                      dilunasi perusahaan asuransi selama dokumen pengajuan
                      klaim asuransi sudah lengkap.
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>3. </Text>
                    <Text style={{ width: 230 }}>
                      dapat menentukan jangka waktu pelunasan sesuai dengan
                      kemampuan Anda.
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1, border: "1px solid #aaa" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: "#929292",
                    padding: 2,
                    fontWeight: "bold",
                  }}
                >
                  <Text style={{ color: "white" }}>RESIKO</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: 2,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>1. </Text>
                    <Text style={{ width: 230 }}>
                      Peminjam yang melakukan pelunasan kredit sebelum jatuh
                      tempo kredit akan dikenakan penalty yang dihitung dari
                      jumlah yang dilunasi.
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>2. </Text>
                    <Text style={{ width: 230 }}>
                      Tambahan biaya yang muncul apabila kredit anda macet
                      (dikenakan biaya penagihan) maupun pelunasan kredit yang
                      dipercepat.
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>3. </Text>
                    <Text style={{ width: 230 }}>
                      Tercatatnya riwayat kredit Anda pada Sistem Layanan
                      Informasi Keuangan (SLIK) ketika Anda menunggak
                      pembayaran.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* END MANFAAT & RESIKO */}
            {/* SYARAT & TATACARA */}
            <View style={{ margin: 2, border: "1px solid #aaa" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  backgroundColor: "#929292",
                  padding: 2,
                  fontWeight: "bold",
                }}
              >
                <Text style={{ color: "white" }}>Persyaratan dan Tatacara</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    padding: 2,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>1.</Text>
                    <Text>Mengisi form Pinjaman</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>2.</Text>
                    <Text>
                      Fc KTP calon debitur dan pasangan yang masih berlaku
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>3.</Text>
                    <Text>Foto copy Kartu Keluarga (KK) calon Debitur</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>4.</Text>
                    <Text>Foto copy Surat Nikah / Cerai/Kematian</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>5.</Text>
                    <Text>
                      Surat pernyataan beda nama ( PMI ) jika beda nama
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>6.</Text>
                    <Text>
                      FC pernyataan belum menikah / jika janda atau duda
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>7.</Text>
                    <Text>
                      Foto copy identitas pensiunan ( KARIB / TASPEN )
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>8.</Text>
                    <Text>Kartu penerima pensiun ( untuk ASABRI )</Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    padding: 2,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>9.</Text>
                    <Text>Asli / copy tanda penerima gaji terakhir</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>10.</Text>
                    <Text>Fc NPWP untuk pinjaman diatas Rp. 50.000.000, -</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>11.</Text>
                    <Text>
                      Foto atau gambar bergerak nasabah sedang berjalan
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}></Text>
                    <Text></Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid #aaa",
                      padding: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        textAlign: "justify",
                        fontWeight: "bold",
                      }}
                    >
                      <Text>
                        Anda dapat menyampaikan pertanyaan dan pengaduan melalui
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        textAlign: "justify",
                      }}
                    >
                      <Text style={{ width: 150 }}>Telepon</Text>
                      <Text>022-4206626</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        textAlign: "justify",
                      }}
                    >
                      <Text style={{ width: 150 }}>Email</Text>
                      <Text>bprsip@yahoo.com</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        textAlign: "justify",
                      }}
                    >
                      <Text style={{ width: 150 }}>Whatsapp</Text>
                      <Text>081399127856</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* END SYARAT & TATACARA */}
            {/* SIMULASI */}
            <View style={{ margin: 2, border: "1px solid #aaa" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  backgroundColor: "#929292",
                  padding: 2,
                  fontWeight: "bold",
                }}
              >
                <Text style={{ color: "white" }}>Simulasi</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                    Pelunasan Dipercepat
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    <Text style={{ width: 150 }}>Sisa pokok</Text>
                    <Text style={{ width: 20 }}></Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    <Text style={{ width: 150 }}>Penalty</Text>
                    <Text style={{ width: 20 }}></Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      height: 10,
                    }}
                  >
                    <Text style={{ width: 150 }}></Text>
                    <Text style={{ width: 20 }}></Text>
                    <Text style={{ width: 100 }}></Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                    Denda angsuran 0,3% per hari setelah 3 hari
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    <Text style={{ width: 120 }}>Cicilan per bulan </Text>
                    <Text style={{ width: 50 }}></Text>
                    <Text style={{ textAlign: "right" }}>
                      {formatNumber(angsuran.toFixed(0))}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    <Text style={{ width: 120 }}>Terlambat 5 hari </Text>
                    <Text style={{ width: 50 }}>5</Text>
                    <Text style={{ textAlign: "right" }}>
                      {formatNumber((angsuran * (0.3 / 100) * 5).toFixed(0))}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* ENDSIMULASI */}
            {/* INFO TAMBAHAN */}
            <View style={{ margin: 2, border: "1px solid #aaa" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  backgroundColor: "#929292",
                  padding: 2,
                  fontWeight: "bold",
                }}
              >
                <Text style={{ color: "white" }}>Informasi Tambahan</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  padding: 3,
                }}
              >
                <View
                  style={{
                    flex: 1,
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
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>1.</Text>
                    <Text style={{ width: 230 }}>
                      Bunga efektif adalah suku bunga yang bersifat menurun
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>2.</Text>
                    <Text style={{ width: 230 }}>
                      Anda akan menerima penawaran produk lain dari pihak ketiga
                      apabila menyetujui untuk membagikan data pribadi ( setuju
                      / Tidak )
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>3.</Text>
                    <Text style={{ width: 230 }}>
                      tidak terdapat Refund ( pengembalian ) asuransi untuk
                      pelunasan di percepat
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>4.</Text>
                    <Text style={{ width: 230 }}>
                      Pengembalian dokumen agunan pada hari yang sama saat
                      pelunasan
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>5.</Text>
                    <Text style={{ width: 230 }}>
                      Debitur wajib memberikan informasi dan atau data yang
                      benar sesuai kondisi yang sesungguhnya
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>6.</Text>
                    <Text style={{ width: 230 }}>
                      Calon debitur di beri kesempatan untuk memahami klausula
                      perjanjian selama dua hari
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
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
                      textAlign: "justify",
                      fontWeight: "bold",
                    }}
                  >
                    <Text>Disclaimer (penting untuk dibaca):</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>1.</Text>
                    <Text style={{ width: 230 }}>
                      Anda telah membaca, menerima penjelasan, dan memahami
                      produk kredit pensiunan sesuai Ringkasan Informasi Produk
                      dan Layanan
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>2.</Text>
                    <Text style={{ width: 230 }}>
                      Ringkasan Informasi Produk dan Layanan ini bukan merupakan
                      bagian dari perjanjian kredit
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>3.</Text>
                    <Text style={{ width: 230 }}>
                      Anda wajib untuk tetap membaca, memahami, dan
                      menandatangani perjanjian kredit
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>4.</Text>
                    <Text style={{ width: 230 }}>
                      Informasi yang tercakup dalam Ringkasan Informasi Produk
                      dan Layanan ini berlaku sejak tanggal cetak dokumen sampai
                      dengan
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      textAlign: "justify",
                    }}
                  >
                    <Text style={{ width: 10 }}>5.</Text>
                    <Text style={{ width: 230 }}>
                      Anda harus membaca dengan teliti Ringkasan Informasi
                      Produk dan Layanan ini sebelum menyetujui pembukaan
                      rekening pinjaman dan berhak bertanya kepada pegawai Bank
                      atas semua hal terkait Ringkasan Informasi Produk dan
                      Layanan ini
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* END INFO TAMBAHAN */}
          </View>
          {/* END BIAYA */}
          <View style={{ textAlign: "right", marginRight: 100 }}>
            <Text>Bandung,...</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              textAlign: "center",
              paddingLeft: 30,
              paddingRight: 30,
            }}
          >
            <View>
              <Text>Pegawai / petugas yang menjelaskan</Text>
              <Text style={{ marginTop: 50 }}>
                BPR SIP Berizin dan diawasi oleh OJK
              </Text>
            </View>
            <View>
              <Text>Konsumen</Text>
              <Text style={{ marginTop: 50 }}>{data.nama}</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
