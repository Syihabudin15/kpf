"use client";

import { Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import moment from "moment";
import { Agama, StatusKawin, StatusRumah } from "@prisma/client";
import { formatNumber } from "../inputUtils";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";
import { ceiling } from "./pdfUtil";

export default function FormPengajuan({ data }: { data: DataDataPengajuan }) {
  return (
    <Page size={"A4"} style={{ padding: "20px 20px", fontSize: 6 }}>
      <View
        style={{
          backgroundColor: "#fc4903",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ width: 50, height: 40, backgroundColor: "white" }}>
          <Image
            src={"/assets/images/app_logo.png"}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 9 }}>
            {process.env.NEXT_PUBLIC_APP_NAME || "KOPERASI PEMASARAN FADILLAH"}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 9 }}>
            FORMULIR PERMOHONAN PINJAMAN
          </Text>
        </View>
        <View style={{ width: 50, height: 40, backgroundColor: "white" }}>
          <Image src={data.Bank.logo || "/assets/images/app_logo.png"} />
        </View>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <View style={{ flex: "1" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              margin: "1px 0",
            }}
          >
            <Text style={{ width: 80 }}>Tanggal</Text>
            <Text>:</Text>
            <Text>
              {moment(data.DataPembiayaan.tanggal_input).format(
                "DD - MM - YYYY"
              )}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Text style={{ width: 80 }}>No. Akad</Text>
            <Text>:</Text>
            <Text></Text>
          </View>
        </View>
        <View style={{ flex: "1" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              margin: "1px 0",
            }}
          >
            <Text style={{ width: 80 }}>Nama Kantor Layanan</Text>
            <Text>:</Text>
            <Text>{data.User.UnitCabang ? data.User.UnitCabang.name : ""}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Text style={{ width: 80 }}>MOC/SPV</Text>
            <Text>:</Text>
            <Text>
              {data.User.first_name} {data.User.last_name}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fc4903",
          padding: "3px",
          margin: "2px 0px",
        }}
      >
        <Text style={{ color: "white" }}>
          (DIISI DENGAN HURUF CETAK DAN BERI TANDA (X) PADA KOTAK PILIHAN YANG
          SESUAI)
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#fc4903",
          padding: "4px",
          margin: "2px 0px",
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          DATA IDENTITAS PEMOHON
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>NOPEN</Text>
        <Text>:</Text>
        <View
          style={{ flex: "1", borderBottom: "1px oslid #aaa", width: "100%" }}
        >
          <Text>{data.nopen}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>No. KTP</Text>
        <Text>:</Text>
        <View
          style={{ flex: "1", borderBottom: "1px oslid #aaa", width: "100%" }}
        >
          <Text>{data.nik}</Text>
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
          <Text>Berlaku s.d</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Checkbox checked={data.DataPembiayaan.tanggal_lahir.charAt(0)} />
            <Checkbox checked={data.DataPembiayaan.tanggal_lahir.charAt(1)} />
          </View>
          <Text>-</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Checkbox checked={data.DataPembiayaan.tanggal_lahir.charAt(3)} />
            <Checkbox checked={data.DataPembiayaan.tanggal_lahir.charAt(4)} />
          </View>
          <Text>-</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Checkbox checked={2} />
            <Checkbox checked={9} />
            <Checkbox checked={9} />
            <Checkbox checked={9} />
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Nama Lengkap</Text>
        <Text>:</Text>
        <View
          style={{ flex: "1", borderBottom: "1px oslid #aaa", width: "100%" }}
        >
          <Text>{data.nama}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Tempat & Tanggal Lahir</Text>
        <Text>:</Text>
        <View
          style={{ flex: "1", borderBottom: "1px oslid #aaa", width: "100%" }}
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
            <Checkbox checked={data.DataPembiayaan.tanggal_lahir.charAt(0)} />
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
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Status Pernikahan</Text>
        <Text>:</Text>
        <View
          style={{ flex: 1, display: "flex", flexDirection: "row", gap: 5 }}
        >
          {optKawin.map((o) => (
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
              }}
              key={o.value}
            >
              <Checkbox checked={o.value === data.status_kawin && "X"} />
              <Text>{o.label}</Text>
            </View>
          ))}
        </View>
        <View
          style={{ flex: 1, display: "flex", flexDirection: "row", gap: 5 }}
        >
          <Text>Jumlah Tanggungan</Text>
          <Text>:</Text>
          <View
            style={{ flex: 1, display: "flex", flexDirection: "row", gap: 5 }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Checkbox />
              <Text>Istri</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Checkbox />
              <Text>Anak</Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Agama</Text>
        <Text>:</Text>
        <View
          style={{ flex: 1, display: "flex", flexDirection: "row", gap: 5 }}
        >
          {optAgama.map((o) => (
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
              }}
              key={o.value}
            >
              <Checkbox checked={o.value === data.agama && "X"} />
              <Text>{o.label}</Text>
              {o.value === "LAINNYA" && (
                <View
                  style={{
                    flex: 1,
                    height: 10,
                    borderBottom: "1px solid #aaa",
                  }}
                ></View>
              )}
            </View>
          ))}
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Pekerjaan</Text>
        <Text>:</Text>
        <View
          style={{ flex: "1", borderBottom: "1px oslid #aaa", width: "100%" }}
        >
          <Text>{data.pekerjaan_sekarang}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Alamat Sesuai KTP</Text>
        <Text>:</Text>
        <View
          style={{ flex: "2", borderBottom: "1px oslid #aaa", width: "100%" }}
        >
          <Text>{data.DataPembiayaan.alamat}</Text>
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
          <Text>RT</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            {(data.DataPengajuanAlamat.rt
              ? data.DataPengajuanAlamat.rt.padStart(4, "0").split("")
              : ["0", "0", "0", "0"]
            ).map((v, i) => (
              <Checkbox checked={v} key={i} />
            ))}
          </View>
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
          <Text>RW</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            {(data.DataPengajuanAlamat.rw
              ? data.DataPengajuanAlamat.rw.padStart(4, "0").split("")
              : ["0", "0", "0", "0"]
            ).map((v, i) => (
              <Checkbox checked={v} key={i} />
            ))}
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}></Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text>Kel.</Text>
          <Text>{data.DataPengajuanAlamat.kelurahan}</Text>
        </View>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text>Kec.</Text>
          <Text>{data.DataPengajuanAlamat.kecamatan}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}></Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text>Kota/Kab.</Text>
          <Text>{data.DataPengajuanAlamat.kota}</Text>
        </View>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text>Provinsi</Text>
          <Text>{data.DataPengajuanAlamat.provinsi}</Text>
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
          <Text>Kode Pos</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            {(data.DataPengajuanAlamat.kode_pos
              ? data.DataPengajuanAlamat.kode_pos.padStart(4, "0").split("")
              : ["0", "0", "0", "0"]
            ).map((v, i) => (
              <Checkbox checked={v} key={i} />
            ))}
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Alamat Domisili</Text>
        <Text>:</Text>
        <View
          style={{ flex: "2", borderBottom: "1px oslid #aaa", width: "100%" }}
        >
          <Text>{data.DataPengajuanAlamat.alamat_domisili}</Text>
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
          <Text>RT</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            {(data.DataPengajuanAlamat.rt_domisili
              ? data.DataPengajuanAlamat.rt_domisili.padStart(4, "0").split("")
              : ["0", "0", "0", "0"]
            ).map((v, i) => (
              <Checkbox checked={v} key={i} />
            ))}
          </View>
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
          <Text>RW</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            {(data.DataPengajuanAlamat.rw_domisili
              ? data.DataPengajuanAlamat.rw_domisili.padStart(4, "0").split("")
              : ["0", "0", "0", "0"]
            ).map((v, i) => (
              <Checkbox checked={v} key={i} />
            ))}
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}></Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text>Kel.</Text>
          <Text>{data.DataPengajuanAlamat.kelurahan_domisili}</Text>
        </View>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text>Kec.</Text>
          <Text>{data.DataPengajuanAlamat.kecamatan_domisili}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}></Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text>Kota/Kab.</Text>
          <Text>{data.DataPengajuanAlamat.kota_domisili}</Text>
        </View>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text>Provinsi</Text>
          <Text>{data.DataPengajuanAlamat.provinsi_domisili}</Text>
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
          <Text>Kode Pos</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            {(data.DataPengajuanAlamat.kode_pos_domisili
              ? data.DataPengajuanAlamat.kode_pos_domisili
                  .padStart(4, "0")
                  .split("")
              : ["0", "0", "0", "0"]
            ).map((v, i) => (
              <Checkbox checked={v} key={i} />
            ))}
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Alamat Domisili</Text>
        <Text>:</Text>
        <View
          style={{ flex: "2", borderBottom: "1px oslid #aaa", width: "100%" }}
        >
          <Text>{data.no_telepon}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Status Rumah</Text>
        <Text>:</Text>
        <View
          style={{ flex: 1, display: "flex", flexDirection: "row", gap: 5 }}
        >
          {optRumah.map((o) => (
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
              }}
              key={o.value}
            >
              <Checkbox checked={o.value === data.status_rumah && "X"} />
              <Text>{o.label}</Text>
              {o.value === "TIDAK_PUNYA_RUMAH" && (
                <View
                  style={{
                    flex: 1,
                    height: 10,
                    borderBottom: "1px solid #aaa",
                  }}
                ></View>
              )}
            </View>
          ))}
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Nama Ibu Kandung</Text>
        <Text>:</Text>
        <View
          style={{ flex: "1", borderBottom: "1px oslid #aaa", width: "100%" }}
        >
          <Text>{data.nama_ibu_kandung}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Nama Suami/Istri *)</Text>
        <Text>:</Text>
        <View
          style={{ flex: "1", borderBottom: "1px oslid #aaa", width: "100%" }}
        >
          <Text>{data.DataPengajuanPasangan.nama_pasangan}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Nama Ahli Waris</Text>
        <Text>:</Text>
        <View
          style={{ flex: "1", borderBottom: "1px oslid #aaa", width: "100%" }}
        >
          <Text></Text>
        </View>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Text>No Telepon Ahli Waris:</Text>
          <Text></Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fc4903",
          padding: "4px",
          margin: "2px 0px",
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          DATA PENGHASILAN PEMOHON
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Penghasilan Pemohon</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text>Rp. </Text>
          <Text>
            {formatNumber(data.DataPembiayaan.gaji_bersih.toString())}
          </Text>
        </View>
        <View
          style={{
            flex: "1",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Text style={{ width: 80 }}>Pengeluaran</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #aaa",
              height: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 3,
            }}
          >
            <Text>Rp. </Text>
            <Text>/ Bulan</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Penghasilan Tambahan</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text>Rp. </Text>
          <Text></Text>
        </View>
        <View
          style={{
            flex: "1",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Text style={{ width: 80 }}>Total Angsuran</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #aaa",
              height: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 3,
            }}
          >
            <Text>Rp. </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Penghasilan Pasangan</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text>Rp. </Text>
          <Text></Text>
        </View>
        <View
          style={{
            flex: "1",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Text style={{ width: 80 }}>Sisa Penghasilan</Text>
          <Text>:</Text>
          <View
            style={{
              flex: 1,
              borderBottom: "1px solid #aaa",
              height: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 3,
            }}
          >
            <Text>Rp. </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Total Penghasilan</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text>Rp. </Text>
          <Text></Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fc4903",
          padding: "4px",
          margin: "2px 0px",
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          DALAM KEADAAN DARURAT SIAPA YANG BISA DIHUBUNGI (KELUARGA/KERABAT
          TIDAK SERUMAH)
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Nama Lengkap</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text>{data.DataPengajuanPasangan.nama_keluarga_tidak_serumah}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Alamat Domisili</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text>{data.DataPengajuanPasangan.alamat_keluarga}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Hubungan</Text>
        <Text>:</Text>
        <View
          style={{ flex: 1, display: "flex", flexDirection: "row", gap: 5 }}
        >
          {optKeluarga.map((o) => (
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
              }}
              key={o.value}
            >
              <Checkbox
                checked={
                  o.value.includes(
                    data.DataPengajuanPasangan.hubungan?.toLocaleLowerCase() ||
                      ""
                  ) && "X"
                }
              />
              <Text>{o.label}</Text>
              {o.value === "lainnya" && (
                <View
                  style={{
                    flex: 1,
                    height: 10,
                    borderBottom: "1px solid #aaa",
                  }}
                ></View>
              )}
            </View>
          ))}
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>No Telepon</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text>{data.DataPengajuanPasangan.no_telepon_keluarga}</Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fc4903",
          padding: "4px",
          margin: "2px 0px",
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          DATA PENSIUN
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Pengelola Pensiun</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text>{data.jenis_pensiun}</Text>
        </View>
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            margin: "2px 0",
          }}
        >
          <Text style={{ width: 80 }}>No. SK Pensiun</Text>
          <Text>:</Text>
          <View
            style={{
              flex: "1",
              borderBottom: "1px oslid #aaa",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Text>{data.nomor_sk_pensiun}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>No. KARIP/Kartu ASABRI *)</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text></Text>
        </View>
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            margin: "2px 0",
          }}
        >
          <Text style={{ width: 80 }}>Tanggal Terbit SK Pensiun</Text>
          <Text>:</Text>
          <View
            style={{
              flex: "1",
              borderBottom: "1px oslid #aaa",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Text>
              {data.tanggal_sk_pensiun &&
                moment(data.tanggal_sk_pensiun).format("DD - MM - YYYY")}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Kantor Juru Bayar</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text>{data.DataPembiayaan.juru_bayar_asal}</Text>
        </View>
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            margin: "2px 0",
          }}
        >
          <Text style={{ width: 80 }}>Penerbit SK Pensiun</Text>
          <Text>:</Text>
          <View
            style={{
              flex: "1",
              borderBottom: "1px oslid #aaa",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Text>{data.penerbit_sk}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fc4903",
          padding: "4px",
          margin: "2px 0px",
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          DATA PEMBIAYAAN DI LEMBAGA KEUANGAN LAIN
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Nama Instansi</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text>{data.DataPembiayaan.pembiayaan_sebelumnya}</Text>
        </View>
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            margin: "2px 0",
          }}
        >
          <Text style={{ width: 80 }}>Sisa Pinjaman</Text>
          <Text>:</Text>
          <View
            style={{
              flex: "1",
              borderBottom: "1px oslid #aaa",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Text>Rp.</Text>
            <Text>
              {data.DataPembiayaan.pelunasan !== 0 &&
                formatNumber(data.DataPembiayaan.pelunasan.toString() || "0")}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Checkbox />
            <Checkbox />
            <Text style={{ marginLeft: 2 }}>Bulan</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}></Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text></Text>
        </View>
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            margin: "2px 0",
          }}
        >
          <Text style={{ width: 80 }}>Sisa Pinjaman</Text>
          <Text>:</Text>
          <View
            style={{
              flex: "1",
              borderBottom: "1px oslid #aaa",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Text>Rp.</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Checkbox />
            <Checkbox />
            <Text style={{ marginLeft: 2 }}>Bulan</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}></Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text></Text>
        </View>
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            margin: "2px 0",
          }}
        >
          <Text style={{ width: 80 }}>Sisa Pinjaman</Text>
          <Text>:</Text>
          <View
            style={{
              flex: "1",
              borderBottom: "1px oslid #aaa",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Text>Rp.</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Checkbox />
            <Checkbox />
            <Text style={{ marginLeft: 2 }}>Bulan</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fc4903",
          padding: "4px",
          margin: "2px 0px",
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          DATA PERMOHONAN PEMBIAYAAN
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Jenis Produk</Text>
        <Text>:</Text>
        <View
          style={{ flex: 1, display: "flex", flexDirection: "row", gap: 5 }}
        >
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Checkbox checked={"X"} />
            <Text>Pensiun</Text>
          </View>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Checkbox />
            <Text>Umum</Text>
          </View>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Checkbox />
            <Text>Flash</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Jenis Pembiayaan</Text>
        <Text>:</Text>
        <View
          style={{ flex: 1, display: "flex", flexDirection: "row", gap: 5 }}
        >
          {optJepem.map((o) => (
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
              }}
              key={o.value}
            >
              <Checkbox
                checked={
                  o.value.includes(data.DataPembiayaan.JenisPembiayaan.name) &&
                  "X"
                }
              />
              <Text>{o.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Tujuan Penggunaan</Text>
        <Text>:</Text>
        <View
          style={{ flex: 1, display: "flex", flexDirection: "row", gap: 5 }}
        >
          {optPurpose.map((o) => (
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
              }}
              key={o.value}
            >
              <Checkbox
                checked={
                  o.value.includes(
                    data.tujuan_penggunaan1.toLocaleLowerCase()
                  ) && "X"
                }
              />
              <Text>{o.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Plafon Pembiayaan</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text>Rp. </Text>
          <Text>{formatNumber(data.DataPembiayaan.plafond.toString())}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Jangka Waktu Pembiayaan</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {(data.DataPembiayaan.tenor
              ? data.DataPembiayaan.tenor.toString().padStart(3, "0").split("")
              : ["0", "0", "0"]
            ).map((v, i) => (
              <Checkbox checked={v} key={i} />
            ))}
            <Text style={{ marginLeft: 3 }}>Bulan</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          margin: "2px 0",
        }}
      >
        <Text style={{ width: 80 }}>Besar Angsuran Perbulan</Text>
        <Text>:</Text>
        <View
          style={{
            flex: "1",
            borderBottom: "1px oslid #aaa",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Text>Rp. </Text>
          <Text>
            {formatNumber(
              ceiling(
                parseInt(
                  getAngsuranPerBulan(
                    data.DataPembiayaan.mg_bunga,
                    data.DataPembiayaan.tenor,
                    data.DataPembiayaan.plafond,
                    false,
                    data.jenis_margin === "FLAT" ? true : false,
                    data.Bank.kode
                  )
                ),
                data.DataPembiayaan.pembulatan
              ).toString()
            )}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fc4903",
          padding: "4px",
          margin: "2px 0px",
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          SETUJUI SYARAT DAN KETENTUAN
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
        <Text style={{ flex: 1.5, textAlign: "justify" }}>
          Demikian semua informasi yang diberikan sesuai keadaan yang
          sebenarnya. Dengan ini saya bersedia tunduk pada Peraturan dan
          Persyaratan yang ditentukan oleh {process.env.NEXT_PUBLIC_APP_NAME}{" "}
          termasuk mengizinkan {process.env.NEXT_PUBLIC_APP_NAME} dalam
          melakukan verifikasi data tersebut dan memeriksa seluruh informasi
          yang diperlukan.
        </Text>
        <View
          style={{
            flex: 1,
            border: "1px solid #aaa",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View style={{ borderBottom: "1px solid #aaa" }}>
            <Text style={{ textAlign: "center" }}>MOC</Text>
          </View>
          <Text style={{ textAlign: "center" }}>{data.moc}</Text>
        </View>
        <View
          style={{
            flex: 1,
            border: "1px solid #aaa",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View style={{ borderBottom: "1px solid #aaa" }}>
            <Text style={{ textAlign: "center" }}>
              Supervisor Kantor Layanan
            </Text>
          </View>
          <Text style={{ textAlign: "center" }}>
            {data.User.first_name} {data.User.last_name}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            border: "1px solid #aaa",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View style={{ borderBottom: "1px solid #aaa" }}>
            <Text style={{ textAlign: "center" }}>Pemohon</Text>
          </View>
          <Text style={{ textAlign: "center" }}>{data.nama}</Text>
        </View>
        <View
          style={{
            flex: 1,
            border: "1px solid #aaa",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View style={{ borderBottom: "1px solid #aaa" }}>
            <Text style={{ textAlign: "center" }}>Suami/Istri *)</Text>
          </View>
          <Text style={{ textAlign: "center" }}>
            {data.DataPengajuanPasangan.nama_pasangan}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fc4903",
          padding: "4px",
          margin: "2px 0px",
        }}
      >
        <Text style={{ color: "white", fontStyle: "italic" }}>
          *) Coret yg tidak perlu
        </Text>
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
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#000",
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

const optKawin = [
  { label: "Nikah", value: StatusKawin.KAWIN },
  { label: "Belum Nikah", value: StatusKawin.BELUM_KAWIN },
  { label: "Janda", value: StatusKawin.JANDA },
  { label: "Duda", value: StatusKawin.DUDA },
];
const optAgama = [
  { label: "Islam", value: Agama.ISLAM },
  { label: "Katholik", value: Agama.KATHOLIK },
  { label: "Hindu", value: Agama.HINDU },
  { label: "Budha", value: Agama.BUDHA },
  { label: "Atheis", value: Agama.ATHEIS },
  { label: "Lainnya", value: Agama.LAINNYA },
];
const optRumah = [
  { label: "Milik Sendiri", value: StatusRumah.MILIK_SENDIRI },
  { label: "Milik Keluarga", value: StatusRumah.MILIK_KELUARGA },
  { label: "Sewa/Kos", value: StatusRumah.SEWA },
  { label: "Milik Orang Lain", value: StatusRumah.MILIK_ORANGLAIN },
  { label: "Lainnya", value: StatusRumah.TIDAK_PUNYA_RUMAH },
];
const optKeluarga = [
  { label: "Orang Tua", value: "orang tua" },
  { label: "Anak", value: "anak kandung" },
  { label: "Saudara Kandung", value: "saudara kandung" },
  { label: "Lainnya", value: "lainnya" },
];
const optJepem = [
  { label: "SK Ditangan", value: "SK Di Tangan" },
  { label: "Mutasi", value: "Mutasi" },
  { label: "Mutasi Take Over", value: "Mutasi Take Over" },
  { label: "Take Over", value: "Take Over" },
  { label: "Rehab", value: "Rehab" },
  { label: "Sisa Gaji", value: "Sisa Gaji" },
];
const optPurpose = [
  { label: "Renovasi Rumah", value: "renovasi rumah" },
  { label: "Modal Usaha", value: "modal usaha" },
  { label: "Investasi", value: "investasi" },
  { label: "Konsumsi", value: "konsumsi" },
  { label: "Lainnya", value: "lainnya" },
];
