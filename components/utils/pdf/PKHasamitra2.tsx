"use client";

import { Image, Page, Text, View } from "@react-pdf/renderer";
import { stylePdf } from "./stylePdf";
import { DataDataPengajuan } from "../Interfaces";
import moment from "moment";
import { IDRFormat } from "@/components/v1/appUtils";
moment.locale("id");

export default function PKHasamitra2({ data }: { data: DataDataPengajuan }) {
  const admin =
    data.DataPembiayaan.plafond *
    ((data.DataPembiayaan.by_admin + data.DataPembiayaan.by_admin_bank) / 100);
  const asuransi =
    data.DataPembiayaan.plafond * (data.DataPembiayaan.by_asuransi / 100);
  return (
    <Page
      size={"A4"}
      style={{
        ...stylePdf.root,
        fontSize: 8,
        paddingVertical: 40,
        paddingHorizontal: 60,
        lineHeight: 1.5,
        textAlign: "justify",
      }}
    >
      <View>
        <Image
          src={data.Bank.logo || ""}
          style={{ width: 120, marginBottom: 10 }}
        />
      </View>

      <View style={{ border: "1px solid black", padding: 3 }}>
        <Text
          style={{
            padding: 5,
            fontWeight: "bold",
            fontSize: 14,
            borderBottom: "1px solid black",
            textAlign: "center",
          }}
        >
          BUKTI PEMBERIAN KREDIT
        </Text>
        <Text style={{ borderBottom: "1px solid black", padding: 3 }}>
          Telah diterima dari Bank Perekonomian Rakyat Hasamitra Jawa Barat
          sejumlah uang untuk pembayaran pemberian kredit sesuai perjanjian
          nomor : {data.nomor_akad} dengan rincian sebagai berikut :
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 40 }}>Nama</Text>
          <Text style={{ width: 4 }}>:</Text>
          <Text>{data.nama}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ width: 40 }}>Alamat</Text>
          <Text style={{ width: 4 }}>:</Text>
          <Text style={{ flex: 1 }}>
            {data.DataPengajuanAlamat.alamat} RT {data.DataPengajuanAlamat.rt}{" "}
            RW {data.DataPengajuanAlamat.rw} KELURAHAN{" "}
            {data.DataPengajuanAlamat.kelurahan} KECAMATAN{" "}
            {data.DataPengajuanAlamat.kecamatan}{" "}
            {data.DataPengajuanAlamat.provinsi}{" "}
            {data.DataPengajuanAlamat.kode_pos}
          </Text>
        </View>
        <View style={{ marginLeft: 100 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Plafond</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp. {IDRFormat(data.DataPembiayaan.plafond)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Pelunasan Pokok</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp. {IDRFormat(data.DataPembiayaan.pelunasan)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Sisa Plafond</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp.{" "}
              {IDRFormat(
                data.DataPembiayaan.plafond - data.DataPembiayaan.pelunasan,
              )}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Provisi</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp. {IDRFormat(data.DataPembiayaan.by_provisi)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Administrasi</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp. {IDRFormat(admin)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Asuransi Jiwa</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp. {IDRFormat(0)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Asuransi Kredit</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp. {IDRFormat(asuransi)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Agensi</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp. {IDRFormat(0)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Notaris</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp. {IDRFormat(0)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Biaya Tatalaksana</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text style={{ width: 120, textAlign: "right" }}>
              Rp. {IDRFormat(data.DataPembiayaan.by_tatalaksana)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Biaya Buka Rekening</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text style={{ width: 120, textAlign: "right" }}>
              Rp. {IDRFormat(data.DataPembiayaan.by_buka_rekening)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Biaya Materai</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text style={{ width: 120, textAlign: "right" }}>
              Rp. {IDRFormat(data.DataPembiayaan.by_materai)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Biaya Data Informasi</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text style={{ width: 120, textAlign: "right" }}>
              Rp.{" "}
              {IDRFormat(
                data.DataPembiayaan.by_epotpen +
                  data.DataPembiayaan.by_flagging,
              )}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Biaya Mutasi</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text style={{ width: 120, textAlign: "right" }}>
              Rp. {IDRFormat(data.DataPembiayaan.by_mutasi)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Bunga Berjalan</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp. {IDRFormat(0)}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              fontWeight: "bold",
            }}
          >
            <Text style={{ width: 100 }}>Total Potongan</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp.{" "}
              {IDRFormat(
                data.DataPembiayaan.by_provisi +
                  admin +
                  asuransi +
                  data.DataPembiayaan.pelunasan +
                  data.DataPembiayaan.by_materai +
                  data.DataPembiayaan.by_tatalaksana +
                  data.DataPembiayaan.by_buka_rekening +
                  data.DataPembiayaan.by_epotpen +
                  data.DataPembiayaan.by_flagging +
                  data.DataPembiayaan.by_mutasi,
              )}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Tabungan Wajib Si Mitra</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp. {IDRFormat(0)}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Angsuran Pertama</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp. {IDRFormat(0)}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              fontWeight: "bold",
            }}
          >
            <Text style={{ width: 100 }}>Total Yang Diterima</Text>
            <Text style={{ width: 5 }}>:</Text>
            <Text
              style={{
                width: 120,
                textAlign: "right",
              }}
            >
              Rp.{" "}
              {IDRFormat(
                data.DataPembiayaan.plafond -
                  (data.DataPembiayaan.by_provisi +
                    admin +
                    asuransi +
                    data.DataPembiayaan.pelunasan +
                    data.DataPembiayaan.by_materai +
                    data.DataPembiayaan.by_tatalaksana +
                    data.DataPembiayaan.by_epotpen +
                    data.DataPembiayaan.by_flagging +
                    data.DataPembiayaan.by_buka_rekening +
                    data.DataPembiayaan.by_mutasi),
              )}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            marginBottom: 8,
          }}
        >
          Catatan :{" "}
        </Text>
      </View>
      <Text>
        {data.DataPengajuanAlamat.kota
          ?.toLowerCase()
          .replace("kota", "")
          .replace("kabupaten", "")
          .toUpperCase()}
        ,{"     "} {moment(data.tanggal_cetak_akad).format("MMMM YYYY")}
      </Text>
      <View
        style={{
          border: "1px solid black",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
            textAlign: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text style={{ borderBottom: "1px solid black", padding: 2 }}>
            Dibuat Oleh
          </Text>
          <View style={{ height: 60 }}></View>
          <Text style={{ height: 10 }}></Text>
          <Text>Admin Kredit</Text>
        </View>
        <View
          style={{
            flex: 1,
            textAlign: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text style={{ borderBottom: "1px solid black", padding: 2 }}>
            Disetujui Oleh
          </Text>
          <View style={{ height: 60 }}></View>
          <Text style={{ height: 10 }}></Text>
          <Text>Pejabat Bank</Text>
        </View>
        <View
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >
          <Text style={{ borderBottom: "1px solid black", padding: 2 }}>
            Penerima Kredit
          </Text>
          <View style={{ height: 60 }}></View>
          <Text style={{ textDecoration: "underline" }}>{data.nama}</Text>
          <Text>Debitur</Text>
        </View>
      </View>

      <View
        style={{ marginTop: 20, display: "flex", flexDirection: "row", gap: 4 }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>CIF</Text>
            <Text style={{ width: 5 }}>:</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>No. Loan</Text>
            <Text style={{ width: 5 }}>:</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Rek. Tab.</Text>
            <Text style={{ width: 5 }}>:</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Rek. Bend.</Text>
            <Text style={{ width: 5 }}>:</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Instansi</Text>
            <Text style={{ width: 5 }}>:</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Ref.</Text>
            <Text style={{ width: 5 }}>:</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Jenis Penggunaan</Text>
            <Text style={{ width: 5 }}>:</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 100 }}>Sektor Ekonomi</Text>
            <Text style={{ width: 5 }}>:</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 8 }}>1.</Text>
            <Text style={{ width: 100 }}>Limit</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 8 }}>2.</Text>
            <Text style={{ width: 100 }}>Pendaftaran Fasilitas</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 8 }}>3.</Text>
            <Text style={{ width: 100 }}>Blokiran</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 8 }}>4.</Text>
            <Text style={{ width: 100 }}>Agunan</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Text style={{ width: 8 }}>5.</Text>
            <Text style={{ width: 100 }}>Fund Transfer & Agunan</Text>
          </View>
        </View>
      </View>
    </Page>
  );
}
