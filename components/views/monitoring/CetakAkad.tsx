"use client";

import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { LoadingOutlined, PrinterFilled } from "@ant-design/icons";
import { Form, Input, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import { JadwalAngsuran } from "@prisma/client";
import moment from "moment";
import dynamic from "next/dynamic";
import { generateTableAngsuran } from "@/components/utils/pdf/pdfUtil";

const Akad = dynamic(() => import("@/components/views/dataPdf/Akad"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function CetakAkad({ data }: { data: DataDataPengajuan }) {
  const [open, setOpen] = useState(false);
  const [openAkad, setOpenAkad] = useState(false);
  const [tanggal, setTanggal] = useState<string>();
  const [angsurans, setAngsurans] = useState<JadwalAngsuran[]>();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (data.tanggal_cetak_akad && !tanggal)
      setTanggal(moment(data.tanggal_cetak_akad).format("YYYY-MM-DD"));

    form.setFieldsValue({
      tanggal_cetak_akad: moment(tanggal).format("YYYY-MM-DD"),
      nomor_akad: `${data.User.UnitCabang.number_code || "001"}/KPF-${
        data.User.UnitCabang.kode_area
      }/${data.Bank.kode}/${moment(tanggal).format("DDMMYYYY")}`,
      produk: data.DataPembiayaan.Produk.name,
      jenis: data.DataPembiayaan.jenis_pembiayaan_id
        ? data.DataPembiayaan.JenisPembiayaan.name
        : "Sisa Gaji",
      sumber_dana: data.Bank.name,
      jenis_margin: data.jenis_margin,
      mg_bunga: data.DataPembiayaan.mg_bunga,
    });
  }, [tanggal]);

  const handleCetak = async (e: any) => {
    if (!e.tanggal_cetak_akad) {
      return message.error("Mohon isi tanggal cetak akad terlebih dahulu!");
    }
    setLoading(true);
    e.id = data.id;
    const res = await fetch("/api/pengajuan/cetak_akad", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(e),
    });
    if (res.ok) {
      data.tanggal_cetak_akad = e.tanggal_cetak_akad;
      data.nomor_akad = e.nomor_akad;
      data.jenis_margin = e.jenis_margin;
      data.DataPembiayaan.mg_bunga = parseFloat(e.mg_bunga);

      const getAngsuran =  generateTableAngsuran(data);
      setAngsurans(getAngsuran);
      const angsSave = await fetch("/api/angsuran", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({
          data: getAngsuran.filter((angs: any) => angs.angsuran_ke != 0),
          blokir: data.DataPembiayaan.blokir,
        }),
      });
      console.log(getAngsuran);
      if(!angsSave.ok){
        const {msg, data} = await angsSave.json();
        console.log({msg, data});
        setLoading(false);
        return message.error("Gagal menyimpan data angsuran!");
      }
      setOpen(false);
      setOpenAkad(true);
      message.success("Cetak akad berhasil!");
    } else {
      message.error("Cetak akad gagal. Coba lagi nanti!");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-center">
        <button
          className="py-1 px-2 border rounded shadow hover:opacity-50"
          onClick={() => setOpen(true)}
        >
          <PrinterFilled />
        </button>
      </div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={[]}
        title={`CETAK AKAD ${data.DataPembiayaan.name}`}
        style={{ top: 20 }}
      >
        <Form labelCol={{ span: 8 }} onFinish={handleCetak} form={form}>
          <Form.Item label="Tanggal Cetak Akad" name={"tanggal_cetak_akad"}>
            <Input type="date" onChange={(e) => setTanggal(e.target.value)} />
          </Form.Item>
          <Form.Item label="Nomor Akad" name={"nomor_akad"}>
            <Input />
          </Form.Item>
          <Form.Item label="Produk Pembiayaan" name={"produk"}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Jenis Pembiayaan" name={"jenis"}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Sumber Dana" name={"sumber_dana"}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Jenis Margin" name={"jenis_margin"}>
            <Select
              options={[
                { label: "FLAT", value: "FLAT" },
                { label: "ANUITAS", value: "ANUITAS" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Margin" name={"mg_bunga"}>
            <Input type="number" />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <button
              className={`bg-orange-500 hover:bg-orange-600 py-2 px-4 rounded shadow text-white`}
              type="submit"
              disabled={loading}
            >
              {loading ? <LoadingOutlined /> : "Simpan"}
            </button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={openAkad}
        onCancel={() => setOpenAkad(false)}
        footer={[]}
        title={`AKAD ${data.DataPembiayaan.name}`}
        style={{ top: 20 }}
        width={"95vw"}
      >
        <div
          style={{
            width: "100%",
            height: "80vh",
          }}
        >
          <Akad data={data} angsurans={angsurans || []} />
        </div>
      </Modal>
    </div>
  );
}
