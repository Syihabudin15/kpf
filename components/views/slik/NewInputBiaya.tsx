"use client";
import {
  formatNumber,
  inputTextToDecimal,
  newGetUsiaMasuk,
} from "@/components/utils/inputUtils";
import {
  DataBankWithProduk,
  IDapem,
  IDapemSlik,
  ITempBank,
  ITempProduk,
} from "@/components/utils/Interfaces";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import {
  BulbFilled,
  EyeFilled,
  InfoCircleFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { JenisPembiayaan } from "@prisma/client";
import { Form, Input, Modal, Select, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";
const { PV } = require("@formulajs/formulajs");

export default function NewInputBiaya() {
  const [hideBank, setHideBank] = useState(false);
  const [dataBank, setDataBank] = useState<DataBankWithProduk[]>([]);
  const [dataJenis, setDataJenis] = useState<JenisPembiayaan[]>([]);
  const [isDisable, setIsDisable] = useState(false);
  const [produkSesuai, setProdukSesuai] = useState<string[]>();
  const [labelTabungan, setLabelTabungan] = useState("Buka Rekening");
  const [bank, setBank] = useState<ITempBank>({
    id: "",
    name: "",
    kode: "",
    by_admin: 0,
    by_admin_bank: 0,
    by_lainnya: 0,
    by_tatalaksana: 0,
    by_materai: 0,
    by_buka_rekening: 0,
    by_angsuran: 95,
    by_flagging: 0,
    by_epotpen: 0,
    by_provisi: 0,
    margin_bank: 0,
    pembulatan: 0,
  });
  const [prduk, setPrduk] = useState<ITempProduk>({
    id: "",
    name: "",
    by_asuransi: 0,
    mg_bunga: 0,
    min_age: 0,
    max_age: 0,
    max_usia_lunas: 0,
    max_tenor: 0,
    max_plafon: 0,
  });
  const [jenis, setJenis] = useState<JenisPembiayaan>({
    id: "",
    name: "",
    by_mutasi: 0,
    is_active: true,
    created_at: new Date(),
  });
  const [dapem, setDapem] = useState<IDapemSlik>({
    tanggal_simulasi: new Date(),
    nama_pemohon: "",
    nopen: "",
    alamat: "",
    tanggal_lahir: null,
    tahun: 0,
    bulan: 0,
    hari: 0,
    gaji_bersih: 0,
    tenor: 0,
    plafond: 0,
    angsuran: 0,
    provisi: 0,
    blokir: 0,
    terima_kotor: 0,
    bpp: 0,
    pelunasan: 0,
    terima_bersih: 0,
    sisa_gaji: 0,
    is_flash: false,
    juru_bayar_asal: null,
    juru_bayar_tujuan: null,
    pembiayaan_sebelumnya: null,
    nama_bank: null,
    no_rekening: null,
    tempat_lahir: "",
  });

  const [form] = Form.useForm();
  const formWatch = Form.useWatch([], form);
  const [currProvisi, setCurrProvisi] = useState<number>();
  const [showMessage, setShowMessage] = useState(false);
  const [openInput, setOpenInput] = useState(false);

  useEffect(() => {
    (async () => {
      setIsDisable(true);
      const resJenis = await fetch("/api/master/pembiayaan");
      const { result } = await resJenis.json();
      setDataJenis(result);

      const resBank = await fetch("/api/master/bank");
      const bank = await resBank.json();
      setDataBank(bank.result);
    })();
  }, []);

  useEffect(() => {
    if (!dapem.tanggal_lahir) return setIsDisable(true);
    setIsDisable(false);
    setShowMessage(false);
    const maxTenor = parseInt(form.getFieldValue("max_tenor") || "0");
    const maxPlafond = inputTextToDecimal(
      form.getFieldValue("max_plafond") || "0"
    );
    if (
      (maxTenor !== 0 && dapem.tenor > maxTenor) ||
      (maxPlafond !== 0 && dapem.plafond > maxPlafond)
    ) {
      setShowMessage(true);
      return;
    }
    let tmp = prduk.max_usia_lunas - dapem.tahun;
    const max_tenor =
      dapem.tahun <= prduk.max_usia_lunas ? tmp * 12 - (dapem.bulan + 1) : 0;
    let maxPlaf =
      PV(
        prduk.mg_bunga / 100 / 12,
        dapem.tenor,
        dapem.gaji_bersih * (bank.by_angsuran / 100),
        0,
        0
      ) * -1;

    const angsuran = ceiling(
      parseInt(getAngsuranPerBulan(prduk.mg_bunga, dapem.tenor, dapem.plafond)),
      bank.pembulatan
    );
    const admin =
      dapem.plafond *
      ((bank.by_admin + bank.by_admin_bank + bank.by_lainnya) / 100);
    const asuransi = dapem.plafond * (prduk.by_asuransi / 100);
    const tatalaksana =
      prduk.name !== "Flash Sisa Gaji"
        ? bank.by_tatalaksana
        : bank.by_tatalaksana > 100
        ? bank.by_tatalaksana
        : dapem.plafond * (3 / 100);

    const tempProvisi =
      bank.by_provisi > 10
        ? bank.by_provisi
        : dapem.plafond * (bank.by_provisi / 100);

    const provisi = currProvisi ? currProvisi : tempProvisi;

    const jumlahBlokir = angsuran * dapem.blokir;

    const terimaKotor =
      dapem.plafond -
      (admin +
        asuransi +
        tatalaksana +
        bank.by_buka_rekening +
        bank.by_materai +
        bank.by_flagging +
        bank.by_epotpen +
        jenis.by_mutasi +
        provisi +
        jumlahBlokir);
    const terimaBersih = terimaKotor - (dapem.bpp + dapem.pelunasan);

    form.setFieldsValue({
      tahun: dapem.tahun,
      bulan: dapem.bulan,
      hari: dapem.hari,
      gaji_bersih: formatNumber(dapem.gaji_bersih.toFixed(0)),
      sumber_dana: prduk.mg_bunga,
      tenor: dapem.tenor,
      max_tenor: max_tenor > prduk.max_tenor ? prduk.max_tenor : max_tenor,
      plafond:
        dapem.plafond > maxPlaf ? "0" : formatNumber(dapem.plafond.toFixed(0)),
      max_plafond:
        maxPlaf > prduk.max_plafon
          ? formatNumber(prduk.max_plafon.toFixed(0))
          : formatNumber(maxPlaf.toFixed(0)),
      angsuran: formatNumber(angsuran.toString()),
      max_angsuran: formatNumber(
        (dapem.gaji_bersih * (bank.by_angsuran / 100)).toFixed(0)
      ),
      admin_bank: bank.by_admin_bank,
      admin_koperasi: bank.by_admin,
      administrasi: formatNumber(admin.toFixed(0)),
      input_asuransi: prduk.by_asuransi,
      asuransi: formatNumber(asuransi.toFixed(0)),
      tatalaksana: formatNumber(tatalaksana.toString()),
      buka_rekening: formatNumber(bank.by_buka_rekening.toFixed(0)),
      materai: formatNumber(bank.by_materai.toFixed(0)),
      epotpen: formatNumber(bank.by_epotpen.toFixed(0)),
      flagging: formatNumber(bank.by_flagging.toFixed(0)),
      mutasi: formatNumber(jenis.by_mutasi.toFixed(0)),
      provisi: formatNumber(provisi.toFixed(0)),
      blokir: dapem.blokir,
      jumlah_blokir: formatNumber(jumlahBlokir.toFixed(0)),
      kotor: formatNumber(terimaKotor.toFixed(0)),
      bpp: formatNumber(dapem.bpp.toFixed(0)),
      pelunasan: formatNumber(dapem.pelunasan.toFixed(0)),
      bersih: formatNumber(terimaBersih.toFixed(0)),
      sisa_gaji: formatNumber((dapem.gaji_bersih - angsuran).toFixed(0)),
    });
  }, [prduk, jenis, bank, dapem, formWatch, currProvisi]);

  return (
    <div>
      <button
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 text-center rounded shadow text-xs"
        onClick={() => setOpenInput(true)}
      >
        Input <PlusCircleOutlined />
      </button>
      <Modal
        open={openInput}
        onCancel={() => setOpenInput(false)}
        title="INPUT PENGAJUAN"
        footer={[]}
        width={"90vw"}
      >
        <div id="new-simulation">
          <Form layout="vertical" className="my-2 md:flex gap-3" form={form}>
            <div className="flex-1 p-1">
              <div className="flex gap-3">
                <Form.Item label="Nopen" name={"nopen"} className="flex-1">
                  <Input
                    onChange={(e) =>
                      setDapem((prev) => {
                        return { ...prev, nopen: e.target.value };
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Nama Lengkap"
                  name={"nama"}
                  className="flex-1"
                >
                  <Input
                    onChange={(e) =>
                      setDapem((prev) => {
                        return { ...prev, nama_pemohon: e.target.value };
                      })
                    }
                  />
                </Form.Item>
              </div>

              <Form.Item label="Alamat" name={"alamat"}>
                <Input.TextArea
                  onChange={(e) =>
                    setDapem((prev) => {
                      return { ...prev, alamat: e.target.value };
                    })
                  }
                ></Input.TextArea>
              </Form.Item>
              <div className="flex gap-3">
                <Form.Item
                  label="Juru Bayar Asal"
                  name={"juru_bayar_asal"}
                  className="flex-1"
                >
                  <Input
                    onChange={(e) =>
                      setDapem((prev) => {
                        return { ...prev, nopen: e.target.value };
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Nama Lengkap"
                  name={"nama"}
                  className="flex-1"
                >
                  <Input
                    onChange={(e) =>
                      setDapem((prev) => {
                        return { ...prev, nama_pemohon: e.target.value };
                      })
                    }
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between gap-3">
                <Form.Item
                  label="Tanggal Lahir"
                  name={"tanggal_lahir"}
                  className="flex-1"
                >
                  <Input
                    type="date"
                    placeholder="DD-MM-YYYY"
                    onChange={(e) => {
                      const { tahun, bulan, hari } = newGetUsiaMasuk(
                        new Date(e.target.value),
                        new Date()
                      );
                      let tempProduk: string[] = [];
                      dataBank.forEach((b) => {
                        b.products.forEach((p) => {
                          if (
                            p.min_age <= parseInt(tahun) &&
                            p.max_age >= parseInt(tahun)
                          ) {
                            tempProduk.push(p.name);
                          }
                        });
                      });
                      setDapem((prev) => {
                        return {
                          ...prev,
                          tanggal_lahir: new Date(e.target.value),
                          tahun: parseInt(tahun),
                          bulan: parseInt(bulan),
                          hari: parseInt(hari),
                        };
                      });
                      setProdukSesuai(tempProduk);
                    }}
                  />
                </Form.Item>
                <div className="flex-1">
                  <p className="pb-1">Usia Saat ini</p>
                  <div className="flex gap-2">
                    <Form.Item name={"tahun"} className="flex-1">
                      <Input
                        placeholder="0"
                        disabled
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    </Form.Item>
                    <Form.Item name={"bulan"} className="flex-1">
                      <Input
                        placeholder="0"
                        disabled
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    </Form.Item>
                    <Form.Item name={"hari"} className="flex-1">
                      <Input
                        placeholder="0"
                        disabled
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Form.Item
                  label="Gaji Bersih"
                  name={"gaji_bersih"}
                  className="flex-1"
                >
                  <Input
                    defaultValue={0}
                    placeholder="0"
                    disabled={isDisable}
                    onChange={(e) =>
                      setDapem((prev) => {
                        return {
                          ...prev,
                          gaji_bersih: inputTextToDecimal(
                            e.target.value || "0"
                          ),
                        };
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Jenis Pembiayaan"
                  name={"jenis_pembiayaan"}
                  className="flex-1"
                >
                  <Select
                    options={dataJenis.map((e) => {
                      return { label: e.name, value: e.id };
                    })}
                    showSearch
                    placeholder="Pilih Jenis"
                    disabled={isDisable}
                    onChange={(e) => {
                      const tempJenis = dataJenis.filter((j) => j.id === e);
                      if (tempJenis.length === 0)
                        return Modal.error({
                          title: (
                            <span className="text-red-500 italic font-bold">
                              Jenis pembiayaan tidak ditemukan!
                            </span>
                          ),
                          footer: [],
                          closable: true,
                          content: (
                            <div>
                              <p>
                                Mohon maaf jenis pembiayaan tidak ditemukan,
                                mohon pilih ulang!
                              </p>
                            </div>
                          ),
                        });
                      setJenis({
                        id: tempJenis[0].id,
                        name: tempJenis[0].name,
                        by_mutasi: tempJenis[0].by_mutasi,
                        is_active: true,
                        created_at: new Date(),
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="flex gap-3">
                <Form.Item
                  label="Produk Pembiayaan"
                  name={"produk_pembiayaan"}
                  className="flex-1"
                >
                  <Select
                    options={dataBank.map((e) => {
                      return {
                        label: e.name,
                        value: e.id,
                        options: e.products.map((p) => {
                          return {
                            label: (
                              <div className="flex justify-between">
                                <span>{p.name}</span>
                                <span className="text-xs italic opacity-50">
                                  ({e.kode})
                                </span>
                              </div>
                            ),
                            value: p.id,
                          };
                        }),
                      };
                    })}
                    disabled={isDisable}
                    showSearch
                    placeholder="Pilih Produk"
                    onChange={(e) => {
                      for (let i = 0; i < dataBank.length; i++) {
                        for (let j = 0; j < dataBank[i].products.length; j++) {
                          const temp = dataBank[i].products.filter(
                            (p) => p.id === e
                          );
                          if (temp.length !== 0) {
                            if (
                              produkSesuai &&
                              !produkSesuai.includes(temp[0].name)
                            ) {
                              return Modal.error({
                                title: (
                                  <span className="text-red-500 italic font-bold">
                                    Produk yang dipilih tidak sesuai!
                                  </span>
                                ),
                                closable: true,
                                footer: [],
                                content: (
                                  <div>
                                    <p>
                                      Mohon maaf produk yang dipilih tidak
                                      sesuai dengan kriteria umur pemohon. Mohon
                                      pilih produk lain yang sesuai dengan
                                      kriteria pemohon.!
                                    </p>
                                  </div>
                                ),
                              });
                            }
                            setPrduk((prev) => {
                              return {
                                ...prev,
                                id: temp[0].id,
                                name: temp[0].name,
                                by_asuransi: temp[0].by_asuransi,
                                mg_bunga: temp[0].mg_bunga,
                                min_age: temp[0].min_age,
                                max_age: temp[0].max_age,
                                max_usia_lunas: temp[0].max_usia_lunas,
                                max_tenor: temp[0].max_tenor,
                                max_plafon: temp[0].max_plafon,
                              };
                            });
                            setBank((prev) => {
                              return {
                                ...prev,
                                id: dataBank[i].id,
                                name: dataBank[i].name,
                                kode: dataBank[i].kode || "",
                                by_admin: dataBank[i].by_admin || 0,
                                by_admin_bank: dataBank[i].by_admin_bank || 0,
                                by_lainnya: dataBank[i].by_lainnya || 0,
                                by_tatalaksana: dataBank[i].by_tatalaksana || 0,
                                by_materai: dataBank[i].by_materai || 0,
                                by_buka_rekening:
                                  dataBank[i].by_buka_rekening || 0,
                                by_angsuran: dataBank[i].by_angsuran || 0,
                                by_flagging: dataBank[i].by_flagging || 0,
                                by_epotpen: dataBank[i].by_epotpen || 0,
                                by_provisi: dataBank[i].by_provisi || 0,
                                margin_bank: dataBank[i].margin_bank || 0,
                                pembulatan: dataBank[i].pembulatan || 0,
                              };
                            });
                            if (temp[0].name === "Flash Sisa Gaji") {
                              setLabelTabungan("Tabungan Anggota");
                            }
                          }
                        }
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <Tooltip title={bank.name}>
                      Margin/Tahun {bank.kode}
                    </Tooltip>
                  }
                  name={"sumber_dana"}
                  className="flex-1"
                  hidden={hideBank}
                >
                  <Input
                    suffix={<EyeFilled onClick={() => setHideBank(true)} />}
                    disabled={isDisable}
                    type="number"
                    onChange={(e) =>
                      setPrduk((prev) => {
                        return {
                          ...prev,
                          mg_bunga: parseInt(e.target.value) || 0,
                        };
                      })
                    }
                    placeholder="Bunga tahunan"
                  />
                </Form.Item>
              </div>
              {produkSesuai && produkSesuai.length !== 0 && (
                <div className="italic, text-blue-500 text-xs">
                  Tersedia :{" "}
                  {produkSesuai &&
                    produkSesuai
                      .filter((e, i, o) => o.indexOf(e) === i)
                      .join(", ")}
                </div>
              )}
              <div className="p-2 bg-orange-500 text-gray-200 rounded font-bold">
                <span>Rekomendasi Pembiayaan</span>
              </div>
              {showMessage && (
                <div className="text-xs italic text-red-500">
                  <span>
                    <BulbFilled />
                    Tenor atau Plafond yang diinput tidak bisa melebihi maksimal
                    yang tersedia!
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <Form.Item label="Tenor" name={"tenor"} className="flex-1">
                  <Input
                    defaultValue={0}
                    placeholder="0"
                    type="number"
                    disabled={isDisable}
                    onChange={(e) => {
                      if (prduk.max_tenor < parseInt(e.target.value)) {
                        Modal.error({
                          title: (
                            <span className="text-red-500 italic font-bold">
                              Invalid tenor!
                            </span>
                          ),
                          closable: true,
                          footer: [],
                          content: (
                            <div>
                              <p>
                                Mohon maaf tenor yang diinput tidak dapat
                                melebihi maksimal tenor produk yang dipilih:{" "}
                                {prduk.max_tenor}
                              </p>
                            </div>
                          ),
                        });
                      }
                      setDapem((prev) => {
                        return {
                          ...prev,
                          tenor: parseInt(e.target.value || "0"),
                        };
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Max Tenor"
                  name={"max_tenor"}
                  className="flex-1"
                >
                  <Input
                    style={{ color: "black", backgroundColor: "white" }}
                    disabled
                    defaultValue={0}
                    placeholder="0"
                  />
                </Form.Item>
              </div>
              <div className="flex gap-3">
                <Form.Item label="Plafond" name={"plafond"} className="flex-1">
                  <Input
                    defaultValue={0}
                    placeholder="0"
                    disabled={isDisable}
                    onChange={(e) => {
                      if (
                        prduk.max_plafon <
                        inputTextToDecimal(e.target.value || "0")
                      ) {
                        Modal.error({
                          title: (
                            <span className="text-red-500 italic font-bold">
                              Invalid Plafond!
                            </span>
                          ),
                          closable: true,
                          footer: [],
                          content: (
                            <div>
                              <p>
                                Mohon maaf plafond yang diinput tidak dapat
                                melebihi maksimal plafond produk yang dipilih:{" "}
                                {formatNumber(prduk.max_plafon.toFixed(0))}
                              </p>
                            </div>
                          ),
                        });
                      }
                      setDapem((prev) => {
                        return {
                          ...prev,
                          plafond: inputTextToDecimal(e.target.value),
                        };
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Max Plafond"
                  name={"max_plafond"}
                  className="flex-1"
                >
                  <Input
                    disabled
                    defaultValue={0}
                    placeholder="0"
                    style={{ color: "black", backgroundColor: "white" }}
                  />
                </Form.Item>
              </div>
              <div className="flex gap-3">
                <Form.Item
                  label="Angsuran"
                  name={"angsuran"}
                  className="flex-1"
                >
                  <Input
                    defaultValue={0}
                    placeholder="0"
                    disabled
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
                <Form.Item
                  label="Max Angsuran"
                  name={"max_angsuran"}
                  className="flex-1"
                >
                  <Input
                    disabled
                    defaultValue={0}
                    placeholder="0"
                    style={{ color: "black", backgroundColor: "white" }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="flex-1 border rounded">
              <div className="flex justify-between p-2 bg-orange-500 text-gray-200 rounded font-bold">
                <span>Keterangan Biaya</span>
                <span>Nominal (Rp)</span>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">Administrasi</div>
                <div className="w-40 flex gap-2">
                  <Form.Item name={"admin_koperasi"}>
                    <Input
                      type="number"
                      placeholder="kpf"
                      defaultValue={0}
                      disabled={isDisable}
                      suffix={"%"}
                      onChange={(e) => {
                        setBank((prev) => {
                          return {
                            ...prev,
                            by_admin: parseFloat(e.target.value),
                          };
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item name={"admin_bank"}>
                    <Input
                      type="number"
                      placeholder="mitra"
                      defaultValue={0}
                      disabled={isDisable}
                      suffix={"%"}
                      onChange={(e) => {
                        setBank((prev) => {
                          return {
                            ...prev,
                            by_admin_bank: parseFloat(e.target.value),
                          };
                        });
                      }}
                    />
                  </Form.Item>
                </div>
                <Form.Item name={"administrasi"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    disabled
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">Asuransi</div>
                <div className="w-40">
                  <Form.Item name={"input_asuransi"}>
                    <Input
                      type="number"
                      placeholder="0"
                      defaultValue={0}
                      disabled={isDisable}
                      suffix={"%"}
                      onChange={(e) => {
                        setPrduk((prev) => {
                          return {
                            ...prev,
                            by_asuransi: parseFloat(e.target.value),
                          };
                        });
                      }}
                    />
                  </Form.Item>
                </div>
                <Form.Item name={"asuransi"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    disabled
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">Tatalaksana</div>
                <div className="w-40"></div>
                <Form.Item name={"tatalaksana"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    disabled={isDisable}
                    onChange={(e) => {
                      setBank((prev) => {
                        return {
                          ...prev,
                          by_tatalaksana: inputTextToDecimal(
                            e.target.value || "0"
                          ),
                        };
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">{labelTabungan}</div>
                <div className="w-40"></div>
                <Form.Item name={"buka_rekening"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    disabled={isDisable}
                    onChange={(e) => {
                      setBank((prev) => {
                        return {
                          ...prev,
                          by_buka_rekening: inputTextToDecimal(
                            e.target.value || "0"
                          ),
                        };
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">Materai</div>
                <div className="w-40"></div>
                <Form.Item name={"materai"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    disabled={isDisable}
                    onChange={(e) => {
                      setBank((prev) => {
                        return {
                          ...prev,
                          by_materai: inputTextToDecimal(e.target.value || "0"),
                        };
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">Data Informasi</div>
                <div className="w-40">
                  <Form.Item name={"flagging"} className="flex-1">
                    <Input
                      placeholder="flagging"
                      defaultValue={0}
                      disabled={isDisable}
                      onChange={(e) => {
                        setBank((prev) => {
                          return {
                            ...prev,
                            by_flagging: inputTextToDecimal(
                              e.target.value || "0"
                            ),
                          };
                        });
                      }}
                    />
                  </Form.Item>
                </div>
                <Form.Item name={"epotpen"} className="flex-1">
                  <Input
                    placeholder="epotpen"
                    defaultValue={0}
                    disabled={isDisable}
                    onChange={(e) => {
                      setBank((prev) => {
                        return {
                          ...prev,
                          by_epotpen: inputTextToDecimal(e.target.value || "0"),
                        };
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">Mutasi</div>
                <div className="w-40"></div>
                <Form.Item name={"mutasi"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    style={{ backgroundColor: "white", color: "black" }}
                    onChange={(e) => {
                      setJenis((prev) => {
                        return {
                          ...prev,
                          by_mutasi: inputTextToDecimal(e.target.value),
                        };
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">Provisi</div>
                <div className="w-40"></div>
                <Form.Item name={"provisi"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    disabled={isDisable}
                    onChange={(e) =>
                      setCurrProvisi(inputTextToDecimal(e.target.value))
                    }
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">Blokir Angsuran</div>
                <div className="w-40">
                  <Form.Item name={"blokir"} className="flex-1">
                    <Input
                      placeholder="0"
                      defaultValue={0}
                      type="number"
                      disabled={isDisable}
                      onChange={(e) => {
                        setDapem((prev) => {
                          return {
                            ...prev,
                            blokir: parseInt(e.target.value || "0"),
                          };
                        });
                      }}
                    />
                  </Form.Item>
                </div>
                <Form.Item name={"jumlah_blokir"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    disabled
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">Terima Kotor</div>
                <div className="w-40"></div>
                <Form.Item name={"kotor"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    disabled
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">BPP</div>
                <div className="w-40"></div>
                <Form.Item name={"bpp"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    disabled={isDisable}
                    onChange={(e) => {
                      setDapem((prev) => {
                        return {
                          ...prev,
                          bpp: inputTextToDecimal(e.target.value || "0"),
                        };
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">Pelunasan</div>
                <div className="w-40"></div>
                <Form.Item name={"pelunasan"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    disabled={isDisable}
                    onChange={(e) => {
                      setDapem((prev) => {
                        return {
                          ...prev,
                          pelunasan: inputTextToDecimal(e.target.value || "0"),
                        };
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">Terima Bersih</div>
                <div className="w-40"></div>
                <Form.Item name={"bersih"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    disabled
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
                <div className="font-semibold flex-1">Sisa Gaji</div>
                <div className="w-40"></div>
                <Form.Item name={"sisa_gaji"} className="flex-1">
                  <Input
                    placeholder="0"
                    defaultValue={0}
                    disabled
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
