"use client";
import { Form, Input, Modal, Select } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  formatNumber,
  inputTextToDecimal,
} from "@/components/utils/inputUtils";
import { Bank, JenisPembiayaan, Produk } from "@prisma/client";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import {
  DateDiffUsiaMasuk,
  getAngsuranPerBulan,
} from "../simulasi/simulasiUtil";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
const { PV, EDATE } = require("@formulajs/formulajs");
const moment = require("moment-timezone");

interface DataBank extends Bank {
  products: Produk[];
}

interface productOptions {
  label: string;
  value: string;
}
interface BankOptions {
  label: string;
  options: productOptions[];
}
interface TanggalMasuk {
  tahunMasuk: string;
  bulanMasuk: string;
  hariMasuk: string;
}
export default function EditBiaya({
  currData,
  refferal,
  setPembiayaan,
  setJenisMargin,
}: {
  currData: DataDataPengajuan;
  refferal: productOptions[];
  setPembiayaan: Function;
  setJenisMargin: Function;
}) {
  const [data, setData] = useState<BankOptions[]>([]);
  const [dataBank, setDataBank] = useState<Produk[]>([]);
  const [jenisPembiayaan, setJenisPembiayaan] = useState<productOptions[]>([]);
  const [disable, setDisable] = useState(true);
  const [tanggalLahir, setTanggalLahir] = useState<string>("");
  const [tanggalMasuk, setTranggalMasuk] = useState<TanggalMasuk>({
    tahunMasuk: "0",
    bulanMasuk: "0",
    hariMasuk: "0",
  });
  const [produkTidakSesuai, SetTidakSesuai] = useState(false);
  const [produkSesuai, setProdukSesuai] = useState<string>("");
  const [gajiBersih, setGajiBersih] = useState<string>("0");
  const [maxAngsuran, setMaxAngsuran] = useState<string>("0");
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>();
  const [banks, setBanks] = useState<DataBank[]>([]);
  const [selectedBank, setSelectedBank] = useState<DataBank | null>();
  const [tenor, setTenor] = useState<number>(0);
  const [plafond, setPlafond] = useState<string>("0");
  const [maxPlafond, setMaxPlafond] = useState<string>("0");
  const [maxtenor, setMaxTenor] = useState<string>("0");
  const [angsuranBulan, setAngsuranBulan] = useState<string>("0");
  const [blokir, setBlokir] = useState<number>(0);
  const [by_admin, setByAdmin] = useState<string>("0");
  const [kotor, setKotor] = useState<string>("0");
  const [bpp, setBpp] = useState<string>("0");
  const [pelunasan, setPelunasan] = useState<string>("0");
  const [bersih, setBersih] = useState<string>("0");
  const [jumlahGajiBersih, setJumlahGajiBersih] = useState<string>("0");
  const [tenor_msg, setTenorMsg] = useState("");
  const [plafond_msg, setPlafondMsg] = useState("");
  const [by_tatalaksana, setTatalaksana] = useState("");
  const [by_mutasi, setByMutasi] = useState("");
  const [dataJenis, setDataJenis] = useState<JenisPembiayaan[]>([]);
  const [selectedJenis, setSelectedJenis] = useState<JenisPembiayaan | null>();
  const [jenisDisable, setJenisDisable] = useState(false);
  const [tanggalLunas, setTanggalLunas] = useState("");
  const [provisi, setProvisi] = useState("0");
  const [modalMsg, setModalMsg] = useState(false);
  const [tglLahirError, setTglLahirError] = useState(false);
  const [requiredModal, setRequiredModal] = useState(false);
  const [reffFee, setReffFee] = useState<number>();
  const [juruAsal, setJuruAsal] = useState<string>();
  const [juruTujuan, setJuruTujuan] = useState<string>();
  const [pembiayaanSebelumnya, setpembiayaanSebelumnya] = useState<string>();
  const [reffId, setReffId] = useState<string>();
  const [tempatLahir, setTempatLahir] = useState<string>();
  const [namaBank, setNamaBank] = useState<string>();
  const [noBank, setNoBank] = useState<string>();
  const [byAdminBank, setByAdminBank] = useState<string>("0");
  const [byLainnya, setByLainnya] = useState<string>("0");
  const [modalGajiBersih, setModalGajiBersih] = useState(false);

  const hitungUlang = (type: string) => {
    if (type == "all") {
      setTanggalLahir("");
      setTranggalMasuk({ tahunMasuk: "0", bulanMasuk: "0", hariMasuk: "0" });
      SetTidakSesuai(false);
      setProdukSesuai("");
      setGajiBersih("0");
      setMaxAngsuran("0");
      setTenor(0);
      setPlafond("0");
      setMaxPlafond("0");
      setMaxTenor("0");
      setAngsuranBulan("0");
      setBlokir(0);
      setByAdmin("0");
      setByAdminBank("0");
      setByLainnya("0");
      setKotor("0");
      setBpp("0");
      setPelunasan("0");
      setBersih("0");
      setJumlahGajiBersih("0");
      setTatalaksana("0");
      setDisable(true);
      setJenisDisable(true);
      setSelectedProduk(null);
      setSelectedBank(null);
      setSelectedJenis(null);
      setByMutasi("0");
      setKotor("0");
      setBersih("0");
      setTanggalLunas("");
      setProvisi("0");
    } else {
      setMaxAngsuran("0");
      setTenor(0);
      setPlafond("0");
      setMaxPlafond("0");
      setMaxTenor("0");
      setAngsuranBulan("0");
      setBlokir(0);
      setByAdmin("0");
      setByAdminBank("0");
      setByLainnya("0");
      setProvisi("0");
      setKotor("0");
      setBpp("0");
      setPelunasan("0");
      setBersih("0");
      setJumlahGajiBersih("0");
      setTatalaksana("0");
      setTanggalLunas("");
    }
  };

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/master/bank");
      const result = await res.json();
      const filetered = result.result.filter(
        (bi: any) => bi.id === currData.bankId
      );
      setBanks(filetered);
      const dataBankTmp: Produk[] = [];
      const convertToData = filetered.map((e: DataBank) => {
        return {
          label: e.name,
          options: e.products.map((p: Produk) => {
            dataBankTmp.push(p);
            return {
              label: p.name,
              value: p.id,
            };
          }),
        };
      });
      setDataBank(dataBankTmp);
      setData(convertToData);
      const jenis = await fetch("/api/master/pembiayaan");
      const pembiayaan = await jenis.json();
      setDataJenis(pembiayaan.result);
      const resultJenis = pembiayaan.result.map((e: JenisPembiayaan) => {
        return { label: e.name, value: e.id, key: e.id };
      });
      setJenisPembiayaan(resultJenis);
    })();
  }, []);
  const handleTanggalLahir = (e: string) => {
    SetTidakSesuai(false);
    setProdukSesuai("");

    var ar = e.split("");

    const filter = ar.filter((e) => e == "-");
    if (ar.length > 2 && filter.length == 0) {
      ar.splice(2, 0, "-");
    }
    if (ar.length > 4 && filter.length == 1) {
      ar.splice(6, 0, "-");
    }
    setTanggalLahir(ar.join(""));
    if (e.length < 10) return;
    setDisable(false);

    const date = e.split("-");
    if (
      parseInt(date[0]) > 31 ||
      parseInt(date[1]) > 12 ||
      parseInt(date[2]) >= new Date().getFullYear()
    ) {
      setTglLahirError(true);
      setDisable(true);
      return;
    }
    const date1 = moment().tz("Asia/Jakarta");
    const date2 = moment([
      parseInt(date[2]),
      parseInt(date[1]) - 1,
      parseInt(date[0]),
    ]).tz("Asia/Jakarta");

    if (date2 >= date1) {
      setTglLahirError(true);
      setTranggalMasuk({ tahunMasuk: "0", bulanMasuk: "0", hariMasuk: "0" });
      return;
    } else {
      setTglLahirError(false);
    }

    const years = date1.diff(date2, "year");
    date2.add(years, "years");
    const months = date1.diff(date2, "months");
    date2.add(months, "months");
    const days = date1.diff(date2, "days");

    if (years) {
      setTranggalMasuk({
        tahunMasuk: years.toString(),
        bulanMasuk: months.toString(),
        hariMasuk: days.toString(),
      });
      const userAge = parseFloat(years + Math.floor(parseFloat(months) / 12));
      const sesuai = dataBank.filter((b) => {
        if (userAge >= b.min_age && userAge <= b.max_age) {
          return b;
        }
      });

      if (sesuai.length == 0) {
        setDisable(true);
        setJenisDisable(false);
        return SetTidakSesuai(true);
      }
      const sedia = sesuai.map((s) => s.name);
      const removeDups = (arr: string[]): string[] => {
        return arr.filter((item, index) => arr.indexOf(item) === index);
      };
      setProdukSesuai(sedia && removeDups(sedia).join(", "));
      if (selectedProduk) {
        if (
          userAge >= parseFloat(selectedProduk.min_age.toString()) &&
          userAge <= parseFloat(selectedProduk.max_age.toString())
        ) {
          SetTidakSesuai(false);
          setTanggalLunas("");
        } else {
          SetTidakSesuai(true);
        }
      }
    }
  };
  const handleProduk = (e: string) => {
    SetTidakSesuai(false);
    const filter = dataBank.filter((p) => p.id == e.split("/")[1]);
    const filterBank = banks.filter((d) => d.id == e.split("/")[0]);
    setSelectedProduk(filter[0]);
    setSelectedBank(filterBank[0]);
    const userAge =
      parseFloat(tanggalMasuk.tahunMasuk) +
      Math.floor(
        parseFloat((parseFloat(tanggalMasuk.bulanMasuk) / 12).toString())
      );

    if (
      userAge >= parseFloat(filter[0].min_age.toString()) &&
      userAge <= parseFloat(filter[0].max_age.toString())
    ) {
      SetTidakSesuai(false);
      setTanggalLunas("");
    } else {
      SetTidakSesuai(true);
      setModalMsg(true);
    }

    if (filter[0].name == "Flash Sisa Gaji") {
      document
        .querySelectorAll(".will-hide-if-flash")
        .forEach((e) => e.classList.add("hidden"));
      setJenisDisable(true);
    } else {
      document
        .querySelectorAll(".will-hide-if-flash")
        .forEach((e) => e.classList.remove("hidden"));
      setJenisDisable(false);
    }

    if (!gajiBersih) return;
    const byAngs = selectedBank ? selectedBank.by_angsuran / 100 : 0.95;
    const maxAngs = inputTextToDecimal(gajiBersih) * byAngs;
    setMaxAngsuran(formatNumber(maxAngs.toFixed(0).toString()));
  };
  const handleJenisPembiayaan = (e: string) => {
    const filter = dataJenis.filter((j) => j.id == e);

    setSelectedJenis(filter[0]);
    if (!plafond) {
      setBersih("0");
      return setKotor("0");
    }
  };
  const jenisChange = () => {
    if (!selectedJenis) {
      return setByMutasi("0");
    } else {
      setByMutasi(formatNumber(selectedJenis.by_mutasi.toString()));
    }
  };
  const handleGajiBersih = (e: string) => {
    setGajiBersih(formatNumber(e));
    const byAngs = selectedBank ? selectedBank.by_angsuran / 100 : 0.95;
    const maxAngs = inputTextToDecimal(e) * byAngs;
    setMaxAngsuran(formatNumber(maxAngs.toFixed(0).toString()));
  };
  const handlePlafond = (e: string) => {
    setPlafond(formatNumber(e));
    if (inputTextToDecimal(e) > inputTextToDecimal(maxPlafond)) {
      setPlafondMsg("");
      setBersih("0");
      setKotor("0");
      return;
    }
    setPlafondMsg("");
  };
  const getAngsuran = () => {
    if (!selectedProduk || !plafond) return;
    const result = ceiling(
      parseInt(
        getAngsuranPerBulan(
          selectedProduk.mg_bunga,
          tenor,
          inputTextToDecimal(plafond)
        )
      ),
      currData.DataPembiayaan.pembulatan || 1
    );
    setAngsuranBulan(formatNumber(result.toFixed(0)));
  };
  const getMaxPlafond = () => {
    let margin = selectedProduk ? selectedProduk?.mg_bunga / 100 : 0;
    let maxPlaf =
      PV(margin / 12, tenor, inputTextToDecimal(maxAngsuran), 0, 0) * -1;

    if (selectedProduk && maxPlaf > selectedProduk.max_plafon) {
      setMaxPlafond(formatNumber(selectedProduk.max_plafon.toFixed(0)));
    } else {
      setMaxPlafond(formatNumber(maxPlaf.toFixed(0)));
    }
  };
  const getMaxTenor = () => {
    if (produkTidakSesuai) return setMaxTenor("0");
    const max_age = selectedProduk ? selectedProduk.max_usia_lunas : 0;
    let tmp = max_age - parseInt(tanggalMasuk.tahunMasuk);
    const result =
      parseInt(tanggalMasuk.tahunMasuk) <= max_age
        ? tmp * 12 - (parseInt(tanggalMasuk.bulanMasuk) + 1)
        : 0;

    if (result <= 0) {
      hitungUlang("");
      setSelectedProduk(null);
      SetTidakSesuai(true);
    }
    if (selectedProduk && result > selectedProduk?.max_tenor) {
      setMaxTenor(selectedProduk.max_tenor.toString());
    } else {
      setMaxTenor(result.toString());
    }
  };
  const bppPelunasan = () => {
    if (bpp != "0" || pelunasan != "0") {
      const awal = inputTextToDecimal(kotor.toString());
      const bersih =
        awal - inputTextToDecimal(bpp) - inputTextToDecimal(pelunasan);
      setBersih(formatNumber(bersih.toString()));
    }
  };
  // My
  const getanggalLunas = () => {
    // Tanggal Lunas
    if (!tenor || tenor == 0) return;
    const tgl = EDATE(moment().tz("Asia/Jakarta")._d, tenor);
    const lunas = new Date(tgl).toLocaleDateString();
    const splitting = lunas.split("/");
    let bulan = splitting[0].length == 1 ? `0${splitting[0]}` : splitting[0];
    let hari = splitting[1].length == 1 ? `0${splitting[1]}` : splitting[1];

    setTanggalLunas(`${bulan} - ${hari} - ${splitting[2]}`);

    // Usia Lunas
    if (tanggalMasuk.tahunMasuk && tanggalLunas != "") {
      const tglLahirSplt = tanggalLahir.split("-");
      const date1 = moment(tgl).tz("Asia/Jakarta");
      const date2 = moment([
        parseInt(tglLahirSplt[2]),
        parseInt(tglLahirSplt[1]),
        parseInt(tglLahirSplt[0]),
      ]).tz("Asia/Jakarta");

      const year = date1.diff(date2, "year");
      date2.add(year, "years");
      const month = date1.diff(date2, "months");
      date2.add(month, "months");
      const day = date1.diff(date2, "days");

      if (produkTidakSesuai || !tenor || tenor > parseInt(maxtenor)) {
        setTanggalLunas("");
      }
    }
  };
  // End My

  useEffect(() => {
    setTanggalLunas("");
    getMaxPlafond();
    setTenorMsg("");
    setPlafondMsg("");

    if (!plafond || plafond == "0") {
      setKotor("0");
    }
    if (selectedProduk && selectedProduk.name == "Flash Sisa Gaji") {
      document
        .querySelectorAll(".will-hide-if-flash")
        .forEach((e) => e.classList.add("hidden"));
      setJenisDisable(true);
    } else {
      document
        .querySelectorAll(".will-hide-if-flash")
        .forEach((e) => e.classList.remove("hidden"));
      setJenisDisable(false);
    }
    if (produkTidakSesuai && tenor) {
      setTenorMsg("0");
      hitungUlang("");
    }

    if (!selectedProduk) {
      setJenisDisable(true);
      setTatalaksana("0");
      setBersih("0");
      setKotor("0");
    }
    if (selectedProduk) {
      getMaxTenor();
      if (selectedProduk.name == "Flash Sisa Gaji" || produkTidakSesuai) {
        setSelectedJenis(null);
        setJenisDisable(true);
      }
    }
    if (selectedJenis) {
      jenisChange();
    }

    if (plafond) {
      getAngsuran();
      const plaf = inputTextToDecimal(plafond);
      // let tmp = 0;
      if (selectedProduk && selectedProduk.name !== "Flash Sisa Gaji") {
        if (!selectedJenis) {
          setByMutasi("0");
        } else {
          setByMutasi(formatNumber(selectedJenis.by_mutasi.toString()));
        }
      } else {
        setByMutasi("0");
      }
      const tmp =
        plaf -
        plaf * ((reffFee ? reffFee : 0) / 100) -
        (selectedBank?.by_flagging || 0) -
        (selectedBank?.by_epotpen || 0) -
        inputTextToDecimal(by_admin) -
        inputTextToDecimal(byAdminBank) -
        inputTextToDecimal(byLainnya) -
        inputTextToDecimal(by_tatalaksana) -
        inputTextToDecimal(plafond) *
          (selectedProduk ? selectedProduk.by_asuransi / 100 : 0) -
        inputTextToDecimal(provisi) -
        inputTextToDecimal(
          selectedBank ? selectedBank.by_buka_rekening.toString() : "0"
        ) -
        inputTextToDecimal(
          selectedBank ? selectedBank.by_materai.toString() : "0"
        ) -
        inputTextToDecimal(by_mutasi ? by_mutasi.toString() : "0") -
        blokir * inputTextToDecimal(angsuranBulan);

      if (tanggalMasuk.tahunMasuk != "0" && plafond !== "0") {
        setKotor(formatNumber(tmp.toFixed(0).toString()));
        setBersih(formatNumber(tmp.toFixed(0).toString()));
      }
      if (inputTextToDecimal(plafond) > inputTextToDecimal(maxPlafond)) {
        setBersih("0");
        setKotor("0");
        setJumlahGajiBersih("0");
      }
      if (!selectedProduk || !selectedBank) return;
      const byAdmin = selectedBank ? selectedBank?.by_admin / 100 : 0.2;
      const admin = inputTextToDecimal(plafond) * byAdmin;
      const adminBank =
        inputTextToDecimal(plafond) * ((selectedBank.by_admin_bank || 0) / 100);
      const layanan =
        inputTextToDecimal(plafond) * ((selectedBank.by_lainnya || 0) / 100);
      setByAdmin(formatNumber(admin.toFixed(0).toString()));
      setByAdminBank(formatNumber(adminBank.toFixed(0).toString()));
      setByLainnya(formatNumber(layanan.toFixed(0).toString()));
    }
    if (inputTextToDecimal(bpp) >= inputTextToDecimal(kotor) || kotor == "0") {
      setBpp("0");
    }
    if (
      inputTextToDecimal(pelunasan) > inputTextToDecimal(kotor) ||
      kotor == "0"
    ) {
      setPelunasan("0");
    }
    if (inputTextToDecimal(tenor.toString()) > inputTextToDecimal(maxtenor)) {
      setTenorMsg("0");
    }
    if (inputTextToDecimal(plafond) > inputTextToDecimal(maxPlafond)) {
      setPlafondMsg("0");
    }
    if (gajiBersih && angsuranBulan) {
      let bersih =
        inputTextToDecimal(gajiBersih) - inputTextToDecimal(angsuranBulan);
      setJumlahGajiBersih(formatNumber(bersih.toString()));
      if (inputTextToDecimal(plafond) > inputTextToDecimal(maxPlafond)) {
        setJumlahGajiBersih("0");
      }
    }
    bppPelunasan();
    if (blokir) {
      bppPelunasan();
    }
    if (selectedProduk && selectedProduk?.name == "Flash Sisa Gaji") {
      const tatalaksana = inputTextToDecimal(plafond) * 0.03;
      setTatalaksana(formatNumber(tatalaksana.toFixed(0).toString()));
    } else if (selectedProduk && selectedProduk?.name != "Flash Sisa Gaji") {
      if (selectedBank) {
        setTatalaksana(formatNumber(selectedBank.by_tatalaksana.toString()));
      }
    } else {
      setTatalaksana("0");
    }
    getanggalLunas();

    setPembiayaan({
      name: currData.DataPembiayaan.name,
      nopen: currData.DataPembiayaan.nopen,
      gaji_bersih: inputTextToDecimal(gajiBersih),
      produk_id: selectedProduk?.id,
      jenis_pembiayaan_id: selectedJenis
        ? selectedJenis.id
        : currData.DataPembiayaan.jenis_pembiayaan_id,
      tenor,
      plafond: inputTextToDecimal(plafond),
      blokir,
      bpp: inputTextToDecimal(bpp),
      pelunasan: inputTextToDecimal(pelunasan),
      by_tatalaksana: inputTextToDecimal(by_tatalaksana),
      by_mutasi: inputTextToDecimal(by_mutasi),
      by_provisi: inputTextToDecimal(provisi),
      mg_bunga: selectedProduk?.mg_bunga,
      by_admin: currData.DataPembiayaan.by_admin,
      by_asuransi: selectedProduk?.by_asuransi,
      by_buka_rekening: currData.DataPembiayaan.by_buka_rekening,
      by_materai: currData.DataPembiayaan.by_materai,
      is_simulasi: false,
      alamat: currData.DataPembiayaan.alamat,
      juru_bayar_asal: juruAsal,
      juru_bayar_tujuan: juruTujuan,
      pembiayaan_sebelumnya: pembiayaanSebelumnya,
      tanggal_lahir: tanggalLahir,
      refferal_id: reffId ? reffId : currData.DataPembiayaan.refferal_id,
      keterangan: "Edit Pengajuan Slik",
      fee: reffFee,
      by_admin_bank: currData.DataPembiayaan.by_admin_bank,
      by_lainnya: currData.DataPembiayaan.by_lainnya,
      tempat_lahir: tempatLahir,
      nama_bank: namaBank,
      no_rekening: noBank,
      by_flagging: currData.DataPembiayaan.by_flagging,
      by_epotpen: currData.DataPembiayaan.by_epotpen,
    });
  }, [
    provisi,
    tenor,
    selectedProduk,
    tanggalLahir,
    plafond,
    blokir,
    gajiBersih,
    bpp,
    pelunasan,
    angsuranBulan,
    by_admin,
    kotor,
    maxPlafond,
    maxtenor,
    selectedBank,
    selectedJenis,
    by_mutasi,
    by_tatalaksana,
    produkTidakSesuai,
    reffFee,
  ]);
  useEffect(() => {
    setModalGajiBersih(false);
    if (
      jumlahGajiBersih !== "0" &&
      angsuranBulan !== "0" &&
      selectedProduk &&
      selectedProduk.name === "Flash Sisa Gaji" &&
      inputTextToDecimal(jumlahGajiBersih) <=
        parseInt(
          process.env.NEXT_PUBLIC_APP_FLASH_MINIMUM_SISA_GAJI || "100000"
        )
    ) {
      setModalGajiBersih(true);
    } else {
      setModalGajiBersih(false);
    }
  }, [jumlahGajiBersih]);

  useEffect(() => {
    setDisable(false);
    setJenisDisable(false);
    SetTidakSesuai(false);
    const masuk = DateDiffUsiaMasuk(
      currData.DataPembiayaan.tanggal_lahir,
      moment(currData.DataPembiayaan.created_at).format("YYYY-MM-DD")
    );
    setTanggalLahir(currData.DataPembiayaan.tanggal_lahir);
    setGajiBersih(formatNumber(currData.DataPembiayaan.gaji_bersih.toFixed(0)));
    setTranggalMasuk({
      tahunMasuk: masuk.tahun.toString(),
      bulanMasuk: masuk.bulan.toString(),
      hariMasuk: masuk.hari.toString(),
    });
    setSelectedProduk(currData.DataPembiayaan.Produk);
    setSelectedBank({
      ...currData.Bank,
      products: [currData.DataPembiayaan.Produk],
    });
    setSelectedJenis(currData.DataPembiayaan.JenisPembiayaan);
    setTenor(currData.DataPembiayaan.tenor);
    setPlafond(formatNumber(currData.DataPembiayaan.plafond.toFixed(0)));
    const byAngs = currData.Bank.by_angsuran / 100;
    const maxAngs = currData.DataPembiayaan.gaji_bersih * byAngs;
    setMaxAngsuran(formatNumber(maxAngs.toFixed(0).toString()));

    const angsuranPerbulan = ceiling(
      parseInt(
        getAngsuranPerBulan(
          currData.DataPembiayaan.mg_bunga,
          currData.DataPembiayaan.tenor,
          currData.DataPembiayaan.plafond
        )
      ),
      parseInt(process.env.NEXT_PUBLIC_APP_PEMBULATAN || "100")
    );
    const byAdmin =
      currData.DataPembiayaan.plafond *
      (currData.DataPembiayaan.by_admin / 100);
    const byAdminBank =
      currData.DataPembiayaan.plafond *
      (currData.DataPembiayaan.by_admin_bank / 100);
    const byCadangan =
      currData.DataPembiayaan.plafond *
      (currData.DataPembiayaan.by_lainnya / 100);
    const reffFee =
      currData.DataPembiayaan.plafond * (currData.DataPembiayaan.fee / 100);

    setAngsuranBulan(formatNumber(angsuranPerbulan.toFixed(0)));
    setTatalaksana(
      formatNumber(currData.DataPembiayaan.by_tatalaksana.toFixed(0))
    );
    setProvisi(currData.DataPembiayaan.by_provisi.toFixed(0));
    setByAdmin(formatNumber(byAdmin.toFixed(0)));
    setByAdminBank(formatNumber(byAdminBank.toFixed(0)));
    setByLainnya(formatNumber(byCadangan.toFixed(0)));
    setReffFee(currData.DataPembiayaan.fee);
    setBlokir(currData.DataPembiayaan.blokir);
    setBpp(formatNumber(currData.DataPembiayaan.bpp.toFixed(0)));
    setPelunasan(formatNumber(currData.DataPembiayaan.pelunasan.toFixed(0)));
  }, []);
  return (
    <section>
      <div className="bg-orange-500 p-2 rounded">
        <h1 className="text-1xl font-semibold text-gray-200">
          Data Pembiayaan
        </h1>
      </div>
      <div className="my-5">
        <div>
          <div className="">
            <div className="flex-1">
              <div className="block md:flex gap-5">
                <Form.Item
                  label="Juru Bayar Asal"
                  name={"juru_bayar_asal"}
                  className="w-full md:w-50"
                >
                  <Input
                    onChange={(e) => setJuruAsal(e.target.value)}
                    defaultValue={currData.DataPembiayaan.juru_bayar_asal || ""}
                  />
                </Form.Item>
                <Form.Item
                  label="Juru Bayar Tujuan"
                  name={"juru_bayar_tujuan"}
                  className="w-full md:w-50"
                >
                  <Input
                    onChange={(e) => setJuruTujuan(e.target.value)}
                    defaultValue={
                      currData.DataPembiayaan.juru_bayar_tujuan || ""
                    }
                  />
                </Form.Item>
              </div>
              <div className="flex gap-5">
                <Form.Item
                  label="Pembiayaan Sebelumnya"
                  className="w-full md:w-50"
                >
                  <Input
                    disabled={disable}
                    data-hitung="simulasi-ulang"
                    onChange={(e) => setpembiayaanSebelumnya(e.target.value)}
                    defaultValue={
                      currData.DataPembiayaan.pembiayaan_sebelumnya || ""
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Nama Bank"
                  name={"nama_bank"}
                  className="w-full md:w-50"
                >
                  <Input
                    onChange={(e) => setNamaBank(e.target.value)}
                    defaultValue={currData.DataPembiayaan.nama_bank || ""}
                  />
                </Form.Item>
              </div>
              <div className="block md:flex gap-5">
                <Form.Item
                  label="No Rekening"
                  name={"no_rekening"}
                  className="w-full md:w-50"
                >
                  <Input
                    onChange={(e) => setNoBank(e.target.value)}
                    defaultValue={currData.DataPembiayaan.no_rekening || ""}
                  />
                </Form.Item>
                <Form.Item
                  label="Tempat Lahir"
                  name={"tempat_lahir"}
                  className="w-full md:w-50"
                  required
                >
                  <Input
                    onChange={(e) => setTempatLahir(e.target.value)}
                    required
                    defaultValue={currData.DataPembiayaan.tempat_lahir || ""}
                  />
                </Form.Item>
              </div>
              <div className="block md:flex gap-5 items-end justify-between">
                <Form.Item
                  label="Tanggal Lahir"
                  className=" w-full md:w-30 flex-1"
                  required
                >
                  <Input
                    style={{
                      backgroundColor: "white",
                      color: "black",
                    }}
                    placeholder="dd-mm-yyyy"
                    id="tanggal-masuk"
                    value={tanggalLahir}
                    required
                    maxLength={10}
                    onChange={(e) => handleTanggalLahir(e.target.value)}
                  />
                  {tglLahirError && (
                    <div className="text-red-500 text-xs italic">
                      <InfoCircleFilled /> Tanggal lahir tidak sesuai!
                    </div>
                  )}
                </Form.Item>
                <div className="flex-1">
                  <div>Usia Masuk</div>
                  <div className="flex gap-2">
                    <Form.Item label="Tahun" required>
                      <Input
                        style={{ backgroundColor: "white", color: "black" }}
                        disabled
                        data-hitung="simulasi-ulang"
                        placeholder="0"
                        id="tahun-masuk"
                        value={tanggalMasuk.tahunMasuk}
                        required
                      />
                    </Form.Item>
                    <Form.Item label="Bulan">
                      <Input
                        style={{ backgroundColor: "white", color: "black" }}
                        disabled
                        data-hitung="simulasi-ulang"
                        placeholder="0"
                        id="bulan-masuk"
                        value={tanggalMasuk.bulanMasuk}
                      />
                    </Form.Item>
                    <Form.Item label="Hari">
                      <Input
                        disabled
                        style={{ backgroundColor: "white", color: "black" }}
                        data-hitung="simulasi-ulang"
                        placeholder="0"
                        id="hari-masuk"
                        value={tanggalMasuk.hariMasuk}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="block md:flex justify-between gap-4">
                <Form.Item
                  label="Gaji Bersih"
                  className="w-full md:w-50"
                  required
                >
                  <Input
                    required
                    style={{ backgroundColor: "white", color: "black" }}
                    disabled={disable}
                    data-hitung="simulasi-ulang"
                    onChange={(e) => handleGajiBersih(e.target.value)}
                    value={gajiBersih}
                  />
                </Form.Item>

                <div className="w-full md:w-50">
                  <Form.Item label="Produk Pembiayaan" required>
                    <Select
                      disabled={disable}
                      defaultValue={currData.DataPembiayaan.produk_id}
                      placeholder="- Produk Pembiayaan -"
                      options={data}
                      id="produk-pembiayaan"
                      onChange={(e) => handleProduk(e)}
                    />
                    {produkTidakSesuai && (
                      <div className="text-red-500 text-xs italic">
                        <InfoCircleFilled /> Produk tidak sesuai usia
                      </div>
                    )}
                    {produkSesuai && (
                      <div className="text-blue-500 text-xs italic">
                        <InfoCircleFilled /> Produk tersedia: {produkSesuai}
                      </div>
                    )}
                  </Form.Item>
                </div>
              </div>
              <div className="block md:flex items-end justify-between gap-5">
                <Form.Item
                  label="Jenis Pembiayaan"
                  className="w-full md:w-50 flex-1"
                  required={jenisDisable}
                >
                  <Select
                    disabled={jenisDisable}
                    value={selectedJenis && selectedJenis.name}
                    placeholder="- Jenis Pembiayaan -"
                    options={jenisPembiayaan}
                    id="jenis-pembiayaan"
                    onChange={(e) => handleJenisPembiayaan(e)}
                  />
                </Form.Item>
                <Form.Item
                  label="Jenis Margin"
                  name={"jenis_margin"}
                  required
                  rules={[{ required: true, message: "Mohon isi field ini!" }]}
                  className="flex-1"
                >
                  <Select
                    showSearch
                    onChange={(e) => setJenisMargin(e)}
                    options={[
                      { label: "FLAT", value: "FLAT" },
                      { label: "ANUITAS", value: "ANUITAS" },
                    ]}
                  />
                </Form.Item>
              </div>
              <div className="block md:flex items-end justify-between gap-5">
                <Form.Item
                  required
                  label="Refferal"
                  className="w-full md:w-50 flex-1"
                  name={"refferal_id"}
                >
                  <Select
                    disabled={disable}
                    placeholder="- Refferal -"
                    options={refferal && refferal}
                    onChange={(e) => setReffId(e)}
                    style={{ backgroundColor: "white", color: "black" }}
                    defaultValue={currData.DataPembiayaan.Refferal.name}
                  />
                </Form.Item>
                <div className="flex gap-2 items-end flex-1">
                  <Form.Item
                    label="Refferal Fee (%)"
                    className="w-full md:w-50"
                  >
                    <Input
                      style={{ backgroundColor: "white", color: "black" }}
                      disabled={disable}
                      onChange={(e) => setReffFee(parseFloat(e.target.value))}
                      data-hitung="simulasi-ulang"
                      type="tel"
                      defaultValue={currData.DataPembiayaan.fee}
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Rekomendasi Pembiayaan */}
              <div className="p-2 bg-orange-500 rounded text-gray-200 w-full">
                <div className="font-semibold">Rekomendasi Pembiayaan</div>
                <div className="text-xs text-gray-300">
                  Rekomendasi Tenor dan Plafond yang bisa di gunakan
                </div>
              </div>
              <div className="flex justify-between gap-3 items-end">
                <Form.Item label="Tenor" className="flex-1" required>
                  <Input
                    style={{ backgroundColor: "white", color: "black" }}
                    required
                    placeholder="0"
                    disabled={disable}
                    data-hitung="simulasi-ulang"
                    value={tenor ? tenor.toString() : "0"}
                    onChange={(e) =>
                      setTenor(parseInt((e.target.value || 0).toString()))
                    }
                  />
                  {tenor_msg && (
                    <div className="text-red-500 text-xs italic">
                      <InfoCircleFilled /> Tenor melebihi batas
                    </div>
                  )}
                </Form.Item>
                <Form.Item label="Max Tenor" className="flex-1">
                  <Input
                    style={{ backgroundColor: "white", color: "black" }}
                    placeholder="0"
                    disabled
                    data-hitung="simulasi-ulang"
                    value={
                      tanggalMasuk.tahunMasuk != "0" ? parseInt(maxtenor) : "0"
                    }
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between gap-3 items-end">
                <Form.Item label="Plafond" className="flex-1" required>
                  <Input
                    required
                    placeholder="0"
                    disabled={disable}
                    style={{ backgroundColor: "white", color: "black" }}
                    data-hitung="simulasi-ulang"
                    value={plafond}
                    onChange={(e) => handlePlafond(e.target.value)}
                  />
                  {plafond_msg && (
                    <div className="text-red-500 text-xs italic">
                      <InfoCircleFilled /> Plafond melebihi batas
                    </div>
                  )}
                </Form.Item>
                <Form.Item label="Max Plafond" className="flex-1">
                  <Input
                    style={{ backgroundColor: "white", color: "black" }}
                    placeholder="0"
                    disabled
                    data-hitung="simulasi-ulang"
                    value={maxPlafond}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between gap-3 items-end">
                <Form.Item label="Angsuran" className="flex-1">
                  <Input
                    style={{ backgroundColor: "white", color: "black" }}
                    placeholder="0"
                    disabled
                    data-hitung="simulasi-ulang"
                    value={angsuranBulan}
                  />
                </Form.Item>
                <Form.Item label="Max Angsuran" className="flex-1">
                  <Input
                    placeholder="0"
                    disabled
                    data-hitung="simulasi-ulang"
                    value={maxAngsuran}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
              </div>
              {/* End Rekomendasi Pembiayaan */}
            </div>
            <div className="flex-1 mt-2">
              <div className="flex justify-between p-2 bg-orange-500 rounded text-gray-200 font-semibold w-full">
                <span>Keterangan Biaya</span>
                <span>Nominal (RP)</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Administrasi</div>
                    <div className="text-xs">Biaya admin koperasi</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {by_admin || 0}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Admin Bank</div>
                    <div className="text-xs">Biaya admin bank</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {byAdminBank || 0}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">
                      Pencadangan Pusat
                    </div>
                    <div className="text-xs">Biaya pencadangan pusat</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {byLainnya || 0}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Tatalaksana</div>
                    <div className="text-xs">Biaya tatalaksana</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {by_tatalaksana || 0}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Asuransi</div>
                    <div className="text-xs">Biaya asuransi (NON-BPP)</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {formatNumber(
                      (
                        inputTextToDecimal(plafond || "0") *
                        ((selectedProduk?.by_asuransi || 0) / 100)
                      ).toFixed(0)
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Buka Rekening</div>
                    <div className="text-xs">Biaya buka rekening</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {formatNumber(
                      (selectedBank?.by_buka_rekening || 0).toFixed(0)
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Maretrai</div>
                    <div className="text-xs">Biaya materai</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {formatNumber((selectedBank?.by_materai || 0).toFixed(0))}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Refferal</div>
                    <div className="text-xs">Biaya refferal</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {formatNumber(
                      (
                        ((reffFee || 0) / 100) *
                        inputTextToDecimal(plafond || "0")
                      ).toFixed(0)
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Data Informasi</div>
                    <div className="text-xs">Biaya data informasi</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {formatNumber(
                      (
                        (selectedBank?.by_flagging || 0) +
                        (selectedBank?.by_epotpen || 0)
                      ).toFixed(0)
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Mutasi</div>
                    <div className="text-xs">Status pindah kantor bayar</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {formatNumber((selectedJenis?.by_mutasi || 0).toFixed(0))}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Provisi</div>
                    <div className="text-xs">Biaya provisi</div>
                  </div>
                  <div className="w-20 md:w-32 text-center">
                    <Input
                      className="text-center"
                      onChange={(e) => setProvisi(e.target.value)}
                      value={formatNumber(provisi)}
                      disabled={disable}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      Retensi Angsuran
                    </div>
                    <div className="text-xs">Jumlah retensi angsuran</div>
                  </div>
                  <div className="flex-1 flex gap-5 justify-end">
                    <div className="w-12 md:w-32 text-center">
                      <Input
                        placeholder="0"
                        disabled
                        className="text-center"
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    </div>
                    <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                      0
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Blokir Angsuran</div>
                    <div className="text-xs">Jumlah blokir angsuran</div>
                  </div>
                  <div className="flex-1 flex gap-5 justify-end">
                    <div className="w-12 md:w-32 text-center">
                      <Input
                        onChange={(e) =>
                          setBlokir(parseInt(e.target.value || "0"))
                        }
                        value={blokir}
                        className="text-center"
                        disabled={disable}
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    </div>
                    <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                      {formatNumber(
                        (
                          (blokir || 0) *
                          inputTextToDecimal(angsuranBulan || "0")
                        ).toFixed(0)
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Terima Kotor</div>
                    <div className="text-xs">Jumlah terima kotor</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {formatNumber(kotor || "0")}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm text-red-500">
                      BPP
                    </div>
                    <div className="text-xs">Nominal BPP</div>
                  </div>
                  <div className="w-20 md:w-32 py-1-center">
                    <Input
                      className="text-center"
                      onChange={(e) => setBpp(e.target.value)}
                      value={formatNumber(bpp)}
                      disabled={disable}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">
                      Nominal Pelunasan
                    </div>
                    <div className="text-xs">Jumlah pelunasan ke mitra</div>
                  </div>
                  <div className="w-20 md:w-32 text-center">
                    <Input
                      className="text-center"
                      onChange={(e) => setPelunasan(e.target.value)}
                      value={formatNumber(pelunasan)}
                      disabled={disable}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Terima Bersih</div>
                    <div className="text-xs">Jumlah terima bersih</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {formatNumber(bersih || "0")}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <div className="font-semibold text-sm">Sisa Gaji</div>
                    <div className="text-xs">Sisa gaji setiap bulan</div>
                  </div>
                  <div className="border rounded w-20 md:w-32 py-1 px-2 text-center">
                    {formatNumber(
                      (
                        inputTextToDecimal(gajiBersih || "0") -
                        inputTextToDecimal(angsuranBulan || "0")
                      ).toFixed(0)
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={modalMsg}
        onCancel={() => setModalMsg(false)}
        title={<div className="text-red-500">Produk Tidak Sesuai Usia!</div>}
      >
        <p>
          Maaf produk yang dipilih tidak sesuai dengan usia pengajuan. Mohon
          pilih produk yang sesuai :
          <span className="italic text-green-500 px-2">
            {produkSesuai && produkSesuai}
          </span>
        </p>
      </Modal>
      <Modal
        open={requiredModal}
        onCancel={() => setRequiredModal(false)}
        onOk={() => setRequiredModal(false)}
        title={<span className="text-red-500">Data Tidak Lengkap</span>}
      >
        Mohon lengkapi data yang berlabel Bintang!
      </Modal>
      <Modal
        open={modalGajiBersih}
        onCancel={() => setModalGajiBersih(false)}
        onOk={() => setModalGajiBersih(false)}
        title="Keterangan Gaji Bersih"
      >
        <div className="text-red-600 p-5">
          <p>
            Minimun sisa gaji untuk pengajuan Flash Sisa Gaji adalah Rp. 100.000
          </p>
          <p>
            Mohon maaf perhitungan simulasi yang diajukan tidak memenuhi
            persyaratan!
          </p>
        </div>
      </Modal>
    </section>
  );
}
