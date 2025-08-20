import { DataDataPengajuan } from "../Interfaces";
import { Image, Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { formatNumber } from "../inputUtils";
import { ceiling } from "./pdfUtil";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";
const angkaTerbilang = require("angka-menjadi-terbilang");

export default function TandaTerimaDebitur({
  data,
}: {
  data: DataDataPengajuan;
}) {
  const admin =
    data.DataPembiayaan.plafond *
    ((data.DataPembiayaan.by_admin +
      data.DataPembiayaan.by_admin_bank +
      data.DataPembiayaan.by_lainnya) /
      100);
  const asuransi =
    data.DataPembiayaan.plafond * (data.DataPembiayaan.by_asuransi / 100);
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
              data.Bank.kode,
              data.DataPembiayaan.pembulatanKhusus
            )
          ),
          data.DataPembiayaan.pembulatan
        );
  const blokir = data.DataPembiayaan.blokir * angsuran;

  const kotor =
    data.DataPembiayaan.plafond -
    (admin +
      asuransi +
      data.DataPembiayaan.by_tatalaksana +
      data.DataPembiayaan.by_materai +
      data.DataPembiayaan.by_buka_rekening +
      data.DataPembiayaan.by_mutasi +
      data.DataPembiayaan.by_epotpen +
      data.DataPembiayaan.by_flagging +
      data.DataPembiayaan.by_provisi);
  const bersih =
    kotor - (data.DataPembiayaan.bpp + data.DataPembiayaan.pelunasan);
  return (
    <Page size={"A4"} style={stylePdf.root}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <View style={{ alignSelf: "baseline" }}>
          <Image
            src={data.Bank.logo || process.env.NEXT_PUBLIC_APP_LOGO}
            style={{ width: 50 }}
          />
        </View>
        <Text style={{ fontSize: 10, fontWeight: "bold" }}>
          TANDA TERIMA UANG OLEH NASABAH
        </Text>
        <Text></Text>
      </View>
      <View style={{ lineHeight: 2 }}>
        <Text>
          Dengan ini telah diakui oleh yang bertandatangan dibawah ini :
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 50 }}>Nama</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text>{data.nama}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 50 }}>Pekerjaan</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text>{data.pekerjaan_sekarang}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 50 }}>Alamat</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 200, lineHeight: 2 }}>
            {data.DataPengajuanAlamat.alamat} {data.DataPengajuanAlamat.rt}/
            {data.DataPengajuanAlamat.rw}, {data.DataPengajuanAlamat.kelurahan}{" "}
            {data.DataPengajuanAlamat.kecamatan},{" "}
            {data.DataPengajuanAlamat.kota} {data.DataPengajuanAlamat.provinsi}{" "}
            {data.DataPengajuanAlamat.kode_pos}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 30, lineHeight: 2 }}>
        <Text>Untuk dan atas nama sendiri :</Text>
        <Text>
          Bahwa saya telah menerima uang dari PT. BPR Bina Dana Swadaya sejumlah{" "}
          <Text style={{ fontWeight: "bold" }}>
            Rp. {formatNumber(bersih.toFixed(0))} (
            {angkaTerbilang(bersih)
              .split(" ")
              .map(function (word: string) {
                return word.charAt(0).toUpperCase().concat(word.substr(1));
              })
              .join(" ")}{" "}
            Rupiah)
          </Text>
        </Text>
        <Text>
          sebagai pinjaman dengan syarat-syarat yang tercantum dalam Perjanjian
          Kredit No: <Text style={{ marginLeft: 10 }}>/BDS-PK/KKM/</Text>
          <Text style={{ marginLeft: 10 }}> /</Text>
          <Text style={{ marginLeft: 10 }}> tanggal</Text>
        </Text>
      </View>
      <View
        style={{
          marginTop: 50,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View>
          <Text>Jakarta</Text>
        </View>
        <View
          style={{
            height: 90,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text>Materai</Text>
          <Text>Rp. 10.000</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: 100,
          }}
        >
          <Text style={{ width: 100, borderBottom: "1px solid #aaa" }}></Text>
          <Text>Debitur</Text>
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
