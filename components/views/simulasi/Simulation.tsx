"use client";
import {
  formatNumber,
  inputTextToDecimal,
  newGetUsiaMasuk,
} from "@/components/utils/inputUtils";
import {
  DataBankWithProduk,
  IDapem,
  ITempBank,
  ITempProduk,
} from "@/components/utils/Interfaces";
import { JenisPembiayaan } from "@prisma/client";
import { Input, Modal, Select, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
const { PV } = require("@formulajs/formulajs");

export default function Simulation() {
  const [dataBank, setDataBank] = useState<DataBankWithProduk[]>([]);
  const [dataJenis, setDataJenis] = useState<JenisPembiayaan[]>([]);
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
    pembulatan: 0,
  });
  const [produk, setProduk] = useState<ITempProduk>({
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
  const [dapem, setDapem] = useState<IDapem>({
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
    tanggal_lunas: "",
    usia_lunas: "",
    curr_max_tenor: 0,
    curr_max_plafond: 0,
    biaya_biaya: 0,
  });

  const [currProvisi, setCurrProvisi] = useState<number>();
  const [currTatalaksana, setCurrTatalaksana] = useState<number>();
  const [tgl, setTgl] = useState("");
  const [modalErr, setModalErr] = useState("");

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

  const resetData = () => {
    setBank({
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
    setProduk({
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
    setJenis({
      id: "",
      name: "",
      by_mutasi: 0,
      is_active: true,
      created_at: new Date(),
    });
    setDapem((prev) => {
      return {
        ...prev,
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
        tanggal_lunas: "",
        usia_lunas: "",
        curr_max_tenor: 0,
        curr_max_plafond: 0,
        biaya_biaya: 0,
      };
    });
    setCurrProvisi(undefined);
    setCurrTatalaksana(undefined);
    setTgl("");
  };

  useEffect(() => {
    if (!dapem.tanggal_lahir) return;
    let tmp = produk.max_usia_lunas - dapem.tahun;
    const max_tenor =
      dapem.tahun <= produk.max_usia_lunas ? tmp * 12 - (dapem.bulan + 1) : 0;
    let max_plafond =
      PV(
        produk.mg_bunga / 100 / 12,
        dapem.tenor,
        dapem.gaji_bersih * (bank.by_angsuran / 100),
        0,
        0
      ) * -1;
    setDapem((prev) => {
      return {
        ...prev,
        curr_max_tenor:
          max_tenor > produk.max_tenor ? produk.max_tenor : max_tenor,
        curr_max_plafond:
          max_plafond > produk.max_plafon ? produk.max_plafon : max_plafond,
      };
    });
  }, [
    bank,
    produk,
    dapem,
    tgl,
    jenis,
    currProvisi,
    currTatalaksana,
    produkSesuai,
  ]);

  return (
    <div className="bg-white rounded text-sm">
      <div className="bg-orange-500 py-2 px-2 rounded text-white flex flex-col gap-0">
        <span className="font-bold">SIMULASI</span>
        <span>Analisa Perhitungan</span>
      </div>
      <div className="flex gap-3 flex-col sm:flex-row p-2">
        <div className="flex-1">
          <div className="flex flex-col gap-1 my-2">
            <span>Tanggal Simulasi</span>
            <Input
              value={moment().format("DD-MM-YYYY")}
              disabled
              style={{ color: "black", backgroundColor: "white" }}
            />
          </div>
          <div className="flex gap-3 my-2">
            <div className="flex-1 flex flex-col gap-1">
              <span>Nama Pemohon</span>
              <Input />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span>Nopen</span>
              <Input />
            </div>
          </div>
          <div className="flex flex-col gap-1 my-2">
            <span>Alamat</span>
            <Input.TextArea />
          </div>
          <div className="flex gap-3 my-2">
            <div className="flex-1 flex flex-col gap-1">
              <span>Tanggal Lahir</span>
              <Input
                value={tgl}
                onChange={(e) => {
                  var ar = e.target.value.split("");
                  const filter = ar.filter((e) => e == "-");
                  if (ar.length > 2 && filter.length == 0) {
                    ar.splice(2, 0, "-");
                  }
                  if (ar.length > 4 && filter.length == 1) {
                    ar.splice(6, 0, "-");
                  }
                  setTgl(ar.join(""));
                  if (e.target.value.length < 10) return setIsDisable(true);
                  setIsDisable(false);

                  const date = e.target.value.split("-");
                  if (
                    parseInt(date[0]) > 31 ||
                    parseInt(date[1]) > 12 ||
                    parseInt(date[2]) >= new Date().getFullYear()
                  ) {
                    return setIsDisable(true);
                  }
                  const validDate = new Date(
                    `${date[2]}/${parseInt(date[1])}/${date[0]}`
                  );
                  const { tahun, bulan, hari } = newGetUsiaMasuk(
                    validDate,
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
                      tanggal_lahir: validDate,
                      tahun: parseInt(tahun),
                      bulan: parseInt(bulan),
                      hari: parseInt(hari),
                    };
                  });
                  setProdukSesuai(tempProduk);
                }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span>Usia Masuk</span>
              <div className="flex gap-1">
                <Input
                  value={dapem.tahun}
                  disabled
                  style={{ color: "black", backgroundColor: "white" }}
                  suffix={
                    <span className="text-xs italic hidden sm:block">
                      Tahun
                    </span>
                  }
                />
                <Input
                  value={dapem.bulan}
                  disabled
                  style={{ color: "black", backgroundColor: "white" }}
                  suffix={
                    <span className="text-xs italic hidden sm:block">
                      Bulan
                    </span>
                  }
                />
                <Input
                  value={dapem.hari}
                  disabled
                  style={{ color: "black", backgroundColor: "white" }}
                  suffix={
                    <span className="text-xs italic hidden sm:block">Hari</span>
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 my-2">
            <div className="flex-1 flex flex-col gap-2">
              <span>Gaji Bersih</span>
              <Input
                value={formatNumber(dapem.gaji_bersih.toFixed(0))}
                onChange={(e) =>
                  setDapem((prev) => {
                    return {
                      ...prev,
                      gaji_bersih: inputTextToDecimal(e.target.value || "0"),
                    };
                  })
                }
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <span>Jenis Pembiayaan</span>
              <Select
                options={dataJenis.map((e) => {
                  return { label: e.name, value: e.id };
                })}
                value={jenis.id}
                showSearch
                placeholder="Pilih Jenis"
                disabled={isDisable}
                onChange={(e) => {
                  const tempJenis = dataJenis.filter((j) => j.id === e);
                  if (tempJenis.length > 0) {
                    setJenis({
                      id: tempJenis[0].id,
                      name: tempJenis[0].name,
                      by_mutasi: tempJenis[0].by_mutasi,
                      is_active: true,
                      created_at: new Date(),
                    });
                  }
                }}
              />
            </div>
          </div>
          <div className="flex gap-3 my-2">
            <div className="flex-1 flex flex-col gap-2">
              <span>Produk Pembiayaan</span>
              <Select
                options={dataBank.map((e) => {
                  return {
                    label: e.name,
                    value: e.id,
                    options: e.products.map((p) => {
                      return {
                        label: (
                          <div className="flex justify-between items-center">
                            <span>{p.name}</span>
                            <span className="text-xs italic opacity-50 text-blue-500">
                              ({e.kode})
                            </span>
                          </div>
                        ),
                        value: p.id,
                      };
                    }),
                  };
                })}
                value={produk.id}
                disabled={isDisable}
                showSearch
                placeholder="Pilih Produk"
                onChange={(e) => {
                  setCurrProvisi(undefined);
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
                          resetData();
                          return setModalErr(
                            `Mohon maaf produk yang dipilih tidak sesuai dengan kriteria umur pemohon. Mohon pilih produk lain yang sesuai dengan umur pemohon: ${
                              produkSesuai &&
                              produkSesuai
                                .filter((e, i, o) => o.indexOf(e) === i)
                                .join(", ")
                            }`
                          );
                        }
                        setProduk((prev) => {
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
                            by_buka_rekening: dataBank[i].by_buka_rekening || 0,
                            by_angsuran: dataBank[i].by_angsuran || 0,
                            by_flagging: dataBank[i].by_flagging || 0,
                            by_epotpen: dataBank[i].by_epotpen || 0,
                            by_provisi: dataBank[i].by_provisi || 0,
                            margin_bank: dataBank[i].margin_bank || 0,
                            pembulatan: dataBank[i].pembulatan || 0,
                          };
                        });
                        setDapem((prev) => {
                          return {
                            ...prev,
                            curr_max_tenor: temp[0].max_tenor,
                            curr_max_plafond: temp[0].max_plafon,
                            is_flash: false,
                          };
                        });
                        if (temp[0].name === "Flash Sisa Gaji") {
                          setLabelTabungan("Tabungan Anggota");
                          setDapem((prev) => {
                            return {
                              ...prev,
                              is_flash: true,
                              curr_max_tenor: 18,
                              curr_max_plafond: 10000000,
                            };
                          });
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <span>Margin Bunga</span>
              <Input value={produk.mg_bunga} disabled={isDisable} suffix="%" />
            </div>
          </div>
          <div className="bg-orange-500 text-white p-2 rounded font-bold">
            <span>Rekomendasi Pembiayaan</span>
          </div>
          <div className="flex gap-3 my-3">
            <div className="flex-1 flex flex-col gap-2">
              <span>Tenor</span>
              <Input
                disabled={isDisable}
                type="number"
                status={dapem.tenor > dapem.curr_max_tenor ? "error" : ""}
                value={dapem.tenor || 0}
                onChange={(e) => {
                  if (parseInt(e.target.value) > dapem.curr_max_tenor) {
                    setDapem((prev) => {
                      return {
                        ...prev,
                        tenor: 0,
                      };
                    });
                    return setModalErr(
                      `Maaf tenor yang diinput tidak dapat melebihi maksimal tenor yang tersedia!`
                    );
                  }
                  setDapem((prev) => {
                    return {
                      ...prev,
                      tenor: parseInt(e.target.value),
                    };
                  });
                }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <span>Maks Tenor</span>
              <Input
                disabled
                value={dapem.curr_max_tenor}
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
          </div>
          <div className="flex gap-3 my-3">
            <div className="flex-1 flex flex-col gap-2">
              <span>Plafond</span>
              <Input
                disabled={isDisable}
                status={dapem.plafond > dapem.curr_max_plafond ? "error" : ""}
                value={formatNumber(dapem.plafond.toFixed(0))}
                onChange={(e) => {
                  if (
                    inputTextToDecimal(e.target.value) > dapem.curr_max_plafond
                  ) {
                    setDapem((prev) => {
                      return {
                        ...prev,
                        plafond: 0,
                      };
                    });
                    return setModalErr(
                      `Maaf plafond yang diinput tidak dapat melebihi maksimal plafond yang tersedia!`
                    );
                  }
                  setDapem((prev) => {
                    return {
                      ...prev,
                      plafond: inputTextToDecimal(e.target.value || "0"),
                    };
                  });
                }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <span>Maks Plafond</span>
              <Input
                disabled
                value={formatNumber(dapem.curr_max_plafond.toFixed(0))}
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
          </div>
          <div className="flex gap-3 my-3">
            <div className="flex-1 flex flex-col gap-2">
              <span>Angsuran</span>
              <Input
                disabled
                value={formatNumber(dapem.angsuran.toFixed(0))}
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <span>Maks Angsuran</span>
              <Input
                disabled
                value={formatNumber(
                  (dapem.gaji_bersih * (bank.by_angsuran / 100)).toFixed(0)
                )}
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-orange-500 text-white p-2 rounded font-bold">
            <span>Keterangan Biaya</span>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>Administrasi</span>
            </div>
            <div className="flex-1 flex gap-2">
              <Tooltip title="Admin KPF">
                <Input
                  value={bank.by_admin}
                  type="number"
                  suffix={<span className="hidden sm:block opacity-80">%</span>}
                  disabled={isDisable}
                />
              </Tooltip>
              <Tooltip title="Admin Bank">
                <Input
                  value={bank.by_admin_bank}
                  type="number"
                  suffix={<span className="hidden sm:block opacity-80">%</span>}
                  disabled={isDisable}
                />
              </Tooltip>
            </div>
            <div className="flex-1">
              <Input
                value={formatNumber(
                  (
                    dapem.plafond *
                    ((bank.by_admin + bank.by_admin_bank) / 100)
                  ).toFixed(0)
                )}
                disabled
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>Asuransi</span>
            </div>
            <div className="flex-1">
              <Input
                value={produk.by_asuransi}
                type="number"
                suffix={<span className="hidden sm:block opacity-80">%</span>}
                disabled={isDisable}
              />
            </div>
            <div className="flex-1">
              <Input
                value={formatNumber(produk.by_asuransi.toFixed(0))}
                disabled
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>Tatalaksana</span>
            </div>
            <div className="flex-1"></div>
            <div className="flex-1">
              <Input
                value={formatNumber((currTatalaksana || 0).toFixed(0))}
                disabled={isDisable}
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setCurrTatalaksana(inputTextToDecimal(e.target.value || "0"))
                }
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>{labelTabungan}</span>
            </div>
            <div className="flex-1"></div>
            <div className="flex-1">
              <Input
                value={formatNumber(bank.by_buka_rekening.toFixed(0))}
                disabled={isDisable}
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setBank((prev) => {
                    return {
                      ...prev,
                      by_buka_rekening: inputTextToDecimal(
                        e.target.value || "0"
                      ),
                    };
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>Materai</span>
            </div>
            <div className="flex-1"></div>
            <div className="flex-1">
              <Input
                value={formatNumber(bank.by_materai.toFixed(0))}
                disabled={isDisable}
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setBank((prev) => {
                    return {
                      ...prev,
                      by_materai: inputTextToDecimal(e.target.value || "0"),
                    };
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>Data Informasi</span>
            </div>
            <div className="flex-1">
              <Tooltip title="Biaya Epotpen">
                <Input
                  value={formatNumber(bank.by_epotpen.toFixed(0))}
                  disabled={isDisable}
                  style={{ color: "black", backgroundColor: "white" }}
                  onChange={(e) =>
                    setBank((prev) => {
                      return {
                        ...prev,
                        by_epotpen: inputTextToDecimal(e.target.value || "0"),
                      };
                    })
                  }
                />
              </Tooltip>
            </div>
            <div className="flex-1">
              <Tooltip title="Biaya Flagging">
                <Input
                  value={formatNumber(bank.by_flagging.toFixed(0))}
                  disabled={isDisable}
                  style={{ color: "black", backgroundColor: "white" }}
                  onChange={(e) =>
                    setBank((prev) => {
                      return {
                        ...prev,
                        by_flagging: inputTextToDecimal(e.target.value || "0"),
                      };
                    })
                  }
                />
              </Tooltip>
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>Mutasi</span>
            </div>
            <div className="flex-1"></div>
            <div className="flex-1">
              <Input
                value={formatNumber(jenis.by_mutasi.toFixed(0))}
                disabled={isDisable}
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setJenis((prev) => {
                    return {
                      ...prev,
                      by_mutasi: inputTextToDecimal(e.target.value || "0"),
                    };
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>Provisi</span>
            </div>
            <div className="flex-1"></div>
            <div className="flex-1">
              <Input
                value={formatNumber((currProvisi || 0).toFixed(0))}
                disabled={isDisable}
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setCurrProvisi(inputTextToDecimal(e.target.value || "0"))
                }
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>Blokir Angsuran</span>
            </div>
            <div className="flex-1">
              <Input
                value={formatNumber(dapem.blokir.toFixed(0))}
                disabled={isDisable}
                type="number"
                prefix="x"
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setDapem((prev) => {
                    return {
                      ...prev,
                      blokir: parseInt(e.target.value || "0"),
                    };
                  })
                }
              />
            </div>
            <div className="flex-1">
              <Input
                value={formatNumber((dapem.blokir * dapem.angsuran).toFixed(0))}
                disabled
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>Terima Kotor</span>
            </div>
            <div className="flex-1"></div>
            <div className="flex-1">
              <Input
                value={formatNumber(
                  (dapem.plafond - dapem.biaya_biaya).toFixed(0)
                )}
                disabled
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold text-red-500">
              <span>BPP</span>
            </div>
            <div className="flex-1"></div>
            <div className="flex-1">
              <Input
                value={formatNumber(dapem.bpp.toFixed(0))}
                disabled={isDisable}
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setDapem((prev) => {
                    return {
                      ...prev,
                      bpp: inputTextToDecimal(e.target.value || "0"),
                    };
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>Pelunasan</span>
            </div>
            <div className="flex-1"></div>
            <div className="flex-1">
              <Input
                value={formatNumber(dapem.pelunasan.toFixed(0))}
                disabled={isDisable}
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setDapem((prev) => {
                    return {
                      ...prev,
                      pelunasan: inputTextToDecimal(e.target.value || "0"),
                    };
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>Terima Bersih</span>
            </div>
            <div className="flex-1"></div>
            <div className="flex-1">
              <Input
                value={formatNumber(
                  (
                    dapem.plafond -
                    (dapem.biaya_biaya + dapem.bpp + dapem.pelunasan)
                  ).toFixed(0)
                )}
                disabled
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between items-center border-b border-gray-300 p-1">
            <div className="flex-1 font-semibold">
              <span>Sisa Gaji</span>
            </div>
            <div className="flex-1"></div>
            <div className="flex-1">
              <Input
                value={formatNumber(
                  (dapem.gaji_bersih - dapem.angsuran).toFixed(0)
                )}
                disabled
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              className="bg-red-500 hover:bg-red-600 text-white text-xs italic py-2 px-3 rounded shadow my-2"
              onClick={() => resetData()}
            >
              Reset Simulasi
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs italic py-2 px-3 rounded shadow my-2"
              onClick={() => setOpen(true)}
            >
              Cek Simulasi
            </button>
          </div>
        </div>
      </div>
      <Modal
        open={modalErr ? true : false}
        onCancel={() => setModalErr("")}
        title={<span className="italic text-red-500">PERHATIAN</span>}
        footer={[]}
      >
        <div className="italic text-red-500">
          <p>{modalErr}</p>
        </div>
      </Modal>
    </div>
  );
}
