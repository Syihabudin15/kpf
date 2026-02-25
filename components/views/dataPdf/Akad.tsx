"use client";
import JadwalAngsuran from "@/components/utils/pdf/JadwalAngsuran";
import { Document, PDFViewer } from "@react-pdf/renderer";
import PerjanjianKreditNonFlash from "@/components/utils/pdf/perjanjianKreditNonFlash";
import DebetRekening from "@/components/utils/pdf/DebetRekening";
import PernyataanDebitur from "@/components/utils/pdf/PernyataanDebitur";
import BuktiPembayaran from "@/components/utils/pdf/BuktiPembayaran";
import PemotonganGaji from "@/components/utils/pdf/PemotonganGaji";
import Kesanggupan from "@/components/utils/pdf/Kesanggupan";
import TandaTerima from "@/components/utils/pdf/TandaTerima";
import KelengkapanDokumen from "@/components/utils/pdf/KelengkapanDokumen";
import DokumenCeklis from "@/components/utils/pdf/DokumenCeklis";
import PerjanjianKreditFlashPage1 from "@/components/utils/pdf/perjanjianKreditFlashPage1";
import PerjanjianKreditFlashPage2 from "@/components/utils/pdf/PerjanjianKreditFlashPage2";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import AnalisaPerhitungan from "@/components/utils/pdf/AnalisaPerhitungan";
// import AkadChanneling from "@/components/utils/pdf/AkadChanneling";
import TandaTerimaDebitur from "@/components/utils/pdf/TandaTerimaDebitur";
import ChanelingAkad from "@/components/utils/pdf/ChanelingAkad";
import AkadBBTM from "@/components/utils/pdf/AkadBBTM";
import PKDassa from "@/components/utils/pdf/PKDassa";
import PKDassa2 from "@/components/utils/pdf/PKDassa2";
import PKHM from "@/components/utils/pdf/PKHM";
import PKHasamitra from "@/components/utils/pdf/PKHasamitra";
import PKHasamitra2 from "@/components/utils/pdf/PKHasamitra2";
import PKSaga from "@/components/utils/pdf/PKSaga";
import PKHasamitra3 from "@/components/utils/pdf/PKHasamitra3";

export default function Akad({
  data,
  angsurans,
}: {
  data: DataDataPengajuan;
  angsurans: any[];
}) {
  return (
    <div className="w-full h-full">
      <PDFViewer className="w-full h-full">
        <Document title="Akad Pinjaman">
          <AnalisaPerhitungan data={data} />
          <JadwalAngsuran data={data} isFor="DEBITUR" angsurans={angsurans} />
          <JadwalAngsuran
            data={data}
            isFor={data.Bank.kode || "BPRS"}
            angsurans={angsurans}
          />
          {data.DataPembiayaan.Produk.name === "Flash Sisa Gaji" ? (
            <>
              <PerjanjianKreditFlashPage1 data={data} />
              <PerjanjianKreditFlashPage2 data={data} />
            </>
          ) : (
            <>
              {data.Bank.kode === "BPR BDS" && (
                <PerjanjianKreditNonFlash data={data} />
              )}
              {data.Bank.kode === "BPR BBTM" && <AkadBBTM data={data} />}
              {!["BPR BDS", "BPR BBTM"].includes(data.Bank.kode || "") && (
                <ChanelingAkad data={data} />
              )}
            </>
          )}
          <DebetRekening data={data} />
          <PernyataanDebitur data={data} />
          <BuktiPembayaran data={data} isFor="DEBITUR" />
          <BuktiPembayaran data={data} isFor={data.Bank.kode || "BPR"} />
          <PemotonganGaji data={data} page={14} />
          <Kesanggupan data={data} isFor="DEBITUR" />
          <Kesanggupan data={data} isFor={"KREDITUR"} />
          <TandaTerima data={data} />
          {data.Bank.kode === "BPR BDS" && <TandaTerimaDebitur data={data} />}
          <KelengkapanDokumen data={data} />
          <DokumenCeklis data={data} />
          {data.Bank.kode === "BPR DASSA" && <PKDassa data={data} />}
          {data.Bank.kode === "BPR DASSA" && <PKDassa2 data={data} />}
          {data.Bank.kode === "BPR HM" && <PKHM data={data} />}
          {data.Bank.kode === "BPR HASAMITRA" && <PKHasamitra3 data={data} />}
          {data.Bank.kode === "BPR HASAMITRA" && <PKHasamitra data={data} />}
          {data.Bank.kode === "BPR HASAMITRA" && <PKHasamitra2 data={data} />}
          {data.Bank.kode === "BPR SAGA" && <PKSaga data={data} />}
        </Document>
      </PDFViewer>
    </div>
  );
}
