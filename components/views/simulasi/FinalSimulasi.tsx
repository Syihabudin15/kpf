"use client";
import {
  formatNumber,
  getUsiaTanggalLunas,
  inputTextToDecimal,
} from "@/components/utils/inputUtils";
import {
  DataBankWithProduk,
  InputDapem,
  ITempBank,
  ITempProduk,
} from "@/components/utils/Interfaces";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { JenisPembiayaan } from "@prisma/client";
import { Input, Modal, Select, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  DateDiffUsiaMasuk,
  getAngsuranPerBulan,
  getMaxPlafond,
  newGetMaxTenor,
} from "./simulasiUtil";
import Image from "next/image";

export default function Simulation({ is_deviasi }: { is_deviasi: boolean }) {
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
  const [inputDapem, setInputDapem] = useState<InputDapem>({
    tanggal_simulasi: new Date(),
    tanggal_lahir: null,
    tahun: 0,
    bulan: 0,
    hari: 0,
    nama_pemohon: null,
    nopen: null,
    alamat: null,
    gaji: 0,
    tenor: 0,
    plafond: 0,
    blokir: 0,
    bpp: 0,
    pelunasan: 0,
    result_tenor: 0,
    result_plafond: 0,
    angsuran: 0,
    tanggal_lunas: "",
    usia_lunas: "",
    kotor: 0,
    bersih: 0,
  });
  const [dataBank, setDataBank] = useState<DataBankWithProduk[]>([]);
  const [dataJenis, setDataJenis] = useState<JenisPembiayaan[]>([]);
  const [isDisable, setIsDisable] = useState(true);
  const [open, setOpen] = useState(false);
  const [produkSesuai, setProdukSesuai] = useState<string[]>();
  const [labelTabungan, setLabelTabungan] = useState("Buka Rekening");
  const [tglSimulasi, setTglSimulasi] = useState("");
  const [tgl, setTgl] = useState("");
  const [modalErr, setModalErr] = useState("");
  const [tempTatalaksana, setTempTatalaksana] = useState<number>();
  const [tempProvisi, setTempProvisi] = useState<number>();

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
  };
  const getTglDetail = (
    tglmulai: string,
    setTgl: Function,
    tglakhir?: Date
  ) => {
    var ar = tglmulai.split("");
    const filter = ar.filter((e) => e == "-");
    if (ar.length > 2 && filter.length == 0) {
      ar.splice(2, 0, "-");
    }
    if (ar.length > 4 && filter.length == 1) {
      ar.splice(6, 0, "-");
    }
    setTgl(ar.join(""));
    if (tglmulai.length < 10) return setIsDisable(true);
    setIsDisable(false);

    const date = tglmulai.split("-");
    if (parseInt(date[0]) > 31 || parseInt(date[1]) > 12) {
      return setIsDisable(true);
    }
    const validDate = new Date(`${date[2]}/${parseInt(date[1])}/${date[0]}`);
    if (tglakhir) {
      const { tahun, bulan, hari } = DateDiffUsiaMasuk(ar.join(""), tglakhir);
      setInputDapem((prev) => {
        return {
          ...prev,
          tanggal_lahir: validDate,
          tahun: parseInt(tahun.toString()),
          bulan: parseInt(bulan.toString()),
          hari: parseInt(hari.toString()),
        };
      });
      let tempProduk: string[] = [];
      dataBank.forEach((b) => {
        b.products.forEach((p) => {
          if (
            p.min_age <= parseInt(tahun.toString()) &&
            p.max_age >= parseInt(tahun.toString())
          ) {
            tempProduk.push(p.name);
          }
        });
      });
      setProdukSesuai(tempProduk);
      return { resTgl: validDate, tahun, bulan, hari };
    } else {
      setInputDapem((prev) => {
        return {
          ...prev,
          tanggal_simulasi: validDate,
        };
      });
    }
    return { resTgl: validDate };
  };

  useEffect(() => {
    const tglRes = getTglDetail(tglSimulasi, setTglSimulasi);

    const tglMasuk = getTglDetail(
      tgl,
      setTgl,
      tglRes ? tglRes.resTgl : inputDapem.tanggal_simulasi
    );
    const { tanggalLunas, tahun, bulan, hari } = getUsiaTanggalLunas(
      tglRes
        ? tglRes.resTgl.toString()
        : inputDapem.tanggal_simulasi.toString(),
      tgl,
      inputDapem.tenor
    );
    const max_tenor = newGetMaxTenor(
      produk.max_usia_lunas,
      tglMasuk ? parseInt(tglMasuk.tahun?.toString() || "0") : inputDapem.tahun,
      inputDapem.bulan
    );
    const max_plafond = getMaxPlafond(
      produk.mg_bunga,
      inputDapem.tenor,
      inputDapem.gaji * (bank.by_angsuran / 100)
    );
    const angsuran =
      produk.name === "Flash Sisa Gaji" || produk.name === "Ultima Plus"
        ? ceiling(
            parseInt(
              getAngsuranPerBulan(
                produk.mg_bunga,
                inputDapem.tenor,
                inputDapem.plafond,
                false,
                true
              )
            ),
            bank.pembulatan
          )
        : ceiling(
            parseInt(
              getAngsuranPerBulan(
                produk.mg_bunga,
                inputDapem.tenor,
                inputDapem.plafond
              )
            ),
            bank.pembulatan
          );
    const admin =
      inputDapem.plafond * ((bank.by_admin + bank.by_admin_bank) / 100);
    const asuransi = inputDapem.plafond * (produk.by_asuransi / 100);
    const blokirAngsuran = inputDapem.blokir * angsuran;

    const biayaAwal =
      admin +
      asuransi +
      (tempTatalaksana || 0) +
      bank.by_buka_rekening +
      bank.by_materai +
      bank.by_epotpen +
      bank.by_flagging +
      jenis.by_mutasi +
      (tempProvisi || 0) +
      blokirAngsuran;
    const kotor = inputDapem.plafond - biayaAwal;
    if (
      inputDapem.gaji > 100000 &&
      produk.name === "Flash Sisa Gaji" &&
      inputDapem.gaji - angsuran < 100000
    ) {
      setModalErr(
        "Minimun sisa gaji untuk pengajuan Flash Sisa Gaji adalah Rp. 100.000 Mohon maaf perhitungan simulasi yang diajukan tidak memenuhi persyaratan!"
      );
    }
    return setInputDapem((prev) => {
      return {
        ...prev,
        tanggal_lunas: tanggalLunas,
        usia_lunas: `${tahun} Tahun ${bulan} Bulan ${hari} Hari`,
        result_tenor:
          max_tenor > produk.max_tenor ? produk.max_tenor : max_tenor,
        result_plafond:
          max_plafond > produk.max_plafon ? produk.max_plafon : max_plafond,
        angsuran: angsuran,
        kotor,
        bersih: kotor - (inputDapem.bpp + inputDapem.pelunasan),
      };
    });
  }, [
    bank,
    produk,
    tgl,
    tglSimulasi,
    inputDapem.gaji,
    inputDapem.tenor,
    inputDapem.plafond,
    inputDapem.blokir,
    inputDapem.bpp,
    inputDapem.pelunasan,
    jenis.by_mutasi,
    tempTatalaksana,
    tempProvisi,
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
              value={
                tglSimulasi ||
                moment(inputDapem.tanggal_simulasi).format("DD-MM-YYYY")
              }
              style={{ color: "black", backgroundColor: "white" }}
              onChange={(e) => setTglSimulasi(e.target.value)}
            />
          </div>
          <div className="flex gap-3 my-2">
            <div className="flex-1 flex flex-col gap-1">
              <span>Nama Pemohon</span>
              <Input
                onChange={(e) =>
                  setInputDapem((prev) => {
                    return {
                      ...prev,
                      nama_pemohon: e.target.value,
                    };
                  })
                }
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span>Nopen</span>
              <Input
                onChange={(e) =>
                  setInputDapem((prev) => {
                    return {
                      ...prev,
                      nopen: e.target.value,
                    };
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 my-2">
            <span>Alamat</span>
            <Input.TextArea
              onChange={(e) =>
                setInputDapem((prev) => {
                  return {
                    ...prev,
                    alamat: e.target.value,
                  };
                })
              }
            />
          </div>
          <div className="flex gap-3 my-2">
            <div className="flex-1 flex flex-col gap-1">
              <span>Tanggal Lahir</span>
              <Input value={tgl} onChange={(e) => setTgl(e.target.value)} />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span>Usia Masuk</span>
              <div className="flex gap-1">
                <Input
                  disabled
                  value={inputDapem.tahun}
                  style={{ color: "black", backgroundColor: "white" }}
                  // suffix={
                  //   <span className="text-xs italic hidden sm:block">
                  //     Tahun
                  //   </span>
                  // }
                />
                <Input
                  disabled
                  style={{ color: "black", backgroundColor: "white" }}
                  value={inputDapem.bulan}
                  // suffix={
                  //   <span className="text-xs italic hidden sm:block">
                  //     Bulan
                  //   </span>
                  // }
                />
                <Input
                  disabled
                  style={{ color: "black", backgroundColor: "white" }}
                  value={inputDapem.hari}
                  // suffix={
                  //   <span className="text-xs italic hidden sm:block">Hari</span>
                  // }
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 my-2">
            <div className="flex-1 flex flex-col gap-2">
              <span>Gaji Bersih</span>
              <Input
                value={formatNumber(inputDapem.gaji.toFixed(0))}
                disabled={isDisable}
                onChange={(e) =>
                  setInputDapem((prev) => {
                    return {
                      ...prev,
                      gaji: inputTextToDecimal(e.target.value || "0"),
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
                placeholder="Jenis Pembiayaan"
                disabled={produk.name === "Flash Sisa Gaji" ? true : isDisable}
                onChange={(e) => {
                  const tempJenis = dataJenis.filter((j) => j.id === e);
                  if (tempJenis.length > 0) {
                    return setJenis({
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
                placeholder="Produk Pembiayaan"
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
                            // ...prev,
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
                            // ...prev,
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
                        if (temp[0].name === "Flash Sisa Gaji") {
                          setLabelTabungan("Tabungan Anggota");
                          setTempTatalaksana(0);
                          setJenis((prev) => {
                            return {
                              ...prev,
                              id: "",
                              name: "",
                              by_mutasi: 0,
                            };
                          });
                          setBank((prev) => {
                            return {
                              ...prev,
                              by_flagging: 0,
                              by_epotpen: 0,
                              by_provisi: 0,
                            };
                          });
                        } else {
                          setTempTatalaksana(bank.by_tatalaksana);
                        }
                        if ((dataBank[i].by_provisi || 0) > 100) {
                          setTempProvisi(dataBank[i].by_provisi || 0);
                        } else {
                          setTempProvisi(
                            inputDapem.plafond *
                              ((dataBank[i].by_provisi || 0) / 100)
                          );
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div
              className={`flex-1 flex flex-col gap-2 ${
                is_deviasi ? "" : "hidden"
              }`}
            >
              <span>Margin Bunga</span>
              <Input
                value={produk.mg_bunga}
                disabled={isDisable}
                suffix="%"
                type="number"
                onChange={(e) =>
                  setProduk((prev) => {
                    return {
                      ...prev,
                      mg_bunga: parseFloat(e.target.value || "0"),
                    };
                  })
                }
              />
            </div>
          </div>
          <div className="text-blue-500 italic text-xs">
            {produkSesuai &&
              produkSesuai.filter((e, i, o) => o.indexOf(e) === i).join(", ")}
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
                status={
                  inputDapem.tenor > inputDapem.result_tenor ? "error" : ""
                }
                value={inputDapem.tenor || 0}
                onChange={(e) => {
                  if (parseInt(e.target.value) > inputDapem.result_tenor) {
                    setInputDapem((prev) => {
                      return {
                        ...prev,
                        tenor: 0,
                      };
                    });
                    return setModalErr(
                      `Maaf tenor yang diinput tidak dapat melebihi maksimal tenor yang tersedia!`
                    );
                  }
                  setInputDapem((prev) => {
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
                value={inputDapem.result_tenor}
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
          </div>
          <div className="flex gap-3 my-3">
            <div className="flex-1 flex flex-col gap-2">
              <span>Plafond</span>
              <Input
                disabled={isDisable}
                status={
                  inputDapem.plafond > inputDapem.result_plafond ? "error" : ""
                }
                value={formatNumber(inputDapem.plafond.toFixed(0))}
                onChange={(e) => {
                  if (
                    inputTextToDecimal(e.target.value) >
                    inputDapem.result_plafond
                  ) {
                    setInputDapem((prev) => {
                      return {
                        ...prev,
                        plafond: 0,
                      };
                    });
                    return setModalErr(
                      `Maaf plafond yang diinput tidak dapat melebihi maksimal plafond yang tersedia!`
                    );
                  }
                  if (produk.name === "Flash Sisa Gaji") {
                    setTempTatalaksana(0);
                  } else {
                    setTempTatalaksana(bank.by_tatalaksana);
                  }
                  if (bank.by_provisi > 100) {
                    setTempProvisi(bank.by_provisi);
                  } else {
                    setTempProvisi(
                      inputTextToDecimal(e.target.value || "0") *
                        (bank.by_provisi / 100)
                    );
                  }
                  return setInputDapem((prev) => {
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
                value={formatNumber(inputDapem.result_plafond.toFixed(0))}
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
          </div>
          <div className="flex gap-3 my-3">
            <div className="flex-1 flex flex-col gap-2">
              <span>Angsuran</span>
              <Input
                disabled
                value={formatNumber(inputDapem.angsuran.toFixed(0))}
                style={{ color: "black", backgroundColor: "white" }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <span>Maks Angsuran</span>
              <Input
                disabled
                value={formatNumber(
                  (inputDapem.gaji * (bank.by_angsuran / 100)).toFixed(0)
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
            <div className="flex-1">
              <div className={`flex gap-2 ${is_deviasi ? "" : "hidden"}`}>
                <Tooltip title="Admin KPF">
                  <Input
                    value={bank.by_admin}
                    type="number"
                    suffix={
                      <span className="hidden sm:block opacity-80">%</span>
                    }
                    disabled={isDisable}
                    onChange={(e) =>
                      setBank((prev) => {
                        return {
                          ...prev,
                          by_admin: parseFloat(e.target.value),
                        };
                      })
                    }
                  />
                </Tooltip>
                <Tooltip title="Admin Bank">
                  <Input
                    value={bank.by_admin_bank}
                    type="number"
                    suffix={
                      <span className="hidden sm:block opacity-80">%</span>
                    }
                    disabled={isDisable}
                    onChange={(e) =>
                      setBank((prev) => {
                        return {
                          ...prev,
                          by_admin_bank: parseFloat(e.target.value),
                        };
                      })
                    }
                  />
                </Tooltip>
              </div>
            </div>
            <div className="flex-1">
              <Input
                value={formatNumber(
                  (
                    inputDapem.plafond *
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
              <div className={`${is_deviasi ? "" : "hidden"}`}>
                <Input
                  value={produk.by_asuransi}
                  type="number"
                  suffix={<span className="hidden sm:block opacity-80">%</span>}
                  disabled={isDisable}
                  onChange={(e) =>
                    setProduk((prev) => {
                      return {
                        ...prev,
                        by_asuransi: parseInt(e.target.value),
                      };
                    })
                  }
                />
              </div>
            </div>
            <div className="flex-1">
              <Input
                value={formatNumber(
                  (inputDapem.plafond * (produk.by_asuransi / 100)).toFixed(0)
                )}
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
                value={formatNumber((tempTatalaksana || 0).toFixed(0))}
                disabled={isDisable}
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setTempTatalaksana(inputTextToDecimal(e.target.value || "0"))
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
                value={formatNumber((tempProvisi || 0).toFixed(0))}
                disabled={isDisable}
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setTempProvisi(inputTextToDecimal(e.target.value || "0"))
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
                value={inputDapem.blokir}
                disabled={isDisable}
                type="number"
                prefix="x"
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setInputDapem((prev) => {
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
                value={formatNumber(
                  (inputDapem.blokir * inputDapem.angsuran).toFixed(0)
                )}
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
                value={formatNumber(inputDapem.kotor.toFixed(0))}
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
                value={formatNumber(inputDapem.bpp.toFixed(0))}
                disabled={isDisable}
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setInputDapem((prev) => {
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
                value={formatNumber(inputDapem.pelunasan.toFixed(0))}
                disabled={isDisable}
                style={{ color: "black", backgroundColor: "white" }}
                onChange={(e) =>
                  setInputDapem((prev) => {
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
                value={formatNumber(inputDapem.bersih.toFixed(0))}
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
                  (inputDapem.gaji - inputDapem.angsuran).toFixed(0)
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
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        footer={[]}
        width={window.innerWidth < 600 ? "90vw" : "80vw"}
        style={{ top: 30 }}
        title={
          <div className="flex text-center sm:text-left gap-2 items-center">
            <Image
              src={"/assets/images/logo_kpf.jpg"}
              alt="KPF Logo"
              width={40}
              height={40}
            />
            <span className="font-bold">ANALISA PERHITUNGAN</span>
          </div>
        }
      >
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1">
            <div className="text-center font-bold bg-green-500 text-white p-2">
              DATA PEMBIAYAAN
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Tanggal Simulasi</span>
              <span className="text-right">
                {moment(inputDapem.tanggal_simulasi).format("DD-MM-YYYY")}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Nomor Pensiun</span>
              <span className="text-right">{inputDapem.nopen}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Nama Pemohon</span>
              <span className="text-right">{inputDapem.nama_pemohon}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Tanggal Lahir</span>
              <span className="text-right">
                {moment(inputDapem.tanggal_lahir).format("DD-MM-YYYY")}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Usia Masuk</span>
              <span className="text-right">
                {inputDapem.tahun} Tahun {inputDapem.bulan} Bulan{" "}
                {inputDapem.hari} Hari
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1 font-bold">
              <span>Tanggal Lunas</span>
              <span className="text-right">{inputDapem.tanggal_lunas}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1 font-bold">
              <span>Usia Lunas</span>
              <span className="text-right">{inputDapem.usia_lunas}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1 font-bold text-green-500">
              <span>Gaji Bersih</span>
              <span className="text-right">
                {formatNumber(inputDapem.gaji.toFixed(0))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Produk Pembiayaan</span>
              <span className="text-right">{produk.name}</span>
            </div>
            {bank.kode === "BPR SIP" && (
              <div className="flex justify-between border-b border-gray-200 py-1">
                <span>Margin Bunga</span>
                <span className="text-right">{produk.mg_bunga}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Jenis Pembiayaan</span>
              <span className="text-right">{jenis.name}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Tenor</span>
              <span className="text-right">{inputDapem.tenor}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Plafond</span>
              <span className="text-right">
                {formatNumber(inputDapem.plafond.toFixed(0))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Angsuran</span>
              <span className="text-right">
                {formatNumber(inputDapem.angsuran.toFixed(0))}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-center font-bold bg-green-500 text-white p-2">
              RINCIAN PEMBIAYAAN
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Biaya Administrasi</span>
              <span className="text-right">
                {formatNumber(
                  (
                    inputDapem.plafond *
                    ((bank.by_admin + bank.by_admin_bank) / 100)
                  ).toFixed(0)
                )}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Biaya Asuransi</span>
              <span className="text-right">
                {formatNumber(
                  (inputDapem.plafond * (produk.by_asuransi / 100)).toFixed(0)
                )}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Biaya Tatalaksana</span>
              <span className="text-right">
                {formatNumber((tempTatalaksana || 0).toFixed(0))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Biaya {labelTabungan}</span>
              <span className="text-right">
                {formatNumber(bank.by_buka_rekening.toFixed(0))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Biaya Materai</span>
              <span className="text-right">
                {formatNumber(bank.by_materai.toFixed(0))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>
                Biaya {bank.kode === "BPR SIP" ? "Layanan Kredit" : "Provisi"}
              </span>
              <span className="text-right">
                {formatNumber((tempProvisi || 0).toFixed(0))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Biaya Data Informasi</span>
              <span className="text-right">
                {formatNumber((bank.by_epotpen + bank.by_flagging).toFixed(0))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Biaya Mutasi</span>
              <span className="text-right">
                {formatNumber(jenis.by_mutasi.toFixed(0))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Blokir Angsuran</span>
              <span className="text-center">
                {inputDapem.blokir} x{" "}
                {formatNumber(inputDapem.angsuran.toFixed(0))}
              </span>
              <span className="text-right">
                {formatNumber(
                  (inputDapem.blokir * inputDapem.angsuran).toFixed(0)
                )}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Terima Kotor</span>
              <span className="text-right">
                {formatNumber(inputDapem.kotor.toFixed(0))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1 text-red-500 font-bold">
              <span>BPP</span>
              <span className="text-right">
                {formatNumber(inputDapem.bpp.toFixed(0))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Pelunasan</span>
              <span className="text-right">
                {formatNumber(inputDapem.pelunasan.toFixed(0))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1 font-bold">
              <span>Terima Bersih</span>
              <span className="text-right">
                {formatNumber(inputDapem.bersih.toFixed(0))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Sisa Gaji</span>
              <span className="text-right">
                {formatNumber(
                  (inputDapem.gaji - inputDapem.angsuran).toFixed(0)
                )}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
