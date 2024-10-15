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
import AkadChanneling from "@/components/utils/pdf/AkadChanneling";
import TandaTerimaDebitur from "@/components/utils/pdf/TandaTerimaDebitur";

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
          <JadwalAngsuran
            data={data}
            isFor="DEBITUR"
            angsurans={angsurans}
            page={2}
          />
          <JadwalAngsuran
            data={data}
            isFor={data.Bank.kode || "BPRS"}
            angsurans={angsurans}
            page={data.DataPembiayaan.tenor > 42 ? 4 : 3}
          />
          {data.DataPembiayaan.Produk.name === "Flash Sisa Gaji" ? (
            <>
              <PerjanjianKreditFlashPage1 data={data} page={4} />
              <PerjanjianKreditFlashPage2 data={data} page={5} />
            </>
          ) : (
            <>
              {data.Bank.kode === "BPR BDS" ? (
                <PerjanjianKreditNonFlash data={data} page={6} />
              ) : (
                <AkadChanneling data={data} page={6} />
              )}
            </>
          )}
          <DebetRekening data={data} page={9} />
          <PernyataanDebitur data={data} page={10} />
          <BuktiPembayaran data={data} isFor="DEBITUR" page={11} />
          <BuktiPembayaran
            data={data}
            isFor={data.Bank.kode || "BPR"}
            page={12}
          />
          <PemotonganGaji data={data} page={13} />
          <Kesanggupan data={data} isFor="DEBITUR" page={14} />
          <Kesanggupan data={data} isFor={"KREDITUR"} page={15} />
          <TandaTerima data={data} page={16} />
          {data.Bank.kode === "BPR BDS" && (
            <TandaTerimaDebitur data={data} page={17} />
          )}
          <KelengkapanDokumen
            data={data}
            page={data.Bank.kode === "BPR BDS" ? 18 : 17}
          />
          <DokumenCeklis
            data={data}
            page={data.Bank.kode === "BPR BDS" ? 19 : 18}
          />
        </Document>
      </PDFViewer>
    </div>
  );
}
