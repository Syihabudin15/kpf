import { DataDataPengajuan } from "../Interfaces";
import { Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { formatNumber } from "../inputUtils";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";
import moment from "moment";

export default function Kesanggupan({
  data,
  isFor,
}: {
  data: DataDataPengajuan;
  isFor: string;
}) {
  return (
    <Page size={"A4"} style={stylePdf.root}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        <View style={{ flex: 1 }}></View>
        <Text style={{ flex: 1 }}>SURAT PERNYATAAN DAN KESANGGUPAN</Text>
        <Text style={{ flex: 1 }}>{isFor}</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text>Yang bertanda tangan dibawah ini,</Text>
      </View>
      <View style={{ marginTop: 5, marginBottom: 5, lineHeight: 1.2 }}>
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
          <Text style={{ width: 120 }}>No. KTP</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>{data.nik}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ width: 120 }}>Alamat</Text>
          <Text style={{ width: 20 }}>:</Text>
          <Text style={{ width: 300 }}>
            {data.DataPengajuanAlamat.alamat}{" "}
            {data.DataPengajuanAlamat.rt && data.DataPengajuanAlamat.rt + "/"}{" "}
            {data.DataPengajuanAlamat.rw}, {data.DataPengajuanAlamat.kelurahan}{" "}
            {data.DataPengajuanAlamat.kecamatan},{" "}
            {data.DataPengajuanAlamat.kota}, {data.DataPengajuanAlamat.provinsi}{" "}
            {data.DataPengajuanAlamat.kode_pos}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 5, marginBottom: 5 }}>
        <Text>Dengan ini menyatakan :</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: 510,
          lineHeight: 1.2,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Text>1. </Text>
        <Text>
          Telah menerima fasilitas Kredit dari {data.Bank.name.toUpperCase()}{" "}
          melalui {process.env.NEXT_PUBLIC_APP_FULL_NAME} sebesar Rp.{" "}
          {formatNumber(data.DataPembiayaan.plafond.toFixed(0))} dengan besar
          angsuran Rp.{" "}
          {formatNumber(
            getAngsuranPerBulan(
              data.DataPembiayaan.mg_bunga,
              data.DataPembiayaan.tenor,
              data.DataPembiayaan.plafond
            )
          )}{" "}
          per bulan, selama 94 bulan, terhitung mulai bulan{" "}
          {moment(data.tanggal_cetak_akad).add(1, "M").month()} tahun{" "}
          {moment(data.tanggal_cetak_akad).year()} sampai dengan bulan{" "}
          {moment(data.tanggal_cetak_akad)
            .add(data.DataPembiayaan.tenor, "M")
            .month()}{" "}
          tahun{" "}
          {moment(data.tanggal_cetak_akad)
            .add(data.DataPembiayaan.tenor, "M")
            .year()}
          .
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: 510,
          lineHeight: 1.2,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Text>2. </Text>
        <Text>
          Telah memperoleh penjelasan mengenai karakteristik Kredit Pensiun
          serta telah mengerti dan memahami segala konsekuensinya, termasuk
          manfaat, resiko dan biaya – biaya yang timbul terkait dengan Kredit
          Pensiun.
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: 510,
          lineHeight: 1.2,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Text>3. </Text>
        <View style={{ width: 490 }}>
          <Text>
            Bersedia mematuhi dan menyetujui ketentuan pembatalan Kredit sebagai
            berikut :
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text>a. </Text>
            <Text>
              Untuk pengajuan Kredit yang telah disetujui tetapi belum dilakukan
              transfer dana dikenakan penalti biaya administrasi pembatalan
              sebesar 1% dari plafon yang disetujui.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text>b. </Text>
            <View>
              <Text>
                Untuk pengajuan yang telah disetujui dan telah dilakukan
                transfer dana dikenakan penalti biaya administrasi dengan
                ketentuan jika pembatalan dilakukan :
              </Text>
              <View style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                <Text style={{ width: 8 }}>i.</Text>
                <Text>
                  Maksimal H+2 setelah pencairan denda penalti sebesar 1% dari
                  plafon.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                <Text style={{ width: 8 }}>ii.</Text>
                <Text>
                  Lebih dari H+2 atau lewat Bulan setelah pencairan denda
                  penalti mengacu pada No. 4 Poin B.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                <Text style={{ width: 8 }}>iii.</Text>
                <Text>
                  Lewat bulan setelah pencairan denda penalti sebesar 6,00% dari
                  plafon.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                <Text style={{ width: 8 }}>iv.</Text>
                <Text>
                  Dana harus dikembalikan sejak pemberitahuan pembatalan
                  sejumlah dana pencairan + penalti biaya administrasi.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: 510,
          lineHeight: 1.2,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Text>4. </Text>
        <View style={{ width: 490 }}>
          <Text>
            Bersedia mematuhi dan menyetujui ketentuan dan persyaratan pelunasan
            dipercepat sebagai berikut :
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text>a. </Text>
            <View>
              <Text>Pelunasan Lanjut</Text>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Text>1. </Text>
                <Text>
                  Pelunasan Lanjut/Rehab, dapat dilakukan setelah Angsuran di
                  muka terproses autodebet.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Text>2. </Text>
                <View>
                  <Text>Perhitungan pelunasan Lanjut diatur sbb:</Text>
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 8 }}
                  >
                    <Text>a {"<"} </Text>
                    <View>
                      <Text>Tanggal Akad</Text>
                      <View>
                        <Text>
                          1{")"}.{" "}
                          <Text style={{ fontWeight: "bold" }}>
                            {"Sisa pokok bulan lalu"}
                          </Text>
                        </Text>
                        <Text>
                          2{")"}. ada pengembalian angsuran bulan berjalan
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 8 }}
                  >
                    <Text>b {">="} </Text>
                    <View>
                      <Text>Tanggal Akad</Text>
                      <View>
                        <Text>
                          1{")"}.{" "}
                          <Text style={{ fontWeight: "bold" }}>
                            {"Sisa pokok bulan lalu - pokok bulan berjalan"}
                          </Text>
                        </Text>
                        <Text>
                          2{")"}. tidak ada pengembalian angsuran bulan berjalan
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Text>3. </Text>
                <Text>
                  Sisa pokok Kredit posisi pada saat pelunasan sesuai yang
                  tercata pada system.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Text>4. </Text>
                <Text>
                  Pengembalian angsuran bulan berjalan ditransfer langsung
                  melalui rekening debitur maksimal hari kerja pertama bulan
                  berikutnya.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Text>5. </Text>
                <Text>
                  Batas waktu akhir pelunasan lanjut adalah tanggal 25 setiap
                  bulannya, khusus pelunasan lanjut yang dilakukan diatas
                  tanggal 20 dikenakan potongan 1x angsuran dimuka.
                </Text>
              </View>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text>b. </Text>
            <View>
              <Text>Pelunasan Lepas</Text>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Text>1. </Text>
                <Text>
                  Pelunasan Lepas baru dapat dilakukan setelah Angsuran ke 6
                  terproses autodebet.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Text>2. </Text>
                <View>
                  <Text>Biaya administrasi pelunasan Lepas adalah :</Text>
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 8 }}
                  >
                    <Text>a. </Text>
                    <View>
                      <Text> Angsuran Terbayar {"<="} 12 bulan</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {"sisa pokok bulan lalu + 4x angsuran"}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 8 }}
                  >
                    <Text>b. </Text>
                    <View>
                      <Text> Angsuran Terbayar {">"} 12 bulan</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {"sisa pokok bulan lalu + 2x angsuran"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Text>3. </Text>
                <Text>Tidak ada pengembalian angsuran.</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Text>4. </Text>
                <Text>
                  Batas waktu akhir pelunasan lepas adalah tanggal 20 setiap
                  bulannya.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Text>5. </Text>
                <Text>
                  Untuk pelunasan lepas Debitur diwajibkan melakukan konfirmasi
                  ke Kantor Pusat via telepon dan setelah mendapatkan nominal
                  pelunasan serta nomor rekening, maka penyetoran uang pelunasan
                  tersebut wajib disetorkan sendiri ke rekening Kantor Pusat.
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <Text>6. </Text>
                <Text>
                  Pengambilan SK Asli akan dikirimkan dari Kantor Pusat ke Unit
                  Pelayanan paling cepat tanggal 1 bulan berikutnya.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: 510,
          lineHeight: 1.2,
          fontWeight: "bold",
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Text>5. </Text>
        <View style={{ width: 490 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text>a.</Text>
            <Text>
              Mekanisme Pelunasan wajib menghubungi Kantor Pusat{" "}
              {process.env.NEXT_PUBLIC_APP_FULL_NAME} di no telepon
              0821-4561-4774.
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text>b.</Text>
            <Text>
              Tidak diperkenankan melakukan penyetoran sejumlah uang pelunasan
              kepada petugas dilapangan. Apabila hal tersebut dilakukan, Kantor
              Pusat {process.env.NEXT_PUBLIC_APP_FULL_NAME} tidak bertanggung
              jawab jika terjadi hal-hal yang tidak diinginkan.
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: 510,
          lineHeight: 1.2,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Text>6. </Text>
        <Text>
          Apabila diperlukan bersedia untuk dilakukan pemindahan Kantor Bayar
          Gaji Pensiun ke Kantor Bayar Gaji Pensiun yang ditunjuk{" "}
          {process.env.NEXT_PUBLIC_APP_FULL_NAME}.
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: 510,
          lineHeight: 1.2,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Text>7. </Text>
        <Text>
          Segala resiko atas pemberian pernyataan ini adalah merupakan tanggung
          jawab Pemberi Pernyataan sepenuhnya dan oleh karena itu Pemberi
          Pernyataan menyatakan membebaskan{" "}
          {process.env.NEXT_PUBLIC_APP_FULL_NAME} dan seluruh karyawannya dari
          segala tuntutan dan/atau gugatan hukum yang mungkin timbul dari pihak
          manapun akibat adanya pemberian pernyataan ini.
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: 510,
          lineHeight: 1.2,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Text>8. </Text>
        <Text>
          Terhitung mulai{" "}
          <Text style={{ fontWeight: "bold" }}>
            Bulan {moment(data.tanggal_cetak_akad).add(1, "M").month()} Tahun{" "}
            {moment(data.tanggal_cetak_akad).year()}
          </Text>
          , apabila gaji pensiun saya tidak terpotong/terdebet oleh kantor bayar
          gaji pensiunan saya, maka saya akan melakukan penyetoran keajiban
          angsuran saya secara tunai kepada{" "}
          {process.env.NEXT_PUBLIC_APP_FULL_NAME} melalui Unit Pelayanan dimana
          saya mengajukan pinjaman saya.
        </Text>
      </View>
      <View style={{ marginTop: 7 }}>
        <Text>
          Demikian surat pernyataan ini dibuat dengan sebenarnya dengan
          dilandasi itikad baik tanpa paksaan dari siapapun dan pihak manapun.
        </Text>
      </View>
      <View style={{ marginTop: 15 }}>
        <Text>
          {data.area_pelayanan_berkas || "BANDUNG"},{" "}
          {moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")}
        </Text>
      </View>
      <View
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          width: 120,
        }}
      >
        <Text style={{ textAlign: "center" }}>Yang membuat pernyataan</Text>
        <View
          style={{
            height: 80,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>materai</Text>
          <Text>Rp. 10.000</Text>
        </View>
        <View
          style={{
            fontWeight: "bold",
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <Text>{data.DataPembiayaan.name}</Text>
          <View style={{ width: 120, borderBottom: "1px solid #aaa" }}></View>
          <Text>Nasabah</Text>
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
