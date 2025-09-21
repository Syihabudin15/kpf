import { Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { DataDataPengajuan } from "../Interfaces";
import { AngsuranAnuitas, IDRFormat } from "@/components/v1/appUtils";
import moment from "moment";
const angkaTerbilang = require("angka-menjadi-terbilang");

const angka = [
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
];
export default function PKDassa({ data }: { data: DataDataPengajuan }) {
  return (
    <Page
      size={"A4"}
      style={{
        ...stylePdf.root,
        fontSize: 8,
        paddingVertical: 40,
        paddingHorizontal: 60,
        lineHeight: 1.5,
        textAlign: "justify",
      }}
    >
      <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 12 }}>
        PERJANJIAN KREDIT
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 10,
        }}
      >
        No.
      </Text>
      <View
        style={{
          width: 100,
          margin: "7px auto",
          borderBottom: "1px solid black",
        }}
      ></View>
      <View
        style={{
          width: 30,
          margin: "5px auto",
          borderBottom: "1px solid black",
        }}
      ></View>

      <Text style={{ marginTop: 20, textAlign: "justify" }}>
        Perjanjian Kredit ini (selanjutnya disebut {'"Perjanjian"'}) dibuat dan
        ditandatangani pada hari {"                             "}, tanggal{" "}
        {"                                        "}{" "}
      </Text>
      <Text style={{ marginBottom: 10 }}>
        {
          "(                                                                            )"
        }
        , oleh dan antara :
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          marginBottom: 7,
        }}
      >
        <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
          <Text
            style={{
              border: "2px solid black",
              borderRadius: "50%",
              marginTop: 6,
              width: 1,
              height: 1,
            }}
          ></Text>
          <View
            style={{
              textAlign: "justify",
            }}
          >
            <Text>
              PT Bank Perekonomian Rakyat Dassa suatu perseroan terbatas yang
              didirikan menurut Undang-undang Negara Republik Indonesia
              berkedudukan di Kabupaten Tangerang dan beralamat di North Point
              Commercial, Nava Park Number 8 BSD City, Jalan BSD Boulevard
              Utara, dalam hal ini diwakili oleh Pahala David dan Ferry
              masing-masing bertindak selaku Direktur Utama dan Direktur Bisnis,
              sehingga sah bertindak untuk dan atas nama PT Bank Perekonomian
              Rakyat Dassa.
            </Text>
            <Text>Selanjutnya disebut Kreditur.</Text>
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
          <Text
            style={{
              border: "2px solid black",
              borderRadius: "50%",
              width: 1,
              height: 1,
              marginTop: 6,
            }}
          ></Text>
          <View>
            <Text>
              {data.nama} lahir di {data.DataPembiayaan.tempat_lahir} pada
              tanggal {data.DataPembiayaan.tanggal_lahir} Pensiunan bertempat
              tinggal di {data.DataPengajuanAlamat.alamat} RT/RW{" "}
              {data.DataPengajuanAlamat.rt}/{data.DataPengajuanAlamat.rw}{" "}
              Kecamatan {data.DataPengajuanAlamat.kecamatan} Kelurahan{" "}
              {data.DataPengajuanAlamat.kelurahan}{" "}
              {data.DataPengajuanAlamat.kota} Provinsi{" "}
              {data.DataPengajuanAlamat.provinsi}, Pemegang Kartu Tanda
              Penduduk, berwenang melakukan tindakan hukum dalam Perjanjian ini
              serta dalam hal ini tidak memerlukan persetujuan dari pihak
              manapun untuk menandatangani Perjanjian.
            </Text>
            <Text>Selanjutnya disebut Debitur.</Text>
          </View>
        </View>
      </View>
      <Text>
        Debitur dan Kreditur selanjutnya secara bersama-sama disebut “PARA
        PIHAK”.
      </Text>
      <Text>
        Para Pihak telah sepakat untuk membuat Perjanjian dengan syarat dan
        ketentuan sebagai berikut :
      </Text>
      <View
        style={{
          margin: "10px 0px",
          textAlign: "center",
          fontWeight: "bold",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
        }}
      >
        <Text>PASAL 1</Text>
        <Text>FASILITAS KREDIT</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <View
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}
        >
          <Text>
            Atas permintaan Debitur, Kreditur setuju memberikan fasilitas kredit
            kepada Debitur dengan ketentuan :
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
            <Text
              style={{
                border: "2px solid black",
                borderRadius: "50%",
                width: 1,
                height: 1,
                marginTop: 6,
              }}
            ></Text>
            <Text style={{ width: 100 }}>Plafon Pembiayaan</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text style={{ flex: 1 }}>
              Rp. {IDRFormat(data.DataPembiayaan.plafond)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
            <Text
              style={{
                border: "2px solid black",
                borderRadius: "50%",
                width: 1,
                height: 1,
                marginTop: 6,
              }}
            ></Text>
            <Text style={{ width: 100 }}>Bunga</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text style={{ flex: 1 }}>{data.DataPembiayaan.margin_bank}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
            <Text
              style={{
                border: "2px solid black",
                borderRadius: "50%",
                width: 1,
                height: 1,
                marginTop: 6,
              }}
            ></Text>
            <Text style={{ width: 100 }}>Jenis Fasilitas</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text style={{ flex: 1 }}>Kredit Pensiun</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
            <Text
              style={{
                border: "2px solid black",
                borderRadius: "50%",
                width: 1,
                height: 1,
                marginTop: 6,
              }}
            ></Text>
            <Text style={{ width: 100 }}>Adm</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text style={{ flex: 1 }}>
              {data.DataPembiayaan.by_admin_bank}% (Satu koma lima Persen)
            </Text>
          </View>
        </View>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Dalam hal terjadi perubahan suku bunga yang menambah biaya Debitur
          sebagaimana dimaksud pada pasal 1.1 diatas, maka perubahan tersebut
          akan disampaikan secara tertulis oleh Kreditur kepada Debitur.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Dilakukan blokir sebanyak {data.DataPembiayaan.blokir} (
          {angka[data.DataPembiayaan.blokir + 1]}) kali angsuran yang disimpan
          pada rekening tabungan Debitur di Kreditur, untuk proses take over.
        </Text>
      </View>
      <View
        style={{
          margin: "10px 0px",
          textAlign: "center",
          fontWeight: "bold",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
        }}
      >
        <Text>PASAL 2</Text>
        <Text>Jangka Waktu dan Jadwal</Text>
        <Text>Angsuran</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Jangka waktu fasilitas {data.DataPembiayaan.tenor} (
          {angkaTerbilang(data.DataPembiayaan.tenor)
            .split(" ")
            .map(function (word: string) {
              return word.charAt(0).toUpperCase().concat(word.substr(1));
            })
            .join(" ")}
          ) bulan terhitung sejak tanggal{" "}
          {"                                           "} dan akan berakhir pada
          tanggal {"                                    "} (
          {
            "                                                                       "
          }
          )
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Angsuran bulanan sesuai dengan jadwal angsuran yang telah disepakati
          Para Pihak serta menjadi lampiran dari Perjanjian.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Pembayaran angsuran dilakukan dalam {data.DataPembiayaan.tenor} kali
          angsuran yang harus dibayar setiap bulan sesuai dengan jadwal angsuran
          dan harus sudah lunas selambat- lambatnya tanggal{" "}
          {"                              "} (
          {
            "                                                                        "
          }
          )
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur sewaktu-waktu dapat melunasi fasilitas kredit tersebut di atas
          dalam masa jangka waktu fasilitas yang telah ditetapkan dengan
          membayar denda pinalti disesuaikan dengan ketentuan yang berlaku.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Apabila pembayaran kewajiban yang harus dilakukan Debitur kepada
          Kreditur jatuh tempo bukan pada hari kerja, maka pembayaran harus
          dilakukan pada 1 (satu) hari kerja sebelumnya.
        </Text>
      </View>
      <View
        style={{
          margin: "10px 0px",
          textAlign: "center",
          fontWeight: "bold",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
        }}
      >
        <Text>PASAL 3</Text>
        <Text>Penarikan Fasilitas Kredit dan Pengakuan Hutang</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Penarikan fasilitas Kredit yang diberikan Kreditur kepada Debitur
          dicairkan sekaligus yaitu sebesar Rp.{" "}
          {IDRFormat(data.DataPembiayaan.plafond)} (
          {angkaTerbilang(data.DataPembiayaan.plafond)
            .split(" ")
            .map(function (word: string) {
              return word.charAt(0).toUpperCase().concat(word.substr(1));
            })
            .join(" ")}{" "}
          Rupiah), jumlah tersebut sebelum dikurangi dengan biaya-biaya yang
          terkait dengan pemberian fasilitas kredit ini.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <View
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}
        >
          <Text>
            Debitur memberikan kuasa kepada Kreditur untuk melakukan penarikan
            fasilitas kredit pada rekening sebagai berikut :
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 100 }}>Nama Bank</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 100 }}>Nomor Rekening</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 100 }}>Atas Nama</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
          <Text>
            Atas penarikan fasilitas kredit setelah dikurangi biaya-biaya, harap
            di transfer pada rekening sebagai berikut :
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 100 }}>Nama Bank</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text style={{ flex: 1 }}>BANK RAKYAT INDONESIA</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 100 }}>Nomor Rekening</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 100 }}>Atas Nama</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text style={{ flex: 1 }}>KOPERASI PEMASARAN FADILLAH</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={{ width: 100 }}>Jumlah yang ditransfer</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text style={{ flex: 1 }}>
              Rp.{" "}
              {(() => {
                const adm =
                  data.DataPembiayaan.plafond *
                  (data.DataPembiayaan.by_admin_bank / 100);
                const angs = AngsuranAnuitas(
                  data.DataPembiayaan.plafond,
                  data.DataPembiayaan.tenor,
                  data.DataPembiayaan.margin_bank,
                  data.DataPembiayaan.pembulatan
                );
                return IDRFormat(
                  data.DataPembiayaan.plafond -
                    (adm +
                      data.DataPembiayaan.by_buka_rekening +
                      angs.angsuran * data.DataPembiayaan.blokir)
                );
              })()}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Penandatanganan Perjanjian ini merupakan tanda penerimaan yang sah
          atas seluruh jumlah hutang pokok sebagaimana dimaksud pasal 1.1
          Perjanjian dan Debitur dengan ini mengaku benar-benar secara sah telah
          berhutang kepada Kreditur atas jumlah hutang pokok tersebut demikian
          berikut bunga, denda dan biaya-biaya lain serta lain-lain jumlah yang
          wajib dibayar oleh Debitur kepada Kreditur berdasarkan Perjanjian ini.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <View style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Text>
            Debitur menyetujui bahwa jumlah yang terutang oleh Debitur kepada
            Kreditur berdasarkan Perjanjian ini pada waktu- waktu tertentu akan
            terbukti dari :
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
            <Text
              style={{
                border: "2px solid black",
                borderRadius: "50%",
                width: 1,
                height: 1,
                marginTop: 6,
              }}
            ></Text>
            <Text>
              Rekening Debitur yang dipegang dan dipelihara oleh Kreditur
              dan/atau
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
            <Text
              style={{
                border: "2px solid black",
                borderRadius: "50%",
                width: 1,
                height: 1,
                marginTop: 6,
              }}
            ></Text>
            <Text>
              Surat-surat dan Dokumen-dokumen lain yang dikeluarkan oleh
              Kreditur.
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          margin: "10px 0px",
          textAlign: "center",
          fontWeight: "bold",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
        }}
      >
        <Text>PASAL 4</Text>
        <Text>Peristiwa Cidera Janji</Text>
      </View>
      <Text style={{ marginTop: 6 }}>
        Dengan tetap memperhatikan ketentuan Pasal 2 ayat 1 Perjanjian ini,
        Kreditur berhak untuk sewaktu-waktu dengan mengesampingkan ketentuan
        Pasal 1266 Kitab Undang-Undang Hukum Perdata, Khususnya ketentuan yang
        mengatur keharusan untuk mengajukan permohonan pembatalan Perjanjian
        melalui pengadilan sehingga tidak diperlukan suatu pemberitahuan
        (somasi) atau surat lain yang serupa dengan itu serta surat peringatan
        dari juru sita, menagih hutang Debitur berdasarkan Perjanjian ini atau
        sisanya, berikut bunga- bunga, denda-denda dan biaya yang lain yang
        timbul berdasarkan Perjanjian dan wajib dibayar oleh Debitur dengan
        seketika dan sekaligus lunas, apabila terjadi salah satu atau Iebih
        kejadian-kejadian tersebut dibawah ini :
      </Text>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur tidak atau lalai membayar lunas pada waktunya kepada Kreditur
          baik angsuran pokok, bunga-bunga, denda-denda dan biaya lain yang
          sudah jatuh tempo berdasarkan Perjanjian.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>Debitur meninggal dunia atau berada dibawah pengampuan.</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur dinyatakan pailit, diberikan penundaan membayar hutang-hutang
          (surseance van betaling) atau bilamana Debitur dan/atau orang/pihak
          lain mengajukan permohonan kepada instansi yang berwenang agar Debitur
          dinyatakan dalam keadaan pailit.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Kekayaan Debitur baik sebagian maupun seluruhnya disita atau
          dinyatakan dalam sitaan oleh instansi yang berwenang.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur lalai atau tidak memenuhi syarat-syarat dan
          ketentuan/kewajiban dalam Perjanjian ini dan setiap perubahannya.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur lalai atau tidak memenuhi kewajibannya kepada pihak lain
          berdasarkan Perjanjian dengan pihak lain sehingga Debitur dinyatakan
          cidera janji.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur tersangkut dalam suatu perkara hukum yang dapat menghalangi
          Debitur memenuhi kewajiban berdasarkan Perjanjian ini sebagaimana
          mestinya.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Apabila ternyata suatu pernyataan-pernyataan atau dokumen-dokumen atau
          keterangan-keterangan yang diberikan Debitur kepada Kreditur ternyata
          tidak benar atau tidak sesuai dengan kenyataan.
        </Text>
      </View>
      <View
        style={{
          margin: "10px 0px",
          textAlign: "center",
          fontWeight: "bold",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
        }}
      >
        <Text>PASAL 5</Text>
        <Text>Jaminan</Text>
      </View>
      <Text style={{ marginTop: 6 }}>
        Untuk menjamin pembayaran hutang pokok, bunga dan pembayaran lainnya
        sebagaimana tercantum dalam Perjanjian ini, Debitur setuju memberikan
        jaminan kepada Kreditur berupa :
      </Text>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>Asli Surat Kuasa Debet rekening atas nama {data.nama}</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Asli Surat Keputusan Pensiun Asli Nomor : {data.nomor_sk_pensiun}{" "}
          Tanggal {moment(data.tanggal_sk_pensiun).format("DD-MM-YYYY")} atas
          nama {data.nama_skep}
        </Text>
      </View>
      <View
        style={{
          margin: "10px 0px",
          textAlign: "center",
          fontWeight: "bold",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
        }}
      >
        <Text>PASAL 6</Text>
        <Text>Pernyataan dan Jaminan</Text>
      </View>
      <Text style={{ marginTop: 6 }}>
        Debitur dengan ini menyatakan dan menjamin Kreditur hal-hal sebagai
        berikut :
      </Text>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur mempunyai wewenang untuk menandatangani Perjanjian ini.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur dengan ini menyatakan dan menjamin bahwa Perjanjian ini tidak
          bertentangan dengan perjanjian apapun yang dibuat oleh Debitur dengan
          pihak ketiga.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur dengan ini menyatakan dan menjamin bahwa pada waktu ini tidak
          ada sesuatu hal atau peristiwa yang merupakan suatu kejadian
          kelalaian/pelanggaran sebagaimana dimaksudkan dalam pasal 4 Perjanjian
          ini.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur dengan ini menyatakan dan menjamin akan mengganti segala
          kerugian yang diderita Kreditur sehubungan dengan adanya tuntutan atau
          gugatan dari pihak ketiga yang diakibatkan oleh karena adanya
          keterangan/pernyataan yang tidak benar yang disampaikan Debitur kepada
          Kreditur.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur dengan ini menyatakan dan menjamin bahwa apa yang dijaminkan
          dalam Perjanjian ini adalah benar merupakan hak Debitur sendiri dan
          tidak sedang terikat sebagai jaminan dan tidak akan dialihkan haknya
          pada pihak lain sampai dengan seluruh hutang Debitur dinyatakan lunas
          oleh Kreditur.
        </Text>
      </View>
      <View
        style={{
          margin: "10px 0px",
          textAlign: "center",
          fontWeight: "bold",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
        }}
      >
        <Text>PASAL 7</Text>
        <Text>Pemberian Kuasa</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur dengan ini memberikan kuasa kepada Kreditur untuk mendebet dan
          menggunakan dana yang tersimpan pada Kreditur baik dari rekening
          tabungan/deposito milik Debitur guna pembayaran angsuran pokok maupun
          bunga, denda, premi asuransi, biaya- biaya lainnya yang mungkin timbul
          sehubungan dengan pemberian fasilitas kredit ini dan segala yang
          terhutang berkenaan dengan pemberian fasilitas kredit berdasarkan
          perjanjian ini.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Kreditur diberi kuasa oleh Debitur untuk menutup asuransi jiwa dan
          biaya premi menjadi beban Debitur, apabila Debitur meninggal dunia
          maka uang klaim asuransi untuk menjamin pelunasan seluruh kewajiban
          Debitur.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Kuasa-kuasa yang diberikan Debitur kepada Kreditur berdasarkan
          Perjanjian ini kata demi kata harus telah dianggap telah termaktub
          dalam Perjanjian ini dan merupakan satu kesatuan serta bagian yang
          tidak terpisahkan dengan Perjanjian ini yang tidak dibuat tanpa adanya
          kuasa tersebut dan oleh karenanya kuasa-kuasa tersebut tidak akan
          dicabut dan tidak akan berakhir oleh karena sebab apapun juga,
          termasuk oleh sebab-sebab berakhirnya kuasa sebagaimana dimaksud dalam
          Pasal 1813, 1814 dan 1816 kitab Undang-Undang Hukum Perdata. Namun
          demikian, apabila ternyata terdapat suatu ketentuan hukum yang
          mengharuskan adanya suatu surat kuasa khusus untuk melaksanakan hak
          Kreditur berdasarkan Perjanjian, maka Debitur atas permintaan pertama
          dari Kreditur wajib untuk memberikan kuasa khusus dimaksud kepada
          Kreditur.
        </Text>
      </View>
      <View
        style={{
          margin: "10px 0px",
          textAlign: "center",
          fontWeight: "bold",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
        }}
      >
        <Text>PASAL 8</Text>
        <Text>Lain - lain</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur menyetujui dan dengan ini memberi kuasa kepada Kreditur untuk
          sewaktu-waktu menjual, mengalihkan, menjaminkan atau dengan cara
          apapun memindahkan piutang/tagihan-tagihan Kreditur kepada Debitur
          berdasarkan Perjanjian ini kepada pihak ketiga lainnya dengan siapa
          Kreditur membuat perjanjian kerjasama berikut semua hak,
          kekuasaan-kekuasaan dan jaminan-jaminan yang ada pada Kreditur
          berdasarkan Perjanjian ini atau perjanjian jaminan, dengan
          syarat-syarat dan ketentuan-ketentuan yang dianggap baik oleh
          Kreditur, tanpa diperlukan surat persetujuan/kuasa tersendiri.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur tidak diperkenankan untuk mengalihkan hak-hak dan kewajibannya
          berdasarkan Perjanjian ini kepada pihak manapun tanpa persetujuan
          tertulis terlebih dahulu dari Kreditur.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Selama fasilitas kredit belum lunas, Debitur tidak diperkenankan untuk
          menerima pinjaman dari bank/pihak ketiga lainnya tanpa persetujuan
          dari Kreditur.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Selama fasilitas kredit belum lunas, Debitur tidak diperkenankan untuk
          menunda pengambilan gajinya setiap bulan untuk memenuhi pembayaran
          angsuran kepada Kreditur dan mengalihkan lokasi pembayaran uang
          pensiun Debitur ketempat lain selain Bank Perekonomian Rakyat Dassa
          yang telah menerima Surat Kuasa pemotongan uang pensiun Debitur.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur wajib mengizinkan Kreditur untuk melakukan pemeriksaan atas
          kekayaan dan/usaha Debitur serta dan memeriksa pembukuan,
          catatan-catatan dan administrasi Debitur dan membuat salinan-salinan
          atau foto copy atau catatan-catatan lainnya.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Seluruh lampiran-lampiran Perjanjian ini termasuk namun tidak terbatas
          pada Perjanjian kerjasama, surat kuasa pemotongan uang pensiun,
          merupakan suatu kesatuan dan bagian yang tidak terpisahkan dengan
          Perjanjian.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Debitur dengan ini menyatakan setuju, Kreditur menyampaikan informasi
          data Debitur kepada Bank Indonesia dan Otoritas Jasa Keuangan melalaui
          Sistem Informasi Debitur dan SLIK.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Perjanjian ini telah disesuaikan dengan ketentuan peraturan
          perundang-undangan termasuk ketentuan peraturan Otoritas Jasa Keuangan
          (OJK).
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Perjanjian Kredit ini dibuat rangkap 1 (Satu), telah di mengerti
          isinya dan memiliki Kekuatan Hukum.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Hal-hal yang belum diatur dalam Perjanjian ini serta perubahan
          dan/atau penambahan akan ditentukan kemudian antara Para Pihak serta
          dituangkan secara tertulis dalam suatu Addendum yang ditandatangani
          bersama oleh Para Pihak serta merupakan bagian dan satu kesatuan yang
          tidak dapat dipisahkan dan mempunyai kekuatan hukum yang sama dengan
          Perjanjian ini.
        </Text>
      </View>
      <View
        style={{
          margin: "10px 0px",
          textAlign: "center",
          fontWeight: "bold",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
        }}
      >
        <Text>PASAL 9</Text>
        <Text>Hukum Yang Berlaku dan</Text>
        <Text>Domisili Hukum</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Perjanjian ini tunduk pada dan karenanya harus ditafsirkan berdasarkan
          hukum Republik Indonesia.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
        <Text
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            width: 1,
            height: 1,
            marginTop: 5,
          }}
        ></Text>
        <Text>
          Untuk pelaksanaan Perjanjian ini dan segala akibatnya Para Pihak
          memilih tempat tinggal yang tetap dan tidak berubah di kantor Panitera
          Pengadilan Negeri Kota Bandung, dengan tidak mengurangi hak Kreditur
          untuk memohon pelaksanaar/eksekusi dari Perjanjian ini atau mengajukan
          tuntutan hukum terhadap Debitur melalui Pengadilan Negeri lainnya
          dalam wilayah Republik Indonesia.
        </Text>
      </View>
      <Text style={{ marginTop: 13 }}>
        Demikian Perjanjian ini dibuat dan ditandatangani oleh Para Pihak pada
        hari ini dan tanggal sebagaimana disebutkan di awal Perjanjian ini.
      </Text>
      <View
        style={{
          marginTop: 30,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 80,
        }}
      >
        <View style={{ flex: 1, fontWeight: "bold" }}>
          <View style={{ marginLeft: 30 }}>
            <Text>KREDITUR</Text>
            <Text>PT BANK PEREKONOMIAN RAKYAT DASSA</Text>
          </View>
          <View style={{ height: 80 }}></View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              textAlign: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ textDecoration: "underline" }}>Pahala David</Text>
              <Text>Direktur Utama</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ textDecoration: "underline" }}>Ferry</Text>
              <Text>Direktur Bisnis</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, fontWeight: "bold" }}>
          <Text>DEBITUR</Text>
          <Text style={{ height: 93 }}></Text>
          <Text style={{ textDecoration: "underline" }}>{data.nama}</Text>
        </View>
      </View>
    </Page>
  );
}
