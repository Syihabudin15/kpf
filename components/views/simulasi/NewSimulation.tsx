"use client";
import { formatNumber } from "@/components/utils/inputUtils";
import { DataBankWithProduk } from "@/components/utils/Interfaces";
import {
  EyeFilled,
  InfoCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { JenisPembiayaan } from "@prisma/client";
import { Form, Input, Select } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export default function NewSimulation() {
  const [form] = Form.useForm();
  const [hideBank, setHideBank] = useState(false);
  const [dataBank, setDataBank] = useState<DataBankWithProduk[]>([]);
  const [dataJenis, setDataJenis] = useState<JenisPembiayaan[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e: any, path?: string, value?: string) => {
    if (path && value) {
      form.setFieldValue(path, value);
    }
  };

  return (
    <div className="rounded border shadow bg-white" id="new-simulation">
      <div className="bg-orange-500 p-2 rounded">
        <h1 className="text-1xl font-semibold text-gray-100">
          SIMULASI DEVIASI
        </h1>
        <p className="text-gray-200 text-xs">Analisa Perhitungan</p>
      </div>
      <Form
        layout="vertical"
        className="my-2 md:flex gap-3"
        form={form}
        onChange={(e) => handleChange(form.getFieldsValue())}
      >
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
              <Input type="date" placeholder="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              name={"usia_masuk"}
              className="flex-1"
              children={
                <div className="flex gap-3">
                  <Form.Item label="Tahun" name={"tahun"} className="flex-1">
                    <Input
                      disabled
                      style={{ color: "black", backgroundColor: "white" }}
                      placeholder="0"
                    />
                  </Form.Item>
                  <Form.Item label="Bulan" name={"bulan"} className="flex-1">
                    <Input
                      style={{ color: "black", backgroundColor: "white" }}
                      placeholder="0"
                    />
                  </Form.Item>
                  <Form.Item label="Hari" name={"hari"} className="flex-1">
                    <Input
                      style={{ color: "black", backgroundColor: "white" }}
                      placeholder="0"
                    />
                  </Form.Item>
                </div>
              }
            ></Form.Item>
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
                onBlur={(e) => {
                  form.setFieldValue(
                    "gaji_bersih",
                    formatNumber(e.target.value)
                  );
                  return;
                }}
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
                onChange={(e) =>
                  handleChange(form.getFieldsValue(), "jenis_pembiayaan", e)
                }
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
                showSearch
                placeholder="Pilih Produk"
                onChange={(e) =>
                  handleChange(form.getFieldsValue(), "produk_pembiayaan", e)
                }
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
          <div className="p-2 bg-orange-500 text-gray-200 rounded font-bold">
            <span>Rekomendasi Pembiayaan</span>
          </div>
          <div className="flex gap-3">
            <Form.Item label="Tenor" name={"tenor"} className="flex-1">
              <Input defaultValue={0} placeholder="0" type="number" />
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
                onBlur={(e) => {
                  form.setFieldValue("plafond", formatNumber(e.target.value));
                  return;
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
            <Form.Item label="Angsuran" name={"angsuran"} className="flex-1">
              <Input defaultValue={0} placeholder="0" />
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
            <div className="w-28 flex gap-2">
              <Form.Item name={"admin_koperasi"}>
                <Input type="number" placeholder="kpf" defaultValue={0} />
              </Form.Item>
              <Form.Item name={"admin_bank"}>
                <Input type="number" placeholder="mitra" defaultValue={0} />
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
            <div className="w-28">
              <Input type="number" placeholder="0" defaultValue={0} />
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
            <div className="w-28"></div>
            <Form.Item name={"tatalaksana"} className="flex-1">
              <Input
                placeholder="0"
                defaultValue={0}
                onBlur={(e) => {
                  form.setFieldValue(
                    "tatalaksana",
                    formatNumber(e.target.value)
                  );
                  return;
                }}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Buka Rekening</div>
            <div className="w-28"></div>
            <Form.Item name={"buka_rekening"} className="flex-1">
              <Input
                placeholder="0"
                defaultValue={0}
                onBlur={(e) => {
                  form.setFieldValue(
                    "buka_rekening",
                    formatNumber(e.target.value)
                  );
                  return;
                }}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Materai</div>
            <div className="w-28"></div>
            <Form.Item name={"materai"} className="flex-1">
              <Input
                placeholder="0"
                defaultValue={0}
                onBlur={(e) => {
                  form.setFieldValue("materai", formatNumber(e.target.value));
                  return;
                }}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Data Informasi</div>
            <div className="w-28">
              <Form.Item name={"flagging"} className="flex-1">
                <Input
                  placeholder="flagging"
                  defaultValue={0}
                  onBlur={(e) => {
                    form.setFieldValue(
                      "flagging",
                      formatNumber(e.target.value)
                    );
                    return;
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item name={"epotpen"} className="flex-1">
              <Input
                placeholder="epotpen"
                defaultValue={0}
                onBlur={(e) => {
                  form.setFieldValue("epotpen", formatNumber(e.target.value));
                  return;
                }}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Mutasi</div>
            <div className="w-28"></div>
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
            <div className="w-28"></div>
            <Form.Item name={"provisi"} className="flex-1">
              <Input
                placeholder="0"
                defaultValue={0}
                onBlur={(e) => {
                  form.setFieldValue("provisi", formatNumber(e.target.value));
                  return;
                }}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Blokir Angsuran</div>
            <div className="w-28">
              <Form.Item name={"blokir"} className="flex-1">
                <Input placeholder="0" defaultValue={0} type="number" />
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
            <div className="w-28"></div>
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
            <div className="w-28"></div>
            <Form.Item name={"bpp"} className="flex-1">
              <Input
                placeholder="0"
                defaultValue={0}
                onBlur={(e) => {
                  form.setFieldValue("bpp", formatNumber(e.target.value));
                  return;
                }}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Pelunasan</div>
            <div className="w-28"></div>
            <Form.Item name={"pelunasan"} className="flex-1">
              <Input
                placeholder="0"
                defaultValue={0}
                onBlur={(e) => {
                  form.setFieldValue("pelunasan", formatNumber(e.target.value));
                  return;
                }}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between border-b items-center pt-1 px-1 gap-2">
            <div className="font-semibold flex-1">Terima Bersih</div>
            <div className="w-28"></div>
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
            <div className="w-28"></div>
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
    </div>
  );
}

// function download() {
//   var download = document.getElementById("download");
//   var image = document.getElementById("myCanvas").toDataURL("image/png")
//       .replace("image/png", "image/octet-stream");
//   download.setAttribute("href", image);
//   //download.setAttribute("download","archive.png");
//   }

// <a id="download" download="triangle.png">
// <button type="button" onClick="download()">Download</button>
// </a>

// <canvas id="myCanvas" width="720" height="450">Your browser does not support Canvas.</canvas>
