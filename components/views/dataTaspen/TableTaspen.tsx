"use client";
import { DataDataTaspen } from "@/components/utils/Interfaces";
import {
  EditFilled,
  LoadingOutlined,
  PlusCircleFilled,
  PrinterFilled,
} from "@ant-design/icons";
import { DataKeluarga } from "@prisma/client";
import { Divider, Form, Input, Modal, Table, TableProps } from "antd";
import { useEffect, useState } from "react";

export default function TableTaspen({
  data,
  loading,
  total,
  setPage,
  name,
  setName,
}: {
  data: DataDataTaspen[];
  loading: boolean;
  total: number;
  setPage: Function;
  name: string;
  setName: Function;
}) {
  const [selected, setSelected] = useState<DataDataTaspen>();
  const [selectedKeluarga, setSelectedKeluarga] = useState<DataKeluarga>();
  const [modalTambah, setModalTambah] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalHapus, setModalHapus] = useState(false);
  const [modalTambahKeluarga, setModalTambahKeluarga] = useState(false);
  const [modalEditKeluarga, setModalEditKeluarga] = useState(false);
  const [modalHapusKeluarga, setModalHapusKeluarga] = useState(false);
  const [loadingAksi, setLoadingAksi] = useState(false);
  const [formTaspen] = Form.useForm();

  const handleAction = (record: DataDataTaspen, type: string) => {
    setSelected(record);
    if (type == "Edit") {
      setModalEdit(true);
    } else {
      setModalHapus(true);
    }
  };
  const handleActionKeluarga = (record: DataKeluarga, type: string) => {
    setSelectedKeluarga(record);
    if (type == "Edit") {
      setModalEditKeluarga(true);
    } else {
      setModalHapusKeluarga(true);
    }
  };
  useEffect(() => {
    if (selected) {
      formTaspen.setFieldsValue(selected);
    }
  }, [selected, selectedKeluarga]);
  const columns: TableProps<DataDataTaspen>["columns"] = [
    { title: "Nopen", dataIndex: "nopen", key: "nopen" },
    {
      title: "Nama",
      dataIndex: "nama",
      key: "nama",
      sorter: (a, b) => a.nama.localeCompare(b.nama),
    },
    {
      title: "Tanggal Lahir",
      dataIndex: "tanggal_lahir",
      key: "tanggal_lahir",
    },
    { title: "No SKEP", dataIndex: "no_skep", key: "no_skep" },
    { title: "Kode Jiwa", dataIndex: "kode_jiwa", key: "kode_jiwa" },
    {
      title: "Alamat",
      dataIndex: "alamat",
      key: "alamat",
      width: 200,
      render(value, record, index) {
        return (
          <>
            {record.Domisili.alamat} {record.Domisili.rt && record.Domisili.rw}{" "}
            {record.Domisili.kelurahan && record.Domisili.kecamatan}{" "}
            {record.Domisili.kecamatan} {record.Domisili.kota}{" "}
            {record.Domisili.provinsi && record.Domisili.provinsi}{" "}
            {record.Domisili.kode_pos && record.Domisili.kode_pos}
          </>
        );
      },
    },
    { title: "No Telepon", dataIndex: "no_telepon", key: "no_telepon" },
    { title: "NIK", dataIndex: "nik", key: "nik" },
    { title: "NPWP", dataIndex: "npwp", key: "npwp" },
    { title: "Jenis Kelamin", dataIndex: "jenis_kelaim", key: "jenis_kelaim" },
    {
      title: "No SK Pensiun",
      dataIndex: "nomor_sk_pensiun",
      key: "nomor_sk_pensiun",
    },
    { title: "Penerbit SK", dataIndex: "penerbit_sk", key: "penerbit_sk" },
    { title: "Pangkat", dataIndex: "golongan", key: "golongan" },
    {
      title: "Jenis Pensiun",
      dataIndex: "jenis_pensiun",
      key: "jenis_pensiun",
    },
    { title: "NIPNRP", dataIndex: "nipnrp", key: "nipnrp" },
    {
      title: "Status Peserta",
      dataIndex: "status_peserta",
      key: "status_peserta",
    },
    {
      title: "Aksi",
      dataIndex: "id",
      key: "aksi",
      fixed: "right",
      width: 70,
      render(value, record, index) {
        return (
          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-gray-100 px-2 py-1 shadow rounded"
              onClick={() => handleAction(record, "Edit")}
            >
              <EditFilled />
            </button>
            {/* <button
              className="bg-red-500 hover:bg-red-600 text-gray-100 px-2 py-1 shadow rounded"
              onClick={() => handleAction(record, "Hapus")}
            >
              <DeleteFilled />
            </button> */}
          </div>
        );
      },
    },
  ];
  const columnsExpand: TableProps<DataKeluarga>["columns"] = [
    { title: "Nama", dataIndex: "nama", key: "nama_keluarga" },
    { title: "Hubungan", dataIndex: "hubungan", key: "hubungan_keluarga" },
    {
      title: "Tanggal Lahir",
      dataIndex: "tanggal_lahir",
      key: "tanggal_lahir_keluarga",
    },
    {
      title: "Tanggal Nikah",
      dataIndex: "tanggal_nikah",
      key: "tanggal_nikah_keluarga",
    },
    {
      title: "Tanggal Wafat",
      dataIndex: "tanggal_wafat",
      key: "tanggal_wafat_keluarga",
    },
    { title: "Kode Tunjang", dataIndex: "kode_tunjang", key: "kode_tunjang" },
    { title: "Hak Bagi", dataIndex: "hak_bagi", key: "hak_bagi" },
    {
      title: "Aksi",
      dataIndex: "id",
      key: "id",
      render(value, record, index) {
        return (
          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-gray-100 px-2 py-1 shadow rounded"
              onClick={() => handleActionKeluarga(record, "Edit")}
            >
              <EditFilled />
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="block my-1 sm:flex gap-5">
        <div className="input-width">
          <Input.Search
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div className="flex gap-3 mt-2 sm:mt-0">
          <button
            className="bg-green-500 text-gray-200 px-2 py-1 rounded hover:bg-green-600 text-xs"
            onClick={() => setModalTambah(true)}
          >
            <PlusCircleFilled /> Tambah
          </button>
          <button className="bg-blue-500 text-gray-200 px-2 py-1 rounded hover:bg-blue-600 text-xs">
            <PrinterFilled /> Cetak
          </button>
        </div>
      </div>
      <Table
        bordered
        columns={columns}
        dataSource={data}
        size="small"
        loading={loading}
        scroll={{ x: 3000, y: 300 }}
        pagination={{
          pageSize: 20,
          onChange(page, pageSize) {
            setPage(page);
          },
          total: total,
        }}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <div>
                <Table
                  size="small"
                  bordered
                  columns={columnsExpand}
                  dataSource={record.DataKeluarga}
                  pagination={false}
                />
                <div className="flex justify-end p-2">
                  <button
                    className="bg-green-500 text-gray-200 px-2 py-1 rounded hover:bg-green-600 text-xs"
                    onClick={() => setModalTambahKeluarga(true)}
                  >
                    <PlusCircleFilled /> Tambah Keluarga
                  </button>
                </div>
              </div>
            );
          },
        }}
      />

      {/* Modal Tambah */}
      {/* End Modal Tambah */}

      {/* Modal Edit */}
      <Modal
        title="Edit Data Taspen"
        footer={[]}
        open={modalEdit}
        onCancel={() => setModalEdit(false)}
        width={"90vw"}
        style={{ top: 20 }}
      >
        <Form layout="vertical" form={formTaspen}>
          <div
            style={{ height: "70vh", overflowY: "auto" }}
            className="block sm:flex gap-5 sm:px-5"
          >
            <div className="flex-1">
              <Form.Item name={"id"} label="ID" hidden>
                <Input />
              </Form.Item>
              <div className="flex gap-2 justify-between">
                <Form.Item name={"nopen"} label="Nopen" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item name={"nama"} label="Nama" className="flex-1">
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"nama_skep"}
                  label="Nama SKEP"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item name={"no_skep"} label="No SKEP" className="flex-1">
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"kode_jiwa"}
                  label="Kode Jiwa"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"Golongan"}
                  label="golongan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <Divider style={{ fontSize: 10, fontStyle: "italic" }}>
                ALAMAT SESUAI KTP
              </Divider>
              <Form.Item name={"alamat"} label="Alamat">
                <Input.TextArea />
              </Form.Item>
              <div className="flex gap-2 justify-between">
                <Form.Item name={"rt"} label="RT" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item name={"rw"} label="RW" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"kelurahan"}
                  label="Kelurahan"
                  className="flex-2"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"kecamatan"}
                  label="Kecamatan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item name={"kota"} label="Kota" className="flex-1">
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"provinsi"}
                  label="provinsi"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"kode_pos"}
                  label="Kode Pos"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <Divider style={{ fontSize: 10, fontStyle: "italic" }}>
                ALAMAT SESUAI DOMISILI
              </Divider>
              <Form.Item
                name={"alamat_domisili"}
                label="Alamat Domisili"
                className="flex-1"
              >
                <Input.TextArea />
              </Form.Item>
              <div className="flex gap-2 justify-between">
                <Form.Item name={"rt_domisili"} label="RT" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item name={"rw_domisili"} label="RW" className="flex-1">
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"kelurahan_domisili"}
                  label="Kelurahan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"kecamatan_domisili"}
                  label="Kecamatan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"kota_domisili"}
                  label="Kota"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"provinsi_domisili"}
                  label="Provinsi"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"kode_pos_domisili"}
                  label="Kode Pos"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"geo_location"}
                  label="Geo Location"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"no_telepon"}
                  label="No Telepon"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item name={"nik"} label="NIK" className="flex-1">
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"masa_ktp"}
                  label="Masa KTP"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item name={"npwp"} label="NPWP" className="flex-1">
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"pendidikan"}
                  label="Pendidikan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"jenis_kelamin"}
                  label="Jenis Kelamin"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item name={"agama"} label="Agama" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"masa_kerja"}
                  label="Masa Kerja"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"status_rumah"}
                  label="Status Rumah"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"menempati_tahun"}
                  label="Menempati Tahun"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"nama_ibu_kandung"}
                  label="Nama Ibu Kandung"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"pekerjaan_sekarang"}
                  label="Pekerjaan Sekarang"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"alamat_pekerjaan"}
                  label="Alamat Pekerjaan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"jenis_usaha"}
                  label="Jenis Usaha"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"status_kawin"}
                  label="Status Perkawinan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"nama_pasangan"}
                  label="Nama Pasangan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"tempat_lahir_pasangan"}
                  label="Tempat Lahir Pasangan"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"tanggal_lahir_pasangan"}
                  label="Tanggal Lahir Pasangan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"nik_pasangan"}
                  label="NIK Pasangan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"masa_ktp_pasangan"}
                  label="Masa KTP Pasangan"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  name={"pekerjaan_pasangan"}
                  label="Pekerjaan Pasangan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"nomor_sk_pensiun"}
                  label="Nomor SK Pensiun"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"tanggal_sk_pensiun"}
                  label="Tanggal SK Pensiun"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"tanggal_lahir"}
                  label="Tanggal Lahir"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  name={"tmt_pensiun"}
                  label="TMT Pensiun"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"tanggal_nikah"}
                  label="Tanggal Nikah"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  name={"tanggal_wafat"}
                  label="Tanggal Wafat"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  name={"akhir_sks"}
                  label="Akhir SKS"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"penerbit_sk"}
                  label="Penerbit SK"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"jenis_pensiun"}
                  label="Jenis Pensiun"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item name={"nipnrp"} label="NIPNRP" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"status_peserta"}
                  label="Status Peserta"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"jandadudaypdari"}
                  label="Janda/Duda/YP Dari"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"tanggal_lahir_jandadudayp"}
                  label="Tanggal Lahir Janda/Duda/YP"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"awal_flaging"}
                  label="Awal Flagging"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  name={"akhir_flagging"}
                  label="Akhir Flagging"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"blth_rincian"}
                  label="BLTH Rincian"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"jenis_hutang"}
                  label="Jenis Hutang"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item name={"cicilan"} label="Cicilan" className="flex-1">
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"jumlah_kotor"}
                  label="Jumlah Kotor"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"jumlah_potongan"}
                  label="Jumlah Potongan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"jumlah_hutang"}
                  label="Jumlah Hutang"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"jumlah_total"}
                  label="Jumlah Total"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"jenis_dapem"}
                  label="Jenis Dapem"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"kantor_cabang"}
                  label="Kantor Cabang"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"alamat_cabang"}
                  label="Alamat Cabang"
                  className="flex-1"
                >
                  <Input.TextArea />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"ktr_bay_dapem"}
                  label="Kantor Bayar Dapem"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item name={"kpkn"} label="KPKN" className="flex-1">
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"mitra_flagging"}
                  label="Mitra Flagging"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"no_dosir"}
                  label="No DOSIR"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"no_rek"}
                  label="No Rekening"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"nu_dapem"}
                  label="NU DAPEM"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"pembulatan"}
                  label="Pembulatan"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"penpok"}
                  label="Pokok Pensiun"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"pot_alimentasi"}
                  label="Pot Alimentasi"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"pot_askes"}
                  label="Pot Askes"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"pot_assos"}
                  label="Pot Assos"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"pot_ganti_rugi"}
                  label="Pot Ganti Rugi"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"pot_kasda"}
                  label="Pot Kasda"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"pot_kpkn"}
                  label="Pot KPKN"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"pot_pph21"}
                  label="Pot PPH21"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"pot_sewa_rumah"}
                  label="Pot Sewa Rumah"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item name={"spn"} label="SPN" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"status_dapem"}
                  label="Status Dapem"
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item name={"t_istri"} label="T Istri" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item name={"t_anak"} label="T Anak" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item name={"t_beras"} label="T Beras" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item name={"t_cacat"} label="T Cacat" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item name={"t_dahor"} label="T Dahor" className="flex-1">
                  <Input />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"tanggal_sekarang"}
                  label="Tanggal"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  name={"tanggal_surat"}
                  label="Tanggal Surat"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item
                  name={"tanggal_sekarang"}
                  label="Tanggal"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  name={"tanggal_surat"}
                  label="Tanggal Surat"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item name={"tkd"} label="TKD" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item
                  name={"tmt_stop"}
                  label="TMT Stop"
                  className="flex-1"
                >
                  <Input type="date" />
                </Form.Item>
              </div>
              <div className="flex gap-2 justify-between">
                <Form.Item name={"tpmtp"} label="TPMTP" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item name={"tpp"} label="TPP" className="flex-1">
                  <Input />
                </Form.Item>
                <Form.Item name={"tpph21"} label="TPPH21" className="flex-1">
                  <Input />
                </Form.Item>
              </div>
            </div>
          </div>
          <Form.Item className="flex justify-end">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-gray-100 shadow rounded px-3 py-2"
              disabled={loadingAksi}
            >
              {loadingAksi ? <LoadingOutlined /> : "Simpan"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
      {/* End Modal Edit */}

      {/* Modal Hapus */}
      <Modal title="Hapus Data Taspen">
        <p>Konfirmasi hapus data taspen {selected && selected.nama}?</p>
      </Modal>
      {/* End Modal Hapus */}
    </div>
  );
}
