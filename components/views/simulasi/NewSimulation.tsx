"use client";
import {
  formatNumber,
  inputTextToDecimal,
  newGetUsiaMasuk,
} from "@/components/utils/inputUtils";
import {
  DataBankWithProduk,
  ITempBank,
  ITempProduk,
} from "@/components/utils/Interfaces";
import {
  EyeFilled,
  InfoCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { JenisPembiayaan } from "@prisma/client";
import { Form, Input, Modal, Select } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export default function NewSimulation() {
  const [hideBank, setHideBank] = useState(false);
  const [dataBank, setDataBank] = useState<DataBankWithProduk[]>([]);
  const [dataJenis, setDataJenis] = useState<JenisPembiayaan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [open, setOpen] = useState(false);
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
    is_syariah: false,
    is_flash: false,
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
    gaji_bersih: 0,
    tenor: 0,
    plafond: 0,
  });
  const [form] = Form.useForm();
  const formWatch = Form.useWatch([], form);

  const getData = async () => {
    setLoading(true);
    const resJenis = await fetch("/api/master/pembiayaan");
    const { result } = await resJenis.json();
    setDataJenis(result);

    const resBank = await fetch("/api/master/bank");
    const bank = await resBank.json();
    setDataBank(bank.result);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  useEffect(() => {
    if (!formWatch.tanggal_lahir) {
      return setIsDisable(true);
    }
    setIsDisable(false);

    // let administrasi =
    //   inputTextToDecimal(form.getFieldValue("plafond") || "0") *
    //   ((bank.by_admin + (bank.by_admin_bank || 0)) / 100);
    // let asuransi =
    //   inputTextToDecimal(form.getFieldValue("plafond") || "0") *
    //   (prduk.by_asuransi / 100);
    // let tatalaksanaExpres = bank.by_tatalaksana;
    // let tatalaksanaReguller =
    //   inputTextToDecimal(form.getFieldValue("plafond") || "0") * (3 / 100);
    // let provisi = 0;
    // if ((bank.by_provisi || 0) > 100) {
    //   provisi = bank.by_provisi || 0;
    // } else {
    //   provisi =
    //     inputTextToDecimal(form.getFieldValue("plafond") || "0") *
    //     ((bank.by_provisi || 0) / 100);
    // }

    // form.setFieldsValue({
    //   tahun,
    //   bulan,
    //   hari,
    //   gaji_bersih: formatNumber(formWatch.gaji_bersih || "0"),
    //   sumber_dana: bank.name,
    //   admin_bank: bank.by_admin_bank,
    //   admin_koperasi: bank.by_admin,
    //   administrasi: formatNumber(administrasi.toFixed(0)),
    //   input_asuransi: prduk.by_asuransi,
    //   asuransi: formatNumber(asuransi.toFixed(0)),
    //   tatalaksana:
    //     prduk.name === "Flash Sisa Gaji"
    //       ? formatNumber(tatalaksanaExpres.toFixed(0))
    //       : formatNumber(tatalaksanaReguller.toFixed(0)),
    //   buka_rekening: formatNumber(bank.by_buka_rekening.toFixed(0)),
    //   materai: formatNumber(bank.by_materai.toFixed(0)),
    //   flagging: formatNumber(bank.by_flagging.toFixed(0)),
    //   epotpen: formatNumber(bank.by_epotpen.toFixed(0)),
    //   provisi: formatNumber(provisi.toFixed(0)),
    // });
  }, [formWatch]);

  return (
    <div className="rounded border shadow bg-white" id="new-simulation">
      <div className="bg-orange-500 p-2 rounded">
        <h1 className="text-1xl font-semibold text-gray-100">
          SIMULASI DEVIASI
        </h1>
        <p className="text-gray-200 text-xs">Analisa Perhitungan</p>
      </div>
      <Form layout="vertical" className="my-2 md:flex gap-3" form={form}>
        <div className="flex-1 p-1">
          <Form.Item label="Tanggal Simulasi" name={"tanggal_simulasi"}>
            <Input
              value={moment().format("DD-MM-YYYY")}
              defaultValue={moment().format("YYYY-MM-DD")}
              disabled
              style={{ backgroundColor: "white", color: "black" }}
            />
            <div className="text-red-600 italic text-xs">
              <InfoCircleFilled /> Tanggal simulasi jangan dirubah!
            </div>
          </Form.Item>
          <div className="flex gap-3">
            <Form.Item label="Nopen" name={"nopen"} className="flex-1">
              <Input />
            </Form.Item>
            <Form.Item label="Nama Lengkap" name={"nama"} className="flex-1">
              <Input />
            </Form.Item>
          </div>
          <Form.Item label="Alamat" name={"alamat"}>
            <Input.TextArea></Input.TextArea>
          </Form.Item>
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
                  form.setFieldsValue({ tahun, bulan, hari });
                  setProdukSesuai(
                    tempProduk.filter((e, i, o) => o.indexOf(e) === i)
                  );
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
                  setPrduk((prev) => {
                    const temp = formatNumber(e.target.value);
                    const result = inputTextToDecimal(temp);
                    return {
                      ...prev,
                      gaji_bersih: result,
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
                  dataBank.forEach((b) => {
                    const tempProduk = b.products.filter((p) => p.id === e);
                    if (tempProduk.length !== 0) {
                      setPrduk((prev) => {
                        return {
                          ...prev,
                          id: tempProduk[0].id,
                          name: tempProduk[0].name,
                          by_asuransi: tempProduk[0].by_asuransi,
                          mg_bunga: tempProduk[0].mg_bunga,
                          min_age: tempProduk[0].min_age,
                          max_age: tempProduk[0].max_age,
                          max_usia_lunas: tempProduk[0].max_usia_lunas,
                          max_tenor: tempProduk[0].max_tenor,
                          max_plafon: tempProduk[0].max_plafon,
                        };
                      });
                      if (b.id === tempProduk[0].bank_id) {
                        setBank((prev) => {
                          return {
                            ...prev,
                            id: b.id,
                            name: b.name,
                            kode: b.kode || "BPR",
                            by_admin: b.by_admin,
                            by_admin_bank: b.by_admin_bank || 0,
                            by_lainnya: b.by_lainnya || 0,
                            by_tatalaksana: b.by_tatalaksana,
                            by_materai: b.by_materai,
                            by_buka_rekening: b.by_buka_rekening,
                            by_angsuran: b.by_angsuran,
                            by_flagging: b.by_flagging,
                            by_epotpen: b.by_epotpen,
                            by_provisi: b.by_provisi || 0,
                            margin_bank: b.margin_bank || 0,
                            is_syariah: false,
                            is_flash: false,
                            pembulatan: 0,
                          };
                        });
                      }
                    }
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              label="Sumber Dana"
              name={"sumber_dana"}
              className="flex-1"
              hidden={hideBank}
            >
              <Input
                suffix={<EyeFilled onClick={() => setHideBank(true)} />}
                disabled
                style={{ backgroundColor: "white", color: "black" }}
                placeholder="Nama Bank"
              />
            </Form.Item>
          </div>
          {produkSesuai && produkSesuai.length !== 0 && (
            <div className="italic, text-blue-500 text-xs">
              Tersedia : {produkSesuai && produkSesuai.join(", ")}
            </div>
          )}
          <div className="p-2 bg-orange-500 text-gray-200 rounded font-bold">
            <span>Rekomendasi Pembiayaan</span>
          </div>
          <div className="flex gap-3">
            <Form.Item label="Tenor" name={"tenor"} className="flex-1">
              <Input
                defaultValue={0}
                placeholder="0"
                type="number"
                disabled={isDisable}
              />
            </Form.Item>
            <Form.Item label="Max Tenor" name={"max_tenor"} className="flex-1">
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
                onChange={(e) =>
                  setPrduk((prev) => {
                    const temp = formatNumber(e.target.value);
                    const result = inputTextToDecimal(temp);
                    return {
                      ...prev,
                      gaji_bersih: result,
                    };
                  })
                }
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
            <Form.Item label="Angsuran" name={"angsuran"} className="flex-1">
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
            <div className="w-36 flex gap-2">
              <Form.Item name={"admin_koperasi"}>
                <Input
                  type="number"
                  placeholder="kpf"
                  defaultValue={0}
                  disabled={isDisable}
                  suffix={"%"}
                />
              </Form.Item>
              <Form.Item name={"admin_bank"}>
                <Input
                  type="number"
                  placeholder="mitra"
                  defaultValue={0}
                  disabled={isDisable}
                  suffix={"%"}
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
            <div className="w-36 ">
              <Form.Item name={"input_asuransi"}>
                <Input
                  type="number"
                  placeholder="0"
                  defaultValue={0}
                  disabled={isDisable}
                  suffix={"%"}
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
            <div className="w-36 "></div>
            <Form.Item name={"tatalaksana"} className="flex-1">
              <Input placeholder="0" defaultValue={0} disabled={isDisable} />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">{labelTabungan}</div>
            <div className="w-36 "></div>
            <Form.Item name={"buka_rekening"} className="flex-1">
              <Input placeholder="0" defaultValue={0} disabled={isDisable} />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Materai</div>
            <div className="w-36 "></div>
            <Form.Item name={"materai"} className="flex-1">
              <Input placeholder="0" defaultValue={0} disabled={isDisable} />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Data Informasi</div>
            <div className="w-36 ">
              <Form.Item name={"flagging"} className="flex-1">
                <Input
                  placeholder="flagging"
                  defaultValue={0}
                  disabled={isDisable}
                />
              </Form.Item>
            </div>
            <Form.Item name={"epotpen"} className="flex-1">
              <Input
                placeholder="epotpen"
                defaultValue={0}
                disabled={isDisable}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Mutasi</div>
            <div className="w-36 "></div>
            <Form.Item name={"mutasi"} className="flex-1">
              <Input
                placeholder="0"
                defaultValue={0}
                disabled
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Provisi</div>
            <div className="w-36 "></div>
            <Form.Item name={"provisi"} className="flex-1">
              <Input placeholder="0" defaultValue={0} disabled={isDisable} />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Blokir Angsuran</div>
            <div className="w-36 ">
              <Form.Item name={"blokir"} className="flex-1">
                <Input
                  placeholder="0"
                  defaultValue={0}
                  type="number"
                  disabled={isDisable}
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
            <div className="w-36 "></div>
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
            <div className="w-36 "></div>
            <Form.Item name={"bpp"} className="flex-1">
              <Input placeholder="0" defaultValue={0} disabled={isDisable} />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Pelunasan</div>
            <div className="w-36 "></div>
            <Form.Item name={"pelunasan"} className="flex-1">
              <Input placeholder="0" defaultValue={0} disabled={isDisable} />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Terima Bersih</div>
            <div className="w-36 "></div>
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
            <div className="w-36 "></div>
            <Form.Item name={"sisa_gaji"} className="flex-1">
              <Input
                placeholder="0"
                defaultValue={0}
                disabled
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between items-center pt-1 px-1 gap-2">
            <button
              type="button"
              className="py-2 px-3 text-xs bg-red-500 hover:bg-red-600 text-white rounded shadow"
              onClick={() => form.resetFields()}
            >
              {loading ? <LoadingOutlined /> : "Hitung Ulang"}
            </button>
            <button
              type="submit"
              className="py-2 px-3 text-xs bg-green-500 hover:bg-green-600 text-white rounded shadow"
            >
              {loading ? <LoadingOutlined /> : "Cek Simulasi"}
            </button>
          </div>
        </div>
      </Form>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={[]}
        title={<div>Analisa Perhitungan</div>}
      >
        Analisa Perhitungan
      </Modal>
    </div>
  );
}
