"use client";
import { notifContext } from "@/components/NotifContext";
import {
  BankOpt,
  Cabang,
  DataDataTaspen,
  IUser,
  Options,
} from "@/components/utils/Interfaces";
import { LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Bank,
  BerkasPengajuan,
  DataPembiayaan,
  StatusKawin,
} from "@prisma/client";
import {
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  message,
} from "antd";
import { useContext, useEffect, useState } from "react";
import InputPembiayaan from "./InputBiaya";
import UploadDoc from "../pengajuan/UploadDoc";
import { filterOption } from "@/components/utils/inputUtils";
import moment from "moment";

export default function InputForm({
  getData,
  fullCabang,
  fullUser,
  upOpt,
  refferalOpt,
  taspens,
  provinsi,
}: {
  getData: Function;
  fullCabang: Cabang[];
  fullUser: IUser[];
  upOpt: BankOpt[];
  refferalOpt: Options[];
  taspens: DataDataTaspen[];
  provinsi: Options[];
}) {
  const [open, setOpen] = useState(false);
  const [pembiayaan, setPembiayaan] = useState<DataPembiayaan>();
  const [bankOption, setBankOption] = useState<BankOpt[]>();
  const [selectedBank, setSelectedBank] = useState<Bank>();
  const [berkas, setBerkas] = useState<BerkasPengajuan>();
  const [nama, setNama] = useState<string>();
  const [alamat, setAlamat] = useState<string>();
  const [nopen, setNopen] = useState<string>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [domisiliSama, setDomisiliSama] = useState(false);
  const [statusKawinDisable, setStatusKawinDisable] = useState(false);
  const [taspen, setTaspen] = useState<DataDataTaspen>();
  const context = useContext(notifContext);
  const [jenisMargin, setJenisMargin] = useState<string>();
  const [isDisable, setIsDisable] = useState(true);
  const [kabupaten, setKabupaten] = useState<Options[]>([]);
  const [kabupatenDomisili, setKabupatenDomisili] = useState<Options[]>([]);

  // const handleChangeUP = (e: string) => {
  //   const cabang = fullCabang?.filter((ca) => ca.id == e);
  //   const user = fullUser?.filter((u) => u.unit_cabang_id == e);
  //   const fixUserOpt: Options[] = user?.map((user) => {
  //     return { label: user.first_name + " " + user.last_name, value: user.id };
  //   }) as any;
  //   setUserOpt(fixUserOpt);
  //   form.setFieldsValue({
  //     area_pelayanan: cabang && cabang[0].unit,
  //   });
  // };

  const handleChangeUser = (e: string) => {
    const user = fullUser?.filter((u) => u.id == e);
    form.setFieldsValue({
      posisi: user && user[0].posisi,
      status_pkwt: user && user[0].status_pkwt,
    });
  };

  const handleStatusKawin = (e: StatusKawin) => {
    if (e !== "KAWIN") {
      setStatusKawinDisable(true);
    } else {
      setStatusKawinDisable(false);
    }
  };
  const handleChangeNopen = (e: any) => {
    setIsDisable(true);
    setNopen(e);
    const filter = taspens.filter((t) => t.nopen === e);
    if (!filter || filter.length === 0) {
      setIsDisable(false);
      return;
    }
    setNama(filter[0].nama);
    setTaspen(filter[0]);
    setIsDisable(false);
  };

  const handleChangeProvince = async (e: string, type: string) => {
    const res = await fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${e}.json`
    );
    const result = await res.json();
    const resultMap = result.map((e: any, ind: number) => {
      return {
        label: e.name,
        value: e.name,
      };
    });
    if (type === "domisili") {
      setKabupatenDomisili(resultMap);
    } else {
      setKabupaten(resultMap);
    }
  };

  const handleFinish = async (e: any) => {
    setLoading(true);
    if (
      !pembiayaan ||
      !pembiayaan.name ||
      !pembiayaan.nopen ||
      !pembiayaan.alamat ||
      !pembiayaan.refferal_id
    ) {
      setLoading(false);
      return message.error("Mohon lengkapi data pembiayaan terlebih dahulu!");
    }

    const findProvince = provinsi.filter((data) => data.value === e.provinsi);
    const findProvinceDomisili = provinsi.filter(
      (data) => data.value === e.provinsi_domisili
    );
    e.Domisili = {
      alamat_domisili: domisiliSama ? e.alamat : e.alamat_domisili,
      rt_domisili: domisiliSama ? e.rt : e.rt_domisili,
      rw_domisili: domisiliSama ? e.rw : e.rw_domisili,
      kelurahan_domisili: domisiliSama ? e.kelurahan : e.kelurahan_domisili,
      kecamatan_domisili: domisiliSama ? e.kecamatan : e.kecamatan_domisili,
      kota_domisili: domisiliSama ? e.kota : e.kota_domisili,
      provinsi_domisili: domisiliSama
        ? findProvince[0].label
        : findProvinceDomisili[0]
        ? findProvinceDomisili[0].label
        : findProvince[0].label,
      kode_pos_domisili: domisiliSama ? e.kode_pos : e.kode_pos_domisili,
      geo_location: e.geo_location,
      alamat: e.alamat || null,
      rt: e.rt || null,
      rw: e.rw || null,
      kelurahan: e.kelurahan || null,
      kecamatan: e.kecamatan || null,
      kota: e.kota || null,
      provinsi: findProvince[0].label || null,
      kode_pos: e.kode_pos || null,
    };
    e.DataKeluarga = {
      nama_pasangan: statusKawinDisable ? null : e.nama_pasangan,
      tempat_lahir_pasangan: statusKawinDisable
        ? null
        : e.tempat_lahir_pasangan,
      tanggal_lahir_pasangan: statusKawinDisable
        ? null
        : moment(e.tanggal_lahir_pasangan).toISOString(),
      nik_pasangan: statusKawinDisable ? null : e.nik_pasangan,
      masa_ktp_pasangan: statusKawinDisable
        ? null
        : moment(e.masa_ktp_pasangan).toISOString(),
      pekerjaan_pasangan: statusKawinDisable ? null : e.pekerjaan_pasangan,
      nama_keluarga_tidak_serumah: e.keluarga_tidak_serumah || null,
      hubungan: e.hubungan_keluarga || null,
      no_telepon_keluarga: e.no_telepon_keluarga || null,
      alamat_keluarga: e.alamat_keluarga || null,
    };
    e.BerkasPengajuan = berkas;
    e.DataPembiayaan = pembiayaan;
    e.menempati_tahun = e.menempati_tahun ? e.menempati_tahun.toString() : null;
    e.masa_kerja = parseInt(e.masa_kerja) || null;
    e.tanggal_lahir = pembiayaan.tanggal_lahir;
    e.nopen = nopen;
    e.no_rek = pembiayaan.no_rekening || null;
    e.bankId = selectedBank ? selectedBank.id : null;
    e.jenis_margin = jenisMargin;
    e.status_slik = "ANTRI";
    e.status_verifikasi = "ANTRI";
    e.margin_bank = selectedBank?.margin_bank;
    e.pembulatan = parseInt(
      selectedBank ? selectedBank.pembulatan.toString() : "1"
    );
    e.tanggal_sk_pensiun = moment(e.tanggal_sk_pensiun).toISOString();
    e.masa_ktp = moment(e.masa_ktp).toISOString();
    e.tmt_pensiun = moment(e.tmt_pensiun).toISOString();
    e.area_pelayanan_berkas = e.unit_pelayanan;

    const res = await fetch("/api/slik", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(e),
    });
    const result = await res.json();
    if (res.ok) {
      message.success(result.msg);
      setOpen(false);
    } else {
      message.error(result.msg);
    }
    setOpen(false);
    await getData();
    await context.getNotifFunction();
    setLoading(false);
  };

  useEffect(() => {
    if (!nopen || !taspen) return;
    if (nopen && taspen) {
      setNama(taspen.nama || "");
      setAlamat(taspen.Domisili?.alamat || "");
      form.setFieldsValue({
        nama: taspen.nama || "",
        golongan: taspen.golongan || "",
        nama_skep: taspen.nama_skep || "",
        kode_jiwa: taspen.kode_jiwa || "",
        nomor_sk_pensiun: taspen.no_skep,
        alamat: taspen.Domisili?.alamat || "",
        rt: taspen.Domisili?.rt || "",
        rw: taspen.Domisili?.rw || "",
        kelurahan: taspen.Domisili?.kelurahan || "",
        kecamatan: taspen.Domisili?.kecamatan || "",
        // kota: taspen.Domisili?.kota || "",
        // provinsi: taspen.Domisili?.provinsi || "",
        kode_pos: taspen.Domisili?.kode_pos || "",
        alamat_domisili: taspen.Domisili?.alamat_domisili || "",
        rt_domisili: taspen.Domisili?.rt_domisili || "",
        rw_domisili: taspen.Domisili?.rw_domisili || "",
        kelurahan_domisili: taspen.Domisili?.kelurahan_domisili || "",
        kecamatan_domisili: taspen.Domisili?.kecamatan_domisili || "",
        // kota_domisili: taspen.Domisili?.kota_domisili || "",
        // provinsi_domisili: taspen.Domisili?.provinsi_domisili || "",
        kode_pos_domisili: taspen.Domisili?.kode_pos_domisili || "",
        geo_location: taspen.Domisili?.geo_location || "",
        no_telepon: taspen.no_telepon || "",
        nik: taspen.nik || "",
        npwp: taspen.npwp || "",
        pendidikan: taspen.pendidikan || "",
        jenis_kelamin: taspen.jenis_kelamin || "",
        agama: taspen.agama || "",
        masa_kerja: taspen.masa_kerja || "",
        status_rumah: taspen.status_rumah || "",
        menempati_tahun: taspen.menempati_tahun || "",
        nama_ibu_kandung: taspen.nama_ibu_kandung || "",
        pekerjaan_sekarang: taspen.pekerjaan_sekarang || "",
        alamat_pekerjaan: taspen.alamat_pekerjaan || "",
        jenis_usaha: taspen.jenis_usaha || "",
        status_kawin: taspen.status_kawin || "",
        nama_pasangan: taspen.DataPasangan.nama_pasangan || "",
        tempat_lahir_pasangan: taspen.DataPasangan.tempat_lahir_pasangan || "",
        nik_pasangan: taspen.DataPasangan.nik_pasangan || "",
        pekerjaan_pasangan: taspen.DataPasangan.pekerjaan_pasangan || "",
        no_sk_pensiun: taspen.nomor_sk_pensiun || "",
        penerbit_sk: taspen.penerbit_sk || "",
        jenis_pensiun: taspen.jenis_pensiun || "",
      });
      if (taspen.status_kawin && taspen.status_kawin === "KAWIN") {
        setStatusKawinDisable(false);
      } else {
        setStatusKawinDisable(true);
      }
    }
  }, [nopen, taspen]);

  return (
    <div>
      <button
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 text-center rounded shadow text-xs"
        onClick={() => setOpen(true)}
        disabled={taspens ? false : true}
      >
        Input <PlusCircleOutlined />
      </button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={[]}
        title="Input Pengajuan Slik"
        wrapClassName="input-pengajuan"
        width={"100%"}
        style={{ top: 20 }}
      >
        <Spin spinning={loading}>
          <Form layout="vertical" form={form} onFinish={handleFinish}>
            <div
              style={{
                height: "80vh",
                overflowY: "auto",
                padding: "0 10px",
              }}
            >
              <div className="w-full py-3 px-2 bg-orange-500 text-gray-100 mb-2 font-semibold">
                Data Pensiun
              </div>
              <div className="block md:flex justify-between gap-5">
                <Form.Item
                  label="Nopen"
                  name={"nopen"}
                  required
                  className="flex-1"
                >
                  <Select
                    options={taspens.map((t) => {
                      return {
                        label: `${t.nopen} - ${t.nama}`,
                        value: t.nopen,
                      };
                    })}
                    onChange={(e) => handleChangeNopen(e[0])}
                    mode="tags"
                    maxCount={1}
                    showSearch
                  />
                </Form.Item>
                <Form.Item
                  label="Kelompok Pensiun"
                  name={"jenis_pensiun"}
                  required
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="block md:flex justify-between gap-5">
                <Form.Item
                  label="Nama Lengkap"
                  name={"nama"}
                  required
                  className="flex-1"
                >
                  <Input
                    required
                    value={nama && nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Nama SKEP"
                  name={"nama_skep"}
                  required
                  className="flex-1"
                >
                  <Input required />
                </Form.Item>
              </div>
              <Form.Item
                label="Kode Jiwa"
                name={"kode_jiwa"}
                required
                className="flex-1"
              >
                <Input required />
              </Form.Item>
              <div className="w-full py-3 px-2 bg-orange-500 text-gray-100 mt-2 mb-2 font-semibold">
                Data Alamat
              </div>
              <Divider className="divider-input">Alamat Sesuai KTP</Divider>
              <div className="block md:flex justify-between items-end gap-5">
                <Form.Item
                  label="Alamat Sesuai KTP"
                  name={"alamat"}
                  required
                  className="w-full md:flex-1"
                >
                  <Input.TextArea
                    required
                    value={alamat && alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                  />
                </Form.Item>
                <div className="block md:flex-1 md:flex gap-5">
                  <Form.Item
                    label="RT"
                    name={"rt"}
                    required
                    className="flex-1"
                    rules={[
                      {
                        required: true,
                        message: "Mohon isi field ini!",
                      },
                    ]}
                  >
                    <Input required />
                  </Form.Item>
                  <Form.Item
                    label="RW"
                    name={"rw"}
                    required
                    className="flex-1"
                    rules={[
                      {
                        required: true,
                        message: "Mohon isi field ini!",
                      },
                    ]}
                  >
                    <Input required />
                  </Form.Item>
                </div>
              </div>
              <div className="block">
                <div className="block md:flex gap-5">
                  <Form.Item
                    label="Kelurahan"
                    name={"kelurahan"}
                    required
                    className="flex-1"
                  >
                    <Input required />
                  </Form.Item>
                  <Form.Item
                    label="Kecamatan"
                    name={"kecamatan"}
                    required
                    className="flex-1"
                  >
                    <Input required />
                  </Form.Item>
                </div>
                <div className="block md:flex justify-between gap-5">
                  <Form.Item
                    label="Provinsi"
                    name={"provinsi"}
                    required
                    className="flex-1"
                    rules={[
                      { required: true, message: "Mohon isi field ini!" },
                    ]}
                  >
                    <Select
                      onChange={(e) => handleChangeProvince(e, "all")}
                      options={provinsi}
                      showSearch
                      filterOption={filterOption}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Kota/Kabupaten"
                    name={"kota"}
                    required
                    className="flex-1"
                    rules={[
                      { required: true, message: "Mohon isi field ini!" },
                    ]}
                  >
                    <Select options={kabupaten} showSearch />
                  </Form.Item>
                </div>
                <Form.Item
                  label="Kode Pos"
                  name={"kode_pos"}
                  required
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
              </div>
              <Divider className="divider-input">
                Alamat Sesuai Domisili
              </Divider>
              <div className="block md:flex gap-10 py-5">
                <span>Alamat domisili sama dengan KTP?</span>
                <Checkbox
                  value={domisiliSama}
                  onChange={() => setDomisiliSama(!domisiliSama)}
                />
              </div>
              <div className="block md:flex justify-between items-end gap-5">
                <Form.Item
                  label="Alamat Sesuai Domisili"
                  name={"alamat_domisili"}
                  required
                  hidden={domisiliSama}
                  className="w-full md:flex-1"
                >
                  <Input.TextArea
                    required
                    disabled={isDisable ? isDisable : domisiliSama}
                  />
                </Form.Item>
                <div className="block md:flex-1 md:flex gap-5">
                  <Form.Item
                    label="RT"
                    name={"rt_domisili"}
                    required
                    hidden={domisiliSama}
                    className="flex-1"
                    rules={[
                      {
                        required: !domisiliSama,
                        message: "Mohon isi field ini!",
                      },
                    ]}
                  >
                    <Input
                      required
                      disabled={isDisable ? isDisable : domisiliSama}
                    />
                  </Form.Item>
                  <Form.Item
                    label="RW"
                    name={"rw_domisili"}
                    required
                    hidden={domisiliSama}
                    className="flex-1"
                    rules={[
                      {
                        required: !domisiliSama,
                        message: "Mohon isi field ini!",
                      },
                    ]}
                  >
                    <Input
                      required
                      disabled={isDisable ? isDisable : domisiliSama}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="block md:flex justify-center gap-5">
                <Form.Item
                  label="Kecamatan"
                  name={"kecamatan_domisili"}
                  required
                  hidden={domisiliSama}
                  className="flex-1"
                >
                  <Input
                    required
                    disabled={isDisable ? isDisable : domisiliSama}
                  />
                </Form.Item>
                <Form.Item
                  label="Kelurahan"
                  name={"kelurahan_domisili"}
                  required
                  hidden={domisiliSama}
                  className="flex-1"
                >
                  <Input
                    required
                    disabled={isDisable ? isDisable : domisiliSama}
                  />
                </Form.Item>
              </div>
              <div className="block md:flex justify-between gap-5">
                <Form.Item
                  label="Provinsi"
                  name={"provinsi_domisili"}
                  required
                  hidden={domisiliSama}
                  className="flex-1"
                >
                  <Select
                    onChange={(e) => handleChangeProvince(e, "domisili")}
                    showSearch
                    options={provinsi}
                    disabled={isDisable ? isDisable : domisiliSama}
                    filterOption={filterOption}
                  />
                </Form.Item>
                <Form.Item
                  label="Kota/Kabupaten"
                  name={"kota_domisili"}
                  required
                  hidden={domisiliSama}
                  className="flex-1"
                >
                  <Select
                    options={kabupatenDomisili}
                    disabled={isDisable ? isDisable : domisiliSama}
                    showSearch
                  />
                </Form.Item>
              </div>
              <div className="block md:flex justify-between gap-5">
                <Form.Item
                  label="Kode Pos"
                  name={"kode_pos_domisili"}
                  required
                  hidden={domisiliSama}
                  className="flex-1"
                  rules={[
                    {
                      required: !domisiliSama,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input
                    required
                    disabled={isDisable ? isDisable : domisiliSama}
                  />
                </Form.Item>
                <Form.Item
                  label="Geo Location"
                  name={"geo_location"}
                  required
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
              </div>
              <div className="block md:flex justify-between gap-5">
                <Form.Item
                  label="No Telepon"
                  name={"no_telepon"}
                  required
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
                <Form.Item
                  label="NIK"
                  name={"nik"}
                  required
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
              </div>
              <div className="block md:flex gap-5 justify-between">
                <Form.Item
                  label="NPWP Pemohon"
                  name={"npwp"}
                  required
                  className="flex-1"
                >
                  <Input required />
                </Form.Item>
                <div className="block md:flex-1 md:flex gap-5 items-end">
                  <Form.Item
                    label="Masa Berlaku KTP"
                    name={"masa_ktp"}
                    required
                    className="flex-1"
                    rules={[
                      {
                        required: true,
                        message: "Mohon isi field ini!",
                      },
                    ]}
                  >
                    <Input type="date" required />
                  </Form.Item>
                  <Form.Item
                    label="Gelar Pendidikan"
                    name={"pendidikan"}
                    required
                    style={{ flex: 1 }}
                    rules={[
                      { required: true, message: "Mohon isi field ini!" },
                    ]}
                  >
                    <Select
                      aria-required
                      showSearch
                      placeholder={"-- choose --"}
                      options={[
                        { label: "SD", value: "SD" },
                        { label: "SMP", value: "SMP" },
                        { label: "SMA", value: "SMA" },
                        { label: "D3", value: "D3" },
                        { label: "S1", value: "S1" },
                        { label: "S2", value: "S2" },
                        { label: "S3", value: "S3" },
                        { label: "LAINNYA", value: "LAINNYA" },
                      ]}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="block md:flex gap-5 justify-between">
                <Form.Item
                  label="Jenis Kelamin"
                  name={"jenis_kelamin"}
                  required
                  className="flex-1"
                  rules={[{ required: true, message: "Mohon isi field ini!" }]}
                >
                  <Select
                    showSearch
                    aria-required
                    placeholder={"-- choose --"}
                    options={[
                      { label: "LAKI-LAKI", value: "LAKI_LAKI" },
                      { label: "PEREMPUAN", value: "PEREMPUAN" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label="Agama"
                  name={"agama"}
                  required
                  className="flex-1"
                  rules={[{ required: true, message: "Mohon isi field ini!" }]}
                >
                  <Select
                    showSearch
                    aria-required
                    placeholder={"-- choose --"}
                    options={[
                      { label: "ISLAM", value: "ISLAM" },
                      { label: "KATHOLIK", value: "KATHOLIK" },
                      { label: "KONGHUCU", value: "KONGHUCU" },
                      { label: "HINDU", value: "HINDU" },
                      { label: "BUDHA", value: "BUDHA" },
                      { label: "ATHEIS", value: "ATHEIS" },
                      { label: "LAINNYA", value: "LAINNYA" },
                    ]}
                  />
                </Form.Item>
              </div>
              <Divider className="divider-input">Pekerjaan</Divider>
              <div className="block md:flex justify-between gap-5 items-end">
                <Form.Item
                  // style={{ width: 220, flex: 1 }}
                  label="Status Kepemilikan Rumah"
                  name={"status_rumah"}
                  required
                  className="w-full md:flex-1"
                  rules={[{ required: true, message: "Mohon isi field ini!" }]}
                >
                  <Select
                    showSearch
                    placeholder={"-- choose --"}
                    options={[
                      { label: "SEWA", value: "SEWA" },
                      { label: "MILIK SENDIRI", value: "MILIK_SENDIRI" },
                      { label: "MILIK KELUARGA", value: "MILIK_KELUARGA" },
                      { label: "MILIK ORANG LAIN", value: "MILIK_ORANGLAIN" },
                      { label: "NGEKOS", value: "NGEKOS" },
                      {
                        label: "TIDAK PUNYA RUMAH",
                        value: "TIDAK_PUNYA_RUMAH",
                      },
                    ]}
                  />
                </Form.Item>
                <div className="block md:flex-1 md:flex gap-5 items-end">
                  <Form.Item
                    label="Mulai Menempati Pada"
                    name={"menempati_tahun"}
                    required
                    className="flex-1"
                    rules={[
                      {
                        required: true,
                        message: "Mohon isi field ini minimum 4 angka!",
                      },
                    ]}
                  >
                    <Input prefix="Tahun" required type="number" />
                  </Form.Item>
                  <Form.Item
                    label="Masa Kerja"
                    name={"masa_kerja"}
                    required
                    className="flex-1"
                    rules={[
                      {
                        required: true,
                        message: "Mohon isi field ini!",
                      },
                    ]}
                  >
                    <Input suffix="Tahun" required type="number" />
                  </Form.Item>
                </div>
              </div>
              <div className="block md:flex gap-5 justify-between items-end">
                <Form.Item
                  label="Pekerjaan Saat Ini"
                  name={"pekerjaan_sekarang"}
                  required
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
                <Form.Item
                  label="Alamat Pekerjaan"
                  name={"alamat_pekerjaan"}
                  className="w-full md:flex-1"
                >
                  <Input.TextArea />
                </Form.Item>
              </div>
              <div className="block md:flex gap-5 items-end">
                <Form.Item
                  label="Nama Ibu Kandung"
                  name={"nama_ibu_kandung"}
                  required
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
                <Form.Item
                  label="Jenis Usaha"
                  name={"jenis_usaha"}
                  className="flex-1"
                  rules={[{ required: true, message: "Mohon isi field ini!" }]}
                >
                  <Select
                    showSearch
                    placeholder={"-- choose --"}
                    options={[
                      { label: "WARUNG KOPI", value: "WARUNG_KOPI" },
                      { label: "TOKO KELONTONG", value: "TOKO_KELONTONG" },
                      {
                        label: "JASA CUCI MOBIL DAN MOTOR",
                        value: "JASA_CUCI_MOBIL_DAN_MOTOR",
                      },
                      { label: "KATERING", value: "KATERING" },
                      { label: "LOUNDRY", value: "LOUNDRY" },
                      { label: "SALON KECANTIKAN", value: "SALON_KECANTIKAN" },
                      { label: "LAINNYA", value: "LAINNYA" },
                    ]}
                  />
                </Form.Item>
              </div>

              <div className="w-full py-3 px-2 bg-orange-500 text-gray-100 mt-2 mb-2 font-semibold">
                Data Keluarga
              </div>
              <div className="block md:flex gap-5 justify-between items-end">
                <Form.Item
                  label="Status Perkawinan"
                  name={"status_kawin"}
                  required
                  className="w-full md:flex-1"
                  rules={[{ required: true, message: "Mohon isi field ini!" }]}
                >
                  <Select
                    showSearch
                    placeholder={"-- choose --"}
                    options={[
                      { label: "BELUM KAWIN", value: "BELUM_KAWIN" },
                      { label: "KAWIN", value: "KAWIN" },
                      { label: "JANDA", value: "JANDA" },
                      { label: "DUDA", value: "DUDA" },
                    ]}
                    onChange={(e) => handleStatusKawin(e as StatusKawin)}
                  />
                </Form.Item>
                <div className="block md:flex md:flex-1 gap-5 items-end">
                  <Form.Item
                    label="Nama Pasangan"
                    name={"nama_pasangan"}
                    className="flex-1"
                    required={!statusKawinDisable}
                  >
                    <Input
                      disabled={isDisable ? isDisable : statusKawinDisable}
                      required={!statusKawinDisable}
                    />
                  </Form.Item>
                  <Form.Item
                    className="flex-1"
                    label="Tempat Lahir Pasangan"
                    name={"tempat_lahir_pasangan"}
                    required={!statusKawinDisable}
                  >
                    <Input
                      disabled={isDisable ? isDisable : statusKawinDisable}
                      required={!statusKawinDisable}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="block md:flex gap-5 justify-between items-end">
                <Form.Item
                  label="No NIK Pasangan"
                  name={"nik_pasangan"}
                  className="w-full md:flex-1"
                  // required={!statusKawinDisable}
                >
                  <Input
                    disabled={isDisable ? isDisable : statusKawinDisable}
                    required={!statusKawinDisable}
                  />
                </Form.Item>
                <div className="flex-1 md:flex gap-5 items-end">
                  <Form.Item
                    label="Tanggal Lahir Pasangan"
                    name={"tanggal_lahir_pasangan"}
                    className="flex-1"
                    required={!statusKawinDisable}
                  >
                    <Input
                      type="date"
                      disabled={isDisable ? isDisable : statusKawinDisable}
                      required={!statusKawinDisable}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Masa Berlaku KTP Pasangan"
                    name={"masa_ktp_pasangan"}
                    className="flex-1"
                    required={!statusKawinDisable}
                  >
                    <Input
                      type="date"
                      disabled={isDisable ? isDisable : statusKawinDisable}
                      required={!statusKawinDisable}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="block md:flex gap-5 justify-between items-end">
                <Form.Item
                  label="Pekerjaan Saat Ini"
                  name={"pekerjaan_pasangan"}
                  required={!statusKawinDisable}
                  className="flex-1"
                >
                  <Input
                    disabled={isDisable ? isDisable : statusKawinDisable}
                    required={!statusKawinDisable}
                  />
                </Form.Item>
                <div className="flex-1 block md:flex gap-5 items-end">
                  <Form.Item
                    label="Nama Keluarga Tidak Serumah"
                    name={"keluarga_tidak_serumah"}
                    required
                    className="flex-1"
                    rules={[
                      {
                        required: true,
                        message: "Mohon isi field ini!",
                      },
                    ]}
                  >
                    <Input required />
                  </Form.Item>
                  <Form.Item
                    label="Hubungan Keluarga"
                    name={"hubungan_keluarga"}
                    required
                    className="flex-1"
                    rules={[
                      {
                        required: true,
                        message: "Mohon isi field ini!",
                      },
                    ]}
                  >
                    <Input required />
                  </Form.Item>
                </div>
              </div>
              <div className="block md:flex justify-between items-end gap-5">
                <Form.Item
                  label="No Telepon Keluarga"
                  name={"no_telepon_keluarga"}
                  className="flex-1"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
                <Form.Item
                  className="flex-1"
                  label="Alamat"
                  name={"alamat_keluarga"}
                  required
                  rules={[
                    {
                      required: true,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input.TextArea required />
                </Form.Item>
              </div>
              <div className="w-full py-3 px-2 bg-orange-500 text-gray-100 mb-2 font-semibold">
                Data Jaminan
              </div>
              <div className="block md:flex gap-5 justify-between items-end">
                <Form.Item
                  label="Nomor SK Pensiun"
                  name={"nomor_sk_pensiun"}
                  required
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
                <div className="flex-1 md:flex gap-5">
                  <Form.Item
                    label="Tanggal SK Pensiun"
                    name={"tanggal_sk_pensiun"}
                    required
                    className="flex-1"
                    rules={[
                      {
                        required: true,
                        message: "Mohon isi field ini!",
                      },
                    ]}
                  >
                    <Input type="date" required />
                  </Form.Item>
                  <Form.Item
                    label="TMT Pensiun"
                    name={"tmt_pensiun"}
                    required
                    className="flex-1"
                    rules={[
                      {
                        required: true,
                        message: "Mohon isi field ini!",
                      },
                    ]}
                  >
                    <Input type="date" required />
                  </Form.Item>
                </div>
              </div>
              <div className="block md:flex gap-5 justify-between items-end">
                <Form.Item
                  label="Penerbit SK Pensiun"
                  name={"penerbit_sk"}
                  required
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
                <Form.Item
                  label="Pangkat / Golongan"
                  name={"golongan"}
                  required
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
              </div>
              <div className="w-full py-3 px-2 bg-orange-500 text-gray-100 mb-2 font-semibold">
                Akad Pinjaman
              </div>
              <div className="block md:flex justify-between items-end gap-5">
                <Form.Item
                  label="Tujuan Penggunaan 1"
                  required
                  name={"tujuan_penggunaan1"}
                  className="w-full md:flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Mohon isi field ini!",
                    },
                  ]}
                >
                  <Input.TextArea required />
                </Form.Item>
                <Form.Item
                  label="Tujuan Penggunaan 2"
                  name={"tujuan_penggunaan2"}
                  className="w-full md:flex-1"
                >
                  <Input.TextArea />
                </Form.Item>
              </div>

              {/* Pembiayaan */}
              <InputPembiayaan
                nama={nama ? nama : ""}
                nopen={nopen ? nopen : ""}
                alamat={alamat ? alamat : ""}
                refferal={refferalOpt ? refferalOpt : []}
                setBankOpt={setBankOption}
                selected={setSelectedBank}
                setPembiayaan={setPembiayaan}
                setJenisMargin={setJenisMargin}
              />
              {/* End Pembiayaan */}

              <div className="w-full py-3 px-2 bg-orange-500 text-gray-100 mb-2 font-semibold">
                Unit Pelayanan
              </div>
              <Divider className="divider-input">Data Area</Divider>
              <div className="block md:flex gap-5 justify-between items-end">
                <Form.Item
                  label="Unit Pelayanan"
                  name={"unit_pelayanan"}
                  required
                  rules={[{ required: true, message: "Mohon isi field ini!" }]}
                  className="w-full md:flex-1"
                >
                  <Select
                    showSearch
                    options={upOpt}
                    onChange={(e) => {
                      const cabang = fullCabang?.filter((ca) => ca.name == e);
                      console.log(e);
                      form.setFieldsValue({
                        area_pelayanan: cabang && cabang[0].unit,
                      });
                    }}
                    filterOption={filterOption}
                  />
                </Form.Item>
                <Form.Item
                  label="Area Pelayanan"
                  name={"area_pelayanan"}
                  required
                  className="w-full md:flex-1"
                >
                  <Input disabled />
                </Form.Item>
              </div>
              <Divider className="divider-input">Data AO</Divider>
              <div className="block md:flex gap-5 justify-between items-end">
                <Form.Item
                  required
                  label="Nama Marketing"
                  name={"user_id"}
                  className="w-full md:flex-1"
                  rules={[{ required: true, message: "Mohon isi field ini!" }]}
                >
                  <Select
                    showSearch
                    options={fullUser.map((e) => {
                      return {
                        label: `${e.first_name} ${e.last_name} (${e.UnitCabang.name})`,
                        value: e.id,
                      };
                    })}
                    onChange={(e) => handleChangeUser(e)}
                    filterOption={filterOption}
                  />
                </Form.Item>
                <Form.Item
                  label="Posisi"
                  name={"posisi"}
                  className="w-full md:flex-1"
                >
                  <Input disabled />
                </Form.Item>
              </div>
              <div className="block md:flex justify-between gap-5 items-end">
                <Form.Item
                  label="Status PKWT"
                  name={"status_pkwt"}
                  className="flex-1"
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Agent Fronting"
                  name={"agent_fronting"}
                  className="flex-1"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="w-full py-3 px-2 bg-orange-500 text-gray-100 mb-2 font-semibold">
                Upload Dokumen Pesyaratan
              </div>

              {/* Dokument */}
              <UploadDoc setBerkas={setBerkas} />
              {/* End Dokumen */}
              <Form.Item className="block md:flex justify-end">
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-gray-100 rounded shadow px-10 py-1 mr-5"
                  type="submit"
                  style={{ opacity: isDisable || loading ? 0.5 : 1 }}
                  disabled={isDisable ? isDisable : loading}
                >
                  {loading ? <LoadingOutlined /> : "Submit"}
                </button>
              </Form.Item>
            </div>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}
