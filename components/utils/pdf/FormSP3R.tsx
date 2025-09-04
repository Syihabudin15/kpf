"use client";

import { Image, Page, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { stylesFont } from "../CetakFormPengajuan";
import moment from "moment";

export default function FormSP3R({ data }: { data: DataDataPengajuan }) {
  return (
    <Page
      size={"A4"}
      style={{ padding: "35px 40px", fontSize: 9, ...stylesFont.root }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 5,
          alignItems: "flex-end",
        }}
      >
        <View>
          <Image src={"/assets/images/taspen-sp3r.png"} style={{ width: 50 }} />
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Text
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 11 }}
          >
            PT. TABUNGAN ASURANSI PEGAWAI NEGERI (PERSERO)
          </Text>
          <Text
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 11 }}
          >
            KANTOR CABANG UTAMA JAKARTA
          </Text>
          <Text style={{ textAlign: "center" }}>
            Jalan Letjen Suprapto Jakarta 10520 Tromolpos 1399 Jakarta 10013
          </Text>
          <Text style={{ textAlign: "center" }}>
            Telepon : (021) 4203805 Facsimile: 4255484
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>SP3R</Text>
        </View>
      </View>
      <View style={{ borderBottom: "1px solid #222", marginTop: 5 }}></View>
      <View
        style={{
          borderBottom: "1px solid #222",
          borderBottomWidth: 2,
          marginTop: 2,
          marginBottom: 5,
        }}
      ></View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 50,
        }}
      >
        <View style={{ flex: 1, border: "1px solid #111", padding: 5 }}>
          <Text style={{ textAlign: "center", fontSize: 12 }}>
            SURAT PERMINTAAN PEMBAYARAN
          </Text>
          <Text style={{ textAlign: "center", fontSize: 12 }}>
            PENSIUN MELALUI REKENING (SP3R)
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>KEPADA YTH</Text>
          <Text>KEPALA KANTOR CABANG</Text>
          <Text>PT. TASPEN (PERSERO)</Text>
          <Text>DI</Text>
          <Text
            style={{
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
              width: "100%",
              height: 10,
            }}
          ></Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 20,
          marginBottom: 5,
          border: "1px solid #111",
          padding: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Text>Yang bertanda tangan dibawah ini :</Text>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}>1.</Text>
          <Text style={{ width: 200 }}>Nama Penerima Pensiun</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
            }}
          >
            <Text>{data.nama}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}>2.</Text>
          <Text style={{ width: 200 }}>
            {" "}
            Janda/Duda dari Almarhum/Almarhumah
          </Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
            }}
          >
            <Text>{data.nama}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}>3.</Text>
          <Text style={{ width: 200 }}>Tempat dan Tanggal Lahir</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
            }}
          >
            <Text>
              {data.DataPembiayaan.tempat_lahir + ", "}{" "}
              {moment(data.DataPembiayaan.tanggal_lahir, "DD-MM-YYYY").format(
                "DD - MM - YYYY"
              )}
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}>4.</Text>
          <Text style={{ width: 200 }}>TUK/NRP/NIP/NPP</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
            }}
          >
            <Text>{data.nopen}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}>5.</Text>
          <Text style={{ width: 200 }}>Penerbit Skep</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
            }}
          >
            <Text>{data.penerbit_sk}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}>6.</Text>
          <Text style={{ width: 200 }}>Nomor & Tgl. Skep</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
              display: "flex",
              flexDirection: "row",
              gap: 4,
            }}
          >
            <Text style={{ flex: 1 }}>{data.nomor_sk_pensiun}</Text>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              }}
            >
              <Text style={{ width: 70 }}>Tanggal</Text>
              <Text>:</Text>
              <Text>
                {moment(data.tanggal_sk_pensiun).format("DD - MM - YYYY")}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}>7.</Text>
          <Text style={{ width: 200 }}>Tgl. Mulai Pensiun</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
            }}
          >
            <Text>{moment(data.tmt_pensiun).format("DD - MM - YYYY")}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}>8.</Text>
          <Text style={{ width: 200 }}>Alamat setelah Pensiun</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
            }}
          >
            <Text>
              {data.DataPengajuanAlamat.alamat} RT {data.DataPengajuanAlamat.rt}{" "}
              RW {data.DataPengajuanAlamat.rw}
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 200 }}>Kelurahan / Desa *)</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
            }}
          >
            <Text>{data.DataPengajuanAlamat.kelurahan}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 200 }}>Kelurahan / Desa *)</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
            }}
          >
            <Text>{data.DataPengajuanAlamat.kelurahan}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 200 }}>Kecamatan</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
            }}
          >
            <Text>{data.DataPengajuanAlamat.kecamatan}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 200 }}>Kabupaten /*)</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Text style={{ flex: 1 }}>{data.DataPengajuanAlamat.kota}</Text>
            <View
              style={{ flex: 1, display: "flex", flexDirection: "row", gap: 3 }}
            >
              <Text style={{ width: 70 }}>Kode Pos</Text>
              <Text>:</Text>
              <Text>{data.DataPengajuanAlamat.kode_pos}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}></Text>
          <Text style={{ width: 200 }}>Provinsi</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Text style={{ flex: 1 }}>{data.DataPengajuanAlamat.provinsi}</Text>
            <View
              style={{ flex: 1, display: "flex", flexDirection: "row", gap: 3 }}
            >
              <Text style={{ width: 70 }}>Telepon Nomor</Text>
              <Text>:</Text>
              <Text>{data.no_telepon}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ width: 10 }}>9.</Text>
          <Text style={{ width: 200 }}>Bank Giro</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Text style={{ flex: 1 }}>{data.DataPembiayaan.nama_bank}</Text>
            <View
              style={{ flex: 1, display: "flex", flexDirection: "row", gap: 3 }}
            >
              <Text style={{ width: 70 }}>Nomor Relening</Text>
              <Text>:</Text>
              <Text>{data.DataPembiayaan.no_rekening}</Text>
            </View>
          </View>
        </View>
      </View>
      <Text>
        Sehubungan dengan pembayaran pensiun melalui rekening tersebut diatas,
        dengan ini saya menyatakan:
      </Text>
      <View style={{ marginTop: 5 }}></View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 4,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Text style={{ width: 10 }}>1.</Text>
        <View style={{ flex: 1, lineHeight: 1.5, textAlign: "justify" }}>
          <Text>
            Memberikan kuasa dengan hak subsitusi kepada PT. TASPEN
            (PERSERO)khususnya untuk mendebet rekening saya nomor
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
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
            <Text style={{ width: 50 }}>di Bank/Giro</Text>
            <Text
              style={{
                flex: 1,
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
              }}
            >
              {data.DataPembiayaan.nama_bank}
            </Text>
          </View>
          <Text>
            Untuk mengembalikan seluruh kelebihan pembayaran uang pensiun yang
            bukan merupakan hak saya atau ahli waris saya, menurut ketentuan PT.
            TASPEN (PERSERO), untuk dikreditkan sebagai keuntungan PT.TASPEN
            (PERSERO).
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 4,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Text style={{ width: 10 }}>2.</Text>
        <View style={{ flex: 1, lineHeight: 1.5, textAlign: "justify" }}>
          <Text>
            Kuasa sebagaimana tersebut pada butir 1 di atas tidak akan berakhir
            selama kewajiban saya atau ahli waris saya untuk mengembalikan
            kelebihan pembayaran uang pensiun yang bukan merupakan hak saya atau
            ahli waris saya merupakan ketentuan PT. TASPEN (PERSERO) belum
            dilakukan sepenuh nya maupun oleh sebab sebab yang tercantum dalam
            pasal 1813 Kitab Undang-Undang Hukum Perdata.
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 4,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Text style={{ width: 10 }}>3.</Text>
        <View style={{ flex: 1, lineHeight: 1.5, textAlign: "justify" }}>
          <Text>
            Wajib melaporkan ke Kantor Cabang PT. TASPEN (PERSERO) di Bengkulu
            apabila terjadi perubahan susunan keluarga, alamat, ataupun
            perubahan lainnya.
          </Text>
        </View>
      </View>
      <Text style={{ margin: "8px 0px" }}>
        Demikan surat pernyataan ini dibuat, agar yang berkepentingan maklum.
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 50,
          margin: "10px 0px",
        }}
      >
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            border: "1px solid #111",
            padding: 5,
          }}
        >
          <Text>Perhatian !!!</Text>
          <Text>Barang Siapa yang memberikan keterangan tidak</Text>
          <Text>Benar atau memalsukan keterangan ini akan</Text>
          <Text>Dituntut sesuai dengan pasal 263 KUHP</Text>
        </View>
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              borderBottom: "1px solid #111",
              borderBottomStyle: "dotted",
            }}
          >
            {data.User.UnitCabang
              ? data.User.UnitCabang.name === "PUSAT"
                ? "BANDUNG"
                : data.User.UnitCabang.name
              : ""}
            ,{" "}
            {moment(data.DataPembiayaan.tanggal_input).format("DD - MM - YYYY")}
          </Text>
          <Text>Yang Menyatakan,</Text>
          <Text style={{ fontSize: "7", marginTop: 20, marginBottom: 20 }}>
            Materai
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text>(</Text>
            <Text
              style={{
                borderBottom: "1px solid #111",
                borderBottomStyle: "dotted",
                width: 120,
                textAlign: "center",
              }}
            >
              {data.nama}
            </Text>
            <Text>)</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 7,
            }}
          >
            <Text>Nama Jelas/Tanda tangan, atau</Text>
            <Text>Cap Tigajari tangan kiri</Text>
          </View>
        </View>
      </View>
      <Text>Disampaikan :</Text>
      <View
        style={{
          margin: "2px 0px",
          display: "flex",
          flexDirection: "row",
          gap: 4,
        }}
      >
        <Text style={{ width: 10 }}>1.</Text>
        <Text>Lembar I untuk Bank/Giro Pos ..................</Text>
      </View>
      <View
        style={{
          margin: "2px 0px",
          display: "flex",
          flexDirection: "row",
          gap: 4,
        }}
      >
        <Text style={{ width: 10 }}>2.</Text>
        <Text>Lembar II untuk KC PT. TASPEN (PERSERO) ........</Text>
      </View>
      <View
        style={{
          margin: "2px 0px",
          display: "flex",
          flexDirection: "row",
          gap: 4,
        }}
      >
        <Text style={{ width: 10 }}>3.</Text>
        <Text>Lembar III untuk Peserta</Text>
      </View>
    </Page>
  );
}
