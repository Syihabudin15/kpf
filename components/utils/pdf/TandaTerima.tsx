import { DataDataPengajuan } from "../Interfaces";
import { Image, Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import moment from "moment";

export default function TandaTerima({
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
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ alignSelf: "baseline" }}>
          <Image
            src={data.Bank.logo || process.env.NEXT_PUBLIC_APP_LOGO}
            style={{ width: 50 }}
          />
        </View>
        <Text style={{ fontSize: 10, fontWeight: "bold" }}>
          TANDA TERIMA PENYERAHAN JAMINAN
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image src={process.env.NEXT_PUBLIC_APP_LOGO} style={{ width: 50 }} />
          <Text style={{ fontSize: 10, fontWeight: "bold" }}>DEBITUR</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          gap: 30,
        }}
      >
        <View style={{ lineHeight: 1.5, flex: 1 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 100 }}>Nama</Text>
            <Text style={{ width: 20 }}>:</Text>
            <Text style={{ width: 150 }}>{data.DataPembiayaan.name}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 100 }}>NIP / Nopen</Text>
            <Text style={{ width: 20 }}>:</Text>
            <Text style={{ width: 150 }}>{data.DataPembiayaan.nopen}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 100 }}>Instansi</Text>
            <Text style={{ width: 20 }}>:</Text>
            <Text style={{ width: 150 }}>ASABRI</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 100 }}>Loket Bayar</Text>
            <Text style={{ width: 20 }}>:</Text>
            <Text style={{ width: 150 }}>KANTOR POS</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 100 }}>Alamat</Text>
            <Text style={{ width: 20 }}>:</Text>
            <Text style={{ width: 150 }}>
              {data.DataPengajuanAlamat.alamat}{" "}
              {data.DataPengajuanAlamat.rt &&
                data.DataPengajuanAlamat.rt + "/ "}{" "}
              {data.DataPengajuanAlamat.rw},{" "}
              {data.DataPengajuanAlamat.kelurahan},{" "}
              {data.DataPengajuanAlamat.kecamatan},{" "}
              {data.DataPengajuanAlamat.kode_pos},{" "}
              {data.DataPengajuanAlamat.provinsi}{" "}
              {data.DataPengajuanAlamat.kode_pos}
            </Text>
          </View>
        </View>
        <View style={{ border: "1px solid #aaa", padding: 10, width: 200 }}>
          <Text>Surat Keputusan Pensiun Asli</Text>
          <Text>{data.nomor_sk_pensiun}</Text>
          <Text>
            Tertanggal, {moment(data.tanggal_sk_pensiun).format("DD-MM-YYYY")}
          </Text>
          <Text>Atas Nama: {data.DataPembiayaan.name}</Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text>Diserahkan Tanggal</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
              marginTop: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #aaa",
                width: 150,
              }}
            >
              <Text>DEBITUR</Text>
              <View style={{ height: 50 }}></View>
              <Text style={{ height: 10, fontWeight: "bold" }}>
                {data.DataPembiayaan.name}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #aaa",
                width: 150,
              }}
            >
              <Text>Kepala Unit Pelayanan</Text>
              <View style={{ height: 50 }}></View>
              <Text style={{ height: 10, fontWeight: "bold" }}></Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text>Dikembalikan Tanggal</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
              marginTop: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #aaa",
                width: 150,
              }}
            >
              <Text>DEBITUR</Text>
              <View style={{ height: 50 }}></View>
              <Text style={{ height: 10, fontWeight: "bold" }}>
                {data.DataPembiayaan.name}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #aaa",
                width: 150,
              }}
            >
              <Text>Kepala Unit Pelayanan</Text>
              <View style={{ height: 50 }}></View>
              <Text style={{ height: 10, fontWeight: "bold" }}></Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 15,
          marginBottom: 15,
        }}
      >
        <Image src={"/assets/images/cut.png"} style={{ width: 50 }} />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ alignSelf: "baseline" }}>
          <Image
            src={data.Bank.logo || process.env.NEXT_PUBLIC_APP_LOGO}
            style={{ width: 50 }}
          />
        </View>
        <Text style={{ fontSize: 10, fontWeight: "bold" }}>
          TANDA TERIMA PENYERAHAN JAMINAN
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image src={process.env.NEXT_PUBLIC_APP_LOGO} style={{ width: 50 }} />
          <Text style={{ fontSize: 10, fontWeight: "bold" }}>
            AMPLOP JAMINAN
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          gap: 30,
        }}
      >
        <View style={{ lineHeight: 1.5, flex: 1 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 100 }}>Nama</Text>
            <Text style={{ width: 20 }}>:</Text>
            <Text style={{ width: 150 }}>{data.DataPembiayaan.name}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 100 }}>NIP / Nopen</Text>
            <Text style={{ width: 20 }}>:</Text>
            <Text style={{ width: 150 }}>{data.DataPembiayaan.nopen}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 100 }}>Instansi</Text>
            <Text style={{ width: 20 }}>:</Text>
            <Text style={{ width: 150 }}>ASABRI</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 100 }}>Loket Bayar</Text>
            <Text style={{ width: 20 }}>:</Text>
            <Text style={{ width: 150 }}>KANTOR POS</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={{ width: 100 }}>Alamat</Text>
            <Text style={{ width: 20 }}>:</Text>
            <Text style={{ width: 150 }}>
              {data.DataPengajuanAlamat.alamat}{" "}
              {data.DataPengajuanAlamat.rt &&
                data.DataPengajuanAlamat.rt + "/ "}{" "}
              {data.DataPengajuanAlamat.rw},{" "}
              {data.DataPengajuanAlamat.kelurahan},{" "}
              {data.DataPengajuanAlamat.kecamatan},{" "}
              {data.DataPengajuanAlamat.kode_pos},{" "}
              {data.DataPengajuanAlamat.provinsi}{" "}
              {data.DataPengajuanAlamat.kode_pos}
            </Text>
          </View>
        </View>
        <View style={{ border: "1px solid #aaa", padding: 10, width: 200 }}>
          <Text>Surat Keputusan Pensiun Asli</Text>
          <Text>{data.nomor_sk_pensiun}</Text>
          <Text>
            Tertanggal, {moment(data.tanggal_sk_pensiun).format("DD-MM-YYYY")}
          </Text>
          <Text>Atas Nama: {data.DataPembiayaan.name}</Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text>Diserahkan Tanggal</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
              marginTop: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #aaa",
                width: 150,
              }}
            >
              <Text>DEBITUR</Text>
              <View style={{ height: 50 }}></View>
              <Text style={{ height: 10, fontWeight: "bold" }}>
                {data.DataPembiayaan.name}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #aaa",
                width: 150,
              }}
            >
              <Text>Kepala Unit Pelayanan</Text>
              <View style={{ height: 50 }}></View>
              <Text style={{ height: 10, fontWeight: "bold" }}></Text>
            </View>
          </View>
        </View>
        {/* <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text>Dikembalikan Tanggal</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
              marginTop: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #aaa",
                width: 150,
              }}
            >
              <Text>DEBITUR</Text>
              <View style={{ height: 50 }}></View>
              <Text style={{ height: 10, fontWeight: "bold" }}>
                {data.DataPembiayaan.name}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #aaa",
                width: 150,
              }}
            >
              <Text>Kepala Unit Pelayanan</Text>
              <View style={{ height: 50 }}></View>
              <Text style={{ height: 10, fontWeight: "bold" }}></Text>
            </View>
          </View>
        </View> */}
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
