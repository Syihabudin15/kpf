import { App, Button, Card, Col, Modal, Row } from "antd";
import {
  IDataPembiayaan,
  IDataPengajuan,
  IDataTaspen,
  IProduk,
  IUser,
} from "../IInterfaces";
import { FormInput } from "../FormUtil";
import {
  Bank,
  DataPengajuanAlamat,
  DataPengajuanKeluarga,
  JenisPembiayaan,
  Refferal,
} from "@prisma/client";
import { useState } from "react";
import { FolderAddFilled, SearchOutlined } from "@ant-design/icons";

export default function UpsertPengajuan({
  open,
  setOpen,
  record,
}: {
  open: boolean;
  setOpen: Function;
  record?: IDataPengajuan;
}) {
  const [data, setData] = useState<IDataPengajuan>(record || defaultDapeng);
  const [loading, setLoading] = useState(false);
  const [reffs, setReffs] = useState<Refferal[]>([]);
  const [produks, setProduks] = useState<IProduk[]>([]);
  const [jeniss, setJeniss] = useState<JenisPembiayaan[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const { modal, message } = App.useApp();

  const handleNopen = async () => {
    if (!data.nopen) {
      modal.error({ content: "Mohon masukan nopen terlebih dahulu!" });
      return;
    }
    setLoading(true);
    await fetch(`/api/debitur?nopen=` + data.nopen, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== 200) {
          message.error({ content: res.msg });
        } else {
          const tempData: IDataTaspen = res.data;
          setData({
            ...data,
            nopen: tempData.nopen,
            nama: tempData.nama,
            nama_ibu_kandung: tempData.nama_ibu_kandung,
            nik: tempData.nik,
            alamat_pekerjaan: tempData.alamat_pekerjaan,
            nomor_sk_pensiun: tempData.nomor_sk_pensiun,
            golongan: tempData.golongan,
            jenis_pensiun: tempData.jenis_pensiun,
            nama_skep: tempData.nama_skep,
            kode_jiwa: tempData.kode_jiwa,
            masa_ktp: tempData.masa_ktp,
            npwp: tempData.npwp,
            pendidikan: tempData.pendidikan,
            jenis_kelamin: tempData.jenis_kelamin,
            agama: tempData.agama,
            masa_kerja: tempData.masa_kerja,
            status_rumah: tempData.status_rumah,
            menempati_tahun: tempData.menempati_tahun,
            pekerjaan_sekarang: tempData.pekerjaan_sekarang,
            jenis_usaha: tempData.jenis_usaha,
            status_kawin: tempData.status_kawin,
            tanggal_sk_pensiun: tempData.tanggal_sk_pensiun?.toString() || "",
            tmt_pensiun: tempData.tmt_pensiun,
            penerbit_sk: tempData.penerbit_sk,
            no_telepon: tempData.no_telepon,
            DataPembiayaan: {
              ...data.DataPembiayaan,
              nopen: tempData.nopen,
              name: tempData.nama,
              nama_bank: tempData.ktr_bay_dapem,
              gaji_bersih: parseInt(tempData.jumlah_total || "0"),
            },
            DataPengajuanPasangan: {
              ...data.DataPengajuanPasangan,
              nama_pasangan: tempData.DataPasangan.nama_pasangan,
              nik_pasangan: tempData.DataPasangan.nik_pasangan,
              tempat_lahir_pasangan:
                tempData.DataPasangan.tempat_lahir_pasangan,
              tanggal_lahir_pasangan:
                tempData.DataPasangan.tanggal_lahir_pasangan,
              masa_ktp_pasangan: tempData.DataPasangan.masa_ktp_pasangan,
              pekerjaan_pasangan: tempData.DataPasangan.pekerjaan_pasangan,
              alamat_pasangan: tempData.DataPasangan.alamat_pasangan,
              nama_keluarga_tidak_serumah: null,
              hubungan: null,
              no_telepon_keluarga: null,
              alamat_keluarga: null,
            },
            DataPengajuanAlamat: {
              ...data.DataPengajuanAlamat,
              alamat: tempData.DataDomisili.alamat,
              rt: tempData.DataDomisili.rt,
              rw: tempData.DataDomisili.rw,
              kelurahan: tempData.DataDomisili.kelurahan,
              kecamatan: tempData.DataDomisili.kecamatan,
              kota: tempData.DataDomisili.kota,
              provinsi: tempData.DataDomisili.provinsi,
              kode_pos: tempData.DataDomisili.kode_pos,
              no_telepon: null,
              alamat_domisili: tempData.DataDomisili.alamat_domisili,
              rt_domisili: tempData.DataDomisili.rt_domisili,
              rw_domisili: tempData.DataDomisili.rw_domisili,
              kelurahan_domisili: tempData.DataDomisili.kelurahan_domisili,
              kecamatan_domisili: tempData.DataDomisili.kecamatan_domisili,
              kota_domisili: tempData.DataDomisili.kota_domisili,
              provinsi_domisili: tempData.DataDomisili.provinsi_domisili,
              kode_pos_domisili: tempData.DataDomisili.kode_pos_domisili,
              geo_location: tempData.DataDomisili.geo_location,
            },
          });
        }
      });
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
      title={
        <div>
          <FolderAddFilled /> Input Permohonan
        </div>
      }
      loading={loading}
      width={1000}
    >
      <Card title={"Data Calon Debitur"}>
        <Row gutter={12}>
          <Col xs={12} lg={6}>
            <FormInput
              data={{
                label: "Nomor Pensiun",
                value: data.nopen,
                onChange: (e: string) =>
                  setData({
                    ...data,
                    nopen: e,
                    DataPembiayaan: { ...data.DataPembiayaan, nopen: e },
                    DataTaspen: { ...data.DataTaspen, nopen: e },
                  }),
                type: "text",
                required: true,
                suffix: (
                  <Button
                    size="small"
                    icon={<SearchOutlined />}
                    type="primary"
                    onClick={() => handleNopen()}
                    loading={loading}
                  ></Button>
                ),
              }}
            />
          </Col>
          <Col xs={12} lg={6}>
            <FormInput
              data={{
                label: "Nama Sesuai KTP",
                value: data.nama,
                onChange: (e: string) =>
                  setData({
                    ...data,
                    nama: e,
                    DataPembiayaan: { ...data.DataPembiayaan, name: e },
                    DataTaspen: { ...data.DataTaspen, nama: e },
                  }),
                type: "text",
                required: true,
              }}
            />
          </Col>
        </Row>
      </Card>
    </Modal>
  );
}

