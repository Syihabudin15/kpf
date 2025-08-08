"use client";
import { NeracaKeuangan } from "@/components/utils/Interfaces";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { LoadingOutlined } from "@ant-design/icons";
import { DatePicker, Modal, Spin } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";
import { DataAnggota } from "./DataAnggota";
import { Inventaris } from "@prisma/client";
const { RangePicker } = DatePicker;

const NeracaPDF = dynamic(
  () => import("@/components/views/keuangan/pdf/NeracaPDF"),
  { ssr: false, loading: () => <LoadingOutlined /> }
);

export default function Neraca() {
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [open, setOpen] = useState(false);
  const [pinjamanAnggota, setPinjamanAnggota] = useState<number>(0);
  const [pinjamanCalonAnggota, setPinjamanCalonAnggota] = useState<number>(0);
  const [danaKematian, setDanaKematian] = useState<number>(0);
  const [titipanSetoran, setTitipanSetoran] = useState<number>(0);
  const [invent, setInvent] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [ATIMotor, setATIMotor] = useState(32000000);
  const [simpananAnggota, setSimpananAnggota] = useState<number>(0);
  const [simpananCalonAnggota, setSimpananCalonAnggota] = useState<number>(0);
  const [sewaKantor, setSewaKantor] = useState<number>(52000000);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(
        `/api/keuangan/neraca${from ? "?from=" + from : ""}${
          to ? "&to=" + to : ""
        }`
      );
      const { data, prevYear, inventaris } = await res.json();
      if (from || to) {
        setPinjamanAnggota(0);
        setPinjamanCalonAnggota(0);
        setDanaKematian(0);
        setTitipanSetoran(0);
        setInvent(0);
        setATIMotor(0);
        setSimpananAnggota(0);
        setSimpananCalonAnggota(0);
        setSewaKantor(0);
        setOpen(false);
      }
      data.forEach((pd: NeracaKeuangan) => {
        setPinjamanCalonAnggota((prev) => prev + pd.DataPembiayaan.plafond);
        const asuransi =
          pd.DataPembiayaan.plafond * (pd.DataPembiayaan.by_asuransi / 100);
        setDanaKematian((prev) => prev + asuransi);
        const blokirAngsuran =
          pd.DataPembiayaan.blokir *
          ceiling(
            parseInt(
              getAngsuranPerBulan(
                pd.DataPembiayaan.mg_bunga,
                pd.DataPembiayaan.tenor,
                pd.DataPembiayaan.plafond,
                false,
                false,
                pd.Bank.kode
              )
            ),
            pd.DataPembiayaan.pembulatan
          );
        setTitipanSetoran((prev) => prev + blokirAngsuran);
        pd.JadwalAngsuran.forEach((angs) => {
          if (
            angs.tanggal_bayar &&
            new Date(angs.tanggal_bayar).getMonth() <=
              new Date(`${to ? to : new Date()}`).getMonth()
          ) {
            setSimpananCalonAnggota((prev) => prev + 20000);
          }
        });
      });
      DataAnggota.forEach((da) => {
        if (from && to) {
          if (new Date(from).getMonth() + 1 === 3) {
            setSimpananAnggota((prev) => prev + da.buka_tabungan);
          }
          if (new Date(from).getMonth() + 1 <= new Date(to).getMonth() + 1) {
            setSimpananAnggota((prev) => prev + da.tabungan_bulanan);
          }
          return;
        }
        for (
          let i = new Date(`${from ? from : da.dari_bulan}`).getMonth() + 1;
          i <= new Date(`${to ? to : new Date()}`).getMonth() + 1;
          i++
        ) {
          if (i === 3) {
            setSimpananAnggota((prev) => prev + da.buka_tabungan);
            return;
          }
          setSimpananAnggota((prev) => prev + 50000);
        }
      });
      // DataInvent.forEach((da) => {
      //   if (from && to) {
      //     if (new Date(from).getMonth() <= new Date(to).getMonth()) {
      //       setInvent((prev) => prev + da.harga);
      //     }
      //     return;
      //   }
      //   setInvent((prev) => prev + da.harga);
      // });
      inventaris.forEach((inv: Inventaris) => {
        const currPrive = inv.harga * inv.jumlah;
        setInvent((prev) => prev + currPrive);
      });
      setLoading(false);
    })();
  }, [from, to]);

  return (
    <Spin spinning={loading}>
      <div className="bg-white p-1">
        <div className="flex gap-5 items-center">
          <RangePicker
            onChange={(_, info) => {
              setFrom(info && info[0]);
              setTo(info && info[1]);
            }}
            width={170}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded shadow"
            onClick={() => setOpen(true)}
          >
            Cetak
          </button>
        </div>
        <div className="font-bold text-center">
          <h1 className="text-lg">KOPERASI PEMASARAN FADILLAH</h1>
          <h2 className="text-sm">
            NERACA PERTANGGAL {moment(to).format("DD-MM-YYYY")}
          </h2>
        </div>
        <div className="block sm:flex gap-5 text-xs mt-5 px-5">
          <div className="flex-1">
            <div className="text-sm font-bold border-b border-black border-t">
              <span>AKTIVA</span>
            </div>
            <div className="flex justify-between font-bold">
              <span style={{ flex: 0.5 }}>1010000</span>
              <div style={{ flex: 2 }}>
                <span>KAS</span>
              </div>
              <span style={{ flex: 1 }}>0</span>
            </div>
            <div className="flex justify-between">
              <span style={{ flex: 0.5 }}>1010000</span>
              <div style={{ flex: 2 }}>
                <span style={{ paddingLeft: 10 }}>Kas - Besar</span>
              </div>
              <span style={{ flex: 1 }}>0</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-right text-sm font-bold border-t border-black border-b">
              <span>PASIVA</span>
            </div>
          </div>
        </div>
        <Modal
          open={open}
          width={"90vw"}
          style={{ top: 20 }}
          onClose={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          title="CETAK NERACA"
          footer={[]}
        >
          <div className="w-full h-full" style={{ height: "80vh" }}>
            <NeracaPDF
              dateString={moment(to).format("DD-MM-YYYY")}
              pinjamanAnggota={pinjamanAnggota}
              pinjamanCalonAnggota={pinjamanCalonAnggota}
              danaKematian={danaKematian}
              titipanSetoran={titipanSetoran}
              invent={invent}
              ATIMotor={ATIMotor}
              sewaBayar={sewaKantor}
              simpananAnggota={simpananAnggota}
              simpananCalonAnggota={simpananCalonAnggota}
            />
          </div>
        </Modal>
      </div>
    </Spin>
  );
}
