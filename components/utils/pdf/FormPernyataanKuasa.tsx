"use client";

import { Page, Text, View } from "@react-pdf/renderer";
import { DataDataPengajuan } from "../Interfaces";
import { stylesFont } from "../CetakFormPengajuan";
import moment from "moment";
import { formatNumber } from "../inputUtils";
import { ceiling } from "./pdfUtil";
import { getAngsuranPerBulan } from "@/components/views/simulasi/simulasiUtil";

export default function FormPernyataanKuasa({
  data,
}: {
  data: DataDataPengajuan;
}) {
  return (
    <Page
      size={"A4"}
      style={{ padding: "20px 40px", fontSize: 8, ...stylesFont.root }}
    >
      <Text
        style={{
          fontSize: 14,
          textDecoration: "underline",
          margin: 5,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        SURAT PERNYATAAN DAN KUASA
      </Text>
      <View style={{ marginTop: 30 }}></View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 120 }}>Nama</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>{data.nama}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 120 }}>Tempat / Tanggal Lahir</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>
            {data.DataPembiayaan.tempat_lahir + ","}{" "}
            {moment(data.DataPembiayaan.tanggal_lahir, "DD-MM-YYYY").format(
              "DD - MM - YYYY"
            )}
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 120 }}>Alamat</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>
            {[
              `${data.DataPengajuanAlamat.alamat} RT ${data.DataPengajuanAlamat.rt} RW ${data.DataPengajuanAlamat.rw}`,
              `KEL. ${data.DataPengajuanAlamat.kelurahan} KEC. ${data.DataPengajuanAlamat.kecamatan}`,
              `${data.DataPengajuanAlamat.kota} PROVINSI ${data.DataPengajuanAlamat.provinsi} ${data.DataPengajuanAlamat.kode_pos}`,
            ].join(", ")}
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 120 }}>No. KTP</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>{data.nik}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          margin: "3px 0",
        }}
      >
        <Text style={{ width: 120 }}>Nomor Pensiun</Text>
        <Text>:</Text>
        <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
          <Text>{data.nopen}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
          margin: "10px 0",
        }}
      >
        <View style={{ flex: 1, border: "1px solid #222", padding: 5 }}>
          <Text style={{ margin: "8px 0" }}>
            Yang untuk melakukan tindakan hukum dalam surat ini telah mendapat
            persetujuan dari suami/istri saya, yaitu:{" "}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              margin: "3px 0",
            }}
          >
            <Text style={{ width: 100 }}>Nama</Text>
            <Text>:</Text>
            <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
              <Text>{data.DataPengajuanPasangan.nama_pasangan}</Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              margin: "3px 0",
            }}
          >
            <Text style={{ width: 100 }}>Tempat/Tanggal Lahir</Text>
            <Text>:</Text>
            <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
              {data.DataPengajuanPasangan.tempat_lahir_pasangan + ","}{" "}
              {moment(data.DataPengajuanPasangan.tanggal_lahir_pasangan).format(
                "DD - MM - YYYY"
              )}
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              margin: "3px 0",
            }}
          >
            <Text style={{ width: 100 }}>Alamat</Text>
            <Text>:</Text>
            <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
              {data.DataPengajuanPasangan.alamat_pasangan}
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              margin: "3px 0",
            }}
          >
            <Text style={{ width: 100 }}>No. KTP</Text>
            <Text>:</Text>
            <View style={{ flex: 1, borderBottom: "1px solid #aaa" }}>
              {data.DataPengajuanPasangan.nik_pasangan}
            </View>
          </View>
          <View style={{ margin: "5px 0" }}>
            <Text style={{ fontStyle: "italic" }}>
              *) Diisi apabila Peminjam bukan Janda/Duda
            </Text>
          </View>
        </View>
        <View style={{ width: 80, border: "1px solid #222", padding: 5 }}>
          <Text style={{ textAlign: "center" }}>Paraf</Text>
        </View>
      </View>
      <Text style={{ lineHeight: 1.5, textAlign: "justify" }}>
        Dengan ini saya menyatakan telah mendapat pembiayaan dari{" "}
        {process.env.NEXT_PUBLIC_APP_FULL_NAME} (selanjutnya disebut “Koperasi”)
        sebesar{" "}
        <Text
          style={{
            textDecoration: "underline",
            marginLeft: 5,
            marginRight: 5,
          }}
        >
          Rp. {formatNumber(data.DataPembiayaan.plafond.toString())}
        </Text>{" "}
        <Text>
          atau sejumlah yang disetujui oleh Koperasi, serta sesuai dengan Akad
          Pembiayaan yang saya tanda tangani kemudian, dan untuk menjamin
          pembayaran atas pembiayaan tersebut dengan ini saya memberikan kuasa
          kepada Bendahara/Juru Bayar Gaji atau penggantinya pada Dinas/Kantor
          yang tertera dibawah ini untuk memotong uang gaji saya sebesar
        </Text>{" "}
        <Text
          style={{
            textDecoration: "underline",
            marginLeft: 5,
            marginRight: 5,
          }}
        >
          Rp.{" "}
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
        </Text>{" "}
        dan menyetorkan uang hasil potongan tersebut kepada Koperasi pembiayaan
        saya selama{" "}
        <Text style={{ textDecoration: "underline" }}>
          {data.DataPembiayaan.tenor}
        </Text>{" "}
        bulan berturut-turut, mulai bulan{" "}
        <Text style={{ textDecoration: "underline" }}>
          {moment(data.DataPembiayaan.tanggal_input)
            .get("month")
            .toString()
            .padStart(2, "0")
            .split("")}
        </Text>{" "}
        tahun{" "}
        <Text style={{ textDecoration: "underline" }}>
          {moment(data.DataPembiayaan.tanggal_input).get("year")}
        </Text>{" "}
        s/d bulan{" "}
        <Text style={{ textDecoration: "underline" }}>
          {moment(data.DataPembiayaan.tanggal_input)
            .add(data.DataPembiayaan.tenor, "month")
            .get("month")
            .toString()
            .padStart(2, "0")
            .split("")}
        </Text>{" "}
        tahun{" "}
        <Text style={{ textDecoration: "underline" }}>
          {moment(data.DataPembiayaan.tanggal_input)
            .add(data.DataPembiayaan.tenor, "month")
            .get("year")}
          .
        </Text>
      </Text>
      <Text style={{ margin: "5px 0" }}>Dengan ini saya menyatakan:</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "3px 0",
          gap: 5,
        }}
      >
        <Text>1.</Text>
        <Text>
          Bahwa sisa uang pensiun saya sendiri pada saat ini dan seterusnya
          (sampai pinjaman saya lunas) benar-benar cukup untuk dipotong sejumlah
          tersebut diatas, dan jika ternyata dikemudian hari uang pensiun saya
          tidak cukup jumlahnya untuk dipotong karena sebab apapun, maka berarti
          saya telah melakukan tindak pidana pemalsuan data/keterangan.
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "3px 0",
          gap: 5,
        }}
      >
        <Text>2.</Text>
        <Text>
          Bahwa sepenuhnya dari pembiayaan yang saya ambil/terima tersebut
          benar-benar saya pergunakan untuk keperluan saya sendiri dan saya
          tidak akan mengalihkan tempat pengambilan uang pensiun saya ke tempat
          lain sampai dengan pinjaman saya lunas sepenuhnya.
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "3px 0",
          gap: 5,
        }}
      >
        <Text>3.</Text>
        <Text>
          Bahwa dengan ini saya menjamin dan membebaskan{" "}
          {process.env.NEXT_PUBLIC_APP_FULL_NAME} dan “Kantor Pos”, dari segala
          kewajiban, tuntutan, klaim, gugatan berupa apapun dari pihak manapun
          juga, termasuk dari “Pemberi Kuasa” sendiri, serta dari segala resiko
          dan kerugian yang timbul sehubungan dengan Surat Kuasa ini.
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "3px 0",
          gap: 5,
        }}
      >
        <Text>4.</Text>
        <Text>
          Pelaksanaan pemotongan angsuran akan dipotong oleh koperasi MJM
          sebagai mitra pos dan sebagai mitra KOPJAS FAS.
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
        <View style={{ flex: 1, padding: 4, border: "1px solid #aaa" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "3px 0",
              gap: 5,
            }}
          >
            <Text>5.</Text>
            <Text>
              Bahwa saya sanggup melunasi pembiayaan saya kepada Bank melalui
              Koperasi apabila saya melakukan pernikahan yang menyebabkan
              tunjangan pensiun (Janda/Duda ***) hilang.
            </Text>
          </View>
          <Text style={{ marginTop: 5, fontStyle: "italic" }}>
            ***) Dicoret apabila Peminjam bukan Janda/Duda
          </Text>
        </View>
        <View style={{ width: 80, border: "1px solid #222", padding: 5 }}>
          <Text style={{ textAlign: "center" }}>Paraf</Text>
        </View>
      </View>
      <Text style={{ margin: "4px 0", textAlign: "justify", lineHeight: 1.5 }}>
        Pemberian kuasa ini tidak otomatis melepaskan tanggung jawab saya
        terhadap kelancaran pembayaran angsuran pembiayaan tersebut sampai
        dengan lunas tepat waktunya, sehingga saya sebagai pihak pemberi kuasa
        bertanggung jawab penuh terhadap segala tindakan penerima kuasa yang
        berkaitan dengan Surat Kuasa ini. Dan saya memberikan wewenang kepada
        pihak Bank melalui Koperasi untuk membantu melakukan penagihan apabila
        dipandang ada keterlambatan dalam penyerahan uang hasil pemotongan uang
        pensiun saya tersebut.
      </Text>
      <Text style={{ margin: "2px 0", textAlign: "justify", lineHeight: 1.5 }}>
        Demikian Surat Pernyataan dan Kuasa ini saya buat dengan sebenarnya,
        tidak dapat dibatalkan atau dicabut dengan alasan apapun, tidak
        terkecuali oleh sebab yang disebutkan dalam pasal 1831 Kitab Undang
        Undang Hukum Perdata.
      </Text>
      <View style={{ marginTop: 20 }}>
        <Text
          style={{ textDecoration: "underline", textDecorationStyle: "dotted" }}
        >
          {data.User.UnitCabang
            ? data.User.UnitCabang.name === "PUSAT"
              ? "BANDUNG"
              : data.User.UnitCabang.name
            : ""}
          , {moment(data.DataPembiayaan.tanggal_input).format("DD - MM - YYYY")}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 30,
            alignItems: "center",
          }}
        >
          <Text>Yang memberi kuasa,</Text>
          <Text style={{ textAlign: "center" }}>Materai 10.000</Text>
          <View style={{ width: 120 }}>
            <Text style={{ borderBottom: "1px solid black" }}>{data.nama}</Text>
            <Text>Nopen: {data.nopen}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 30,
            alignItems: "center",
          }}
        >
          <Text>Suami/Istri Pemberi Kuasa,</Text>
          <Text></Text>
          <View style={{ width: 120 }}>
            <Text style={{ borderBottom: "1px solid black" }}>
              {data.DataPengajuanPasangan.nama_pasangan}
            </Text>
          </View>
        </View>
      </View>
      <Text style={{ textAlign: "right", marginTop: 10, fontStyle: "italic" }}>
        **) Coret yang tidak perlu dan diberi Paraf/Tandatangan.
      </Text>
    </Page>
  );
}
