import { Image, Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { formatNumber } from "../inputUtils";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";
import moment from "moment";
import { ceiling } from "./pdfUtil";
import { DataDataPengajuan } from "../Interfaces";
const angkaTerbilang = require("angka-menjadi-terbilang");

export default function BuktiPembayaran({
  data,
  isFor,
}: {
  data: DataDataPengajuan;
  isFor: string;
}) {
  const angsuran = ceiling(
    parseInt(
      getAngsuranPerBulan(
        data.DataPembiayaan.mg_bunga,
        data.DataPembiayaan.tenor,
        data.DataPembiayaan.plafond
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
      data.DataPembiayaan.by_mutasi +
      data.DataPembiayaan.by_provisi +
      data.DataPembiayaan.by_materai +
      data.DataPembiayaan.by_epotpen +
      data.DataPembiayaan.by_flagging +
      data.DataPembiayaan.retensi +
      data.DataPembiayaan.blokir * parseInt(angsuran));
  const bersih =
    kotor - (data.DataPembiayaan.bpp + data.DataPembiayaan.pelunasan);
  return (
    <Page size={"A4"} style={stylePdf.root}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 30,
          alignItems: "center",
        }}
      >
        <View style={{ alignSelf: "baseline" }}>
          <Image
            src={data.Bank.logo || process.env.NEXT_PUBLIC_APP_LOGO}
            style={{ width: 50 }}
          />
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          <Text>BUKTI PENCAIRAN PEMBIAYAAN</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image src={process.env.NEXT_PUBLIC_APP_LOGO} style={{ width: 50 }} />
          <Text style={{ fontWeight: "bold", fontSize: 10 }}>{isFor}</Text>
        </View>
      </View>
      <View style={{ lineHeight: 1.5, marginBottom: 20 }}>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 150 }}>Nama</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>{data.DataPembiayaan.name}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 150 }}>Nopen</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>{data.DataPembiayaan.nopen}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 150 }}>Kantor Bayar Pensiun</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>
            {data.DataPembiayaan.juru_bayar_tujuan}
          </Text>
        </View>
      </View>
      <View style={{ lineHeight: 1.5, marginBottom: 20 }}>
        <Text style={{ fontWeight: "bold", textDecoration: "underline" }}>
          RINCIAN PENERIMAAN PEMBIAYAAN
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 150 }}>Pokok Pembiayaan</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>
            Rp. {formatNumber(data.DataPembiayaan.plafond.toFixed(0))}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 150 }}>Biaya Administrasi</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>
            Rp. {formatNumber(admin.toFixed(0))}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 150 }}>Biaya Asuransi</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>
            Rp.{" "}
            {formatNumber(
              (
                data.DataPembiayaan.plafond *
                (data.DataPembiayaan.by_asuransi / 100)
              ).toFixed(0)
            )}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 150 }}>Biaya Pembukaan Rekening</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>
            Rp. {formatNumber(data.DataPembiayaan.by_buka_rekening.toFixed(0))}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 150 }}>Biaya Materai</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>
            Rp. {formatNumber(data.DataPembiayaan.by_materai.toFixed(0))}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 150 }}>Biaya Lain-lain</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>
            Rp.{" "}
            {formatNumber(
              (
                data.DataPembiayaan.by_flagging +
                data.DataPembiayaan.by_epotpen +
                data.DataPembiayaan.by_tatalaksana +
                data.DataPembiayaan.by_mutasi +
                data.DataPembiayaan.by_provisi
              ).toFixed(0)
            )}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            fontWeight: "bold",
          }}
        >
          <Text style={{ width: 150 }}>Penerimaan Bersih</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>
            Rp. {formatNumber(bersih.toFixed(0))} - (
            {angkaTerbilang(bersih)
              .split(" ")
              .map(function (word: string) {
                return word.charAt(0).toUpperCase().concat(word.substr(1));
              })
              .join(" ")}{" "}
            Rupiah)
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 150 }}>Margin Efektif</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>{data.DataPembiayaan.mg_bunga}%</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={{ width: 150 }}>Jangka Waktu</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>{data.DataPembiayaan.tenor} Bulan</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            fontWeight: "bold",
          }}
        >
          <Text style={{ width: 150 }}>Total Angsuran</Text>
          <Text style={{ width: 20 }}>:</Text>
          <View style={{ width: 300 }}>
            <Text>
              Rp. {formatNumber(angsuran)}
              {" - "}(
              {angkaTerbilang(parseInt(angsuran))
                .split(" ")
                .map(function (word: string) {
                  return word.charAt(0).toUpperCase().concat(word.substr(1));
                })
                .join(" ")}{" "}
              Rupiah )
            </Text>
          </View>
        </View>
      </View>
      <View style={{ width: 530, marginTop: 10, marginBottom: 20 }}>
        <Text>
          Menyatakan telah menerima fasilitas Pembiayaan {data.Bank.name}{" "}
          melalui {process.env.NEXT_PUBLIC_APP_FULL_NAME} sebesar tersebut di
          atas melalui BANK Transfer ke rekening Debitur.
        </Text>
      </View>
      <View style={{ marginBottom: 20 }}>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 150 }}>Dibuat Di</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>
            {data.User.unit_cabang_id ? data.User.UnitCabang.name : "BANDUNG"}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 150 }}>Tanggal</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>
            {moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")}
          </Text>
        </View>
      </View>
      <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              border: "1px solid #aaa",
              padding: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 200,
            }}
          >
            <Text>Diterima Oleh</Text>
            <View style={{ height: 80 }}></View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text style={{ height: 10, fontWeight: "bold" }}>
                {data.DataPembiayaan.name}
              </Text>
              <View
                style={{ width: 150, borderBottom: "1px solid #aaa" }}
              ></View>
              <Text style={{ height: 10 }}>Debitur</Text>
            </View>
          </View>
          <View
            style={{
              border: "1px solid #aaa",
              padding: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 200,
            }}
          >
            <Text>Diperiksa Oleh</Text>
            <View style={{ height: 80 }}></View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text style={{ height: 10, fontWeight: "bold" }}></Text>
              <View
                style={{ width: 150, borderBottom: "1px solid #aaa" }}
              ></View>
              <Text style={{ height: 10 }}>Kepala Unit Pelayanan</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              border: "1px solid #aaa",
              padding: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 200,
            }}
          >
            <Text>Diperiksa Oleh</Text>
            <View style={{ height: 80 }}></View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text style={{ height: 10, fontWeight: "bold" }}>
                {process.env.NEXT_PUBLIC_APP_MANAJER_KEUANGAN || "Lulu"}
              </Text>
              <View
                style={{ width: 150, borderBottom: "1px solid #aaa" }}
              ></View>
              <Text style={{ height: 10 }}>Manajer Keuangan</Text>
            </View>
          </View>
          <View
            style={{
              border: "1px solid #aaa",
              padding: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 200,
            }}
          >
            <Text>Diotorisasi Oleh</Text>
            <View style={{ height: 80 }}></View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text style={{ height: 10, fontWeight: "bold" }}>
                {process.env.NEXT_PUBLIC_APP_DIREKTUR || "Lodewijk HF Lantang"}
              </Text>
              <View
                style={{ width: 150, borderBottom: "1px solid #aaa" }}
              ></View>
              <Text style={{ height: 10 }}>Kepala Operasional</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
}
