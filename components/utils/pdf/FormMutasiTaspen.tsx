"use client";

import { Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { stylesFont } from "../CetakFormPengajuan";
import moment from "moment";

export default function FormMutasiTaspen({
  data,
}: {
  data: DataDataPengajuan;
}) {
  return (
    <>
      <Page
        size={"A4"}
        style={{ padding: "50px 80px", fontSize: 9, ...stylesFont.root }}
      >
        <Image
          src={"/assets/images/taspen.png"}
          style={{ position: "absolute", left: 50, top: 30, width: 80 }}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: 13,
            fontWeight: "bold",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          PERMOHONAN MUTASI FINANSIAL DAN NON FINANSIAL
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: 2,
          }}
        >
          <Text style={{ width: 10, fontWeight: "bold" }}>A.</Text>
          <Text style={{ width: 110, fontWeight: "bold" }}>JENIS MUTASI :</Text>
          <View
            style={{ flex: 1, borderBottom: "1px solid #111", padding: 2 }}
          ></View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: 2,
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 110 }}>MUTASI FINANSIAL</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: 2,
            }}
          >
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              }}
            >
              <Checkbox /> <Text>Tunjangan Keluarga</Text>
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              }}
            >
              <Checkbox checked={"X"} /> <Text>Lainnya</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: 2,
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 110 }}>MUTASI NON FINANSIAL</Text>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: 2,
            }}
          >
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              }}
            >
              <Checkbox /> <Text>Mutasi Keluar kantor cabang</Text>
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              }}
            >
              <Checkbox checked={"X"} /> <Text>Mutasi Kantor Bayar</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: 2,
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 110 }}></Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: 2,
            }}
          >
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              }}
            >
              <Checkbox /> <Text>Mutasi Alamat</Text>
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              }}
            >
              <Checkbox /> <Text>Ganti Nomor Rekening</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 5,
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10, fontWeight: "bold" }}>B.</Text>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              gap: 4,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              IDENTITAS PEMOHON / PESERTA
            </Text>{" "}
            <Text style={{ fontStyle: "italic" }}>
              ( Semua Item di bawah ini wajib diisi )
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 110 }}>Nama</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text>{data.nama}</Text>
          </View>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 110 }}>NIP / NO.KPE / NOTAS</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text>{data.nopen}</Text>
          </View>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 110 }}>NOMOR KTP</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text>{data.nik}</Text>
          </View>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 110 }}>NOMOR HANDPHONE</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text>{data.no_telepon}</Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 5,
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10, fontWeight: "bold" }}>C.</Text>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              gap: 4,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>MUTASI FINANSIAL</Text>
            <Text style={{ fontStyle: "italic" }}>
              ( Wajib diisi jika Pilihan Mutasi Finansial pada huruf A diatas )
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10, fontWeight: "bold" }}></Text>
          <Text style={{ width: 13, fontWeight: "bold" }}>C1.</Text>
          <Text>
            TUNJANGAN ANAK USIA DIATAS 21 TAHUN MASIH SEKOLAH / KULIAH
          </Text>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 15 }}></Text>
          <Text style={{ width: 90 }}>Nama</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text style={{ height: 10 }}></Text>
          </View>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 15 }}></Text>
          <Text style={{ width: 90 }}>Tanggal Lahir</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text style={{ height: 10 }}></Text>
          </View>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 15 }}></Text>
          <Text style={{ width: 90 }}>Tanggal Ajaran</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text style={{ height: 10 }}></Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 13 }}>C2.</Text>
          <Text>LAINNYA</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 110 }}></Text>
          <View
            style={{
              flex: 1,
              border: "1px solid #111",
              padding: 3,
              height: 50,
            }}
          >
            <Text></Text>
          </View>
        </View>
      </Page>
      <Page
        size={"A4"}
        style={{ padding: "40px 60px", fontSize: 8, ...stylesFont.root }}
      >
        <View
          style={{
            marginTop: 5,
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}>D.</Text>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              gap: 4,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>MUTASI NON FINANSIAL</Text>
            <Text style={{ fontStyle: "italic" }}>
              ( Wajib diisi jika Pilihan Mutasi Non Finansial pada huruf A
              diatas )
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 13 }}>D1.</Text>
          <Text>DATA LAMA</Text>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 15 }}></Text>
          <Text style={{ width: 90 }}>Kantor Cabang Lama</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text style={{ height: 10 }}>
              {data.DataPembiayaan.juru_bayar_asal}
            </Text>
          </View>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 15 }}></Text>
          <Text style={{ width: 90 }}>Kantor Bayar Lama</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text style={{ height: 10 }}>
              {data.DataPembiayaan.juru_bayar_asal}
            </Text>
          </View>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 15 }}></Text>
          <Text style={{ width: 90 }}>Alamat Lama</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text style={{ height: 50 }}></Text>
          </View>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 15 }}></Text>
          <Text style={{ width: 90 }}>Nomor Rekening Lama</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text style={{ height: 10 }}>
              {data.DataPembiayaan.no_rekening}
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 13 }}>D2.</Text>
          <Text>DATA BARU</Text>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 15 }}></Text>
          <Text style={{ width: 90 }}>Kantor Cabang Baru</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text style={{ height: 10 }}>
              {data.DataPembiayaan.juru_bayar_tujuan}
            </Text>
          </View>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 15 }}></Text>
          <Text style={{ width: 90 }}>Kantor Bayar Baru</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text style={{ height: 10 }}>
              {data.DataPembiayaan.juru_bayar_tujuan}
            </Text>
          </View>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 15 }}></Text>
          <Text style={{ width: 90 }}>Alamat Baru</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text style={{ height: 50 }}></Text>
          </View>
        </View>
        <View
          style={{
            margin: "2px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            padding: "2px 0px 2px 0px",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 15 }}></Text>
          <Text style={{ width: 90 }}>Nomor Rekening Baru</Text>
          <View style={{ flex: 1, border: "1px solid #111", padding: 3 }}>
            <Text style={{ height: 10 }}></Text>
          </View>
        </View>
        <Text
          style={{ margin: "10px 0px", lineHeight: 1.5, textAlign: "justify" }}
        >
          Demikian permohonan ini dan keterangan diatas saya buat dengan
          sebenar-benarnya dan penuh kesadaran , apabila keterangan yang saya
          berikan tidak benar , saya bersedia mengganti semua kerugian kepada
          negara / PT TASPEN (PERSERO) dan bersedia dituntut sesuai dengan
          perundang-undangan yang berlaku .
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
              width: 150,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <View
              style={{
                borderBottom: "1px solid #111",
                borderStyle: "dotted",
                textAlign: "right",
              }}
            >
              <Text>
                {data.User.UnitCabang
                  ? data.User.UnitCabang.name === "PUSAT"
                    ? "BANDUNG"
                    : data.User.UnitCabang.name
                  : " "}
                ,{" "}
                {moment(data.DataPembiayaan.tanggal_input, "DD-MM-YYYY").format(
                  "DD - MM - YYYY"
                )}
              </Text>
            </View>
            <Text style={{ textAlign: "center" }}>Pemohon</Text>
            <View style={{ height: 50 }}></View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 3,
              }}
            >
              <Text>{"("}</Text>
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
              <Text>{")"}</Text>
            </View>
            <Text style={{ fontStyle: "italic", fontSize: 6 }}>
              Nama Jelas , Tanda tangan , cap tiga jari tengah kiri
            </Text>
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
    width: 15,
    height: 15,
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
