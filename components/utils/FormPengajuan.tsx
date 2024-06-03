import { Form, Input, Select, Spin, Tabs, TabsProps, message } from "antd";
import { formatNumber } from "@/components/utils/inputUtils";
import { getAngsuranPerBulan } from "../views/simulasi/simulasiUtil";
import { useContext, useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { notifContext } from "../NotifContext";
import { DataDataPengajuan } from "./Interfaces";
import moment from "moment";
import { ceiling } from "./pdf/pdfUtil";

const obj = {
  slik: "slik",
  verifikasi: "verifikasi",
  checker: "checker",
  maker: "maker",
  approval: "approval",
};
// Form Tabs
export default function TabsForm({
  data,
  isPeriksa,
  pathname,
  getData,
  setOpen,
  nextpath,
}: {
  data: DataDataPengajuan;
  isPeriksa?: boolean;
  pathname?: string;
  getData?: Function;
  setOpen: Function;
  nextpath?: string;
}) {
  const [form] = Form.useForm();
  const [items, setItems] = useState<TabsProps["items"]>();
  const [loading, setLoading] = useState(false);
  const [formProses] = Form.useForm();
  const notif = useContext(notifContext);

  const handleProses = async (e: any) => {
    setLoading(true);
    const tempData = {
      id: data.id,
      [`keterangan_${pathname}`]: e.keterangan,
      [`status_${pathname}`]: e.status,
      [`tanggal_${pathname}`]: new Date(),
    };
    if (nextpath && nextpath !== "transfer" && e.status === "SETUJU") {
      tempData[`status_${nextpath}`] = "ANTRI";
    }
    if (e.status === "DITOLAK") {
      tempData["status_pencairan"] = "BATAL";
    }
    if (nextpath === "transfer" && e.status === "SETUJU") {
      tempData["status_pencairan"] = "PROSES";
    }
    if (pathname === "checker") {
      tempData[`status_${nextpath}`] = e.status;
      tempData[`keterangan_${nextpath}`] = e.keterangan;
      tempData[`tanggal_${nextpath}`] = new Date();
      if (e.status === "SETUJU") {
        tempData[`status_approval`] = "ANTRI";
      }
    }

    const res = await fetch(`/api/pengajuan/periksa?pathname=${pathname}`, {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ ...tempData }),
    });
    const { msg } = await res.json();
    if (res.ok) {
      message.success(msg);
      setOpen(false);
      await notif.getNotifFunction();
      getData && (await getData());
    } else {
      message.error(msg);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isPeriksa) {
      setItems([
        {
          key: "Data Pengajuan",
          label: "Data Pengajuan",
          children: (
            <Form
              form={form}
              labelCol={{ span: 9 }}
              style={{ height: "70vh", overflowY: "auto", padding: "0px 5px" }}
            >
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA PENSIUN
              </div>
              <Form.Item label="Nomor Pensiun" name={"nopen"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nama Sesuai KTP" name={"name"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kelompok Pensiun" name={"jenis_pensiun"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nama Sesuai SKEP" name={"nama_skep"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="No SKEP" name={"no_skep"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kode Jiwa" name={"kode_jiwa"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA ALAMAT
              </div>
              <Form.Item label="Alamat Sesuai KTP" name={"alamat"}>
                <Input.TextArea
                  disabled
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    height: 100,
                  }}
                />
              </Form.Item>
              <Form.Item label="RT" name={"rt"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="RW" name={"rw"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kelurahan" name={"kelurahan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kecamatan" name={"kecamatan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kota/Kabupaten" name={"kota"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Provinsi" name={"provinsi"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kode Pos" name={"kode_pos"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA DOMISILI
              </div>
              <Form.Item label="Alamat Domisili" name={"alamat_domisili"}>
                <Input.TextArea
                  disabled
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    height: 100,
                  }}
                />
              </Form.Item>
              <Form.Item label="RT Domisili" name={"rt_domisili"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="RW Domisili" name={"rw_domisili"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kelurahan Domisili" name={"kelurahan_domisili"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kecamatan Domisili" name={"kecamatan_domisili"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kota/Kabupaten Domisili" name={"kota_domisili"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Provinsi Domisili" name={"provinsi_domisili"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kode Pos Domisisi" name={"kode_pos_domisili"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Geo Location" name={"geo_location"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="No Telepon" name={"no_telepon"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nomor NIK" name={"nik"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Masa Berlaku KTP" name={"masa_ktp"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="NPWP" name={"npwp"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Gelar Pendidikan" name={"pendidikan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Jenis Kelamin" name={"jenis_kelamin"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Agama" name={"agama"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA PEKERJAAN
              </div>
              <Form.Item label="Masa Kerja" name={"masa_kerja"}>
                <Input
                  suffix="Tahun"
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Status Rumah" name={"status_rumah"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Menempati Pada Tahun" name={"menempati_tahun"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nama Ibu Kandung" name={"nama_ibu_kandung"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Pekerjaan Saat Ini" name={"pekerjaan_sekarang"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Alamat Pekerjaan" name={"alamat_pekerjaan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Jenis Usaha" name={"jenis_usaha"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA KELUARGA
              </div>
              <Form.Item label="Status Perkawinan" name={"status_kawin"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nama Pasangan" name={"nama_pasangan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item
                label="Tempat Lahir Pasangan"
                name={"tempat_lahir_pasangan"}
              >
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nomor NIK Pasangan" name={"nik_pasangan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Masa KTP Pasangan" name={"masa_ktp_pasangan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Pekerjaan Saat Ini" name={"pekerjaan_pasangan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item
                label="Keluarga Tidak Serumah"
                name={"nama_keluarga_tidak_serumah"}
              >
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Hubungan Keluarga" name={"hubungan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="No Telepon" name={"no_telepon_keluarga"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Alamat" name={"alamat_keluarga"}>
                <Input.TextArea
                  disabled
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    height: 100,
                  }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA JAMINAN
              </div>
              <Form.Item label="Nomor SK Pensiun" name={"nomor_sk_pensiun"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Tanggal SK Pensiun" name={"tanggal_sk_pensiun"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="TMT Pensiun" name={"tmt_pensiun"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Penerbit SK Pensiun" name={"penerbit_sk"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Pangkat / Golongan" name={"golongan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                AKAD PINJAMAN
              </div>
              <Form.Item label="Tujuan Pengunaan1" name={"tujuan_penggunaan1"}>
                <Input.TextArea
                  disabled
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    height: 100,
                  }}
                />
              </Form.Item>
              <Form.Item label="Tujuan Pengunaan2" name={"tujuan_penggunaan2"}>
                <Input.TextArea
                  disabled
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    height: 100,
                  }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA PEMBIAYAAN
              </div>
              <Form.Item label="Juru Bayar Asal" name={"juru_bayar_asal"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Juru Bayar Tujuan" name={"juru_bayar_tujuan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nama Bank" name={"nama_bank"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="No Rekening" name={"no_rekening"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Tempat Lahir" name={"tempat_lahir"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Tanggal Lahir" name={"tanggal_lahir"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Gaji Bersih" name={"gaji_bersih"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Produk Pembiayaan" name={"produk_pembiayaan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Jenis Pembiayaan" name={"jenis_pembiayaan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              <Form.Item
                label="Sumber Dana"
                name={"sumber_dana"}
                className="flex-1"
              >
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item
                label="Jenis Margin"
                name={"jenis_margin"}
                className="flex-1"
              >
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              </Form.Item>
              <Form.Item label="Refferal" name={"refferal"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Tenor" name={"tenor"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Plafond" name={"plafond"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Angsuran Per Bulan" name={"angsuran"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                KEWAJIBAN BIAYA
              </div>
              <Form.Item label="Biaya Admin Koperasi" name={"biaya_admin"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Admin Bank" name={"biaya_admin_bank"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Cadangan" name={"biaya_lainnya"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Asuransi" name={"biaya_asuransi"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Tatalaksana" name={"biaya_tatalaksana"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Mutasi" name={"biaya_mutasi"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Materai" name={"biaya_materai"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Flagging" name={"biaya_flagging"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Epotpen" name={"biaya_epotpen"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              {/* <Form.Item label="Fee Refferal" name={"reff_fee"}>
                <Input
                  disabled
                  suffix="%"
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item> */}
              <Form.Item label="Biaya Refferal" name={"biaya_reff_rp"}>
                <Input
                  disabled
                  prefix="Rp"
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item
                label="Biaya Buka Rekening"
                name={"biaya_buka_rekening"}
              >
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item
                label="Blokir Angsuran"
                name={"jumlah_blokir_angsuran"}
              >
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Blokir Angsuran" name={"blokir_angsuran"}>
                <Input
                  disabled
                  prefix={"Rp. "}
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Terima Kotor" name={"terima_kotor"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="BPP" name={"bpp"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Pelunasan" name={"pelunasan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Terima Bersih" name={"terima_bersih"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Sisa Gaji Per Bulan" name={"sisa_gaji"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                UNIT PELAYANAN
              </div>
              <Form.Item label="Unit Pelayanan" name={"unit_pelayanan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Area" name={"unit_cabang"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA AO
              </div>
              <Form.Item label="Marketing" name={"marketing"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Posisi" name={"posisi"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Status PKWT" name={"status_pkwt"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Agent Fronting" name={"fronting"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
            </Form>
          ),
        },
        {
          label: "Proses Pengajuan",
          key: "Proses Pengajuan",
          children: (
            <Form
              labelCol={{ span: 7 }}
              onFinish={handleProses}
              form={formProses}
              disabled={
                data[`status_${pathname as keyof typeof obj}`] !== "ANTRI"
                  ? true
                  : false
              }
            >
              <Form.Item label="Keterangan" name={"keterangan"} required>
                <Input.TextArea style={{ height: 100 }} required />
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
                <Input disabled />
              </Form.Item>
              <Form.Item label="Status" name={"status"} required>
                <Select
                  aria-required
                  options={[
                    { label: "SETUJU", value: "SETUJU" },
                    { label: "PENDING", value: "ANTRI" },
                    { label: "DITOLAK", value: "DITOLAK" },
                  ]}
                />
              </Form.Item>
              <Form.Item className="flex justify-end mt-3">
                <button
                  className={`bg-orange-500 hover:bg-orange-600 text-white rounded shadow py-2 px-4 text-xs`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <LoadingOutlined /> : "Submit"}
                </button>
              </Form.Item>
            </Form>
          ),
        },
      ]);
    } else {
      setItems([
        {
          key: "Data Pengajuan",
          label: "Data Pengajuan",
          children: (
            <Form
              form={form}
              labelCol={{ span: 9 }}
              style={{ height: "70vh", overflowY: "auto", padding: "0px 5px" }}
            >
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA PENSIUN
              </div>
              <Form.Item label="Nomor Pensiun" name={"nopen"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kelompok Pensiun" name={"jenis_pensiun"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nama Sesuai SKEP" name={"nama_skep"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nama Sesuai KTP" name={"name"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="No SKEP" name={"no_skep"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kode Jiwa" name={"kode_jiwa"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Alamat Sesuai KTP" name={"alamat"}>
                <Input.TextArea
                  disabled
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    height: 100,
                  }}
                />
              </Form.Item>
              <Form.Item label="RT" name={"rt"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="RW" name={"rw"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kelurahan" name={"kelurahan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kecamatan" name={"kecamatan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kota/Kabupaten" name={"kota"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Provinsi" name={"provinsi"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Kode Pos" name={"kode_pos"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Geo Location" name={"geo_location"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="No Telepon" name={"no_telepon"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nomor NIK" name={"nik"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Masa Berlaku KTP" name={"masa_ktp"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="NPWP" name={"npwp"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Gelar Pendidikan" name={"pendidikan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Jenis Kelamin" name={"jenis_kelamin"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Agama" name={"agama"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Masa Kerja" name={"masa_kerja"}>
                <Input
                  suffix="Tahun"
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Status Rumah" name={"status_rumah"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Menempati Pada Tahun" name={"menempati_tahun"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nama Ibu Kandung" name={"nama_ibu_kandung"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Pekerjaan Saat Ini" name={"pekerjaan_sekarang"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Alamat Pekerjaan" name={"alamat_pekerjaan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Jenis Usaha" name={"jenis_usaha"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA KELUARGA
              </div>
              <Form.Item label="Status Perkawinan" name={"status_kawin"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nama Pasangan" name={"nama_pasangan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item
                label="Tempat Lahir Pasangan"
                name={"tempat_lahir_pasangan"}
              >
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nomor NIK Pasangan" name={"nik_pasangan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Masa KTP Pasangan" name={"masa_ktp_pasangan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Pekerjaan Saat Ini" name={"pekerjaan_pasangan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item
                label="Keluarga Tidak Serumah"
                name={"nama_keluarga_tidak_serumah"}
              >
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Hubungan Keluarga" name={"hubungan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="No Telepon" name={"no_telepon_keluarga"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Alamat" name={"alamat_keluarga"}>
                <Input.TextArea
                  disabled
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    height: 100,
                  }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA JAMINAN
              </div>
              <Form.Item label="Nomor SK Pensiun" name={"nomor_sk_pensiun"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Tanggal SK Pensiun" name={"tanggal_sk_pensiun"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="TMT Pensiun" name={"tmt_pensiun"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Penerbit SK Pensiun" name={"penerbit_sk"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Pangkat / Golongan" name={"golongan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                AKAD PINJAMAN
              </div>
              <Form.Item label="Tujuan Pengunaan1" name={"tujuan_penggunaan1"}>
                <Input.TextArea
                  disabled
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    height: 100,
                  }}
                />
              </Form.Item>
              <Form.Item label="Tujuan Pengunaan2" name={"tujuan_penggunaan2"}>
                <Input.TextArea
                  disabled
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    height: 100,
                  }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA PEMBIAYAAN
              </div>
              <Form.Item label="Juru Bayar Asal" name={"juru_bayar_asal"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Juru Bayar Tujuan" name={"juru_bayar_tujuan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Pembiayaan Sebelumnya" name={"pembiayaan_sebelumnya"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="No Rekening" name={"no_rekening"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Nama Bank" name={"nama_bank"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Tanggal Lahir" name={"tanggal_lahir"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Gaji Bersih" name={"gaji_bersih"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Produk Pembiayaan" name={"produk_pembiayaan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Jenis Pembiayaan" name={"jenis_pembiayaan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Sumber Dana" name={"sumber_dana"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item
                label="Jenis Margin"
                name={"jenis_margin"}
                className="flex-1"
              >
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Refferal" name={"refferal"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Tenor" name={"tenor"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Plafond" name={"plafond"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Angsuran Per Bulan" name={"angsuran"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                KEWAJIBAN BIAYA
              </div>
              <Form.Item label="Biaya Admin Koperasi" name={"biaya_admin"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Admin Bank" name={"biaya_admin_bank"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Cadangan" name={"biaya_lainnya"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Asuransi" name={"biaya_asuransi"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Tatalaksana" name={"biaya_tatalaksana"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Mutasi" name={"biaya_mutasi"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Materai" name={"biaya_materai"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Data Informasi" name={"biaya_data_informasi"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Fee Refferal" name={"reff_fee"}>
                <Input
                  disabled
                  suffix="%"
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Biaya Refferal" name={"biaya_reff_rp"}>
                <Input
                  disabled
                  prefix="Rp"
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item
                label="Biaya Buka Rekening"
                name={"biaya_buka_rekening"}
              >
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Blokir Angsuran" name={"blokir_angsuran"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Terima Kotor" name={"terima_kotor"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="BPP" name={"bpp"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Pelunasan" name={"pelunasan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Terima Bersih" name={"terima_bersih"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Sisa Gaji Per Bulan" name={"sisa_gaji"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                UNIT PELAYANAN
              </div>
              <Form.Item label="Unit Pelayanan" name={"unit_pelayanan"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Area" name={"unit_cabang"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <div className="p-3 font-bold bg-orange-500 text-gray-100 my-2 text-center">
                DATA AO
              </div>
              <Form.Item label="Marketing" name={"marketing"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Posisi" name={"posisi"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Status PKWT" name={"status_pkwt"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item label="Agent Fronting" name={"fronting"}>
                <Input
                  disabled
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
            </Form>
          ),
        },
      ]);
    }
    const angs = ceiling(parseInt(getAngsuranPerBulan(
      data?.DataPembiayaan.mg_bunga as number,
      data?.DataPembiayaan.tenor as number,
      data?.DataPembiayaan.plafond as number
    )), data.DataPembiayaan.pembulatan || 1);
    const kotor =
      (data?.DataPembiayaan.plafond || 0) -
      (data?.DataPembiayaan.plafond || 0) *
        (((data?.DataPembiayaan.by_admin || 0) +
          (data?.DataPembiayaan.by_admin_bank || 0) +
          (data?.DataPembiayaan.by_lainnya || 0)) /
          100) -
      (data?.DataPembiayaan.by_tatalaksana || 0) -
      (data?.DataPembiayaan.plafond || 0) *
        ((data?.DataPembiayaan.by_asuransi || 0) / 100) -
      (data?.DataPembiayaan.by_provisi || 0) -
      (data?.DataPembiayaan.by_buka_rekening || 0) -
      (data?.DataPembiayaan.by_materai || 0) -
      (data?.DataPembiayaan.by_mutasi || 0) -
      data.DataPembiayaan.by_epotpen -
      data.DataPembiayaan.by_flagging -
      (data?.DataPembiayaan.blokir || 0) * angs;
    form.setFieldsValue({
      id: data?.id,
      nopen: data?.DataPembiayaan.nopen || "",
      name: data?.DataPembiayaan.name || "",
      alamat: data?.DataPembiayaan.alamat || "",
      tujuan_penggunaan1: data?.tujuan_penggunaan1 || "",
      tujuan_penggunaan2: data?.tujuan_penggunaan2 || "",
      juru_bayar_asal: data?.DataPembiayaan.juru_bayar_asal || "",
      juru_bayar_tujuan: data?.DataPembiayaan.juru_bayar_tujuan || "",
      tanggal_lahir: data?.DataPembiayaan.tanggal_lahir || "",
      gaji_bersih: formatNumber(
        (data?.DataPembiayaan.gaji_bersih || 0).toString()
      ),
      produk_pembiayaan: data?.DataPembiayaan.Produk.name || "",
      jenis_pembiayaan: data?.DataPembiayaan.jenis_pembiayaan_id
        ? data?.DataPembiayaan.JenisPembiayaan.name
        : "",
      refferal: data?.DataPembiayaan.Refferal.name || "",
      reff_fee: data?.DataPembiayaan.fee || 0,
      biaya_reff_rp: formatNumber(
        (
          (data?.DataPembiayaan.plafond || 0) *
          (data?.DataPembiayaan.fee ? data?.DataPembiayaan.fee / 100 : 0)
        ).toFixed(0)
      ),
      tenor: data?.DataPembiayaan.tenor || 0,
      plafond: formatNumber((data?.DataPembiayaan.plafond || 0).toString()),
      jumlah_blokir_angsuran: data.DataPembiayaan.blokir,
      angsuran: formatNumber(angs.toFixed(0)),
      biaya_admin: formatNumber(
        (
          (data?.DataPembiayaan.plafond || 0) *
          ((data?.DataPembiayaan.by_admin || 0) / 100)
        ).toString()
      ),
      biaya_admin_bank: formatNumber(
        (
          (data?.DataPembiayaan.plafond || 0) *
          ((data?.DataPembiayaan.by_admin_bank || 0) / 100)
        ).toString()
      ),
      biaya_lainnya: formatNumber(
        (
          (data?.DataPembiayaan.plafond || 0) *
          ((data?.DataPembiayaan.by_lainnya || 0) / 100)
        ).toString()
      ),
      biaya_asuransi: formatNumber(
        (
          (data?.DataPembiayaan.plafond || 0) *
          ((data?.DataPembiayaan.by_asuransi || 0) / 100)
        ).toFixed(0)
      ),
      biaya_tatalaksana: formatNumber(
        (data?.DataPembiayaan.by_tatalaksana || 0).toString()
      ),
      biaya_mutasi: formatNumber(
        (data?.DataPembiayaan.by_mutasi || 0).toString()
      ),
      biaya_materai: formatNumber(
        (data?.DataPembiayaan.by_materai || 0).toString()
      ),
      biaya_data_informasi: formatNumber(
        (
          data.DataPembiayaan.by_epotpen + data.DataPembiayaan.by_flagging
        ).toFixed(0)
      ),
      biaya_buka_rekening: formatNumber(
        (data?.DataPembiayaan.by_buka_rekening || 0).toString()
      ),
      blokir_angsuran: formatNumber(
        ((data?.DataPembiayaan.blokir || 0) * angs).toString()
      ),
      terima_kotor: formatNumber(kotor.toString()),
      bpp: formatNumber((data?.DataPembiayaan.bpp || 0).toString()),
      pelunasan: formatNumber(data?.DataPembiayaan.pelunasan.toFixed(0)),
      terima_bersih: formatNumber(
        (
          kotor -
          ((data?.DataPembiayaan.bpp || 0) + data.DataPembiayaan.pelunasan || 0)
        ).toString()
      ),
      sisa_gaji: formatNumber(
        ((data?.DataPembiayaan.gaji_bersih || 0) - angs).toString()
      ),
      unit_pelayanan: data?.User.UnitCabang.UnitPelayanan.name || "",
      marketing:
        (data?.User.first_name || "") + " " + (data?.User.last_name || ""),
      fronting: data?.agent_fronting || "",
      sumber_dana: data?.Bank.name || "",
      golongan: data.golongan || "",
      nama_skep: data.nama_skep || "",
      no_skep: data.nomor_sk_pensiun || "",
      kode_jiwa: data.kode_jiwa || "",
      rt: data?.DataPengajuanAlamat.rt || "",
      rw: data?.DataPengajuanAlamat.rw || "",
      kelurahan: data?.DataPengajuanAlamat.kelurahan || "",
      kecamatan: data?.DataPengajuanAlamat.kecamatan || "",
      kota: data?.DataPengajuanAlamat.kota || "",
      provinsi: data?.DataPengajuanAlamat.provinsi || "",
      kode_pos: data?.DataPengajuanAlamat.kode_pos || "",
      alamat_domisili: data?.DataPengajuanAlamat.alamat_domisili || "",
      rt_domisili: data?.DataPengajuanAlamat.rt_domisili || "",
      rw_domisili: data?.DataPengajuanAlamat.rw_domisili || "",
      kelurahan_domisili: data?.DataPengajuanAlamat.kelurahan_domisili || "",
      kecamatan_domisili: data?.DataPengajuanAlamat.kecamatan_domisili || "",
      kota_domisili: data?.DataPengajuanAlamat.kota_domisili || "",
      provinsi_domisili: data?.DataPengajuanAlamat.provinsi_domisili || "",
      kode_pos_domisili: data?.DataPengajuanAlamat.kode_pos_domisili || "",
      jenis_margin: data?.jenis_margin,
      geo_location: data?.geo_location,
      nik: data?.nik,
      masa_ktp: data?.masa_ktp ? moment(data.masa_ktp).format("DD-MM-YYYY") : "",
      npwp: data?.npwp,
      pendidikan: data?.pendidikan,
      jenis_kelamin: data?.jenis_kelamin,
      agama: data?.agama,
      masa_kerja: data?.masa_kerja,
      status_rumah: data?.status_rumah,
      menempati_tahun: data?.menempati_tahun,
      nama_ibu_kandung: data?.nama_ibu_kandung,
      pekerjaan_sekarang: data?.pekerjaan_sekarang,
      alamat_pekerjaan: data.alamat_pekerjaan,
      jenis_usaha: data?.jenis_usaha,
      status_kawin: data?.status_kawin,
      nama_pasangan: data?.DataPengajuanPasangan.nama_pasangan,
      tempat_lahir_pasangan: data.DataPengajuanPasangan.tempat_lahir_pasangan,
      alamat_pasangan: data.DataPengajuanPasangan.alamat_pasangan,
      tanggal_lahir_pasangan:
        data?.DataPengajuanPasangan.tanggal_lahir_pasangan ? moment(data?.DataPengajuanPasangan.tanggal_lahir_pasangan).format("DD-MM-YYYY") : "",
      nik_pasangan: data?.DataPengajuanPasangan.nik_pasangan,
      masa_ktp_pasangan: data?.DataPengajuanPasangan.masa_ktp_pasangan ? moment(data?.DataPengajuanPasangan.masa_ktp_pasangan).format("DD-MM-YYYY") : "",
      pekerjaan_pasangan: data?.DataPengajuanPasangan.pekerjaan_pasangan,
      nama_keluarga_tidak_serumah:
        data?.DataPengajuanPasangan.nama_keluarga_tidak_serumah,
      hubungan: data?.DataPengajuanPasangan.hubungan,
      no_telepon_keluarga: data?.DataPengajuanPasangan.no_telepon_keluarga,
      alamat_keluarga: data?.DataPengajuanPasangan.alamat_keluarga,
      nomor_sk_pensiun: data?.nomor_sk_pensiun,
      tanggal_sk_pensiun: data?.tanggal_sk_pensiun ? moment(data?.tanggal_sk_pensiun).format("DD-MM-YYYY") : "",
      no_telepon: data?.no_telepon,
      tmt_pensiun: data?.tmt_pensiun ? moment(data?.tmt_pensiun).format("DD-MM-YYYY") : "",
      penerbit_sk: data?.penerbit_sk,
      jenis_pensiun: data?.jenis_pensiun,
      posisi: data?.User.posisi,
      unit_cabang: data?.User.UnitCabang.name,
      status_pkwt: data?.User.status_pkwt,
      pembiayaan_sebelumnya: data?.DataPembiayaan.pembiayaan_sebelumnya,
      no_rekening: data?.DataPembiayaan.no_rekening,
      nama_bank: data?.DataPembiayaan.nama_bank,
    });
    formProses.setFieldsValue({
      keterangan: data[`keterangan_${pathname as keyof typeof obj}`],
      produk: data.DataPembiayaan.Produk.name,
      jenis:
        data.DataPembiayaan.jenis_pembiayaan_id &&
        data.DataPembiayaan.JenisPembiayaan.name,
      sumber_dana: data.Bank.name,
      jenis_margin: data.jenis_margin,
      status: data[`status_${pathname as keyof typeof obj}`],
    });
  }, [data, loading]);

  return (
    <Spin spinning={loading}>
      <Tabs items={items} />
    </Spin>
  );
}
