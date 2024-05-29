"use client";
import { DataDataTaspen } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import {
  TablePdf,
  TablePdfBodies,
  TablePdfHeaders,
} from "@/components/utils/pdf/TablePdf";
import { stylePdf } from "@/components/utils/pdf/stylePdf";
import {
  Document,
  Image,
  PDFViewer,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import moment from "moment";

export default function DataPembanding({
  data,
}: {
  data: DataDataTaspen | null;
}) {
  const bodiesHutang: TablePdfBodies[] = [
    {
      jenis_hutang: data?.jenis_hutang || "-",
      jumlah_hutang: data?.jumlah_hutang || "-",
      cicilan: data?.cicilan || "-",
      dari: data?.tanggal_sekarang || "-",
      s_d: data?.tanggal_surat || "-",
    },
  ];

  return (
    <PDFViewer className="w-full h-full">
      <Document title="Data Pembanding">
        <Page size={"A4"} style={{ ...stylePdf.root, lineHeight: 1 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 20,
              alignItems: "center",
              marginBottom: 20,
              lineHeight: 1.5,
              borderBottom: "1px solid black",
            }}
            fixed
          >
            <View>
              <Image
                src={"/assets/images/logo_kpf.jpg"}
                style={{ width: 50 }}
              />
            </View>
            <View
              style={{
                fontWeight: "bold",
                fontSize: 10,
              }}
            >
              <Text>KOPERASI PEMASARAN FADILAH</Text>
            </View>
          </View>
          <View
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.1,
            }}
          >
            <Image
              src={"/assets/images/logo_kpf.jpg"}
              style={{ width: "70%" }}
            />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 30 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
                flex: 1,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 80 }}>NRP / NIP</Text>
                <Text>: {data?.nipnrp && data.nipnrp}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 80 }}>Nama Penerima</Text>
                <Text>: {data && data.nama}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 80 }}>Janda/Duda/Yp Dari</Text>
                <Text>: {data?.jandadudaypdari && data.jandadudaypdari}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 80 }}>Alamat Rumah</Text>
                <Text style={{ width: 150 }}>
                  : {data?.Domisili.alamat && data.Domisili.alamat}{" "}
                  {data?.Domisili.rt && data.Domisili.rt}{" "}
                  {data?.Domisili.rw && data.Domisili.rw}{" "}
                  {data?.Domisili.kelurahan && data.Domisili.kelurahan}{" "}
                  {data?.Domisili.kecamatan && data.Domisili.kecamatan}{" "}
                  {data?.Domisili.kota && data.Domisili.kota}{" "}
                  {data?.Domisili.provinsi && data.Domisili.provinsi}{" "}
                  {data?.Domisili.kode_pos && data.Domisili.kode_pos}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 80 }}>Penerbit SKEP</Text>
                <Text>: {data?.penerbit_sk && data.penerbit_sk}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 80 }}>Nomor SKEP</Text>
                <Text>: {data?.no_skep && data.no_skep}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 80 }}>Jenis Dapem</Text>
                <Text>: {data?.jenis_dapem && data.jenis_dapem}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 80 }}>Jenis Pensiun</Text>
                <Text>
                  : 1800 - {data?.jenis_pensiun && data.jenis_pensiun}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 80 }}>Kantor Bayar Dapem</Text>
                <Text>
                  : 20410308007 - {data?.ktr_bay_dapem && data.ktr_bay_dapem}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 80 }}>Nomor Rekening</Text>
                <Text>: {data?.no_rek && data.no_rek}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 80 }}>Status Dapem</Text>
                <Text>: {data?.status_dapem && data.status_dapem}</Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
                flex: 1,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 100 }}>NOPEN/NOTAS</Text>
                <Text>: {data && data.nopen}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 100 }}>Tanggal Lahir</Text>
                <Text>: {data?.tanggal_lahir && data.tanggal_lahir}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 100 }}>Tanggal Lahir Janda/Duda/Yp</Text>
                <Text>
                  :{" "}
                  {data?.tanggal_lahir_jandadudayp &&
                    data.tanggal_lahir_jandadudayp}
                </Text>
              </View>
              <View
                style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
              >
                <Text style={{ width: 100 }}>Nomor Dosir</Text>
                <Text>: {data?.no_dosir && data.no_dosir}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 100 }}>Tanggal SKEP</Text>
                <Text>
                  :{" "}
                  {data?.tanggal_sk_pensiun &&
                    moment(data.tanggal_sk_pensiun).format("DD-MM-YYYY")}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 100 }}>TMT Pensiun</Text>
                <Text>
                  :{" "}
                  {data?.tmt_pensiun &&
                    moment(data.tmt_pensiun).format("DD-MM-YYYY")}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 10,
                }}
              >
                <Text style={{ width: 100 }}>NU Dapem</Text>
                <Text>: {data?.nu_dapem && data.nu_dapem}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 100 }}>Jiwa / Pangakat</Text>
                <Text>
                  : {data?.kode_jiwa && data.kode_jiwa} /{" "}
                  {data?.golongan && data.golongan}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 100 }}>TMT Stop</Text>
                <Text>: {data?.tmt_stop && data.tmt_stop}</Text>
              </View>
            </View>
          </View>
          <View style={{ margin: "10px 0", marginTop: 20 }}>
            <Text>
              Rincian penghasilan bulanan pada bulan{" "}
              {new Date().toLocaleString("id-ID", { month: "long" })}{" "}
              {new Date().getFullYear()} adalah :
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              gap: 20,
              flexDirection: "row",
              lineHeight: 1.5,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text>A. PENDAPATAN :</Text>
              <View style={{ marginLeft: 10 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>1. Pokok Pensiun</Text>
                  <Text>Rp </Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.penpok ? formatNumber(data.penpok.toString()) : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>2. Tunjangan Istri</Text>
                  <Text>Rp </Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.TunjanganPotongan.t_istri
                      ? formatNumber(data.TunjanganPotongan.t_istri.toString())
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>3. Tunjangan Anak</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.TunjanganPotongan.t_anak
                      ? formatNumber(data.TunjanganPotongan.t_anak.toString())
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>4. TPP</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.tpp ? formatNumber(data.tpp.toString()) : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>5. TPM / TP</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.tpmtp ? formatNumber(data.tpmtp.toString()) : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>6. TKD</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.tkd ? formatNumber(data.tkd.toString()) : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>7. Tunjangan Dahor</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.TunjanganPotongan.t_dahor
                      ? formatNumber(data.TunjanganPotongan.t_dahor.toString())
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>8. Tunjangan Beras</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.TunjanganPotongan.t_beras
                      ? formatNumber(data.TunjanganPotongan.t_beras.toString())
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>9. Tunjangan PPh Ps 21</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.tpph21 ? formatNumber(data.tpph21.toString()) : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>10. Tunjangan Cacat</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.TunjanganPotongan.t_cacat
                      ? formatNumber(data.TunjanganPotongan.t_cacat.toString())
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>8. Pembulatan</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.pembulatan
                      ? formatNumber(data.pembulatan.toString())
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100, padding: "7px 0" }}>
                    Jumlah Kotor
                  </Text>
                  <Text style={{ padding: "7px 0" }}>Rp</Text>
                  <Text
                    style={{
                      width: 80,
                      textAlign: "right",
                      borderTop: "1px solid #aaa",
                      padding: "7px 0",
                    }}
                  >
                    {data?.jumlah_kotor
                      ? formatNumber(data.jumlah_kotor.toString())
                      : "0"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text>B. POTONGAN :</Text>
              <View style={{ marginLeft: 10 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>1. PPh Ps 21</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.TunjanganPotongan.pot_pph21
                      ? formatNumber(
                          data.TunjanganPotongan.pot_pph21.toString()
                        )
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>2. Askes</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.TunjanganPotongan.pot_askes
                      ? formatNumber(
                          data.TunjanganPotongan.pot_askes.toString()
                        )
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>3. Assos</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.TunjanganPotongan.pot_assos
                      ? formatNumber(
                          data.TunjanganPotongan.pot_assos.toString()
                        )
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>4. Potongan Kasda</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.TunjanganPotongan.pot_kasda
                      ? formatNumber(
                          data.TunjanganPotongan.pot_kasda.toString()
                        )
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>5. Potongan KPKN</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.TunjanganPotongan.pot_kpkn
                      ? formatNumber(data.TunjanganPotongan.pot_kpkn.toString())
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>6. Alimentasi</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.TunjanganPotongan.pot_alimentasi
                      ? formatNumber(
                          data.TunjanganPotongan.pot_alimentasi.toString()
                        )
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>7. Sewa Rumah</Text>
                  <Text>Rp</Text>
                  <Text style={{ width: 80, textAlign: "right" }}>
                    {data?.TunjanganPotongan.pot_sewa_rumah
                      ? formatNumber(
                          data.TunjanganPotongan.pot_sewa_rumah.toString()
                        )
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>8. T. Ganti Rugi</Text>
                  <Text>Rp</Text>
                  <Text
                    style={{
                      width: 80,
                      textAlign: "right",
                    }}
                  >
                    {data?.TunjanganPotongan.pot_ganti_rugi
                      ? formatNumber(
                          data.TunjanganPotongan.pot_ganti_rugi.toString()
                        )
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100, padding: "7px 0" }}>
                    Jumlah Potongan
                  </Text>
                  <Text style={{ padding: "7px 0" }}>Rp</Text>
                  <Text
                    style={{
                      width: 80,
                      textAlign: "right",
                      borderBottom: "1px solid #aaa",
                      borderTop: "1px solid #aaa",
                      padding: "7px 0",
                    }}
                  >
                    {data?.jumlah_potongan
                      ? formatNumber(data.jumlah_potongan)
                      : "0"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ width: 100 }}>Jumlah Bersih (A-B)</Text>
                  <Text>Rp</Text>
                  <Text
                    style={{
                      width: 80,
                      textAlign: "right",
                    }}
                  >
                    {data?.jumlah_total
                      ? formatNumber(data.jumlah_total.toString())
                      : "0"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text>Informasi Keluarga :</Text>
            <View>
              <TablePdf
                dataHeader={header}
                dataBodies={data?.DataKeluarga || []}
              />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text>Informasi Hutang :</Text>
            <View>
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flex: 2 }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Text style={{ width: 50 }}>KPKN</Text>
                      <Text>
                        :{" "}
                        {data?.TunjanganPotongan.kpkn
                          ? data.TunjanganPotongan.kpkn
                          : "-"}
                      </Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Text style={{ width: 50 }}>SPN</Text>
                      <Text>
                        :{" "}
                        {data?.TunjanganPotongan.spn
                          ? data.TunjanganPotongan.spn
                          : "-"}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "flex-end",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Text style={{ width: 50 }}>Tanggal</Text>
                    <Text>
                      : {data?.tanggal_sekarang && data.tanggal_sekarang}
                    </Text>
                  </View>
                </View>
                <View>
                  <TablePdf
                    dataHeader={headerHutang}
                    dataBodies={bodiesHutang}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text>Informasi Tunjuk Silang :</Text>
                  <View>
                    <TablePdf dataHeader={headerSilang} dataBodies={[]} />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              textAlign: "center",
              fontSize: 8,
              lineHeight: 1.5,
              marginTop: 20,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>KETERANGAN</Text>
            <Text>
              Bahwa informasi yang kami sajikan adalah bukan merupakan informasi
              mutlak tanpa mempertimmbangkan informasi pendukung lainnya, kami
              tidak memberikan jaminan keakuratan, kelengkapan, dan atau
              keandalan informasi yang diberikan. Kami tidak bertanggung jawab
              atas segala kerugian dari pengguna yang timbul dikemudian hari
              atas penggunaan informasi yang kami sajikan.
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
const headerSilang: TablePdfHeaders[] = [
  { title: "NOTAS", dataIndex: "nopen", style: { textAlign: "center" } },
  { title: "KD JIWA", dataIndex: "kode_jiwa", style: { textAlign: "center" } },
  { title: "NAMA", dataIndex: "nama", style: { textAlign: "center" } },
  { title: "KDHIT", dataIndex: "kdhit", style: { textAlign: "center" } },
  {
    title: "KD JNS PENS",
    dataIndex: "jenis_pensiun",
    style: { textAlign: "center" },
  },
];
const headerHutang: TablePdfHeaders[] = [
  { title: "JENIS", dataIndex: "jenis_hutang", style: { textAlign: "center" } },
  {
    title: "JML HUTANG",
    dataIndex: "jumlah_hutang",
    style: { textAlign: "center" },
  },
  { title: "CICILAN", dataIndex: "cicilan", style: { textAlign: "center" } },
  { title: "DARI", dataIndex: "dari", style: { textAlign: "center" } },
  { title: "S/D", dataIndex: "s_d", style: { textAlign: "center" } },
];

const header: TablePdfHeaders[] = [
  { title: "NAMA KELAURGA", dataIndex: "nama", style: { textAlign: "center" } },
  { title: "HUBUNGAN", dataIndex: "hubungan", style: { textAlign: "center" } },
  {
    title: "TANGGAL LAHIR",
    dataIndex: "tanggal_lahir",
    style: { textAlign: "center" },
  },
  {
    title: "TANGGAL WAFAT",
    dataIndex: "tanggal_wafat",
    style: { textAlign: "center" },
  },
  {
    title: "TANGGAL NIKAH",
    dataIndex: "tanggal_nikah",
    style: { textAlign: "center" },
  },
  {
    title: "AKHIR SKS",
    dataIndex: "akhir_sks",
    style: { textAlign: "center" },
  },
];
