"use client";

import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { formatNumber } from "../inputUtils";
import { stylesFont } from "../CetakFormPengajuan";

export default function FormIdeb({ data }: { data: DataDataPengajuan }) {
  return (
    <Page size={"A4"} style={{ padding: "20px 30px", fontSize: 8 }}>
      <View
        style={{
          border: "2px solid black",
          padding: "5px 0px",
        }}
      >
        <View
          style={{
            borderBottom: "2px solid black",
            padding: "3px",
            ...stylesFont.root,
          }}
        >
          <Text
            style={{ fontSize: 12, textAlign: "center", fontWeight: "bold" }}
          >
            FORM PERMOHONAN IDEB SLIK OJK
          </Text>
        </View>
        <View
          style={{
            padding: 3,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            margin: "1px 0px",
          }}
        >
          <Text style={{ width: 120 }}>NAMA CALON DEBITUR</Text>
          <Text>:</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid #aaa",
              borderBottomStyle: "dotted",
              flex: 1,
            }}
          >
            <Text>{data.nama}</Text>
          </View>
        </View>
        <View
          style={{
            padding: 3,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            margin: "1px 0px",
          }}
        >
          <Text style={{ width: 120 }}>NO. KTP</Text>
          <Text>:</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid #aaa",
              borderBottomStyle: "dotted",
              flex: 1,
            }}
          >
            <Text>{data.nik}</Text>
          </View>
        </View>
        <View
          style={{
            padding: 3,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            margin: "1px 0px",
          }}
        >
          <Text style={{ width: 120 }}>TEMPAT & TANGGAL LAHIR</Text>
          <Text>:</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid #aaa",
              borderBottomStyle: "dotted",
              flex: 1,
            }}
          >
            <Text>{data.DataPembiayaan.tempat_lahir}</Text>
          </View>
          <View
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
              justifyContent: "center",
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
            padding: 3,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            margin: "1px 0px",
          }}
        >
          <Text style={{ width: 120 }}>NO. NPWP</Text>
          <Text>:</Text>
          <NPWPBoxes value={data.npwp || ""} />
        </View>
        <View
          style={{
            padding: 3,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            margin: "1px 0px",
          }}
        >
          <Text style={{ width: 120 }}>NAMA IBU KANDUNG</Text>
          <Text>:</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid #aaa",
              borderBottomStyle: "dotted",
              flex: 1,
            }}
          >
            <Text>{data.nama_ibu_kandung}</Text>
          </View>
        </View>
        <View
          style={{
            padding: 3,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            margin: "1px 0px",
          }}
        >
          <Text style={{ width: 120 }}>ALAMAT KTP</Text>
          <Text>:</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid #aaa",
              borderBottomStyle: "dotted",
              flex: 1,
            }}
          >
            <Text>
              {[
                `${data.DataPengajuanAlamat.alamat} RT ${data.DataPengajuanAlamat.rt} RW ${data.DataPengajuanAlamat.rw}`,
                `KEL. ${data.DataPengajuanAlamat.kelurahan} KEC. ${data.DataPengajuanAlamat.alamat}`,
                `KOTA/KAB. ${data.DataPengajuanAlamat.kota} PROVINSI ${data.DataPengajuanAlamat.provinsi}`,
              ].join(", ")}
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: 3,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            margin: "1px 0px",
          }}
        >
          <Text style={{ width: 120 }}>KODE POS</Text>
          <Text>:</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            {(data.DataPengajuanAlamat.kode_pos
              ? data.DataPengajuanAlamat.kode_pos.padStart(4, "0").split("")
              : ["0", "0", "0", "0"]
            ).map((v, i) => (
              <Checkbox checked={v} key={i} />
            ))}
          </View>
        </View>
        <View style={{ marginTop: 10 }}></View>
        <View
          style={{
            padding: 3,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            margin: "1px 0px",
          }}
        >
          <Text style={{ width: 120 }}>GAJI</Text>
          <Text>:</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid #aaa",
              borderBottomStyle: "dotted",
              flex: 1,
              gap: 5,
              alignItems: "center",
            }}
          >
            <Text>Rp.</Text>
            <Text>
              {formatNumber(data.DataPembiayaan.gaji_bersih.toString())}
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: 3,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            margin: "1px 0px",
          }}
        >
          <Text style={{ width: 120 }}>PENGAJUAN</Text>
          <Text>:</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid #aaa",
              borderBottomStyle: "dotted",
              flex: 1,
              gap: 5,
              alignItems: "center",
            }}
          >
            <Text>Rp.</Text>
            <Text>{formatNumber(data.DataPembiayaan.plafond.toString())}</Text>
          </View>
        </View>
        <View
          style={{
            padding: 3,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            margin: "1px 0px",
          }}
        >
          <Text style={{ width: 120 }}>PENGGUNAAN</Text>
          <Text>:</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid #aaa",
              borderBottomStyle: "dotted",
              flex: 1,
            }}
          >
            <Text>{data.tujuan_penggunaan1}</Text>
          </View>
        </View>
        <View style={{ marginBottom: 10 }}></View>
        <View
          style={{
            padding: 3,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            margin: "1px 0px",
          }}
        >
          <Text style={{ width: 120 }}>PERMINTAAN IDEB OLEH</Text>
          <Text>:</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: 5,
              }}
            >
              <Checkbox checked={"X"} />
              <Text>CALON DEBITUR</Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: 5,
              }}
            >
              <Checkbox />
              <Text>{data.Bank.name}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: 3,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            margin: "4px 0px",
          }}
        >
          <Text>TERLAMPIR COPY KTP, KK, NPWP (U/PERORANGAN)</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 30,
            justifyContent: "space-around",
            marginTop: 10,
            padding: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 50,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ textAlign: "center", width: "100%" }}>PEMOHON</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: 2,
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text>{"("}</Text>
              <Text style={{ textAlign: "center", flex: 2 }}>{data.nama}</Text>
              <Text>{")"}</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 50,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ textAlign: "center", width: "100%" }}>
              PETUGAS SLIK
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: 2,
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text>{"("}</Text>
              <Text style={{ textAlign: "center", flex: 2 }}></Text>
              <Text>{")"}</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 50,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ textAlign: "center", width: "100%" }}>
              PENGAWAS SLIK
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: 2,
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text>{"("}</Text>
              <Text style={{ textAlign: "center", flex: 2 }}></Text>
              <Text>{")"}</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
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

const NPWP_TEMPLATE = [
  "#",
  "#",
  ".",
  "#",
  "#",
  "#",
  ".",
  "#",
  "#",
  "#",
  ".",
  "#",
  "-",
  "#",
  "#",
  "#",
  ".",
  "#",
  "#",
  "#",
];

const NPWPBoxes = ({ value }: { value?: string }) => {
  const digits = (value || "").replace(/\D/g, "").split("");

  return (
    <View style={styles.row}>
      {NPWP_TEMPLATE.map((slot, i) => {
        if (slot === "." || slot === "-") {
          return (
            <View key={i} style={styles.separator}>
              <Text>{slot}</Text>
            </View>
          );
        }
        // ambil digit sesuai index urutan
        const char = digits.shift() || "";
        return (
          <View key={i} style={styles.box}>
            <Text>{char}</Text>
          </View>
        );
      })}
    </View>
  );
};
