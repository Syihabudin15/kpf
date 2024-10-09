import { DataDataPengajuan } from "../Interfaces";
import { Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import moment from "moment";
moment.updateLocale("id", {
  months: [
    "January",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],
});
import { stylePdf } from "./stylePdf";

export default function PerjanjianKreditFlashPage2({
  data,
}: {
  data: DataDataPengajuan;
}) {
  return (
    <Page style={{ ...styles.page, ...stylePdf.root }} wrap size="A4">
      {/* Header */}
      <View
        fixed
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          padding: "0 10px",
        }}
      >
        <View>
          <Image
            src={data.Bank.logo || "/assets/images/logo_kpf.jpg"}
            style={{ width: 50 }}
          />
        </View>
        <View
          style={{
            fontWeight: "bold",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}
        >
          <Text style={{ fontSize: 10 }}>PERJANJIAN KREDIT</Text>
          {data.nomor_akad ? (
            <Text style={{ fontSize: 8 }}>NO AKAD : {data.nomor_akad}</Text>
          ) : (
            <Text>NO: ____/{data.Bank.kode}-PK/____/____/____/2024</Text>
          )}
        </View>
        <View>
          <Image src={process.env.NEXT_PUBLIC_APP_LOGO} style={{ width: 50 }} />
        </View>
      </View>
      {/* End Header */}

      <View style={[styles.row]} wrap>
        <View style={styles.left} wrap>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>6.3</Text>
            <Text>
              Setiap perubahan besarnya pembayaran bunga pinjaman selalu akan
              diberitahukan secara tertulis oleh KOPERASI kepada PEMINJAM. Dan
              surat pemberitahuan perubahan suku bunga tersebut, dan/atau jadwal
              angsuran pinjaman pokok dan bunga pinjaman, merupakan satu
              kesatuan dan tidak terpisahkan dari perjanjian ini, serta PEMINJAM
              tidak akan menyangkal dalambentuk apapun juga atas perubahan suku
              bunga tersebut
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>6.4</Text>
            <Text>
              Setiap perubahan besarnya pembayaran bunga pinjaman selalu akan
              PEMINJAM membayar angsuran pokok dan bunga pinjaman melalui
              pemotongan gaji yang dilakukan oleh PT POS berdasarkan surat kuasa
              pemotongan gajisampai seluruh kewajibanya dinyatakan lunas oleh
              KOPERASI
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>6.5</Text>
            <Text>
              Semua pembayaran pada KOPERASI harus dilakukan di tempat kedudukan
              KOPERASI melalui rekening PEMINJAM atau rekening lain yang
              ditentukan oleh KOPERASI
            </Text>
          </View>
          {/* Pasal 7 */}
          <View
            style={{
              fontWeight: "bold",
              marginTop: 5,
              marginBottom: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>PASAL 7</Text>
            <Text>DENDA KETERLAMBATAN & PINALTY</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>7.1</Text>
            <Text>
              Bahwa atas setiap keterlambatan pembayaran cicilan/angsuran oleh
              PEMINJAM kepada KOPERASI, maka PEMINJAM dikenakan denda menurut
              ketentuan KOPERASI yang berlaku pada saat ditandatanganinya
              Perjanjian ini, yaitu sebesar 0,3%,- (nol koma dua persen)
              perhari.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>7.2</Text>
            <Text>
              Pelunasan sebagian atau seluruh pinjaman sebelum jatuh tempo dapat
              dilakukan PEMINJAM dengan ketentuan bahwa setiap pelunasan baik
              Sebagianatau seluruh pinjaman tersebut PEMINJAM dikenakan penalty
              sebesar 7% (lima perseratus) yang dihitung dari sisa Pokok
              Pinjaman PEMINJAM yang tertera pada pembukuan pihak KOPERASI.
            </Text>
          </View>
          {/* Pasal 8 */}
          <View
            style={{
              fontWeight: "bold",
              marginTop: 5,
              marginBottom: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>PASAL 8</Text>
            <Text>SYARAT & KETENTUAN</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>8.1</Text>
            <View>
              <Text>
                KOPERASI berhak untuk sewaktu-waktu menghentikan dan memutuskan
                perjanjian ini dengan mengesampingkan ketentuan-ketentuan Pasal
                1266 dan Pasal 1267 Kitab Undang-Undang Hukum Perdata sehingga
                tidak diperlukan lagi suatu surat pemberitahuan (Somasi) atau
                surat peringatan dari juru sita atau surat lain yang serupa itu,
                dalam hal demikian seluruh hutang PEMINJAM kepada KOPERASI harus
                dibayar seketika dan sekaligus, yaitu dalam hal terjadi salah
                satu kejadian dibawah ini :
              </Text>
              <View
                style={{ display: "flex", flexDirection: "row", width: "95%" }}
              >
                <Text style={{ width: 12 }}>a. </Text>
                <Text>
                  Bilamana PEMINJAM menggunakan fasilitas pinjaman ini
                  menyimpang dari tujuan penggunaan yang telah disetujui oleh
                  KOPERASI;
                </Text>
              </View>
              <View
                style={{ display: "flex", flexDirection: "row", width: "95%" }}
              >
                <Text style={{ width: 12 }}>b. </Text>
                <Text>
                  Bilamana PEMINJAM lalai atau tidak memenuhi syarat-syarat atau
                  ketentuan-ketentuan / kewajiban-kewajiban yang dimaksud dalam
                  Perjanjian ini dan atau perubahan/tambahan dan atau
                  perjanjianperjanjian pengikatan jaminan;
                </Text>
              </View>
              <View
                style={{ display: "flex", flexDirection: "row", width: "95%" }}
              >
                <Text style={{ width: 12 }}>c. </Text>
                <Text>
                  Bilamana menurut pertimbangan KOPERASI keadaan keuangan,
                  bonafiditas dan solvabilitas PEMINJAM mundur sedemikian rupa
                  sehingga PEMINJAM tidak dapat membayar hutangnya;
                </Text>
              </View>
              <View
                style={{ display: "flex", flexDirection: "row", width: "95%" }}
              >
                <Text style={{ width: 12 }}>d. </Text>
                <Text>
                  Bilamana PEMINJAM menanggung hutang pihak ketiga tanpa
                  persetujuan tertulis terlebih dahulu dari KOPERASI;
                </Text>
              </View>
              <View
                style={{ display: "flex", flexDirection: "row", width: "95%" }}
              >
                <Text style={{ width: 12 }}>e. </Text>
                <Text>
                  Bilamana pernyataan-pernyataan, surat-surat, keterangan-
                  keterangan yang diberikan PEMINJAM kepada KOPERASI ternyata
                  tidak benar;
                </Text>
              </View>
              <View
                style={{ display: "flex", flexDirection: "row", width: "95%" }}
              >
                <Text style={{ width: 12 }}>f. </Text>
                <Text>
                  Bilamana menurut pertimbangan KOPERASI ada hal-hal lain yang
                  meragukan pengembalian pelunasan kredit tersebut;
                </Text>
              </View>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>8.2</Text>
            <Text>
              Bahwa segala pembukuan / catatan yang dibuat oleh KOPERASI menjadi
              tanda bukti yang mengikat dan sah atas jumlah hutang PEMINJAM
              kepada KOPERASI.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>8.3</Text>
            <Text>
              Apabila PEMINJAM meninggal dunia, maka semua hutang dan kewajiban
              PEMINJAM kepada KOPERASI yang timbul berdasarkan Perjanjian ini
              berikut semua perubahannya dikemudian dan atau berdasarkan apapun
              juga tetap merupakan satu kesatuan hutang dari para ahli waris
              PEMINJAM atau PENANGGUNG (jika ada).
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>8.4</Text>
            <Text>
              Peminjam dengan ini berjanji, akan tunduk kepada segala ketentuan
              dan sesuai dengan ketentuan peraturan perundang-undangan termasuk
              ketentuan peraturan Otoritas Jasa Keuangan.
            </Text>
          </View>
          <View
            style={{
              fontWeight: "bold",
              marginTop: 5,
              marginBottom: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>PASAL 9</Text>
            <Text>DOMISILI HUKUM</Text>
          </View>
          <View>
            <Text>
              Mengenai perjanjian ini dan segala akibat serta pelaksanaannya
              kedua belah pihak menerangkan telah memilih tempat kedudukan hukum
              yang tetap dan umum di Kantor Panitera Pengadilan Negeri domisili
              Koperasi, demikian dengan tidak mengurangi hak dari KOPERASI untuk
              memohon gugatan atau pelaksanaan eksekusi dari perjanjian ini
              melalui Peradilan lainnya dalam wilayah Republik Indonesia.
            </Text>
          </View>
        </View>
        <View style={styles.right} wrap>
          {/* Pasal 10 */}
          <View
            style={{
              fontWeight: "bold",
              marginTop: 5,
              marginBottom: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>PASAL 10</Text>
            <Text>LAIN - LAIN</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>10.1</Text>
            <Text>
              Sebelum Akad ini ditandatangani oleh PEMINJAM, PEMINJAM mengakui
              dengan sebenarnya, bahwa PEMINJAM telah membaca dengan cermat atau
              dibacakan kepada PEMINJAM, sehingga oleh karena itu PEMINJAM
              memahami sepenuhnya segala yang akan menjadi akibat hukum setelah
              PEMINJAM menandatangani Perjanjian Kredit ini.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>10.1</Text>
            <Text>
              Apabila ada hal-hal yang belum diatur atau belum cukup diatur
              dalam Perjanjian Kredit ini, maka PEMINJAM dan KOPERASI akan
              mengaturnya Bersama secara musyawarah untuk mufakat dalam suatu
              Addendum.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ width: 20 }}>10.3</Text>
            <Text>
              Setiap Addendum dari Perjanjian Kredit ini merupakan satu kesatuan
              yang tidak dapat dipisahkan dari Perjanjian Kredit ini.
            </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              marginBottom: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            <Text>
              Bandung,{" "}
              {moment(data.tanggal_cetak_akad)
                .locale("id")
                .format("DD MMMM YYYY")}
            </Text>
          </View>
          <View
            style={{
              width: 250,
              margin: "0 auto",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                border: "1px solid #aaa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Text>Penerima</Text>
              <Text style={{ height: 50, lineHeight: 25 }}>Materai 10.000</Text>
              <Text>{data.DataPembiayaan.name}</Text>
              <Text
                style={{ borderBottom: "1px solid #aaa", width: "80%" }}
              ></Text>
              <Text>Penerima Pembiayaan</Text>
            </View>
            <View
              style={{
                flex: 1,
                border: "1px solid #aaa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Text>Saksi</Text>
              <Text style={{ height: 50 }}></Text>
              <Text>{data.DataPengajuanPasangan.nama_pasangan || " "}</Text>
              <Text
                style={{ borderBottom: "1px solid #aaa", width: "80%" }}
              ></Text>
              <Text>Suami/Istri/Ahli Waris*</Text>
            </View>
          </View>
          <View
            style={{
              width: 250,
              margin: "0 auto",
              marginTop: 5,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                border: "1px solid #aaa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Text>Menyetujui</Text>
              <Text style={{ height: 50 }}></Text>
              <Text>
                {data.Bank.kode === "KPF"
                  ? "Adhi Sofyar Pramudya"
                  : process.env.NEXT_PUBLIC_APP_DIREKTUR}
              </Text>
              <Text
                style={{ borderBottom: "1px solid #aaa", width: "80%" }}
              ></Text>
              <Text>Manajer Operasional</Text>
              <Text>
                {data.Bank.kode === "KPF"
                  ? data.Bank.name
                  : process.env.NEXT_PUBLIC_APP_FULL_NAME}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                border: "1px solid #aaa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Text>Saksi</Text>
              <Text style={{ height: 50 }}></Text>
              <Text>{data.Bank.up_direktur || " "}</Text>
              <Text
                style={{ borderBottom: "1px solid #aaa", width: "80%" }}
              ></Text>
              <Text>Direktur Pengelola</Text>
              <Text>{data.Bank.name}</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: "20px 30px",
    fontSize: 8,
  },
  row: {
    flex: 1,
    gap: 20,
    flexDirection: "row",
  },
  left: {
    width: "47%",
    // flex: 1,
    padding: 5,
    textAlign: "justify",
    lineHeight: 1,
  },

  right: {
    width: "47%",
    // flex: 1,
    padding: 5,
    textAlign: "justify",
    lineHeight: 1.2,
  },
});
