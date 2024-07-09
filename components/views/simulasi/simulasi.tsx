"use client";
import { Form, Input, Modal, Select, Spin, message, notification } from "antd";
import {
  CheckCircleOutlined,
  InfoCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  formatNumber,
  inputTextToDecimal,
} from "@/components/utils/inputUtils";
import { Bank, JenisPembiayaan, Produk } from "@prisma/client";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { getAngsuranPerBulan } from "./simulasiUtil";
import html2canvas from "html2canvas";
const { PV, PMT, EDATE } = require("@formulajs/formulajs");
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
export default function Simulasi() {
  const [data, setData] = useState<BankOptions[]>([]);
  const [dataBank, setDataBank] = useState<Produk[]>([]);
  const [jenisPembiayaan, setJenisPembiayaan] = useState<productOptions[]>([]);
  const [disable, setDisable] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
  const [jenisDisable, setJenisDisable] = useState(true);
  const [usiaLunas, setUsiaLunas] = useState("");
  const [tanggalLunas, setTanggalLunas] = useState("");
  const [provisi, setProvisi] = useState("0");
  const [modalMsg, setModalMsg] = useState(false);
  const [tglLahirError, setTglLahirError] = useState(false);
  const [nama, setNama] = useState<string>();
  const [nopen, setNopen] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [keterangan, setKeterangan] = useState("");
  const [ketItems, setKetItems] = useState([
    { label: "Prospek", value: "Prospek" },
    { label: "Ajuin", value: "Ajuin" },
  ]);
  const [fixKet, setFixKet] = useState();
  const [alamat, setAlamat] = useState<string>();
  const [requiredModal, setRequiredModal] = useState(false);
  const [gajiBersihModal, setGajiBersihModal] = useState(false);

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
      setUsiaLunas("");
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
      setBanks(result.result);
      const dataBankTmp: Produk[] = [];
      const convertToData = result.result.map((e: DataBank) => {
        return {
          label: e.name,
          options: e.products.map((p: Produk) => {
            dataBankTmp.push(p);
            return {
              label: p.name,
              value: e.id + "/" + p.id,
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
          setUsiaLunas("");
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
    if (filterBank[0]) {
      let prov = (filterBank[0].by_provisi || 0) / 100;
      setProvisi(formatNumber((inputTextToDecimal(plafond) * prov).toFixed(0)));
    }
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
      setUsiaLunas("");
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
    if (!selectedProduk || !plafond || !tenor) return;
    const result = ceiling(
      parseInt(
        getAngsuranPerBulan(
          selectedProduk.mg_bunga,
          tenor,
          inputTextToDecimal(plafond)
        )
      ),
      parseInt(selectedBank ? selectedBank.pembulatan.toString() : "1")
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
    let hari = splitting[0].length == 1 ? `0${splitting[0]}` : splitting[0];
    let bulan =
      splitting[1].length == 1
        ? `0${parseInt(splitting[1]) - 1}`
        : parseInt(splitting[1]) - 1;
    setTanggalLunas(moment(tgl).tz("Asia/Jakarta").format("DD-MM-YYYY"));

    // Usia Lunas
    if (tanggalMasuk.tahunMasuk && tanggalLunas != "") {
      const tglLahirSplt = tanggalLahir.split("-");
      const date1 = moment(tgl).tz("Asia/Jakarta");
      const date2 = moment([
        parseInt(tglLahirSplt[2]),
        parseInt(tglLahirSplt[1]) - 1,
        parseInt(tglLahirSplt[0]),
      ]).tz("Asia/Jakarta");

      const year = date1.diff(date2, "year");
      date2.add(year, "years");
      const month = date1.diff(date2, "months");
      date2.add(month, "months");
      const day = date1.diff(date2, "days");

      setUsiaLunas(`${year} Tahun ${month} Bulan ${day} Hari`);
      if (produkTidakSesuai || !tenor || tenor > parseInt(maxtenor)) {
        setTanggalLunas("");
        setUsiaLunas("");
      }
    }
  };
  // End My

  const cekSimulasi = () => {
    if (!nama || !nopen || !alamat) {
      return setRequiredModal(true);
    }
    setShowModal(true);
  };

  useEffect(() => {
    setTanggalLunas("");
    setUsiaLunas("");
    getMaxPlafond();
    setTenorMsg("");
    setPlafondMsg("");
    setGajiBersihModal(false);

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
    if (tenor && plafond && angsuranBulan && blokir) {
      const tmp = blokir * inputTextToDecimal(angsuranBulan);
      if (tmp >= inputTextToDecimal(plafond)) {
        setBlokir(0);
        message.error("Jumlah blokir angsuran melebihi jumlah plafond!");
      }
    }

    if (plafond) {
      getAngsuran();
      const plaf = inputTextToDecimal(plafond);
      if (selectedBank) {
        let prov = (selectedBank.by_provisi || 0) / 100;
        setProvisi(formatNumber((plaf * prov).toFixed(0)));
      }
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
        inputTextToDecimal(by_admin) -
        (selectedBank?.by_flagging || 0) -
        (selectedBank?.by_epotpen || 0) -
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
      const byAdmin = selectedBank
        ? (selectedBank?.by_admin +
            (selectedBank?.by_admin_bank || 0) +
            (selectedBank?.by_lainnya || 0)) /
          100
        : 0.2;
      const admin = inputTextToDecimal(plafond) * byAdmin;
      setByAdmin(formatNumber(admin.toFixed(0).toString()));
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
    jumlahGajiBersih,
  ]);

  useEffect(() => {
    setGajiBersihModal(false);
    if (
      jumlahGajiBersih !== "0" &&
      angsuranBulan !== "0" &&
      selectedProduk &&
      selectedProduk.name === "Flash Sisa Gaji" &&
      inputTextToDecimal(jumlahGajiBersih) <= 100000
    ) {
      setGajiBersihModal(true);
    } else {
      setGajiBersihModal(false);
    }
  }, [jumlahGajiBersih]);

  const addKetItems = () => {
    if (!keterangan) return;
    setKetItems((items) => [
      ...items,
      { label: keterangan, value: keterangan },
    ]);
    setKeterangan("");
  };
  const handleSave = async () => {
    setLoading(true);
    if (!tanggalLahir || !tenor || !plafond || !selectedProduk) {
      setLoading(false);
      return setRequiredModal(true);
    }
    const result = await fetch("/api/simulasi", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        name: nama,
        nopen,
        alamat,
        tanggal_lahir: tanggalLahir,
        gaji_bersih: inputTextToDecimal(gajiBersih),
        produk_id: selectedProduk?.id,
        jenis_pembiayaan_id: selectedJenis ? selectedJenis.id : null,
        tenor,
        plafond: inputTextToDecimal(plafond),
        blokir,
        bpp: inputTextToDecimal(bpp),
        pelunasan: inputTextToDecimal(pelunasan),
        keterangan: fixKet || "Simulasi",
        by_tatalaksana: inputTextToDecimal(by_tatalaksana),
        by_mutasi: inputTextToDecimal(by_mutasi),
        by_provisi: inputTextToDecimal(provisi),
        mg_bunga: selectedProduk.mg_bunga,
        by_admin: selectedBank?.by_admin,
        by_admin_bank: selectedBank?.by_admin_bank,
        by_lainnya: selectedBank?.by_lainnya,
        by_asuransi: selectedProduk.by_asuransi,
        by_buka_rekening: selectedBank?.by_buka_rekening,
        by_materai: selectedBank?.by_materai,
        by_flagging: selectedBank?.by_flagging,
        by_epotpen: selectedBank?.by_epotpen,
        is_simulasi: true,
        margin_bank: selectedBank?.margin_bank,
        pembulatan: parseInt(
          selectedBank ? selectedBank.pembulatan.toString() : "1"
        ),
      }),
    });
    const resultMsg = await result.json();
    if (result.ok) {
      notification.success({ message: resultMsg.msg });
    } else {
      notification.error({ message: resultMsg.msg });
    }
    setShowModal(false);
    setLoading(false);
  };

  const handleDownload = () => {
    const element = document.getElementById("analisa-perhitungan");
    if (!element) {
      return message.error("Download simulasi gagal. coba lagi nanti!");
    }
    html2canvas(element)
      .then((canvas) => {
        const myImage = canvas.toDataURL();
        const link = document.createElement("a");
        link.download = "simulasi.png";
        link.href = myImage;
        link.click();
      })
      .catch((err) => {
        message.error("Download simulasi gagal. coba lagi nanti!");
      });
  };

  return (
    <section className="rounded border shadow bg-white">
      <div className="bg-orange-500 p-2 rounded">
        <h1 className="text-1xl font-semibold text-gray-200">SIMULASI</h1>
        <p className="text-gray-300 text-xs">Kalkulasi Simulasi Makro</p>
      </div>
      <div className="my-5 px-2">
        <Form layout="vertical">
          <div className="block md:flex gap-5">
            <div className="flex-1">
              <Form.Item label="Tanggal Simulasi">
                <Input
                  disabled
                  value={new Date()
                    .toJSON()
                    .slice(0, 10)
                    .split("-")
                    .reverse()
                    .join("-")}
                  className="not-opacity-in-disabled"
                  style={{ backgroundColor: "white", color: "black" }}
                />
                <div className="text-red-500 text-xs italic">
                  <InfoCircleFilled /> Tanggal simulasi jangan dirubah
                </div>
              </Form.Item>
              <div className="flex justify-between gap-5">
                <Form.Item label="Nopen" className=" w-full md:w-30" required>
                  <Input
                    id="nopen"
                    value={nopen}
                    required
                    onChange={(e) => setNopen(e.target.value)}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                  {/* {tglLahirError && 
                                        <div className="text-red-500 text-xs italic">
                                            <InfoCircleFilled /> Tanggal lahir tidak sesuai!
                                        </div>
                                    } */}
                </Form.Item>
                <Form.Item
                  label="Nama Lengkap"
                  className=" w-full md:w-30"
                  required
                >
                  <Input
                    id="nama"
                    value={nama}
                    required
                    style={{ backgroundColor: "white", color: "black" }}
                    onChange={(e) => setNama(e.target.value)}
                  />
                  {/* {tglLahirError && 
                                        <div className="text-red-500 text-xs italic">
                                            <InfoCircleFilled /> Tanggal lahir tidak sesuai!
                                        </div>
                                    } */}
                </Form.Item>
              </div>
              <div className="block md:flex justify-between gap-5">
                <Form.Item label="Alamat" className=" w-full md:w-30" required>
                  <Input.TextArea
                    value={alamat}
                    required
                    onChange={(e) => setAlamat(e.target.value)}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
              </div>
              <div className="block md:flex justify-between gap-5">
                <Form.Item
                  label="Tanggal Lahir"
                  className=" w-full md:w-30"
                  required
                >
                  <Input
                    required
                    placeholder="dd-mm-yyyy"
                    id="tanggal-masuk"
                    value={tanggalLahir}
                    maxLength={10}
                    onChange={(e) => handleTanggalLahir(e.target.value)}
                  />
                  {tglLahirError && (
                    <div className="text-red-500 text-xs italic">
                      <InfoCircleFilled /> Tanggal lahir tidak sesuai!
                    </div>
                  )}
                </Form.Item>
                <div>
                  <div>Usia Masuk</div>
                  <div className="flex gap-2">
                    <Form.Item label="Tahun">
                      <Input
                        disabled
                        data-hitung="simulasi-ulang"
                        placeholder="0"
                        id="tahun-masuk"
                        value={tanggalMasuk.tahunMasuk}
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    </Form.Item>
                    <Form.Item label="Bulan">
                      <Input
                        disabled
                        data-hitung="simulasi-ulang"
                        placeholder="0"
                        id="bulan-masuk"
                        value={tanggalMasuk.bulanMasuk}
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    </Form.Item>
                    <Form.Item label="Hari">
                      <Input
                        disabled
                        data-hitung="simulasi-ulang"
                        placeholder="0"
                        id="hari-masuk"
                        value={tanggalMasuk.hariMasuk}
                        style={{ backgroundColor: "white", color: "black" }}
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
                    disabled={disable}
                    data-hitung="simulasi-ulang"
                    onChange={(e) => handleGajiBersih(e.target.value)}
                    value={gajiBersih}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>

                <div className="w-full md:w-50">
                  <Form.Item label="Produk Pembiayaan" required>
                    <Select
                      disabled={disable}
                      value={
                        selectedProduk &&
                        `${selectedProduk.bank_id}/${selectedProduk.id}`
                      }
                      placeholder="- Produk Pembiayaan -"
                      options={data}
                      id="produk-pembiayaan"
                      onChange={(e) => handleProduk(e)}
                      style={{ backgroundColor: "white", color: "black" }}
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
                  <Form.Item
                    label="Jenis Pembiayaan"
                    className="w-full md:w-50"
                  >
                    <Select
                      disabled={jenisDisable}
                      value={selectedJenis && selectedJenis.name}
                      placeholder="- Jenis Pembiayaan -"
                      options={jenisPembiayaan}
                      id="jenis-pembiayaan"
                      onChange={(e) => handleJenisPembiayaan(e)}
                      style={{ backgroundColor: "white", color: "black" }}
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
              <div className="flex justify-between gap-3">
                <Form.Item label="Tenor" className=" w-full md:w-30" required>
                  <Input
                    required
                    placeholder="0"
                    disabled={disable}
                    defaultValue={"0"}
                    data-hitung="simulasi-ulang"
                    value={tenor.toString()}
                    onChange={(e) =>
                      setTenor(parseInt((e.target.value || 0).toString()))
                    }
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                  {tenor_msg && (
                    <div className="text-red-500 text-xs italic">
                      <InfoCircleFilled /> Tenor melebihi batas
                    </div>
                  )}
                </Form.Item>
                <Form.Item label="Max Tenor" className=" w-full md:w-30">
                  <Input
                    placeholder="0"
                    disabled
                    data-hitung="simulasi-ulang"
                    value={tanggalMasuk.tahunMasuk != "0" ? maxtenor : "0"}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
                <Form.Item label="Max Angsuran" className=" w-full md:w-30">
                  <Input
                    placeholder="0"
                    disabled
                    data-hitung="simulasi-ulang"
                    value={maxAngsuran}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between gap-3">
                <Form.Item label="Plafond" className=" w-full md:w-30" required>
                  <Input
                    required
                    placeholder="0"
                    disabled={disable}
                    data-hitung="simulasi-ulang"
                    defaultValue={"0"}
                    value={plafond}
                    onChange={(e) => handlePlafond(e.target.value)}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                  {plafond_msg && (
                    <div className="text-red-500 text-xs italic">
                      <InfoCircleFilled /> Plafond melebihi batas
                    </div>
                  )}
                </Form.Item>
                <Form.Item label="Max Plafond" className=" w-full md:w-30">
                  <Input
                    placeholder="0"
                    disabled
                    data-hitung="simulasi-ulang"
                    value={maxPlafond}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
                <Form.Item label="Angsuran" className=" w-full md:w-30">
                  <Input
                    placeholder="0"
                    disabled
                    data-hitung="simulasi-ulang"
                    value={angsuranBulan}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                </Form.Item>
              </div>
              {/* End Rekomendasi Pembiayaan */}
            </div>
            <div className="flex-1 mt-8">
              <div className="flex justify-between p-2 bg-orange-500 rounded text-gray-200 font-semibold w-full">
                <span>Keterangan Biaya</span>
                <span>Nominal (RP)</span>
              </div>
              <table className="w-full table-border-bottom">
                <tbody className="pembiayaan">
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2">
                    <td>
                      <div className="font-semibold text-sm">Administrasi</div>
                      <div className="text-xs">Biaya administrasi</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          value={by_admin}
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2">
                    <td>
                      <div className="font-semibold text-sm">Tatalaksana</div>
                      <div className="text-xs">Biaya tatalaksana</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          value={by_tatalaksana != "0" ? by_tatalaksana : "0"}
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2">
                    <td>
                      <div className="font-semibold text-sm">Asuransi</div>
                      <div className="text-xs">Biaya asuransi (Non BPP)</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          value={formatNumber(
                            (
                              (inputTextToDecimal(plafond) || 0) *
                              ((selectedProduk?.by_asuransi || 0) / 100)
                            ).toFixed(0)
                          )}
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2">
                    <td>
                      <div className="font-semibold text-sm">Buka Rekening</div>
                      <div className="text-xs">Biaya buka rekening</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          style={{ backgroundColor: "white", color: "black" }}
                          disabled
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          value={formatNumber(
                            tanggalMasuk.tahunMasuk != "0" && selectedBank
                              ? selectedBank.by_buka_rekening?.toString()
                              : "0"
                          )}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2">
                    <td>
                      <div className="font-semibold text-sm">Materai</div>
                      <div className="text-xs">Biaya materai</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          value={formatNumber(
                            tanggalMasuk.tahunMasuk != "0" && selectedBank
                              ? selectedBank.by_materai.toString()
                              : "0"
                          )}
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2">
                    <td>
                      <div className="font-semibold text-sm">
                        Data Informasi
                      </div>
                      <div className="text-xs">Biaya Data Informasi</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          value={formatNumber(
                            (
                              (selectedBank?.by_epotpen || 0) +
                              (selectedBank?.by_flagging || 0)
                            ).toFixed(0)
                          )}
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2 will-hide-if-flash">
                    <td>
                      <div className="font-semibold text-sm">Mutasi</div>
                      <div className="text-xs">Status pindah kantor bayar</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          value={by_mutasi}
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2">
                    <td>
                      <div className="font-semibold text-sm">Provisi</div>
                      <div className="text-xs">Biaya provisi</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled={disable}
                          defaultValue={"0"}
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          value={provisi}
                          onChange={(e) =>
                            setProvisi(formatNumber(e.target.value || "0"))
                          }
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between items-center py-2 border-b border-gray-300 gap-5">
                    <td>
                      <div className="font-semibold text-sm">
                        Retensi Angsuran
                      </div>
                      <div className="text-xs">Jumlah angsuran</div>
                    </td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className=" w-full md:w-36">
                        <Input
                          disabled={true}
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className=" w-full md:w-36">
                        <Input
                          disabled
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          data-type="currency"
                          id="retensi-angsuran"
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between items-center py-2 border-b border-gray-300 gap-5">
                    <td>
                      <div className="font-semibold text-sm me-3">
                        Blokir Angsuran
                      </div>
                      <div className="text-xs">Jumlah blokir</div>
                    </td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled={disable}
                          placeholder="0"
                          defaultValue={"0"}
                          data-hitung="simulasi-ulang"
                          value={blokir}
                          onChange={(e) =>
                            setBlokir(parseInt(e.target.value) || 0)
                          }
                          type="number"
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className=" w-full md:w-36">
                        <Input
                          disabled
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          value={formatNumber(
                            (
                              blokir * inputTextToDecimal(angsuranBulan)
                            ).toString()
                          )}
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2">
                    <td>
                      <div className="font-semibold text-sm">Terima Kotor</div>
                      <div className="text-xs">Jumlah terima kotor</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          value={kotor}
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2">
                    <td>
                      <div className="font-semibold text-sm text-red-600">
                        BPP
                      </div>
                      <div className="text-xs">Nominal BPP</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled={disable}
                          placeholder="0"
                          defaultValue={"0"}
                          data-hitung="simulasi-ulang"
                          value={bpp}
                          onChange={(e) => setBpp(formatNumber(e.target.value))}
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2">
                    <td>
                      <div className="font-semibold text-sm">
                        Nominal Pelunasan
                      </div>
                      <div className="text-xs">Jumlah pelunasan ke Mitra</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled={disable}
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          defaultValue={"0"}
                          value={pelunasan}
                          onChange={(e) =>
                            setPelunasan(formatNumber(e.target.value))
                          }
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2">
                    <td>
                      <div className="font-semibold text-sm">Terima Bersih</div>
                      <div className="text-xs">Jumlah terima bersih</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          value={bersih}
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr className="flex justify-between border-b border-gray-300 items-center py-2">
                    <td>
                      <div className="font-semibold text-sm">Sisa Gaji</div>
                      <div className="text-xs">Sisa gaji setiap bulan</div>
                    </td>
                    <td></td>
                    <td className="pembiayaan-simulasi">
                      <Form.Item className="w-full md:w-36">
                        <Input
                          disabled
                          placeholder="0"
                          data-hitung="simulasi-ulang"
                          value={jumlahGajiBersih}
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-between mt-5">
            <button
              className="p-2 bg-blue-500 rounded text-gray-100"
              type="button"
              onClick={() => hitungUlang("all")}
            >
              Hitung Ulang
            </button>
            <button
              className="p-2 bg-orange-500 rounded text-gray-100"
              type="submit"
              onClick={() => cekSimulasi()}
            >
              Cek Simulasi
            </button>
          </div>
        </Form>
      </div>

      <Modal
        title={
          <>
            <div className="flex gap-5 items-center">
              <div>
                <img src={process.env.NEXT_PUBLIC_APP_LOGO} width={40} />
              </div>
              <span>Analisa Perhitungan</span>
            </div>
          </>
        }
        open={showModal}
        footer={[]}
        onCancel={() => setShowModal(!showModal)}
        wrapClassName="analisa-simulasi"
        width={"auto"}
        style={{ top: 40 }}
      >
        <Spin spinning={loading}>
          <div
            id="analisa-perhitungan"
            className="my-2 block sm:flex sm:justify-between"
          >
            <div className="flex-1 sm:px-2">
              <div
                className={`bg-${process.env.NEXT_PUBLIC_APP_JUDUL_ANALISA}-500 p-2 text-gray-100 font-semibold text-center`}
              >
                Data Pembiayaan
              </div>
              <div
                className="flex justify-between sm:py-0 border-b border-gray-200"
                style={{ padding: "2.5px 0" }}
              >
                <div>Tanggal Simulasi</div>
                <div className="text-right">
                  {new Date()
                    .toJSON()
                    .slice(0, 10)
                    .split("-")
                    .reverse()
                    .join("-")}
                </div>
              </div>
              <div
                className="flex justify-between sm:py-0 border-b border-gray-200"
                style={{ padding: "2.5px 0" }}
              >
                <div>Nama</div>
                <div className="text-right">{nama && nama}</div>
              </div>
              <div
                className="flex justify-between sm:py-0 border-b border-gray-200"
                style={{ padding: "2.5px 0" }}
              >
                <div>Nopen</div>
                <div className="text-right">{nopen && nopen}</div>
              </div>
              <div
                className="flex justify-between sm:py-0 border-b border-gray-200"
                style={{ padding: "2.5px 0" }}
              >
                <div>Tanggal Lahir</div>
                <div className="text-right">{tanggalLahir || "00-00-0000"}</div>
              </div>
              <div
                className="flex justify-between sm:py-0 border-b border-gray-200"
                style={{ padding: "2.5px 0" }}
              >
                <div>Usia Masuk</div>
                <div className="text-right">
                  {tanggalMasuk.tahunMasuk} Tahun {tanggalMasuk.bulanMasuk}{" "}
                  Bulan {tanggalMasuk.hariMasuk} Hari
                </div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200 font-bold">
                <div>Usia Lunas</div>
                <div className="text-right">{usiaLunas ? usiaLunas : "-"}</div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200 font-bold">
                <div>Tanggal Lunas</div>
                <div className="text-right">
                  {tanggalLunas ? tanggalLunas : "-"}
                </div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200 text-green-500 font-bold">
                <div>Gaji Bersih</div>
                <div className="text-right">{gajiBersih}</div>
              </div>
              <div
                className="flex justify-between sm:py-0 border-b border-gray-200"
                style={{ padding: "2.5px 0" }}
              >
                <div>Produk Pembiayaan</div>
                <div className="text-right">
                  {selectedProduk ? selectedProduk?.name : "-"}
                </div>
              </div>
              {selectedBank && selectedBank.kode === "BPR SIP" && (
                <div
                  className="flex justify-between sm:py-0 border-b border-gray-200"
                  style={{ padding: "2.5px 0" }}
                >
                  <div>Margin Bunga</div>
                  <div className="text-right">
                    {selectedProduk ? selectedProduk.mg_bunga : "0"}
                  </div>
                </div>
              )}
              <div
                className="flex justify-between sm:py-0 border-b border-gray-200"
                style={{ padding: "2.5px 0" }}
              >
                <div>Jenis Pembiayaan</div>
                <div className="text-right">
                  {selectedJenis ? selectedJenis?.name : "-"}
                </div>
              </div>
              <div
                className="flex justify-between sm:py-0 border-b border-gray-200"
                style={{ padding: "2.5px 0" }}
              >
                <div>Tenor</div>
                <div className="text-right">{tenor && tenor}</div>
              </div>
              <div
                className="flex justify-between sm:py-0 border-b border-gray-200"
                style={{ padding: "2.5px 0" }}
              >
                <div>Plafond</div>
                <div className="text-right">{plafond && plafond}</div>
              </div>
              <div
                className="flex justify-between sm:py-0 border-b border-gray-200"
                style={{ padding: "2.5px 0" }}
              >
                <div>Angsuran</div>
                <div className="text-right">
                  {angsuranBulan && angsuranBulan}
                </div>
              </div>
            </div>
            <div className="flex-1 sm:px-2">
              <div
                className={`bg-${process.env.NEXT_PUBLIC_APP_JUDUL_ANALISA}-500 p-2 text-gray-100 font-semibold text-center`}
              >
                Rincian Pembiayaan
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Biaya Administrasi</div>
                <div className="text-right">{by_admin && by_admin}</div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Biaya Tatalaksana</div>
                <div className="text-right">
                  {by_tatalaksana != "0" ? by_tatalaksana : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Biaya Asuransi</div>
                <div className="text-right">
                  {formatNumber(
                    (
                      parseInt(inputTextToDecimal(plafond || "0").toFixed(0)) *
                      (selectedProduk ? selectedProduk.by_asuransi / 100 : 0)
                    )
                      .toFixed(0)
                      .toString()
                  )}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Biaya Buka Rekening</div>
                <div className="text-right">
                  {selectedBank
                    ? formatNumber(selectedBank.by_buka_rekening.toString())
                    : "0"}
                </div>
              </div>
              <div
                className={`flex justify-between py-0 border-b border-gray-200 ${
                  selectedProduk?.name === "Flash Sisa Gaji" ? "hidden" : ""
                }`}
              >
                <div>Biaya Mutasi</div>
                <div className="text-right">
                  {by_mutasi != "0" ? by_mutasi : "0"}
                </div>
              </div>
              <div
                className={`flex justify-between py-0 border-b border-gray-200`}
              >
                <div>Biaya Provisi</div>
                <div className="text-right">
                  {provisi != "0" ? provisi : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Biaya Materai</div>
                <div className="text-right">
                  {selectedBank
                    ? formatNumber(selectedBank.by_materai.toString())
                    : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Biaya Data Informasi</div>
                <div className="text-right">
                  {selectedBank
                    ? formatNumber(
                        (
                          selectedBank.by_flagging + selectedBank.by_epotpen
                        ).toString()
                      )
                    : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Retensi Angsuran</div>
                <div className="text-right">0</div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Blokir Angsuran</div>
                {blokir !== 0 && (
                  <div>
                    {blokir}x {angsuranBulan}
                  </div>
                )}
                <div className="text-right">
                  {blokir &&
                    formatNumber(
                      (blokir * inputTextToDecimal(angsuranBulan)).toString()
                    )}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200 font-bold">
                <div>Terima Kotor</div>
                <div className="text-right">{kotor}</div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div className="text-red-500">BPP</div>
                <div className="text-right">{bpp}</div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Pelunasan</div>
                <div className="text-right">{pelunasan}</div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200 font-bold">
                <div>Terima Bersih</div>
                <div className="text-right">{bersih}</div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Sisa Gaji</div>
                <div className="text-right">{jumlahGajiBersih}</div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Info</div>
                <div className="text-right">
                  {jumlahGajiBersih &&
                  inputTextToDecimal(jumlahGajiBersih) <= 100000 ? (
                    <div className="text-red-500">
                      Tidak bisa mengajukan pinjaman Flash
                    </div>
                  ) : (
                    <div className="text-blue-500">
                      Silahkan mengajukan pinjaman Flash
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>
                  Keterangan <span className="text-red-500">*</span>
                </div>
                <div className="text-right">
                  <Select
                    style={{ width: 200 }}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Input
                          placeholder="lain-lain"
                          value={keterangan}
                          onChange={(e) => setKeterangan(e.target.value)}
                          suffix={
                            <button
                              className="text-xs text-green-500"
                              onClick={() => addKetItems()}
                            >
                              <CheckCircleOutlined />
                            </button>
                          }
                        />
                      </>
                    )}
                    options={ketItems}
                    onChange={(e) => setFixKet(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {/* <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow border"
              onClick={() => handleDownload()}
            >
              Download
            </button> */}
            <button
              className="bg-orange-500 text-gray-300 px-3 py-1 rounded shadow hover:bg-orange-600"
              onClick={() => handleSave()}
              disabled={loading}
            >
              {loading ? <LoadingOutlined /> : "Simpan"}
            </button>
          </div>
        </Spin>
      </Modal>

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
        title={
          <div className="text-red-500">
            Mohon lengkapi data terlebih dahulu!
          </div>
        }
      >
        <p>
          Mohon isi semua data inputan yang berlabel bintang untuk bisa
          melanjutkan proses simpan data simulasi.
        </p>
      </Modal>
      {/* End Modal */}

      <Modal
        open={gajiBersihModal}
        onCancel={() => setGajiBersihModal(false)}
        onOk={() => setGajiBersihModal(false)}
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
