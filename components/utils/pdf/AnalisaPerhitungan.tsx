"use client";

import moment from "moment";
import { DataDataPengajuan } from "../Interfaces";
import {
  formatNumber,
  getUsiaMasuk,
  getUsiaTanggalLunas,
  inputTextToDecimal,
} from "../inputUtils";
import { ceiling } from "./pdfUtil";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";
import { Image, Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";

export default function AnalisaPerhitungan({
  data,
}: {
  data: DataDataPengajuan;
}) {
  const usiaLunas = getUsiaTanggalLunas(
    (data.tanggal_cetak_akad || moment()).toString(),
    data.DataPembiayaan.tanggal_lahir,
    data.DataPembiayaan.tenor
  );
  const usiaMasuk = getUsiaMasuk(
    data.DataPembiayaan.tanggal_lahir,
    (data.tanggal_cetak_akad || moment()).toString()
  );
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
        ).toString()
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
        ).toString();

  const admin =
    data.DataPembiayaan.plafond *
    ((data.DataPembiayaan.by_admin +
      data.DataPembiayaan.by_admin_bank +
      data.DataPembiayaan.by_lainnya) /
      100);
  const kotor =
    data.DataPembiayaan.plafond -
    (admin +
      data.DataPembiayaan.by_tatalaksana +
      data.DataPembiayaan.plafond * (data.DataPembiayaan.by_asuransi / 100) +
      data.DataPembiayaan.by_buka_rekening +
      data.DataPembiayaan.by_materai +
      data.DataPembiayaan.by_mutasi +
      data.DataPembiayaan.by_epotpen +
      data.DataPembiayaan.by_flagging +
      data.DataPembiayaan.by_provisi +
      data.DataPembiayaan.retensi +
      data.DataPembiayaan.blokir * parseInt(angsuran));
  return (
    <Page size={"A4"} style={stylePdf.root}>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
        }}
      >
        <View>
          <Image
            src={
              process.env.NEXT_PUBLIC_APP_LOGO || "/assets/images/logo_kpf.jpg"
            }
            style={{ width: 50 }}
          />
        </View>
        <View style={{ fontWeight: "bold", textAlign: "center" }}>
          <Text style={{ fontSize: 10 }}>ANALISA PEHITUNGAN</Text>
        </View>
        <Text>PRODUK : {data.DataPembiayaan.Produk.name.toUpperCase()}</Text>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 30,
          marginTop: 50,
        }}
      >
        <View
          style={{
            flex: 1,
            border: "1px solid #aaa",
          }}
        >
          <View
            style={{
              backgroundColor: "orange",
              color: "white",
              padding: 10,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <Text>DATA PEMBIAYAAN</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Nama</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <Text style={{ flex: 2, textAlign: "right" }}>
              {data.DataPembiayaan.name}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Nopen</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <Text style={{ flex: 2, textAlign: "right" }}>
              {data.DataPembiayaan.nopen}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Tanggal Lahir</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <Text style={{ flex: 2, textAlign: "right" }}>
              {data.DataPembiayaan.tanggal_lahir}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Usia Masuk</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <Text style={{ flex: 2, textAlign: "right" }}>
              {usiaMasuk.tahun} Tahun {usiaMasuk.bulan} Bulan {usiaMasuk.hari}{" "}
              Hari
            </Text>
          </View>
          <View
            style={{
              ...{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "2px 10px",
              },
              fontWeight: "bold",
            }}
          >
            <Text style={{ width: 100 }}>Usia Lunas</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <Text style={{ flex: 2, textAlign: "right" }}>
              {usiaLunas.tahun} Tahun {usiaLunas.bulan} Bulan {usiaLunas.hari}{" "}
              Hari
            </Text>
          </View>
          <View
            style={{
              ...{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "2px 10px",
              },
              fontWeight: "bold",
            }}
          >
            <Text style={{ width: 100 }}>Tanggal Lunas</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <Text style={{ flex: 2, textAlign: "right" }}>
              {moment(data.tanggal_cetak_akad)
                .add(data.DataPembiayaan.tenor, "M")
                .format("DD-MM-YYYY")}
            </Text>
          </View>
          <View
            style={{
              ...{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "2px 10px",
              },
              fontWeight: "bold",
            }}
          >
            <Text style={{ width: 100 }}>Gaji Bersih</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp. </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(data.DataPembiayaan.gaji_bersih.toFixed(0))}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Produk Pembiayaan</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <Text style={{ flex: 2, textAlign: "right" }}>
              {data.DataPembiayaan.Produk.name}
            </Text>
          </View>
          {data.Bank.kode === "BPR SIP" && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "2px 10px",
              }}
            >
              <Text style={{ width: 100 }}>Margin Bunga</Text>
              <Text style={{ flex: 0.3 }}>:</Text>
              <Text style={{ flex: 2, textAlign: "right" }}>
                {data.DataPembiayaan.mg_bunga} %
              </Text>
            </View>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Jenis Pembiayaan</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <Text style={{ flex: 2, textAlign: "right" }}>
              {data.DataPembiayaan.jenis_pembiayaan_id
                ? data.DataPembiayaan.JenisPembiayaan.name
                : "Sisa Gaji"}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Tenor</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <Text style={{ flex: 2, textAlign: "right" }}>
              {data.DataPembiayaan.tenor} Bulan
            </Text>
          </View>
          <View
            style={{
              ...{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "2px 10px",
              },
              fontWeight: "bold",
            }}
          >
            <Text style={{ width: 100 }}>Plafond</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp. </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(data.DataPembiayaan.plafond.toFixed(0))}
              </Text>
            </View>
          </View>
          <View
            style={{
              ...{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "2px 10px",
              },
              fontWeight: "bold",
            }}
          >
            <Text style={{ width: 100 }}>Angsuran</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp. </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(angsuran)}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            border: "1px solid #aaa",
          }}
        >
          <View
            style={{
              backgroundColor: "orange",
              color: "white",
              padding: 10,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <Text>DATA PEMBIAYAAN</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Biaya Administrasi</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp. </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(admin.toFixed(0))}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Biaya Tatalaksana</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp. </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(data.DataPembiayaan.by_tatalaksana.toFixed(0))}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Biaya Asuransi</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp. </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(
                  (
                    data.DataPembiayaan.plafond *
                    (data.DataPembiayaan.by_asuransi / 100)
                  ).toFixed(0)
                )}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Biaya Buka Rekening</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp. </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(data.DataPembiayaan.by_buka_rekening.toFixed(0))}
              </Text>
            </View>
          </View>
          {data.DataPembiayaan.by_mutasi && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "2px 10px",
              }}
            >
              <Text style={{ width: 100 }}>Biaya Mutasi</Text>
              <Text style={{ flex: 0.3 }}>:</Text>
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  width: 100,
                }}
              >
                <Text style={{ flex: 1 }}>Rp.</Text>
                <Text style={{ flex: 1, textAlign: "right" }}>
                  {formatNumber(data.DataPembiayaan.by_mutasi.toFixed(0))}
                </Text>
              </View>
            </View>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>
              Biaya{" "}
              {data.Bank.kode === "BPR SIP" ? "Layanan Kredit" : "Provisi"}
            </Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp. </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(data.DataPembiayaan.by_provisi.toFixed(0))}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Biaya Materai</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp.</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(data.DataPembiayaan.by_materai.toFixed(0))}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Biaya Data Informasi</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp.</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
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
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Retensi Angsuran</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp.</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(data.DataPembiayaan.retensi.toFixed(0))}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>
              Blokir Angsuran {data.DataPembiayaan.blokir}x
            </Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp.</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(
                  (data.DataPembiayaan.blokir * parseInt(angsuran)).toFixed(0)
                )}
              </Text>
            </View>
          </View>
          <View
            style={{
              ...{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "2px 10px",
              },
              fontWeight: "bold",
            }}
          >
            <Text style={{ width: 100 }}>Terima Kotor</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp.</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(kotor.toFixed(0))}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>BPP</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp.</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(data.DataPembiayaan.bpp.toFixed(0))}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Pelunasan</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp.</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(data.DataPembiayaan.pelunasan.toFixed(0))}
              </Text>
            </View>
          </View>
          <View
            style={{
              ...{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "2px 10px",
              },
              fontWeight: "bold",
            }}
          >
            <Text style={{ width: 100 }}>Terima Bersih</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp.</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(
                  (
                    kotor -
                    (data.DataPembiayaan.bpp + data.DataPembiayaan.pelunasan)
                  ).toFixed(0)
                )}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "2px 10px",
            }}
          >
            <Text style={{ width: 100 }}>Sisa Gaji</Text>
            <Text style={{ flex: 0.3 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                width: 100,
              }}
            >
              <Text style={{ flex: 1 }}>Rp.</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {formatNumber(
                  (
                    data.DataPembiayaan.gaji_bersih -
                    inputTextToDecimal(angsuran)
                  ).toFixed(0)
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          marginTop: 20,
          lineHeight: 1.5,
          textAlign: "justify",
        }}
      >
        <View style={{ width: "90%", lineHeight: 1.5 }}>
          <Text style={{ fontWeight: "bold" }}>Keterangan:</Text>
          <View style={{ marginTop: 5 }}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ width: 10 }}>1.</Text>
              <Text>
                Memberikan Kuasa kepada BANK untuk mentransfer dana realisasi
                pembiayaan ke rekening{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {process.env.NEXT_PUBLIC_APP_FULL_NAME} (
                  {process.env.NEXT_PUBLIC_APP_NAME})
                </Text>{" "}
                di Bank.
              </Text>
            </View>
            <View
              style={{ marginTop: 5, display: "flex", flexDirection: "row" }}
            >
              <Text style={{ width: 10 }}>2.</Text>
              <Text>
                Menyatakan telah menerima fasilitas Pembiayaan BANK melalui{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {process.env.NEXT_PUBLIC_APP_FULL_NAME} (
                  {process.env.NEXT_PUBLIC_APP_NAME})
                </Text>{" "}
                selaku kuasa BANK sebesar Pokok Pembiayaan tersebut di atas
                dengan cara pembayaran : Transfer ke Rekening / Tunai.
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
        <Text render={({ pageNumber, totalPages }) => `${pageNumber}`}></Text>
      </View>
    </Page>
  );
}
