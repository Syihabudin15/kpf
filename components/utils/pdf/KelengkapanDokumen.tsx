import { Image, Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { formatNumber } from "../inputUtils";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";
import { ceiling, docChecklist } from "./pdfUtil";
import { DataDataPengajuan } from "../Interfaces";
import { useEffect } from "react";

export default function KelengkapanDokumen({
  data,
}: {
  data: DataDataPengajuan;
}) {
  const top = docChecklist(data.Bank.kode || "").top;
  const bottom = docChecklist(data.Bank.kode || "").bottom;

  return (
    <Page size={"A4"} style={stylePdf.root}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Image
            src={data.Bank.logo || process.env.NEXT_PUBLIC_APP_LOGO}
            style={{ width: 50 }}
          />
        </View>
        <View>
          <Image src={process.env.NEXT_PUBLIC_APP_LOGO} style={{ width: 50 }} />
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 20,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View style={{ width: 300 }}>
          <View
            style={{
              fontWeight: "bold",
              display: "flex",
              flexDirection: "row",
              fontSize: 10,
              textAlign: "center",
            }}
          >
            <Text style={{ width: 100, border: "1px solid #aaa", padding: 3 }}>
              {data.area_pelayanan_berkas || "PUSAT"}
            </Text>
            <Text style={{ border: "1px solid #aaa", padding: 3, width: 130 }}>
              {data.DataPembiayaan.Produk.name}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text style={{ width: 100, border: "1px solid #aaa", padding: 2 }}>
              NAMA DEBITUR
            </Text>
            <Text style={{ border: "1px solid #aaa", padding: 2, width: 130 }}>
              {data.DataPembiayaan.name}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text style={{ width: 100, border: "1px solid #aaa", padding: 2 }}>
              NO. SK PENSIUN
            </Text>
            <Text style={{ border: "1px solid #aaa", padding: 2, width: 130 }}>
              {data.nomor_sk_pensiun}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text style={{ width: 100, border: "1px solid #aaa", padding: 2 }}>
              PEMBIAYAAN
            </Text>
            <Text style={{ border: "1px solid #aaa", padding: 2, width: 130 }}>
              Rp. {formatNumber(data.DataPembiayaan.plafond.toFixed(0))}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text style={{ width: 100, border: "1px solid #aaa", padding: 2 }}>
              ANGSURAN
            </Text>
            <Text style={{ border: "1px solid #aaa", padding: 2, width: 130 }}>
              Rp.{" "}
              {formatNumber(
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
                    ).toString()
              )}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text style={{ width: 100, border: "1px solid #aaa", padding: 2 }}>
              JANGKA WAKTU
            </Text>
            <Text style={{ border: "1px solid #aaa", padding: 2, width: 130 }}>
              {data.DataPembiayaan.tenor} Bulan
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text style={{ width: 100, border: "1px solid #aaa", padding: 2 }}>
              JENIS PEMBIAYAAN
            </Text>
            <Text style={{ border: "1px solid #aaa", padding: 2, width: 130 }}>
              {data.DataPembiayaan.jenis_pembiayaan_id
                ? data.DataPembiayaan.JenisPembiayaan.name
                : ""}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text style={{ width: 100, border: "1px solid #aaa", padding: 2 }}>
              ADMIN INPUT
            </Text>
            <Text style={{ border: "1px solid #aaa", padding: 2, width: 130 }}>
              {data.DataPembiayaan.User.first_name}{" "}
              {data.DataPembiayaan.User.last_name}
            </Text>
          </View>
        </View>
        <View
          style={{
            fontWeight: "bold",
            fontSize: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>{process.env.NEXT_PUBLIC_APP_FULL_NAME?.toUpperCase()}</Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          marginBottom: 10,
          fontWeight: "bold",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text>CHECKLIST KELENGKAPAN DOKUMEN</Text>
        <Text>PEMBIAYAAN PENSIUNAN</Text>
      </View>
      <View style={{ fontSize: 8 }}>
        <View
          style={{
            textAlign: "center",
            display: "flex",
            fontWeight: "bold",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: 30,
              border: "1px solid #aaa",
              padding: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text>NO</Text>
          </View>
          <View
            style={{
              width: 120,
              border: "1px solid #aaa",
              padding: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text>DOKUMEN PERSYARATAN</Text>
            <Text>PENGAJUAN PEMBIAYAAN</Text>
          </View>
          <View
            style={{
              width: 80,
              border: "1px solid #aaa",
              padding: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text>CHECK</Text>
            <Text>MARKETING</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ flex: 1, border: "1px solid #aaa" }}>Asli</Text>
              <Text style={{ flex: 1, border: "1px solid #aaa" }}>FC</Text>
            </View>
          </View>
          <View
            style={{
              width: 40,
              border: "1px solid #aaa",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text>Lbr</Text>
          </View>
          <View
            style={{
              width: 80,
              border: "1px solid #aaa",
              padding: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text>CHECK</Text>
            <Text>MITRA PUSAT</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ flex: 1, border: "1px solid #aaa" }}>Asli</Text>
              <Text style={{ flex: 1, border: "1px solid #aaa" }}>FC</Text>
            </View>
          </View>
          <View
            style={{
              width: 40,
              border: "1px solid #aaa",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text>Lbr</Text>
          </View>
          <View
            style={{
              width: 80,
              border: "1px solid #aaa",
              padding: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text>CHECK</Text>
            <Text>{data.Bank.kode}</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ flex: 1, border: "1px solid #aaa" }}>Asli</Text>
              <Text style={{ flex: 1, border: "1px solid #aaa" }}>FC</Text>
            </View>
          </View>
          <View
            style={{
              width: 40,
              border: "1px solid #aaa",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>Lbr</Text>
          </View>
        </View>
        <View>
          {top.map((body, ind) => (
            <View key={ind} style={{ display: "flex", flexDirection: "row" }}>
              {body.map((value, index) => (
                <Text
                  key={index}
                  style={{
                    width: value.width,
                    border: "1px solid #aaa",
                    padding: 1,
                    textAlign: index == 1 ? "left" : "center",
                  }}
                >
                  {value.data}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          <View
            style={{
              width: 30,
              border: "1px solid #aaa",
              display: "flex",
              padding: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>No</Text>
          </View>
          <View
            style={{
              width: 120,
              border: "1px solid #aaa",
              display: "flex",
              padding: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>DESKRIPSI DOKUMEN</Text>
          </View>
          <View
            style={{
              width: 80,
              border: "1px solid #aaa",
              display: "flex",
              padding: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>ASLI/COPY</Text>
          </View>
          <View
            style={{
              width: 280,
              padding: 1,
              border: "1px solid #aaa",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text>CHECKLIST</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ flex: 1, border: "1px solid #aaa" }}>
                MARKETING
              </Text>
              <Text style={{ flex: 1, border: "1px solid #aaa" }}>
                MITRA PUSAT
              </Text>
              <Text style={{ flex: 1, border: "1px solid #aaa" }}>
                {data.Bank.kode}
              </Text>
            </View>
          </View>
        </View>
        {bottom.map((body, index) => (
          <View key={index} style={{ display: "flex", flexDirection: "row" }}>
            {body.map((b, ind) => (
              <Text
                style={{
                  width: b.width,
                  border: "1px solid #aaa",
                  padding: 1,
                  textAlign: ind === 1 ? "left" : "center",
                }}
                key={ind}
              >
                {b.data}
              </Text>
            ))}
          </View>
        ))}
      </View>
      <Text style={{ marginTop: 20 }}>Keterangan :</Text>
      <View style={{ marginLeft: 10, lineHeight: 1.5 }}>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 20 }}></Text>
          <Text>Isi dengan tanda cek (v)</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 20 }}>*</Text>
          <Text>Coret yang tidak perlu</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 20 }}>**</Text>
          <Text>
            Bila ada wajib dilampirkan Seluruh dokumen menggunakan kertas A4 70
            gram
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            color: "red",
            gap: 10,
          }}
        >
          <Text style={{ width: 20, gap: 10 }}>***</Text>
          <Text>
            Semua Form-form yang di minta sudah di isi lengkap (Redaksi,
            Materai, Tanda Tangan terkait)
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            color: "red",
            gap: 10,
          }}
        >
          <Text style={{ width: 20 }}>****</Text>
          <Text>Cabang Mengirim berkas H+2 dari tanggal Pencairan Tahap 2</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            color: "red",
            gap: 10,
          }}
        >
          <Text style={{ width: 20 }}>*****</Text>
          <Text>Maksimal pengiriman berkas tanggal 5 bulan berikutnya</Text>
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
  );
}
