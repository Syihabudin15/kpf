"use client";
import { notifContext } from "@/components/NotifContext";
import {
  BankOpt,
  Cabang,
  DataDataPengajuan,
  Options,
} from "@/components/utils/Interfaces";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Bank,
  BerkasPengajuan,
  DataPembiayaan,
  StatusKawin,
  User,
} from "@prisma/client";
import { Checkbox, Divider, Form, Input, Select, Spin, message } from "antd";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { filterOption } from "@/components/utils/inputUtils";
import dynamic from "next/dynamic";

const NewEditBiaya = dynamic(
  () => import("@/components/views/pengajuan/NewEditBiaya"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
// const EditBiaya = dynamic(
//   () => import("@/components/views/pengajuan/EditBiaya"),
//   {
//     ssr: false,
//     loading: () => <LoadingOutlined />,
//   }
// );
const UploadDoc = dynamic(
  () => import("@/components/views/pengajuan/UploadDoc"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function FormEditPengajuan({
  currData,
  getData,
  fullCabang,
  fullUser,
  upOpt,
  refferalOpt,
  provinsi,
  setOpen,
}: {
  currData: DataDataPengajuan;
  getData: Function;
  fullCabang: Cabang[];
  fullUser: User[];
  upOpt: BankOpt[];
  refferalOpt: Options[];
  provinsi: Options[];
  setOpen: Function;
}) {
  const [pembiayaan, setPembiayaan] = useState<DataPembiayaan>();
  const [userOpt, setUserOpt] = useState<Options[]>();
  const [berkas, setBerkas] = useState<BerkasPengajuan>();
  const [alamat, setAlamat] = useState<string>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [domisiliSama, setDomisiliSama] = useState(false);
  const [statusKawinDisable, setStatusKawinDisable] = useState(false);
  const context = useContext(notifContext);
  const [jenisMargin, setJenisMargin] = useState<string>();
  const [kabupaten, setKabupaten] = useState<Options[]>([]);
  const [kabupatenDomisili, setKabupatenDomisili] = useState<Options[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank>();
  const [lastActivity, setlastActivity] = useState<string>();

  const handleChangeUser = (e: string) => {
    const user = fullUser?.filter((u) => u.id == e);
    form.setFieldsValue({
      posisi: user && user[0].posisi,
      status_pkwt: user && user[0].status_pkwt,
    });
    setlastActivity((prev: string | undefined) => {
      if (prev && prev.includes(`Edit MOC`)) {
        return prev;
      } else {
        return `${prev ? prev + " " : ""} Edit MOC,`;
      }
    });
  };

  const handleStatusKawin = (e: StatusKawin) => {
    if (e !== "KAWIN") {
      setStatusKawinDisable(true);
    } else {
      setStatusKawinDisable(false);
    }
    setlastActivity((prev: string | undefined) => {
      if (prev && prev.includes(`Edit Status Perkawinan`)) {
        return prev;
      } else {
        return `${prev ? prev + " " : ""} Edit Status Perkawinan,`;
      }
    });
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

      setlastActivity((prev: string | undefined) => {
        if (prev && prev.includes(`Edit Provinsi Domisili`)) {
          return prev;
        } else {
          return `${prev ? prev + " " : ""} Edit Provinsi Domisili,`;
        }
      });
    } else {
      setKabupaten(resultMap);

      setlastActivity((prev: string | undefined) => {
        if (prev && prev.includes(`Edit Provinsi KTP`)) {
          return prev;
        } else {
          return `${prev ? prev + " " : ""} Edit Provinsi KTP,`;
        }
      });
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
    setBerkas((prev: any) => {
      return { ...prev, id: currData.berkasPengajuanId };
    });
    setPembiayaan((prev: any) => {
      return { ...prev, id: currData.data_pembiayaan_id };
    });
    e.Domisili = {
      id: currData.DataPengajuanAlamat.id,
      alamat_domisili: domisiliSama ? e.alamat : e.alamat_domisili,
      rt_domisili: domisiliSama ? e.rt : e.rt_domisili,
      rw_domisili: domisiliSama ? e.rw : e.rw_domisili,
      kelurahan_domisili: domisiliSama ? e.kelurahan : e.kelurahan_domisili,
      kecamatan_domisili: domisiliSama ? e.kecamatan : e.kecamatan_domisili,
      kota_domisili: domisiliSama ? e.kota : e.kota_domisili,
      provinsi_domisili: domisiliSama
        ? findProvince[0]
          ? findProvince[0].label
          : currData.DataPengajuanAlamat.provinsi
        : findProvinceDomisili[0]
        ? findProvinceDomisili[0].label
        : currData.DataPengajuanAlamat.provinsi_domisili,
      kode_pos_domisili: domisiliSama ? e.kode_pos : e.kode_pos_domisili,
      geo_location: e.geo_location,
      alamat: alamat || null,
      rt: e.rt || null,
      rw: e.rw || null,
      kelurahan: e.kelurahan || null,
      kecamatan: e.kecamatan || null,
      kota: e.kota || null,
      provinsi: findProvince[0]
        ? findProvince[0].label
        : currData.DataPengajuanAlamat.provinsi,
      kode_pos: e.kode_pos || null,
    };
    e.DataKeluarga = {
      id: currData.dataPengajuanKeluargaId,
      nama_pasangan: e.nama_pasangan || null,
      tempat_lahir_pasangan: e.tempat_lahir_pasangan || null,
      tanggal_lahir_pasangan: e.tanggal_lahir_pasangan || null,
      nik_pasangan: e.nik_pasangan || null,
      masa_ktp_pasangan: e.masa_ktp_pasangan || null,
      pekerjaan_pasangan: e.pekerjaan_pasangan || null,
      nama_keluarga_tidak_serumah: e.keluarga_tidak_serumah || null,
      hubungan: e.hubungan_keluarga || null,
      no_telepon_keluarga: e.no_telepon_keluarga || null,
      alamat_keluarga: e.alamat_keluarga || null,
    };
    e.BerkasPengajuan = berkas;
    e.menempati_tahun = e.menempati_tahun;
    e.masa_kerja = parseInt(e.masa_kerja) || 0;
    e.tanggal_lahir = pembiayaan.tanggal_lahir;
    e.nopen = currData.DataPembiayaan.nopen;
    e.no_rek = pembiayaan.no_rekening || null;
    e.bankId = selectedBank ? selectedBank.id : currData.bankId;
    e.jenis_margin = jenisMargin;
    pembiayaan.name = e.nama;
    e.area_pelayanan_berkas = e.unit_pelayanan;
    e.DataPembiayaan = { ...pembiayaan, user_update: lastActivity };

    const res = await fetch("/api/slik", {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ ...e, id: currData.id }),
    });
    if (res.ok) {
      message.success("Edit Data Pengajuan berhasil");
      setOpen(false);
      await getData();
      await context.getNotifFunction();
      setLoading(false);
    } else {
      message.error("Gagal Update data pengajuan. coba lagi nanti!");
    }
  };

  useEffect(() => {
    setAlamat(currData.DataPembiayaan.alamat);
    if (currData.status_kawin === "KAWIN") {
      setStatusKawinDisable(false);
    } else {
      setStatusKawinDisable(true);
    }
    setAlamat(currData.DataPembiayaan.alamat);

    const filte = fullCabang.filter(
      (e) => e.unit === currData.area_pelayanan_berkas
    );
    form.setFieldsValue({
      nama: currData.DataPembiayaan.name,
      nopen: currData.DataPembiayaan.nopen,
      golongan: currData.golongan,
      nama_skep: currData.nama_skep,
      kode_jiwa: currData.kode_jiwa,
      nomor_sk_pensiun: currData.nomor_sk_pensiun,
      alamat: currData.DataPembiayaan.alamat,
      rt: currData.DataPengajuanAlamat.rt,
      rw: currData.DataPengajuanAlamat.rw,
      kelurahan: currData.DataPengajuanAlamat.kelurahan,
      kecamatan: currData.DataPengajuanAlamat.kecamatan,
      kota: currData.DataPengajuanAlamat.kota,
      provinsi: currData.DataPengajuanAlamat.provinsi,
      kode_pos: currData.DataPengajuanAlamat.kode_pos,
      alamat_domisili: currData.DataPengajuanAlamat.alamat_domisili,
      rt_domisili: currData.DataPengajuanAlamat.rt_domisili,
      rw_domisili: currData.DataPengajuanAlamat.rw_domisili,
      kelurahan_domisili: currData.DataPengajuanAlamat.kelurahan_domisili,
      kecamatan_domisili: currData.DataPengajuanAlamat.kecamatan_domisili,
      kota_domisili: currData.DataPengajuanAlamat.kota_domisili,
      provinsi_domisili: currData.DataPengajuanAlamat.provinsi_domisili,
      kode_pos_domisili: currData.DataPengajuanAlamat.kode_pos_domisili,
      geo_location:
        currData.DataPengajuanAlamat.geo_location || currData.geo_location,
      no_telepon: currData.no_telepon,
      nik: currData.nik,
      npwp: currData.npwp,
      pendidikan: currData.pendidikan,
      jenis_kelamin: currData.jenis_kelamin,
      agama: currData.agama,
      masa_kerja: currData.masa_kerja || 0,
      status_rumah: currData.status_rumah,
      menempati_tahun: currData.menempati_tahun,
      nama_ibu_kandung: currData.nama_ibu_kandung,
      pekerjaan_sekarang: currData.pekerjaan_sekarang,
      alamat_pekerjaan: currData.alamat_pekerjaan,
      jenis_usaha: currData.jenis_usaha,
      status_kawin: currData.status_kawin,
      nama_pasangan: currData.DataPengajuanPasangan.nama_pasangan,
      tempat_lahir_pasangan:
        currData.DataPengajuanPasangan.tempat_lahir_pasangan || "-",
      nik_pasangan: currData.DataPengajuanPasangan.nik_pasangan,
      pekerjaan_pasangan: currData.DataPengajuanPasangan.pekerjaan_pasangan,
      no_sk_pensiun: currData.nomor_sk_pensiun,
      penerbit_sk: currData.penerbit_sk,
      jenis_pensiun: currData.jenis_pensiun,
      tanggal_lahir_pasangan:
        currData.status_kawin === "KAWIN" &&
        moment(currData.DataPengajuanPasangan.tanggal_lahir_pasangan).format(
          "YYYY-MM-DD"
        ),
      masa_ktp_pasangan:
        currData.status_kawin === "KAWIN" &&
        moment(currData.DataPengajuanPasangan.masa_ktp_pasangan).format(
          "YYYY-MM-DD"
        ),
      keluarga_tidak_serumah:
        currData.DataPengajuanPasangan.nama_keluarga_tidak_serumah,
      hubungan_keluarga: currData.DataPengajuanPasangan.hubungan,
      no_telepon_keluarga: currData.DataPengajuanPasangan.no_telepon_keluarga,
      alamat_keluarga: currData.DataPengajuanPasangan.alamat_keluarga,
      tanggal_sk_pensiun: moment(currData.tanggal_sk_pensiun).format(
        "YYYY-MM-DD"
      ),
      tmt_pensiun: moment(currData.tmt_pensiun).format("YYYY-MM-DD"),
      tujuan_penggunaan1: currData.tujuan_penggunaan1,
      tujuan_penggunaan2: currData.tujuan_penggunaan2,
      area_pelayanan:
        filte.length > 0
          ? filte[0].unit
          : currData.User.UnitCabang.UnitPelayanan.name,
      posisi: currData.User.posisi,
      status_pkwt: currData.User.status_pkwt,
      agent_fronting: currData.agent_fronting,
      masa_ktp: moment(currData.masa_ktp).format("YYYY-MM-DD"),
      unit_pelayanan: currData.area_pelayanan_berkas,
      jenis_asuransi: currData.jenis_asuransi,
    });
  }, [currData]);

  return (
    <div>
      <Spin spinning={loading}>
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <div
            style={{
              height: "70vh",
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
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Kelompok Pensiun"
                name={"jenis_pensiun"}
                required
                className="flex-1"
              >
                <Input
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Kelompok Pensiun`)) {
                        return prev;
                      } else {
                        return `${
                          prev ? prev + " " : ""
                        } Edit Kelompok Pensiun,`;
                      }
                    })
                  }
                />
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
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev && prev.includes(`Edit Nama KTP`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Nama KTP,`;
                      }
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Nama SKEP"
                name={"nama_skep"}
                required
                className="flex-1"
              >
                <Input
                  required
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Nama SKEP`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Nama SKEP,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>
            <Form.Item
              label="Kode Jiwa"
              name={"kode_jiwa"}
              required
              className="flex-1"
            >
              <Input
                required
                onChange={() =>
                  setlastActivity((prev: string | undefined) => {
                    if (prev && prev.includes(`Edit Kode Jiwa`)) {
                      return prev;
                    } else {
                      return `${prev ? prev + " " : ""} Edit Kode Jiwa,`;
                    }
                  })
                }
              />
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
                  onChange={(e) => {
                    setAlamat(e.target.value);
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Alamat`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Alamat,`;
                      }
                    });
                  }}
                />
              </Form.Item>
              <div className="block md:flex-1 md:flex gap-5">
                <Form.Item label="RT" name={"rt"} required className="flex-1">
                  <Input
                    required
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit RT KTP`)) {
                          return prev;
                        } else {
                          return `${prev ? prev + " " : ""} Edit RT KTP,`;
                        }
                      })
                    }
                  />
                </Form.Item>
                <Form.Item label="RW" name={"rw"} required className="flex-1">
                  <Input
                    required
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit RW KTP`)) {
                          return prev;
                        } else {
                          return `${prev ? prev + " " : ""} Edit RW KTP,`;
                        }
                      })
                    }
                  />
                </Form.Item>
              </div>
            </div>
            <div className="block md:flex justify-between gap-5">
              <Form.Item
                label="Provinsi"
                name={"provinsi"}
                required
                className="flex-1"
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
              >
                <Select
                  options={kabupaten}
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Kota KTP`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Kota KTP,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>
            <div className="block">
              <div className="block md:flex gap-5">
                <Form.Item
                  label="Kecamatan"
                  name={"kecamatan"}
                  required
                  className="flex-1"
                >
                  <Input
                    required
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit Kecamatan KTP`)) {
                          return prev;
                        } else {
                          return `${
                            prev ? prev + " " : ""
                          } Edit Kecamatan KTP,`;
                        }
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Kelurahan"
                  name={"kelurahan"}
                  required
                  className="flex-1"
                >
                  <Input
                    required
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit Kelurahan KTP`)) {
                          return prev;
                        } else {
                          return `${
                            prev ? prev + " " : ""
                          } Edit Kelurahan KTP,`;
                        }
                      })
                    }
                  />
                </Form.Item>
              </div>
              <Form.Item
                label="Kode Pos"
                name={"kode_pos"}
                required
                className="flex-1"
              >
                <Input
                  required
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Kodepos KTP`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Kodepos KTP,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>
            <Divider className="divider-input">Alamat Sesuai Domisili</Divider>
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
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Alamat Domisili`)) {
                        return prev;
                      } else {
                        return `${
                          prev ? prev + " " : ""
                        } Edit Alamat Domisili,`;
                      }
                    })
                  }
                />
              </Form.Item>
              <div className="block md:flex-1 md:flex gap-5">
                <Form.Item
                  label="RT"
                  name={"rt_domisili"}
                  required
                  hidden={domisiliSama}
                  className="flex-1"
                >
                  <Input
                    required
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit RT Domisili`)) {
                          return prev;
                        } else {
                          return `${prev ? prev + " " : ""} Edit RT Domisili,`;
                        }
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="RW"
                  name={"rw_domisili"}
                  required
                  hidden={domisiliSama}
                  className="flex-1"
                >
                  <Input
                    required
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit RW Domisili`)) {
                          return prev;
                        } else {
                          return `${prev ? prev + " " : ""} Edit RW Domisili,`;
                        }
                      })
                    }
                  />
                </Form.Item>
              </div>
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
                  options={provinsi}
                  showSearch
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
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Kota Domisili`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Kota Domisili,`;
                      }
                    })
                  }
                />
              </Form.Item>
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
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Kecamatan Domisili`)) {
                        return prev;
                      } else {
                        return `${
                          prev ? prev + " " : ""
                        } Edit Kecamatan Domisili,`;
                      }
                    })
                  }
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
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Kecamatan Domisili`)) {
                        return prev;
                      } else {
                        return `${
                          prev ? prev + " " : ""
                        } Edit Kecamatan Domisili,`;
                      }
                    })
                  }
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
              >
                <Input
                  required
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Kodepos Domisili`)) {
                        return prev;
                      } else {
                        return `${
                          prev ? prev + " " : ""
                        } Edit Kodepos Domisili,`;
                      }
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Geo Location"
                name={"geo_location"}
                required
                className="flex-1"
              >
                <Input
                  required
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Geo Location`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Geo Location,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>
            <div className="block md:flex justify-between gap-5">
              <Form.Item
                label="No Telepon"
                name={"no_telepon"}
                required
                className="flex-1"
              >
                <Input
                  required
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit No Telepon`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit No Telepon,`;
                      }
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="NIK" name={"nik"} required className="flex-1">
                <Input
                  required
                  onChange={(e) => {
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit NIK`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit NIK,`;
                      }
                    });
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item
              label="NPWP Pemohon"
              name={"npwp"}
              required
              className="flex-1"
            >
              <Input
                required
                onChange={() =>
                  setlastActivity((prev: string | undefined) => {
                    if (prev && prev.includes(`Edit NPWP`)) {
                      return prev;
                    } else {
                      return `${prev ? prev + " " : ""} Edit NPWP,`;
                    }
                  })
                }
              />
            </Form.Item>
            <div className="block md:flex gap-5 justify-between">
              <div className="block md:flex-1 md:flex gap-5 items-end">
                <Form.Item
                  label="Masa Berlaku KTP"
                  name={"masa_ktp"}
                  required
                  className="flex-1"
                >
                  <Input
                    type="date"
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit Masa KTP`)) {
                          return prev;
                        } else {
                          return `${prev ? prev + " " : ""} Edit Masa KTP,`;
                        }
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Gelar Pendidikan"
                  name={"pendidikan"}
                  required
                  style={{ flex: 1 }}
                >
                  <Select
                    aria-required
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
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit Pendidikan`)) {
                          return prev;
                        } else {
                          return `${prev ? prev + " " : ""} Edit Pendidikan,`;
                        }
                      })
                    }
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
              >
                <Select
                  aria-required
                  placeholder={"-- choose --"}
                  options={[
                    { label: "LAKI-LAKI", value: "LAKI_LAKI" },
                    { label: "PEREMPUAN", value: "PEREMPUAN" },
                  ]}
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Jenis Kelamin`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Jenis Kelamin,`;
                      }
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Agama"
                name={"agama"}
                required
                className="flex-1"
              >
                <Select
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
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Agama`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Agama,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>
            <Divider className="divider-input">Pekerjaan</Divider>
            <Form.Item
              // style={{ width: 220, flex: 1 }}
              label="Status Kepemilikan Rumah"
              name={"status_rumah"}
              required
              className="w-full md:flex-1"
            >
              <Select
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
                onChange={() =>
                  setlastActivity((prev: string | undefined) => {
                    if (prev && prev.includes(`Edit Pekerjaan`)) {
                      return prev;
                    } else {
                      return `${prev ? prev + " " : ""} Edit Pekerjaan,`;
                    }
                  })
                }
              />
            </Form.Item>
            <div className="block md:flex justify-between gap-5 items-end">
              <div className="block md:flex-1 md:flex gap-5 items-end">
                <Form.Item
                  label="Mulai Menempati Pada"
                  name={"menempati_tahun"}
                  required
                  className="flex-1"
                >
                  <Input
                    prefix="Tahun"
                    required
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (
                          prev &&
                          prev.includes(`Edit Tahun Menempati Rumah`)
                        ) {
                          return prev;
                        } else {
                          return `${
                            prev ? prev + " " : ""
                          } Edit Tahun Menempati Rumah,`;
                        }
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Masa Kerja"
                  name={"masa_kerja"}
                  required
                  className="flex-1"
                >
                  <Input
                    suffix="Tahun"
                    required
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit Masa Kerja`)) {
                          return prev;
                        } else {
                          return `${prev ? prev + " " : ""} Edit Masa Kerja,`;
                        }
                      })
                    }
                  />
                </Form.Item>
              </div>
            </div>
            <div className="block md:flex gap-5 justify-between items-end">
              <Form.Item
                label="Pekerjaan Saat Ini"
                name={"pekerjaan_sekarang"}
                className="flex-1"
              >
                <Input
                  required
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Pekerjaan`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Pekerjaan,`;
                      }
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Alamat Pekerjaan"
                name={"alamat_pekerjaan"}
                className="w-full md:flex-1"
              >
                <Input.TextArea
                  required
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Alamat Pekerjaan`)) {
                        return prev;
                      } else {
                        return `${
                          prev ? prev + " " : ""
                        } Edit Alamat Pekerjaan,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>
            <div className="block md:flex gap-5 items-end">
              <Form.Item
                label="Nama Ibu Kandung"
                name={"nama_ibu_kandung"}
                required
                className="flex-1"
              >
                <Input
                  required
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Ibu Kandung`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Ibu Kandung,`;
                      }
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Jenis Usaha"
                name={"jenis_usaha"}
                className="flex-1"
              >
                <Select
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
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Jenis Usaha`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Jenis Usaha,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>

            <div className="w-full py-3 px-2 bg-orange-500 text-gray-100 mt-2 mb-2 font-semibold">
              Data Keluarga
            </div>
            <Form.Item
              label="Status Perkawinan"
              name={"status_kawin"}
              required
              className="w-full md:flex-1"
            >
              <Select
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
            <div className="block md:flex gap-5 justify-between items-end">
              <div className="block md:flex md:flex-1 gap-5 items-end">
                <Form.Item
                  label="Nama Pasangan"
                  name={"nama_pasangan"}
                  className="flex-1"
                  required={!statusKawinDisable}
                >
                  <Input
                    disabled={statusKawinDisable}
                    required={!statusKawinDisable}
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit Nama Pasangan`)) {
                          return prev;
                        } else {
                          return `${
                            prev ? prev + " " : ""
                          } Edit Nama Pasangan,`;
                        }
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  className="flex-1"
                  label="Tempat Lahir Pasangan"
                  name={"tempat_lahir_pasangan"}
                  required={!statusKawinDisable}
                >
                  <Input
                    disabled={statusKawinDisable}
                    required={!statusKawinDisable}
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (
                          prev &&
                          prev.includes(`Edit Tempat Lahir Pasangan`)
                        ) {
                          return prev;
                        } else {
                          return `${
                            prev ? prev + " " : ""
                          } Edit Tempat Lahir Pasangan,`;
                        }
                      })
                    }
                  />
                </Form.Item>
              </div>
            </div>
            <Form.Item
              label="No NIK Pasangan"
              name={"nik_pasangan"}
              className="w-full md:flex-1"
              required={!statusKawinDisable}
            >
              <Input
                disabled={statusKawinDisable}
                required={!statusKawinDisable}
                onChange={() =>
                  setlastActivity((prev: string | undefined) => {
                    if (prev && prev.includes(`Edit NIK Pasangan`)) {
                      return prev;
                    } else {
                      return `${prev ? prev + " " : ""} Edit NIK Pasangan,`;
                    }
                  })
                }
              />
            </Form.Item>
            <div className="block md:flex gap-5 justify-between items-end">
              <div className="flex-1 md:flex gap-5 items-end">
                <Form.Item
                  label="Tanggal Lahir Pasangan"
                  name={"tanggal_lahir_pasangan"}
                  className="flex-1"
                  required={!statusKawinDisable}
                >
                  <Input
                    type="date"
                    disabled={statusKawinDisable}
                    required={!statusKawinDisable}
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (
                          prev &&
                          prev.includes(`Edit Tanggal Lahir Pasangan`)
                        ) {
                          return prev;
                        } else {
                          return `${
                            prev ? prev + " " : ""
                          } Edit Tanggal Lahir Pasangan,`;
                        }
                      })
                    }
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
                    disabled={statusKawinDisable}
                    required={!statusKawinDisable}
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit Masa KTP Pasangan`)) {
                          return prev;
                        } else {
                          return `${
                            prev ? prev + " " : ""
                          } Edit Masa KTP Pasangan,`;
                        }
                      })
                    }
                  />
                </Form.Item>
              </div>
            </div>
            <Form.Item
              label="Pekerjaan Saat Ini"
              name={"pekerjaan_pasangan"}
              required={!statusKawinDisable}
              className="flex-1"
            >
              <Input
                disabled={statusKawinDisable}
                required={!statusKawinDisable}
                onChange={() =>
                  setlastActivity((prev: string | undefined) => {
                    if (prev && prev.includes(`Edit Pekerjaan Pasangan`)) {
                      return prev;
                    } else {
                      return `${
                        prev ? prev + " " : ""
                      } Edit Pekerjaan Pasangan,`;
                    }
                  })
                }
              />
            </Form.Item>
            <div className="block md:flex gap-5 justify-between items-end">
              <div className="flex-1 block md:flex gap-5 items-end">
                <Form.Item
                  label="Nama Keluarga Tidak Serumah"
                  name={"keluarga_tidak_serumah"}
                  className="flex-1"
                >
                  <Input
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit Nama Keluarga`)) {
                          return prev;
                        } else {
                          return `${
                            prev ? prev + " " : ""
                          } Edit Nama Keluarga,`;
                        }
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Hubungan Keluarga"
                  name={"hubungan_keluarga"}
                  className="flex-1"
                >
                  <Input
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit Hubungan Keluarga`)) {
                          return prev;
                        } else {
                          return `${
                            prev ? prev + " " : ""
                          } Edit Hubungan Keluarga,`;
                        }
                      })
                    }
                  />
                </Form.Item>
              </div>
            </div>
            <div className="block md:flex justify-between items-end gap-5">
              <Form.Item
                label="No Telepon Keluarga"
                name={"no_telepon_keluarga"}
                className="flex-1"
              >
                <Input
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit No Telepon Keluarga`)) {
                        return prev;
                      } else {
                        return `${
                          prev ? prev + " " : ""
                        } Edit No Telepon Keluarga,`;
                      }
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                className="flex-1"
                label="Alamat"
                name={"alamat_keluarga"}
              >
                <Input.TextArea
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Alamat Keluarga`)) {
                        return prev;
                      } else {
                        return `${
                          prev ? prev + " " : ""
                        } Edit Alamat Keluarga,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>
            <div className="w-full py-3 px-2 bg-orange-500 text-gray-100 mb-2 font-semibold">
              Data Jaminan
            </div>
            <Form.Item
              label="Nomor SK Pensiun"
              name={"nomor_sk_pensiun"}
              required
              className="flex-1"
            >
              <Input
                required
                onChange={() =>
                  setlastActivity((prev: string | undefined) => {
                    if (prev && prev.includes(`Edit Nomor SKEP`)) {
                      return prev;
                    } else {
                      return `${prev ? prev + " " : ""} Edit Nomor SKEP,`;
                    }
                  })
                }
              />
            </Form.Item>
            <div className="block md:flex gap-5 justify-between items-end">
              <div className="flex-1 md:flex gap-5">
                <Form.Item
                  label="Tanggal SK Pensiun"
                  name={"tanggal_sk_pensiun"}
                  required
                  className="flex-1"
                >
                  <Input
                    type="date"
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit Tanggal SKEP`)) {
                          return prev;
                        } else {
                          return `${prev ? prev + " " : ""} Edit Tanggal SKEP,`;
                        }
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="TMT Pensiun"
                  name={"tmt_pensiun"}
                  required
                  className="flex-1"
                >
                  <Input
                    type="date"
                    onChange={() =>
                      setlastActivity((prev: string | undefined) => {
                        if (prev && prev.includes(`Edit TMT Pensiun`)) {
                          return prev;
                        } else {
                          return `${prev ? prev + " " : ""} Edit TMT Pensiun,`;
                        }
                      })
                    }
                  />
                </Form.Item>
              </div>
            </div>
            <div className="block md:flex gap-5 justify-between items-end">
              <Form.Item
                label="Penerbit SK Pensiun"
                name={"penerbit_sk"}
                required
                className="flex-1"
              >
                <Input
                  required
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Penerbit SKEP`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Penerbit SKEP,`;
                      }
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Pangkat / Golongan"
                name={"golongan"}
                required
                className="flex-1"
              >
                <Input
                  required
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Pangkat Pensiun`)) {
                        return prev;
                      } else {
                        return `${
                          prev ? prev + " " : ""
                        } Edit Pangkat Pensiun,`;
                      }
                    })
                  }
                />
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
              >
                <Input.TextArea
                  required
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Tujuan Penggunaan 1`)) {
                        return prev;
                      } else {
                        return `${
                          prev ? prev + " " : ""
                        } Edit Tujuan Penggunaan 1,`;
                      }
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Tujuan Penggunaan 2"
                name={"tujuan_penggunaan2"}
                className="w-full md:flex-1"
              >
                <Input.TextArea
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Tujuan Penggunaan 2`)) {
                        return prev;
                      } else {
                        return `${
                          prev ? prev + " " : ""
                        } Edit Tujuan Penggunaan 2,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>
            <div className="block md:flex justify-between items-end gap-5">
              <Form.Item
                label="Jenis Asuransi"
                required
                name={"jenis_asuransi"}
                className="w-full md:flex-1"
              >
                <Select
                  showSearch
                  options={[
                    { label: "CIU Insurance", value: "CIU" },
                    { label: "Berdikari", value: "BERDIKARI" },
                  ]}
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Jenis Asuransi`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Jenis Asuransi,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>

            {/* Pembiayaan */}
            <NewEditBiaya
              currData={currData}
              refferal={refferalOpt}
              setPembiayaan={setPembiayaan}
              setJenisMargin={setJenisMargin}
              setSelectedBank={setSelectedBank}
              setLastActivity={setlastActivity}
            />
            {/* <EditBiaya
              currData={currData}
              refferal={refferalOpt}
              setPembiayaan={setPembiayaan}
              setJenisMargin={setJenisMargin}
            /> */}
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
                className="w-full md:flex-1"
              >
                <Select
                  options={upOpt}
                  onChange={(e) => {
                    const cabang = fullCabang?.filter((ca) => ca.name == e);
                    form.setFieldsValue({
                      area_pelayanan: cabang && cabang[0].unit,
                    });
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Unit Pelayanan`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Unit Pelayanan,`;
                      }
                    });
                  }}
                  defaultValue={currData.User.UnitCabang.name}
                  showSearch
                  filterOption={filterOption}
                />
              </Form.Item>
              <Form.Item
                label="Area Pelayanan"
                name={"area_pelayanan"}
                required
                className="w-full md:flex-1"
              >
                <Input
                  disabled
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Area Pelayanan`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Area Pelayanan,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>
            <Divider className="divider-input">Data AO</Divider>
            <div className="block md:flex gap-5 justify-between items-end">
              <Form.Item
                required
                label="Nama Marketing"
                name={"user_id"}
                className="w-full md:flex-1"
              >
                <Select
                  options={userOpt}
                  onChange={(e) => handleChangeUser(e)}
                  defaultValue={
                    currData.User.first_name + " " + currData.User.last_name
                  }
                  showSearch
                  filterOption={filterOption}
                />
              </Form.Item>
              <Form.Item
                label="Posisi"
                name={"posisi"}
                className="w-full md:flex-1"
              >
                <Input
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Posisi AO`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Posisi AO,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>
            <div className="block md:flex justify-between gap-5 items-end">
              <Form.Item
                label="Status PKWT"
                name={"status_pkwt"}
                className="flex-1"
              >
                <Input
                  disabled
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Status PKWT AO`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Status PKWT AO,`;
                      }
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Agent Fronting"
                name={"agent_fronting"}
                className="flex-1"
              >
                <Input
                  onChange={() =>
                    setlastActivity((prev: string | undefined) => {
                      if (prev && prev.includes(`Edit Agent Fronting`)) {
                        return prev;
                      } else {
                        return `${prev ? prev + " " : ""} Edit Agent Fronting,`;
                      }
                    })
                  }
                />
              </Form.Item>
            </div>
            <div className="w-full py-3 px-2 bg-orange-500 text-gray-100 mb-2 font-semibold">
              Upload Dokumen Pesyaratan
            </div>

            {/* Dokument */}
            <UploadDoc
              setBerkas={setBerkas}
              currData={currData.BerkasPengajuan}
              setLastActivity={setlastActivity}
            />
            {/* End Dokumen */}
          </div>
          <Form.Item className="block md:flex justify-end">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-gray-100 rounded shadow px-5 py-1 mr-5"
              type="submit"
              disabled={loading}
            >
              Sumbit {loading && <LoadingOutlined />}
            </button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
}
