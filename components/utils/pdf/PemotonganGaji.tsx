import { DataDataPengajuan } from "../Interfaces";
import { Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import moment from "moment";

export default function PemotonganGaji({
  data,
  page,
}: {
  data: DataDataPengajuan;
  page: number;
}) {
  return (
    <Page size={"A4"} style={stylePdf.root}>
      <View
        style={{
          fontWeight: "bold",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Text style={{ fontSize: 10 }}>SURAT PERNYATAAN</Text>
        <Text>PERIHAL : PEMOTONGAN GAJI DIATAS 70%</Text>
      </View>
      <View style={{ marginTop: 30, marginBottom: 10 }}>
        <Text>Yang bertanda tangan dibawah ini :</Text>
      </View>
      <View style={{ lineHeight: 1.5 }}>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 120 }}>Nama</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>{data.DataPembiayaan.name}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 120 }}>Nopen</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>{data.DataPembiayaan.nopen}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 120 }}>No KTP</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>{data.nik}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 120 }}>Alamat</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>
            {data.DataPengajuanAlamat.alamat}{" "}
            {data.DataPengajuanAlamat.rt && data.DataPengajuanAlamat.rt + "/"}
            {data.DataPengajuanAlamat.rw}, {data.DataPengajuanAlamat.kelurahan},{" "}
            {data.DataPengajuanAlamat.kecamatan},{" "}
            {data.DataPengajuanAlamat.kota}, {data.DataPengajuanAlamat.provinsi}{" "}
            {data.DataPengajuanAlamat.kode_pos}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 10, marginBottom: 10, lineHeight: 1.5 }}>
        <Text>
          Sehubungan saya memerlukan dana yang cukup besar, dengan ini saya
          menyatakan :
        </Text>
      </View>
      <View style={{ width: 530, lineHeight: 1.5 }}>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text>1.</Text>
          <View>
            <Text>
              Bersedia membayar angsuran pembiayaan BANK diatas 70% gaji pensiun
              yang saya terima setiap bulan, karena :
            </Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <Text>a.</Text>
              <Text>
                Saya memiliki penghasilan tetap dari usaha diluar gaji
                pensiun.*)
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                width: 500,
              }}
            >
              <Text>b.</Text>
              <Text>
                Saya mendapat tunjangan dari keluarga (anak-anak) setiap bulan
                yang jumlahnya dapat menutupi kekurangan jika sisa gaji pensiun
                tidak mencukupi untuk kebutuhan sehari-hari.*)
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            lineHeight: 1.5,
          }}
        >
          <Text>2.</Text>
          <Text>
            Saya bertanggung jawab atas pengambilan sisa gaji saya setiap
            bulannya di Kantor Bayar Gaji yang ditunjuk oleh{" "}
            {process.env.NEXT_PUBLIC_APP_FULL_NAME}.
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 20, marginBottom: 20, lineHeight: 1.5 }}>
        <Text>
          Demikian surat pernyataan ini dibuat dengan sebenarnya dengan
          dilandasi itikad baik tanpa paksaan dari siapapun dan pihak manapun.
        </Text>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text>
          {data.User.unit_cabang_id ? data.User.UnitCabang.name : "BANDUNG"},{" "}
          {moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View
          style={{
            width: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid #aaa",
            padding: 5,
          }}
        >
          <View style={{ height: 80 }}></View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {data.DataPembiayaan.name}
            </Text>
            <View style={{ width: 150, border: "1px solid #aaa" }}></View>
            <Text style={{ height: 10 }}>Debitur</Text>
          </View>
        </View>
        <View
          style={{
            width: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid #aaa",
            padding: 5,
          }}
        >
          <View style={{ height: 80 }}></View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", height: 10 }}></Text>
            <View style={{ width: 150, border: "1px solid #aaa" }}></View>
            <Text style={{ height: 10 }}>SPV Kantor Layanan</Text>
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
            `${pageNumber < page ? pageNumber : page}`
          }
          fixed
        ></Text>
      </View>
    </Page>
  );
}
