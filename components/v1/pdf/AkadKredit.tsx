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
import TandaTerimaDebitur from "@/components/utils/pdf/TandaTerimaDebitur";
import ChanelingAkad from "@/components/utils/pdf/ChanelingAkad";
import PKDassa from "@/components/utils/pdf/PKDassa";

export default function AkadKredit({
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
          {/* <AnalisaPerhitungan data={data} />
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
              {data.Bank.kode === "BPR BDS" ? (
                <PerjanjianKreditNonFlash data={data} />
              ) : (
                // <AkadChanneling data={data} />
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
          <DokumenCeklis data={data} /> */}
          {data.Bank.kode === "BPR DASSA" && <PKDassa data={data} />}
        </Document>
      </PDFViewer>
    </div>
  );
}
