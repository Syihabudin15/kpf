"use client";

import { Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { stylesFont } from "../CetakFormPengajuan";
import moment from "moment";
import { Flex } from "antd";

export default function FormAsabri({ data }: { data: DataDataPengajuan }) {
  return (
    <>
      <Page
        size={"A4"}
        style={{
          paddingTop: 20,
          paddingLeft: 40,
          paddingRight: 40,
          paddingBottom: 5,
          fontSize: 9,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 50,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image src={"/assets/images/asabri.png"} style={{ width: 150 }} />
          <View
            style={{
              border: "1px solid #111",
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              ...stylesFont.root,
            }}
          >
            <Text>UNTUK PENGAJUAN DAN PENGAMBILAN UANG</Text>
            <Text>TIDAK DIPUNGUT BIAYA APAPUN</Text>
            <Text>BLANKO INI TIDAK DIPERJUAL BELIKAN</Text>
          </View>
        </View>
        <View
          style={{ padding: 3, border: "1px solid #aaa", margin: "3px 0px" }}
        >
          <Text
            style={{ textAlign: "center", fontSize: 10, ...stylesFont.root }}
          >
            FORMULIR PENGAJUAN
          </Text>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}>A.</Text>
          <Text style={{ width: 90 }}>JENIS KLAIM</Text>
          <View
            style={{ flex: 1, display: "flex", flexDirection: "row", gap: 10 }}
          >
            <View
              style={{
                display: "flex",
                gap: 3,
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Checkbox />
              <View
                style={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Text>THT</Text>
                <Text>1. TA</Text>
                <Text>2. NTTA</Text>
                <Text>3. BPPP</Text>
                <Text>4. BPI/S</Text>
                <Text>5. BPA</Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                gap: 4,
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Checkbox />
              <View
                style={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Text>JKK</Text>
                <Text>1. Perawatan</Text>
                <Text>2. SCBD</Text>
                <Text>3. SCDK</Text>
                <Text>4. SRKK</Text>
                <Text>5. Beasiswa</Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                gap: 4,
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Checkbox />
              <View
                style={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Text>JKM</Text>
                <Text>1. SKS</Text>
                <Text>2. UDW</Text>
                <Text>3. Beasiswa</Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                gap: 4,
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Checkbox checked={"X"} />
              <View
                style={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Text>PENSIUN</Text>
                <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
                  <View
                    style={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Text>1. Sendiri</Text>
                    <Text>2. Tunjangan Terbatas</Text>
                    <Text>3. Wari/Janda/Duda</Text>
                    <Text>4. Tunj. Yatim Piatu</Text>
                    <Text>5. Tunj. Orang Tua</Text>
                    <Text>6. UDW</Text>
                  </View>
                  <View
                    style={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Text>7. UKP</Text>
                    <Text>8. NTIP/IDP</Text>
                    <Text>9. Mutasi</Text>
                    <Text>10. SPPI/S</Text>
                    <Text>11. Tinjau KEP</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}>B.</Text>
          <Text style={{ width: 90 }}>PESERTA ASABRI</Text>
          <View
            style={{ flex: 1, display: "flex", flexDirection: "row", gap: 10 }}
          ></View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 90 }}>Nama</Text>
          <View
            style={{
              flex: 1,

              display: "flex",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Text style={{ flex: 1, border: "1px solid #111", padding: 2 }}>
              {data.nama}
            </Text>
            <Text
              style={{
                width: 30,
                border: "1px solid #111",
                padding: 2,
                textAlign: "center",
              }}
            >
              L / P
            </Text>
          </View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 90 }}>Tanggal Lahir</Text>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}
          >
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Checkbox
                checked={String(data.DataPembiayaan.tanggal_lahir.charAt(0))}
              />
              <Checkbox checked={data.DataPembiayaan.tanggal_lahir.charAt(1)} />
            </View>
            <Text>-</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Checkbox checked={data.DataPembiayaan.tanggal_lahir.charAt(3)} />
              <Checkbox checked={data.DataPembiayaan.tanggal_lahir.charAt(4)} />
            </View>
            <Text>-</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Checkbox checked={data.DataPembiayaan.tanggal_lahir.charAt(6)} />
              <Checkbox checked={data.DataPembiayaan.tanggal_lahir.charAt(7)} />
              <Checkbox checked={data.DataPembiayaan.tanggal_lahir.charAt(8)} />
              <Checkbox checked={data.DataPembiayaan.tanggal_lahir.charAt(9)} />
            </View>
          </View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 90 }}>NRP/NIP</Text>
          <View
            style={{ flex: 1, display: "flex", flexDirection: "row", gap: 8 }}
          >
            <View
              style={{ width: "50%", border: "1px solid #111", height: 17 }}
            ></View>
            <View
              style={{ flex: 1, display: "flex", flexDirection: "row", gap: 3 }}
            >
              <Text style={{ width: 70 }}>No. KTPA</Text>
              <Text
                style={{ flex: 1, border: "1px solid #111", height: 17 }}
              ></Text>
            </View>
          </View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 90 }}>Kesatuan</Text>
          <View
            style={{ flex: 1, display: "flex", flexDirection: "row", gap: 8 }}
          >
            <View
              style={{ width: "50%", border: "1px solid #111", height: 17 }}
            ></View>
            <View
              style={{ flex: 1, display: "flex", flexDirection: "row", gap: 3 }}
            >
              <Text style={{ width: 70 }}>No. KTA**</Text>
              <Text
                style={{ flex: 1, border: "1px solid #111", height: 17 }}
              ></Text>
            </View>
          </View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}>C.</Text>
          <Text style={{ width: 90 }}>PENGAJU</Text>
          <View
            style={{ flex: 1, display: "flex", flexDirection: "row", gap: 10 }}
          ></View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 90 }}>Nama</Text>
          <View
            style={{
              flex: 1,

              display: "flex",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Text style={{ flex: 1, border: "1px solid #111", padding: 2 }}>
              {data.nama}
            </Text>
            <Text
              style={{
                width: 30,
                border: "1px solid #111",
                padding: 2,
                textAlign: "center",
              }}
            >
              L / P
            </Text>
          </View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 90 }}>Tanggal Lahir</Text>
          <View
            style={{ flex: 1, display: "flex", flexDirection: "row", gap: 4 }}
          >
            <View
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Checkbox
                  checked={String(data.DataPembiayaan.tanggal_lahir.charAt(0))}
                />
                <Checkbox
                  checked={data.DataPembiayaan.tanggal_lahir.charAt(1)}
                />
              </View>
              <Text>-</Text>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Checkbox
                  checked={data.DataPembiayaan.tanggal_lahir.charAt(3)}
                />
                <Checkbox
                  checked={data.DataPembiayaan.tanggal_lahir.charAt(4)}
                />
              </View>
              <Text>-</Text>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Checkbox
                  checked={data.DataPembiayaan.tanggal_lahir.charAt(6)}
                />
                <Checkbox
                  checked={data.DataPembiayaan.tanggal_lahir.charAt(7)}
                />
                <Checkbox
                  checked={data.DataPembiayaan.tanggal_lahir.charAt(8)}
                />
                <Checkbox
                  checked={data.DataPembiayaan.tanggal_lahir.charAt(9)}
                />
              </View>
            </View>
            <View
              style={{ flex: 1, display: "flex", flexDirection: "row", gap: 3 }}
            >
              <Text style={{ width: 70 }}>Hub. Keluarga</Text>
              <Text style={{ flex: 1, padding: 2, border: "1px solid #aaa" }}>
                DIRI SENDIRI
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 90 }}>Alamat</Text>
          <Text style={{ flex: 1, padding: 2, border: "1px solid #111" }}>
            {data.DataPembiayaan.alamat}
          </Text>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 90 }}>Kelurahan/Desa</Text>
          <View
            style={{
              flex: 1,

              display: "flex",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Text
              style={{ width: "50%", border: "1px solid #111", padding: 2 }}
            >
              {data.DataPengajuanAlamat.kelurahan}
            </Text>
            <View
              style={{ flex: 1, display: "flex", flexDirection: "row", gap: 3 }}
            >
              <Text style={{ width: 70 }}>Kecamatan</Text>
              <Text style={{ flex: 1, border: "1px solid #111", padding: 2 }}>
                {data.DataPengajuanAlamat.kecamatan}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 90 }}>Kota</Text>
          <View
            style={{
              flex: 1,

              display: "flex",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Text
              style={{ width: "50%", border: "1px solid #111", padding: 2 }}
            >
              {data.DataPengajuanAlamat.kota}
            </Text>
            <View
              style={{ flex: 1, display: "flex", flexDirection: "row", gap: 3 }}
            >
              <Text style={{ width: 70 }}>Provinsi</Text>
              <Text style={{ flex: 1, border: "1px solid #111", padding: 2 }}>
                {data.DataPengajuanAlamat.provinsi}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 90 }}>NIK</Text>
          <View
            style={{
              flex: 1,

              display: "flex",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Text
              style={{ width: "50%", border: "1px solid #111", padding: 2 }}
            >
              {data.nik}
            </Text>
            <View
              style={{ flex: 1, display: "flex", flexDirection: "row", gap: 3 }}
            >
              <Text style={{ width: 70 }}>No.Telp/Hp</Text>
              <Text style={{ flex: 1, border: "1px solid #111", padding: 2 }}>
                {data.no_telepon}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <View style={{ width: 90 }}>
            <Text>Jenis UKP/Mutasi/</Text>
            <Text>Pengajuan SPPI/S</Text>
            <Text>Tinjau Kep Pens***</Text>
          </View>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <Text style={{ border: "1px solid #111", height: 17 }}></Text>
            <Text style={{ border: "1px solid #111", height: 17 }}></Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
              <Text
                style={{ width: "50%", border: "1px solid #111", height: 17 }}
              ></Text>
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  gap: 3,
                  alignItems: "center",
                }}
              >
                <Text style={{ width: 70 }}>No. Pensiun</Text>
                <Text style={{ flex: 1, border: "1px solid #111", padding: 2 }}>
                  {data.nopen}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}>D.</Text>
          <Text style={{ width: 90 }}>KANTOR BAYAR</Text>
          <View
            style={{ flex: 1, display: "flex", flexDirection: "row", gap: 10 }}
          ></View>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 90 }}>Bank/Pos</Text>
          <Text style={{ flex: 1, padding: 2, border: "1px solid #111" }}>
            {data.DataPembiayaan.juru_bayar_tujuan}
          </Text>
        </View>
        <View
          style={{
            margin: "3px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text style={{ width: 8 }}></Text>
          <Text style={{ width: 90 }}>Jenis Tabungan</Text>
          <View
            style={{
              flex: 1,

              display: "flex",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Text
              style={{ width: "50%", border: "1px solid #111", padding: 2 }}
            ></Text>
            <View
              style={{ flex: 1, display: "flex", flexDirection: "row", gap: 3 }}
            >
              <Text style={{ width: 70 }}>No Rekening</Text>
              <Text style={{ flex: 1, border: "1px solid #111", padding: 2 }}>
                {data.DataPembiayaan.no_rekening}
              </Text>
            </View>
          </View>
        </View>
        <Text style={{ margin: "8px 0px", textAlign: "justify" }}>
          Keterangan di atas saya buat dengan sebenar - benarnya dengan penuh
          kesadaran, apabila keterangan yang saya berikan tidak benar, saya
          bersedia mengganti seluruh kerugian kepada negara/PT ASABRI (Persero)
          dan bersedia dituntut sesuai dengan peraturan perundang - undangan
          yang berlaku.
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              margin: 8,
              width: 150,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                width: "100%",
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
                textAlign: "center",
              }}
            >
              {data.User.UnitCabang
                ? data.User.UnitCabang.name === "PUSAT"
                  ? "BANDUNG"
                  : data.User.UnitCabang.name
                : ""}
              ,{" "}
              {moment(data.DataPembiayaan.tanggal_input).format(
                "DD - MM - YYYY"
              )}
            </Text>
            <Text>Pengaju</Text>
            <Text style={{ marginTop: 17, marginBottom: 17 }}></Text>
            <Text
              style={{
                width: "100%",
                borderBottom: "1px solid #111",
                textAlign: "center",
              }}
            >
              {data.nama}
            </Text>
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 15 }}>*)</Text>
          <Text style={{ flex: 1, fontSize: 7 }}>
            Bila kurang jelas, dapat menghubungi{" "}
            <Text style={{ fontStyle: "italic" }}>Call Center</Text> ASABRI
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 15 }}>**)</Text>
          <Text style={{ flex: 1, fontSize: 7 }}>
            Diisi untuk pengajuan Perawatan
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 15 }}>***)</Text>
          <Text style={{ flex: 1, fontSize: 7 }}>
            Diisi hanya untuk pengajuan UKP/Mutasi/Pengajuan SPPI/S dan
            Peninjauan Kep Pensiun
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 15 }}></Text>
          <Text
            style={{
              flex: 1,
              ...stylesFont.root,
              fontStyle: "italic",
              fontSize: 7,
            }}
          >
            Untuk informasi lebih lanjut bisa menghubungi Call Center ASABRI
            Nomor <Text style={{ fontSize: 8 }}>150043</Text>
          </Text>
        </View>
        <View
          style={{
            marginTop: 10,
            color: "#bbb",
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <View
            style={{
              width: 200,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Text>PT ASABRI (Persero)</Text>
            <Text>Jl. Mayjen Sutoyo, No. 11, Jakarta 13630</Text>
          </View>
          <View
            style={{
              width: 90,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Text>P: 021 8 094 140</Text>
            <Text>F: 021 8 012 313</Text>
          </View>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Text>asabri@asabri.co.id</Text>
            <Text>www.asabri.co.id</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 2 */}
      <Page
        size={"A4"}
        style={{
          paddingTop: 20,
          paddingHorizontal: 40,
          fontSize: 9,
          ...stylesFont.root,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 50,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            src={"/assets/images/asabri.png"}
            style={{ width: 150, gap: 50 }}
          />
        </View>
        <View
          style={{
            marginVertical: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              border: "1px solid #111",
              width: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              SURAT PERNYATAAN PERMABAYARAN
            </Text>
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              PENSIUN MELALUI REKENING DAN
            </Text>
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              KUASA SP3R
            </Text>
          </View>
          <View style={{ width: 180 }}>
            <Text style={{ fontWeight: "bold" }}>KEPADA YTH.:</Text>
            <Text style={{ fontWeight: "bold" }}>
              DIRUT PT ASABRI (PERSERO)
            </Text>
            <Text style={{ fontWeight: "bold" }}>UP. KAKANCAB</Text>
            <Text style={{ fontWeight: "bold" }}>DI</Text>
            <Text
              style={{
                width: "100%",
                height: 8,
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
              }}
            ></Text>
          </View>
        </View>
        <Text style={{ marginBottom: 5 }}>
          Yang bertanda tangan di bawah ini:
        </Text>
        <View
          style={{
            border: "1px solid #111",
            padding: 5,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}>1</Text>
            <Text style={{ width: 120 }}>Nama Penerima Pensiun</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text
              style={{
                flex: 1,
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
              }}
            >
              {data.nama}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}>2</Text>
            <Text style={{ width: 120 }}>
              Janda/Duda dari almarhum/ almarhumah
            </Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text
              style={{
                flex: 1,
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
              }}
            ></Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}>3</Text>
            <Text style={{ width: 120 }}>Tempat dan tanggal lahir</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text
              style={{
                flex: 1,
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
              }}
            >
              {data.DataPembiayaan.tempat_lahir + ", "}{" "}
              {moment(data.DataPembiayaan.tanggal_lahir, "DD-MM-YYYY").format(
                "DD - MM - YYYY"
              )}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}>4</Text>
            <Text style={{ width: 120 }}>NRP/NIP</Text>
            <Text style={{ width: 10 }}>:</Text>
            <View
              style={{ flex: 1, display: "flex", flexDirection: "row", gap: 4 }}
            >
              <Text
                style={{
                  width: "35%",
                  borderBottom: "1px solid #111",
                  borderBottomStyle: "dotted",
                }}
              ></Text>
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text style={{ width: 70 }}>Nopen</Text>
                <Text style={{ width: 10 }}>:</Text>
                <Text
                  style={{
                    flex: 1,
                    borderBottom: "1px solid #111",
                    borderBottomStyle: "dotted",
                  }}
                >
                  {data.nopen}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}>5</Text>
            <Text style={{ width: 120 }}>Penerbit SKEP</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text
              style={{
                flex: 1,
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
              }}
            >
              {data.penerbit_sk}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}>6</Text>
            <Text style={{ width: 120 }}>Nomor dan Tanggal SKEP</Text>
            <Text style={{ width: 10 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 4,
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
              }}
            >
              <Text
                style={{
                  width: "35%",
                }}
              >
                {data.nomor_sk_pensiun}
              </Text>
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text style={{ width: 70 }}>Tanggal</Text>
                <Text style={{ width: 10 }}></Text>
                <Text
                  style={{
                    flex: 1,
                  }}
                >
                  {moment(data.tanggal_sk_pensiun).format("DD - MM - YYYY")}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}>7</Text>
            <Text style={{ width: 120 }}>Tanggal mulai pensiun</Text>
            <Text style={{ width: 10 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Text
                style={{
                  width: "35%",
                  borderBottom: "1px solid #111",
                  borderBottomStyle: "dotted",
                }}
              >
                {moment(data.tmt_pensiun).format("DD - MM - YYYY")}
              </Text>
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text style={{ width: 70 }}>Pangkat Terakhir</Text>
                <Text style={{ width: 10 }}>:</Text>
                <Text
                  style={{
                    flex: 1,
                    borderBottom: "1px solid #111",
                    borderBottomStyle: "dotted",
                  }}
                >
                  {data.golongan}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}>8</Text>
            <Text style={{ width: 120 }}>Alamat Lengkap</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text
              style={{
                flex: 1,
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
              }}
            >
              {data.DataPengajuanAlamat.alamat} RT {data.DataPengajuanAlamat.rt}{" "}
              RW {data.DataPengajuanAlamat.rw}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}></Text>
            <Text style={{ width: 120 }}>Kelurahan</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text
              style={{
                flex: 1,
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
              }}
            >
              {data.DataPengajuanAlamat.kelurahan}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}></Text>
            <Text style={{ width: 120 }}>Kecamatan</Text>
            <Text style={{ width: 10 }}>:</Text>
            <Text
              style={{
                flex: 1,
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
              }}
            >
              {data.DataPengajuanAlamat.kecamatan}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}></Text>
            <Text style={{ width: 120 }}>Kabupaten/Kota</Text>
            <Text style={{ width: 10 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Text
                style={{
                  width: "35%",
                  borderBottom: "1px solid #111",
                  borderBottomStyle: "dotted",
                }}
              >
                {data.DataPengajuanAlamat.kota}
              </Text>
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text style={{ width: 70 }}>Kode Pos</Text>
                <Text style={{ width: 10 }}>:</Text>
                <Text
                  style={{
                    flex: 1,
                    borderBottom: "1px solid #111",
                    borderBottomStyle: "dotted",
                  }}
                >
                  {data.DataPengajuanAlamat.kode_pos}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}></Text>
            <Text style={{ width: 120 }}>Provinsi</Text>
            <Text style={{ width: 10 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Text
                style={{
                  width: "35%",
                  borderBottom: "1px solid #111",
                  borderBottomStyle: "dotted",
                }}
              >
                {data.DataPengajuanAlamat.provinsi}
              </Text>
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text style={{ width: 70 }}>No Telepon</Text>
                <Text style={{ width: 10 }}>:</Text>
                <Text
                  style={{
                    flex: 1,
                    borderBottom: "1px solid #111",
                    borderBottomStyle: "dotted",
                  }}
                >
                  {data.no_telepon}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 10 }}>9</Text>
            <Text style={{ width: 120 }}>Bank/Giro</Text>
            <Text style={{ width: 10 }}>:</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Text
                style={{
                  width: "35%",
                  borderBottom: "1px solid #111",
                  borderBottomStyle: "dotted",
                }}
              >
                {data.DataPembiayaan.nama_bank}
              </Text>
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Text style={{ width: 70 }}>Nomor Rekening</Text>
                <Text style={{ width: 10 }}>:</Text>
                <Text
                  style={{
                    flex: 1,
                    borderBottom: "1px solid #111",
                    borderBottomStyle: "dotted",
                  }}
                >
                  {data.DataPembiayaan.no_rekening}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={{ marginVertical: 5 }}>
          Sehubungan dengan pembayaran pensiun melalui rekening tersebut di
          atas, dengan ini saya menyatakan :
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 10 }}>1</Text>
          <Text style={{ flex: 1, textAlign: "justify", lineHeight: 1.5 }}>
            Memberi kuasa dengan hak substitusi kepada PT. ASABRI (PERSERO)
            khusus untuk mendebit rekening saya nomor:{" "}
            ....................................... Di PT. BANK/GIRO
            ................................................. Untuk
            mengembalikan seluruh kelebihan pembayaran uang pensiun yang bukan
            merupakan hak saya atau ahli waris yang menurut ketentuan PT. ASABRI
            (PERSERO), untuk dikreditkan sebagai keuntungan PT. ASABRI
            (PERSERO).
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            marginVertical: 3,
          }}
        >
          <Text style={{ width: 10 }}>2</Text>
          <Text style={{ flex: 1, textAlign: "justify", lineHeight: 1.5 }}>
            Memberi kuasa dan hak substitusi kepada PT. BANK/GIRO
            ............................................... khusus untuk memberi
            keterangan mengenai diri saya sebagai nasabah penyimpanan dan
            simpanan saya kepada PT. ASABRI (PERSERO).
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            marginVertical: 3,
          }}
        >
          <Text style={{ width: 10 }}>3</Text>
          <Text style={{ flex: 1, textAlign: "justify", lineHeight: 1.5 }}>
            Kuasa sebagaimana tersebut pada butir 1, diatas tidak akan berakhir
            selama kewajiban saya atau ahli waris saya untuk mengembalikan
            kelebihan pembayaran pensiun yang bukan merupakan hak saya atau ahli
            waris saya menurut ketentuan PT. ASABRI (PERSERO) belum dilakukan
            sepenuhnya maupun oleh sebab-sebab yang tercantum pada pasal 1813
            Kitab Undang-Undang Hukum Pidana.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            marginVertical: 3,
          }}
        >
          <Text style={{ width: 10 }}>4</Text>
          <Text style={{ flex: 1, textAlign: "justify", lineHeight: 1.5 }}>
            Wajib melaporkan ke Kantor Cabang PT. ASABRI (PERSERO) di
            .................................... apabila terjadi perubahan
            susunan keluarga,alamat, ataupun perubahan lainnya.
          </Text>
        </View>
        <Text style={{ marginVertical: 5 }}>
          Dengan surat pernyataan ini dibuat, agar yang berkepentingan maklum.
        </Text>
        <View
          style={{
            marginVertical: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View
            style={{
              border: "1px solid #111",
              width: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              PERHATIAN !!!
            </Text>
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              Barang siapa yang memberikan keterangan
            </Text>
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              tidak benar atau memalsukan keterangan ini
            </Text>
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              akan dituntut sesuai dengan pasal 263 KUHP
            </Text>
          </View>
          <View
            style={{
              width: 180,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
                textAlign: "center",
                width: "80%",
              }}
            >
              {data.User.UnitCabang
                ? data.User.UnitCabang.name === "PUSAT"
                  ? "BANDUNG"
                  : data.User.UnitCabang.name
                : ""}
              ,{" "}
              {moment(data.DataPembiayaan.tanggal_input).format(
                "DD - MM - YYYY"
              )}
            </Text>
            <Text style={{ fontWeight: "bold" }}>Yang menyatakan,</Text>
            <Text style={{ marginVertical: 15 }}></Text>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Text>(</Text>
              <Text
                style={{
                  flex: 1,
                  borderBottom: "1px solid #111",
                  borderBottomStyle: "dotted",
                  textAlign: "center",
                }}
              >
                {data.nama}
              </Text>
              <Text>)</Text>
            </View>
            <Text style={{ fontWeight: "bold" }}>
              Nama Jelas, tanda tangan, cap
            </Text>
          </View>
        </View>
        <Text>Disampaikan :</Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 15 }}>1.</Text>
          <Text style={{ flex: 1 }}>Lembar I untuk Bank / Giro</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 15 }}>2.</Text>
          <Text style={{ flex: 1 }}>
            Lembar II untuk KC.PT. ASABRI (PERSERO)
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <Text style={{ width: 15 }}>3.</Text>
          <Text style={{ flex: 1 }}>Lembar III untuk penerima Pensiun</Text>
        </View>
        <View
          style={{
            marginTop: 10,
            color: "#bbb",
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <View
            style={{
              width: 200,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Text>PT ASABRI (Persero)</Text>
            <Text>Jl. Mayjen Sutoyo, No. 11, Jakarta 13630</Text>
          </View>
          <View
            style={{
              width: 90,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Text>P: 021 8 094 140</Text>
            <Text>F: 021 8 012 313</Text>
          </View>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Text>asabri@asabri.co.id</Text>
            <Text>www.asabri.co.id</Text>
          </View>
        </View>
      </Page>
    </>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  separator: {
    width: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});

const Checkbox = ({ checked }: { checked?: any }) => (
  <View style={styles.checkboxContainer}>
    <View style={styles.box}>
      <Text>{checked}</Text>
    </View>
  </View>
);
