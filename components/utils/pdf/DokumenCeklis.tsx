import { Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { DataDataPengajuan } from "../Interfaces";

export default function DokumenCeklis({ data }: { data: DataDataPengajuan }) {
  const sekat1 = [
    [
      { data: "1", width: 30 },
      { data: "KTP Pemohon", width: 120 },
      { data: "COPY", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "2", width: 30 },
      { data: "KTP Suami / Istri*", width: 120 },
      { data: "COPY", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "3", width: 30 },
      { data: "Katu Keluarga Pemohon", width: 120 },
      { data: "COPY", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "4", width: 30 },
      { data: "NPWP", width: 120 },
      { data: "COPY", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "5", width: 30 },
      { data: "KARIP / Buku ASABRI", width: 120 },
      { data: "COPY", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "6", width: 30 },
      { data: "Slip Gaji karyawan / Rekening Bank 3 Bln Terakhir", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
  ];

  const sekat2 = [
    [
      { data: "1", width: 30 },
      { data: "Analisa Pembiayaan", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "2", width: 30 },
      { data: "Form Permohonan Pembiayaan Pensiun", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "3", width: 30 },
      { data: "Surat Keterangan Asli Pos", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "4", width: 30 },
      {
        data: "Surat pernyataan ketentuan pembiayaan, keterangan kesehatan dan domisili pemohon",
        width: 120,
      },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
    [
      { data: "5", width: 30 },
      { data: "Surat Keterangan / Pernyataan Lainnya", width: 120 },
      { data: "ASLI", width: 80 },
      { data: "", width: 93 },
      { data: "", width: 93 },
      { data: "", width: 93 },
    ],
  ];
  return (
    <Page size={"A4"} style={stylePdf.root}>
      <View style={{ fontSize: 10, fontWeight: "bold" }}>
        <Text>DOKUMEN CHECKLIST</Text>
      </View>
      <View style={{ marginTop: 30 }}>
        <View style={{ display: "flex", flexDirection: "column" }}>
          <View
            style={{
              border: "1px solid #aaa",
              textAlign: "center",
              fontWeight: "bold",
              width: 510,
              padding: 2,
            }}
          >
            <Text>SEKAT 1</Text>
          </View>
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              <View
                style={{
                  width: 30,
                  border: "1px solid #aaa",
                  display: "flex",
                  padding: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>No</Text>
              </View>
              <View
                style={{
                  width: 120,
                  border: "1px solid #aaa",
                  display: "flex",
                  padding: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>DESKRIPSI DOKUMEN</Text>
              </View>
              <View
                style={{
                  width: 80,
                  border: "1px solid #aaa",
                  display: "flex",
                  padding: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>ASLI/COPY</Text>
              </View>
              <View
                style={{
                  width: 280,
                  padding: 1,
                  border: "1px solid #aaa",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Text>CHECKLIST</Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ flex: 1, border: "1px solid #aaa" }}>
                    MARKETING
                  </Text>
                  <Text style={{ flex: 1, border: "1px solid #aaa" }}>
                    MITRA PUSAT
                  </Text>
                  <Text style={{ flex: 1, border: "1px solid #aaa" }}>
                    {data.Bank.kode}
                  </Text>
                </View>
              </View>
            </View>
            {sekat1.map((body, index) => (
              <View
                key={index}
                style={{ display: "flex", flexDirection: "row" }}
              >
                {body.map((b, ind) => (
                  <Text
                    style={{
                      width: b.width,
                      border: "1px solid #aaa",
                      padding: 1,
                      textAlign: ind === 1 ? "left" : "center",
                    }}
                    key={ind}
                  >
                    {b.data}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={{ marginTop: 30 }}>
        <View style={{ display: "flex", flexDirection: "column" }}>
          <View
            style={{
              border: "1px solid #aaa",
              textAlign: "center",
              fontWeight: "bold",
              width: 510,
              padding: 2,
            }}
          >
            <Text>SEKAT 2</Text>
          </View>
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              <View
                style={{
                  width: 30,
                  border: "1px solid #aaa",
                  display: "flex",
                  padding: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>No</Text>
              </View>
              <View
                style={{
                  width: 120,
                  border: "1px solid #aaa",
                  display: "flex",
                  padding: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>DESKRIPSI DOKUMEN</Text>
              </View>
              <View
                style={{
                  width: 80,
                  border: "1px solid #aaa",
                  display: "flex",
                  padding: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>ASLI/COPY</Text>
              </View>
              <View
                style={{
                  width: 280,
                  padding: 1,
                  border: "1px solid #aaa",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Text>CHECKLIST</Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ flex: 1, border: "1px solid #aaa" }}>
                    MARKETING
                  </Text>
                  <Text style={{ flex: 1, border: "1px solid #aaa" }}>
                    MITRA PUSAT
                  </Text>
                  <Text style={{ flex: 1, border: "1px solid #aaa" }}>
                    {data.Bank.kode}
                  </Text>
                </View>
              </View>
            </View>
            {sekat2.map((body, index) => (
              <View
                key={index}
                style={{ display: "flex", flexDirection: "row" }}
              >
                {body.map((b, ind) => (
                  <Text
                    style={{
                      width: b.width,
                      border: "1px solid #aaa",
                      padding: 1,
                      textAlign: ind == 1 ? "left" : "center",
                    }}
                    key={ind}
                  >
                    {b.data}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
      <View
        style={{
          marginTop: 50,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text>Telah Diperiksa: Lengkap/Tidak*</Text>
          <Text>Yang menyerahkan</Text>
          <View style={{ height: 70 }}></View>
          <View style={{ display: "flex", alignItems: "center" }}>
            <View style={{ width: 200, borderBottom: "1px solid #aaa" }}></View>
            <Text>PETUGAS PELAYANAN MITRA {data.Bank.kode}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text>Telah Diperiksa: Lengkap/Tidak*</Text>
          <Text>Yang menerima dan memeriksa</Text>
          <View style={{ height: 70 }}></View>
          <View style={{ display: "flex", alignItems: "center" }}>
            <View style={{ width: 200, borderBottom: "1px solid #aaa" }}></View>
            <Text>ADM FILLING</Text>
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
          render={({ pageNumber, totalPages }) => `${pageNumber}`}
          fixed
        ></Text>
      </View>
    </Page>
  );
}
