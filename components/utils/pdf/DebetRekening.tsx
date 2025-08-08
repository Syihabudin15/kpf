"use client";

import { Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { formatNumber } from "../inputUtils";
const angkaTerbilang = require("angka-menjadi-terbilang");
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";
import moment from "moment";
import { ceiling } from "./pdfUtil";
import { DataDataPengajuan } from "../Interfaces";

export default function DebetRekening({ data }: { data: DataDataPengajuan }) {
  return (
    <Page size={"A4"} wrap style={{ ...stylePdf.root, textAlign: "justify" }}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        }}
        fixed
      >
        <Text style={{ fontSize: 10 }}>
          SURAT PERNYATAAN DAN KUASA DEBET REKENING (SPKDR)
        </Text>
        <Text>No. ....... /KPF-SPKDR/.........../20........</Text>
      </View>
      <View style={{ marginTop: 30, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold" }}>
          Yang bertanda tangan dibawah ini,
        </Text>
      </View>
      <View
        style={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text>1. </Text>
        <Text style={{ width: 130 }}>Nama Penerima Manfaat Pensiun (MP)</Text>
        <Text style={{ width: 20 }}>:</Text>
        <Text>{data.DataPembiayaan.name}</Text>
      </View>
      <View
        style={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text>2. </Text>
        <Text style={{ width: 130 }}>Tempat dan Tanggal Lahir</Text>
        <Text style={{ width: 20 }}>:</Text>
        <Text>
          {data.DataPembiayaan.tempat_lahir},{" "}
          {data.DataPembiayaan.tanggal_lahir}
        </Text>
      </View>
      <View
        style={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text>3. </Text>
        <Text style={{ width: 130 }}>Alamat Lengkap</Text>
        <Text style={{ width: 20 }}>:</Text>
        <Text style={{ width: 300 }}>
          {data.DataPengajuanAlamat.alamat},{" "}
          {data.DataPengajuanAlamat.kelurahan},{" "}
          {data.DataPengajuanAlamat.kecamatan}, {data.DataPengajuanAlamat.kota},{" "}
          {data.DataPengajuanAlamat.provinsi},{" "}
        </Text>
      </View>
      <View
        style={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text>4. </Text>
        <Text style={{ width: 130 }}>No Telepon</Text>
        <Text style={{ width: 20 }}>:</Text>
        <Text style={{ width: 300 }}>{data.no_telepon}</Text>
      </View>
      <View
        style={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text>5. </Text>
        <Text style={{ width: 130 }}>NIP / NRP / NOPEN </Text>
        <Text style={{ width: 20 }}>:</Text>
        <Text style={{ width: 300 }}>{data.DataPembiayaan.nopen}</Text>
      </View>
      <View style={{ marginTop: 30, marginBottom: 10, fontWeight: "bold" }}>
        <Text>
          Yang untuk melakukan tindakan hukum dalam surat ini telah mendapat
          persetujuan dari suami/istri saya yaitu :
        </Text>
      </View>
      <View
        style={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text>1. </Text>
        <Text style={{ width: 130 }}>Nama</Text>
        <Text style={{ width: 20 }}>:</Text>
        <Text>{data.DataPengajuanPasangan.nama_pasangan}</Text>
      </View>
      <View
        style={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text>2. </Text>
        <Text style={{ width: 130 }}>Tempat dan Tanggal Lahir</Text>
        <Text style={{ width: 20 }}>:</Text>
        <Text>
          {data.DataPengajuanPasangan.tempat_lahir_pasangan &&
            data.DataPengajuanPasangan.tempat_lahir_pasangan + ","}{" "}
          {data.DataPengajuanPasangan.tanggal_lahir_pasangan &&
            moment(data.DataPengajuanPasangan.tanggal_lahir_pasangan).format(
              "DD-MM-YYYY"
            )}
        </Text>
      </View>
      <View
        style={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text>3. </Text>
        <Text style={{ width: 130 }}>Alamat Lengkap</Text>
        <Text style={{ width: 20 }}>:</Text>
        <Text style={{ width: 300 }}>
          {data.DataPengajuanPasangan.alamat_pasangan}
        </Text>
      </View>
      <View
        style={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text>4. </Text>
        <Text style={{ width: 130 }}>No KTP</Text>
        <Text style={{ width: 20 }}>:</Text>
        <Text style={{ width: 300 }}>
          {data.DataPengajuanPasangan.nik_pasangan}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 20,
          marginBottom: 20,
          fontWeight: "bold",
        }}
      >
        <Text>{"*)"} diisi apabila Peminjam bukan Janda/Duda</Text>
      </View>
      <View style={{ width: 530, textAlign: "justify", lineHeight: 1.5 }}>
        <Text>
          Sehubungan dengan ini saya menyatakan telah mendapat pembiayaan dari{" "}
          <Text style={{ fontWeight: "bold" }}>
            {process.env.NEXT_PUBLIC_APP_FULL_NAME?.toUpperCase()}
          </Text>{" "}
          Sebesar{" "}
          <Text style={{ fontWeight: "bold" }}>
            Rp.{formatNumber(data.DataPembiayaan.plafond.toFixed(0))},- (
            {angkaTerbilang(data.DataPembiayaan.plafond)
              .split(" ")
              .map(function (word: string) {
                return word.charAt(0).toUpperCase().concat(word.substr(1));
              })
              .join(" ")}{" "}
            Rupiah)
          </Text>
          . atau sejumlah yang disetujui oleh{" "}
          <Text style={{ fontWeight: "bold" }}>
            {process.env.NEXT_PUBLIC_APP_FULL_NAME?.toUpperCase()}
          </Text>
          , serta sesuai dengan surat Perjanjian Pembiayaan nomor{" "}
          <Text style={{ fontWeight: "bold" }}>{data.nomor_akad}</Text> yang
          saya tanda tangani kemudian, yang pembayaran gaji pensiunnya
          dibayarkan di{" "}
          <Text style={{ fontWeight: "bold" }}>
            PT. POS INDONESIA (PERSERO) KANTOR POS
          </Text>
          , maka dengan ini saya menyatakan :
        </Text>
      </View>
      <View
        style={{
          marginLeft: 8,
          marginTop: 10,
          marginBottom: 10,
          textAlign: "justify",
          width: 500,
          lineHeight: 1.5,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Text>1. </Text>
          <Text>
            Pada saat dana pensiun saya sudah masuk ke rekening PT. POS
            INDONESIA (PERSERO), dengan ini saya memberi kuasa kepada PT. POS
            INDONESIA (PERSERO) , untuk melakukan pemotongan dana pensiun saya
            untuk membayar angsuran sebesar{" "}
            <Text>
              Rp.
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
                          data.Bank.kode
                        )
                      ),
                      data.DataPembiayaan.pembulatan
                    ).toString()
              )}
            </Text>{" "}
            sampai dengan pinjaman/kewajiban saya lunas dan hasil potongan
            tersebut disetorkan ke rekening{" "}
            <Text style={{ fontWeight: "bold" }}>
              Bank {process.env.NEXT_PUBLIC_APP_NAMA_BANK} a.n{" "}
              {process.env.NEXT_PUBLIC_APP_FULL_NAME?.toUpperCase()} dengan
              nomor rekening {process.env.NEXT_PUBLIC_APP_NO_REK}
            </Text>{" "}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Text>2. </Text>
          <Text>
            Bahwa sisa gaji saya sendiri pada saat ini dan seterusnya (sampai
            pembiayan saya lunas) benar-benar cukup untuk dipotong sejumhlah
            tersebut diatas, dan jika ternyata dikemudian hari gaji saya tidak
            cukup jumlahnya untuk dipotong karena sebab apapun, maka berarti
            saya telah melakukan tindakan pidana pemalsuan data/keterangan
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Text>3. </Text>
          <Text>
            Bahwa sepenuhnya dari pembiayaan yang saya ambil/terima tersebut
            benar-benar saya pergunakan untuk keperluan saya sendiri dan saya
            tidak akan mengalihkan tempat pengambilan gaji pensiun saya ketempat
            lain sampai dengan pembiayaan saya lunas sepenuhnya.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Text>4. </Text>
          <Text>
            Bahwa saya sanggup melunasi pembiayaan saya kepada{" "}
            <Text style={{ fontWeight: "bold" }}>
              {process.env.NEXT_PUBLIC_APP_FULL_NAME}
            </Text>
            , apabila saya melakukan pernikahan yang menyebabkan{" "}
            <Text style={{ fontWeight: "bold" }}>
              tunjangan pensiun (Janda/Duda**) hilang
            </Text>
            .
          </Text>
        </View>
      </View>
      <View style={{ width: 530, textAlign: "justify", lineHeight: 1.5 }}>
        <Text>
          Pemberian kuasa ini tidak otomatis melepaskan tanggungjawab saya
          terhadap kelancaran pembayaran angsuran pembiayaan tersebut sampai
          dengan lunas tepat waktunya, sehingga saya sebagai pihak pemberi kuasa
          bertanggung jawab penuh terhadap segala macam tindakan penerima kuasa
          yang berkaitan dengan Surat Kuasa ini. Dan saya memberikan wewenang
          kepada pihak{" "}
          <Text style={{ fontWeight: "bold" }}>
            {process.env.NEXT_PUBLIC_APP_FULL_NAME}
          </Text>{" "}
          , untuk membantu melakukan penagihan apabila ada keterlambatan dalam
          penyerahan uang hasil pemotongan gaji pensiun saya tersebut.
        </Text>
      </View>
      <View
        style={{
          marginTop: 10,
          marginBottom: 10,
          width: 530,
          textAlign: "justify",
          lineHeight: 1.5,
        }}
      >
        <Text>
          Demikian Surat Pernyataan dan Kuasa ini dibuat dalam keadaan sadar dan
          tanpa paksaan dari pihak manapun, untuk dapat dipergunakan sebagaimana
          mestinya.
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginBottom: 10,
          marginTop: 20,
          fontWeight: "bold",
        }}
      >
        <Text>
          {data.area_pelayanan_berkas || "BANDUNG"},{" "}
          {moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 20,
          justifyContent: "space-around",
        }}
      >
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
          <Text>Mengetahui</Text>
          <Text>{process.env.NEXT_PUBLIC_APP_FULL_NAME}</Text>
          <View style={{ height: 70 }}></View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text style={{ width: 120, borderBottom: "1px solid #aaa" }}></Text>
            <Text style={{ fontWeight: "bold", height: 10 }}></Text>
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
          <Text>Pemberi Kuasa</Text>
          <Text> </Text>
          <View style={{ height: 70 }}></View>
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
            <Text style={{ width: 120, borderBottom: "1px solid #aaa" }}></Text>
            <Text style={{ height: 10 }}></Text>
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