const defaultDapeng: IDataPengajuan = {
  id: "",
  tujuan_penggunaan1: "",
  tujuan_penggunaan2: null,
  geo_location: null,
  agent_fronting: null,
  status_slik: null,
  keterangan_slik: null,
  tanggal_slik: null,
  nama_pemeriksa_slik: null,
  status_verifikasi: null,
  keterangan_verifikasi: null,
  tanggal_verifikasi: null,
  nama_pemeriksa_verifikasi: null,
  status_checker: null,
  keterangan_checker: null,
  tanggal_checker: null,
  nama_pemeriksa_checker: null,
  status_maker: null,
  keterangan_maker: null,
  tanggal_maker: null,
  nama_pemeriksa_maker: null,
  status_approval: null,
  keterangan_approval: null,
  tanggal_approval: null,
  nama_pemeriksa_approval: null,
  status_pencairan: null,
  tanggal_pencairan: null,
  tanggal_cetak_akad: null,
  nomor_akad: null,
  jenis_margin: null,
  jenis_asuransi: "BUMI PUTERA",
  is_active: true,

  nopen: null,
  nama: null,
  nama_skep: null,
  kode_jiwa: null,
  golongan: null,
  jenis_pensiun: null,
  nik: null,

  masa_ktp: null,
  npwp: null,
  pendidikan: null,
  jenis_kelamin: null,
  agama: null,
  masa_kerja: null,
  status_rumah: null,
  menempati_tahun: null,
  nama_ibu_kandung: null,
  pekerjaan_sekarang: null,
  alamat_pekerjaan: null,
  jenis_usaha: null,
  status_kawin: null,

  nomor_sk_pensiun: null,
  tanggal_sk_pensiun: null,
  tmt_pensiun: null,
  penerbit_sk: null,
  no_telepon: null,

  is_cetak: false,
  pembayaran_asuransi: false,
  status_lunas: false,
  tanggal_pembayaran_asuransi: null,
  area_pelayanan_berkas: null,
  moc: null,
  tagihan_manual: false,

  BerkasPengajuan: {
    id: "",
    berkas_slik: null,
    berkas_pengajuan: null,
    berkas_idpb: null,
    berkas_flagging: null,
    video_wawancara: null,
    video_asuransi: null,
    berkas_akad: null,
    tanggal_akad: null,
    bukti_cair: null,
    tanggal_bukti_cair: null,
    pelunasan: null,
    tanggal_pelunasan: null,
    jaminan: null,
    tanggal_jaminan: null,
    rekening: null,
    tanggal_rekening: null,
    mutasi: null,
    tanggal_mutasi: null,
    flagging: null,
    tanggal_flagging: null,
    video_cair: null,
    tanggal_video_cair: null,
    no_rekening: null,
    nama_bank: null,
    berkas_lainnya: null,
    tanggal_berkas_lainnya: null,
    video_cair2: null,
    tanggal_video_cair2: null,
    video_cair3: null,
    tanggal_video_cair3: null,
    video_akad: null,
    tanggal_video_akad: null,
    epotpen: null,
    tanggal_epotpen: null,
    status_mutasi: "BELUM_PROSESS",
    status_flagging: "BELUM_PROSESS",
  },
  berkasPengajuanId: null,

  DataTaspen: {} as IDataTaspen,
  dataTaspenId: null,

  User: {} as IUser,
  user_id: null,

  data_pembiayaan_id: "",
  DataPembiayaan: {
    id: "",
    nopen: "",
    name: "",
    keterangan: null,
    alamat: "",
    tanggal_lahir: "",
    tempat_lahir: null,
    juru_bayar_asal: null,
    juru_bayar_tujuan: null,
    pembiayaan_sebelumnya: null,
    no_rekening: null,
    nama_bank: null,
    tanggal_input: new Date(),
    gaji_bersih: 0,
    by_tatalaksana: 0,
    by_mutasi: 0,
    by_provisi: 0,
    mg_bunga: 0,
    by_admin: 0,
    by_admin_bank: 0,
    by_lainnya: 0,
    by_asuransi: 0,
    by_buka_rekening: 0,
    by_materai: 0,
    by_flagging: 0,
    by_epotpen: 0,
    tenor: 0,
    plafond: 0,
    retensi: 0,
    blokir: 0,
    bpp: 0,
    pelunasan: 0,
    fee: 0,
    margin_bank: 0,
    pembulatan: 0,
    pembulatanKhusus: false,

    is_simulasi: false,
    is_deviasi: false,
    is_active: true,

    created_at: new Date(),
    updated_at: new Date(),
    user_update: null,

    Produk: {} as IProduk,
    produk_id: null,
    JenisPembiayaan: {} as JenisPembiayaan,
    jenis_pembiayaan_id: null,
    User: {} as IUser,
    user_id: null,
    Refferal: {} as Refferal,
    refferal_id: null,
  } as IDataPembiayaan,
  Bank: {} as Bank,
  bankId: null,
  JadwalAngsuran: [],
  DataPencairan: null,
  dataPencairanId: null,
  DataPengajuanPasangan: {} as DataPengajuanKeluarga,
  dataPengajuanKeluargaId: "",

  DataPengajuanAlamat: {} as DataPengajuanAlamat,
  dataPengajuanAlamatId: null,
  PenyerahanBerkas: null,
  penyerahanBerkasId: null,
  PenyerahanJaminan: null,
  penyerahanJaminanId: null,
};
