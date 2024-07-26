import { Document, Page, PDFViewer, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { stylePdf } from "./stylePdf";
import { formatNumber } from "../inputUtils";
import moment from "moment";
import { ceiling } from "./pdfUtil";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";

export default function RiplaySIP({ data }: { data: DataDataPengajuan }) {
  const angsuran = ceiling(
    parseInt(
      getAngsuranPerBulan(
        data.DataPembiayaan.mg_bunga,
        data.DataPembiayaan.tenor,
        data.DataPembiayaan.plafond
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
              paddingBottom: 20,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
              RINGKASAN INFORMASI PRODUK DAN LAYANAN (RIPLAY)
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 30,
              marginTop: 10,
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
          <View style={{ marginTop: 10, marginBottom: 10, lineHeight: 1.3 }}>
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
                paddingTop: 5,
                paddingBottom: 5,
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
                gap: 20,
                padding: 5,
              }}
            >
              <View
                style={{
                  flex: 1,
                  border: "1px solid #aaa",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
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
                  <Text style={{ width: 20 }}>
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
                  gap: 3,
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
                gap: 3,
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
                gap: 20,
                padding: 5,
              }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: "#929292",
                    paddingTop: 5,
                    paddingBottom: 5,
                    fontWeight: "bold",
                  }}
                >
                  <Text style={{ color: "white" }}>MANFAAT</Text>
                </View>
                <View
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}
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
                    <Text>
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
                    <Text>
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
                    <Text>
                      dapat menentukan jangka waktu pelunasan sesuai dengan
                      kemampuan Anda.
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: "#929292",
                    paddingTop: 5,
                    paddingBottom: 5,
                    fontWeight: "bold",
                  }}
                >
                  <Text style={{ color: "white" }}>RESIKO</Text>
                </View>
                <View
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}
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
                    <Text>
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
                    <Text>
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
                    <Text>
                      Tercatatnya riwayat kredit Anda pada Sistem Layanan
                      Informasi Keuangan (SLIK) ketika Anda menunggak
                      pembayaran.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* END MANFAAT & RESIKO */}
          </View>
          {/* END BIAYA */}
        </Page>
      </Document>
    </PDFViewer>
  );
}
