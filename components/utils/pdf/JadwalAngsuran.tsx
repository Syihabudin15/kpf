import { Image, Page, Text, View } from "@react-pdf/renderer";
import moment from "moment";
import { TablePdfHeaders } from "./TablePdf";
import { stylePdf } from "./stylePdf";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";
import { formatNumber } from "../inputUtils";
import { ceiling } from "./pdfUtil";
import { TableAngsuran } from "./tableAngsuran";
import { DataDataPengajuan } from "../Interfaces";

export default function JadwalAngsuran({
  data,
  isFor,
  angsurans,
}: {
  data: DataDataPengajuan;
  isFor: string;
  angsurans: any[];
}) {
  let bodyAngsuran = angsurans.map((angs, ind) => {
    return {
      key: ind,
      periode: angs.angsuran_ke,
      tanggal:
        angs.angsuran_ke === 0
          ? "-"
          : moment(angs.tanggal_bayar).format("DD-MM-YYYY"),
      angsuran: formatNumber(angs.angsuran),
      pokok: formatNumber(angs.pokok),
      margin: formatNumber(angs.margin),
      sisa: formatNumber(angs.sisa),
    };
  });

  return (
    <Page size={"A4"} style={stylePdf.root}>
      <View
        fixed
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        <View>
          <Image
            src={
              process.env.NEXT_PUBLIC_APP_LOGO || "/assets/images/logo_kpf.jpg"
            }
            style={{ width: 50 }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 10 }}>KARTU ANGSURAN</Text>
          <Text style={{ fontSize: 8, marginTop: 5 }}>
            NO AKAD : {data.nomor_akad}
          </Text>
        </View>
        <View>
          <Image
            src={
              process.env.NEXT_PUBLIC_APP_LOGO || "/assets/images/logo_kpf.jpg"
            }
            style={{ width: 50 }}
          />
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          lineHeight: 1.5,
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Text style={{ width: 80 }}>Tanggal Akad</Text>
            <Text>:</Text>
            <Text>{moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Text style={{ width: 80 }}>Plafond Pembiayaan</Text>
            <Text>:</Text>
            <Text>{formatNumber(data.DataPembiayaan.plafond.toFixed(0))}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Text style={{ width: 80 }}>Jangka Waktu</Text>
            <Text>:</Text>
            <Text>{data.DataPembiayaan.tenor}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Text style={{ width: 80 }}>Angsuran Perbulan</Text>
            <Text>:</Text>
            <Text>
              {formatNumber(
                ceiling(
                  parseInt(
                    getAngsuranPerBulan(
                      data.DataPembiayaan.mg_bunga,
                      data.DataPembiayaan.tenor,
                      data.DataPembiayaan.plafond
                    )
                  ),
                  data.DataPembiayaan.pembulatan
                ).toString()
              )}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Text style={{ width: 70 }}>Nama</Text>
            <Text>:</Text>
            <Text>{data.DataPembiayaan.name}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Text style={{ width: 70 }}>Nopen</Text>
            <Text>:</Text>
            <Text>{data.DataPembiayaan.nopen}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Text style={{ width: 70 }}>Kantor Bayar</Text>
            <Text>:</Text>
            <Text>{data.DataPembiayaan.juru_bayar_tujuan?.toUpperCase()}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Text style={{ width: 70 }}>Area Pelayanan</Text>
            <Text>:</Text>
            <Text>{data.User.UnitCabang.name.toUpperCase()}</Text>
          </View>
        </View>
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 10,
                textAlign: "right",
              }}
            >
              {isFor.toUpperCase()}
            </Text>
          </View>
          <View
            style={{ border: "1px solid black", width: 140, height: 50 }}
          ></View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Text>Tanda Tangan Debitur</Text>
          </View>
        </View>
      </View>

      {/* Jadwal Angsuran */}
      <View style={{ margin: "0px 0" }}>
        <TableAngsuran dataHeader={headerAngsuran} dataBodies={bodyAngsuran} />
      </View>
      {/* End Jadwal Angsuran */}
    </Page>
  );
}

const headerAngsuran: TablePdfHeaders[] = [
  { title: "Periode", dataIndex: "periode", style: { textAlign: "center" } },
  {
    title: "Tanggal Bayar",
    dataIndex: "tanggal",
    style: { textAlign: "center" },
  },
  { title: "Angsuran", dataIndex: "angsuran", style: { textAlign: "center" } },
  { title: "Pokok", dataIndex: "pokok", style: { textAlign: "center" } },
  { title: "Margin", dataIndex: "margin", style: { textAlign: "center" } },
  { title: "Sisa Pokok", dataIndex: "sisa", style: { textAlign: "center" } },
];
