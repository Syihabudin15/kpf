import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const bank = await prisma.bank.create({
    data: {
      name: "Bank BPR Bina Dana Swadaya",
      kode: "BPR",
      by_admin: 4,
      by_epotpen: 35000,
      by_flagging: 20000,
      by_tatalaksana: 500000,
      by_materai: 50000,
      by_buka_rekening: 50000,
      by_angsuran: 95,
      by_admin_bank: 1,
      by_lainnya: 0,
      margin_bank: 18,
      email: "binadanaswadaya@bprbds.co.id",
      alamat: "Jl. Dr. Saharjo No.206 B, Jakarta Selatan",
      no_telepon: "(021) 83784708",
      direktur: "Haryanto TJhajadi",

      logo: "/bank_logo/logo_bpr.jpg",
      up_direktur: "Haryanto TJhajadi",
      sk_akad: `PT. BANK PERKREDITAN RAKYAT BINA DANA SWADAYA, berkedudukan dan berkantor pusat di Jalan Dr. Saharjo Nomor 206 B, Menteng Dalam Tebet, Jakarta Selatan dengan Akta Pendirian Nomor 48, tanggal 18 Mei 2004, yang dibuat di hadapan Drs. Wijanto Suwongso, Sarjana Hukum, Notaris di Jakarta, yang telah disahkan Menteri Hukum dan Hak Asasi Manusia Republik Indonesia, dengan Surat Keputusan Nomor C-16770 HT.01.01.TH.2004 tanggal 6 Juli 2004 dan terakhir kali dilakukan perubahan berupa Akta Pernyataan Keputusan Para Pemegang Saham PT. Bank Perkreditan Rakyat Bina Dana Swadaya Nomor 23 tertanggal 11 September 2023, yang dibuat di hadapan Rusnaldy, SH, Notaris di Jakarta Selatan, yang telah dilaporkan dengan bukti Surat Penerimaan Pemberitahuan Data Perseroan Kementerian Hukum dan Hak Asasi Manusia Republik Indonesia Nomor AHU-AH.01.09-0163253 tertanggal 14 September 2023`,
    },
  });
  const koperasi = await prisma.bank.create({
    data: {
      name: "Koperasi Wahana",
      kode: "WAHANA",
      by_admin: 4,
      by_epotpen: 35000,
      by_flagging: 20000,
      by_tatalaksana: 500000,
      by_materai: 50000,
      by_buka_rekening: 50000,
      by_angsuran: 95,
      by_admin_bank: 1,
      by_lainnya: 0,
      margin_bank: 24,
      email: "",
      logo: "/bank_logo/logo_wahana.jpg",
      up_direktur: " Lodewijk HF Lantang",
      sk_akad: `Selaku Direktur bertindak untuk dan atas nama Koperasi Pemasaran Fadillah, yang berkedudukan di Bandung, yang beralamat di Jalan Perum Pondok Permai No.9 Kelurahan Panenjoan Kecamatan Cicalengka Kabupaten Bandung Provinsi Jawa Barat selanjutnya disebut “Koperasi Pemasaran Fadillah”`,
    },
  });

  const unitPelayanan = await prisma.unitPelayanan.create({
    data: { name: "JAWA BARAT 1", kode_area: "JABAR_1", number_kode: "001" },
  });

  const cabang = await prisma.unitCabang.create({
    data: {
      name: "BANDUNG",
      kode_area: "BDG",
      alamat_cabang: "-",
      number_code: "001",
      unit_pelayanan_id: unitPelayanan.id,
    },
  });

  const userPass = await bcrypt.hash("Tsani182", 10);
  const user = await prisma.user.createMany({
    data: [
      {
        first_name: "Syihabudin",
        last_name: "Tsani",
        username: "syihabudin",
        password: userPass,
        email: "syihabudin@kpf.co.id",
        no_telepon: "0881022157439",
        role: "MASTER",
        status_active: true,
        posisi: "IT",
        status_pkwt: "Baru",
        picture: "/profile/profile_default.svg",
        alamat: "Kp. Cantel 002/004 Margaasih Cicalengka",
        nik: "3204251108010006",
      },
    ],
  });

  const jenis = await prisma.jenisPembiayaan.createMany({
    data: [
      { name: "SK Di Tangan", by_mutasi: 0 },
      { name: "Rehab", by_mutasi: 0 },
      { name: "Take Over", by_mutasi: 0 },
      { name: "Mutasi", by_mutasi: 300000 },
      { name: "Mutasi Take Over", by_mutasi: 300000 },
    ],
  });

  const produk = await prisma.produk.createMany({
    data: [
      {
        name: "Gold",
        by_asuransi: 26,
        mg_bunga: 23.5,
        min_age: 67,
        max_age: 74.11,
        max_usia_lunas: 80,
        max_tenor: 120,
        max_plafon: 100000000,
        bank_id: bank.id,
      },
      {
        name: "Platinum",
        by_asuransi: 27,
        mg_bunga: 24.5,
        min_age: 74,
        max_age: 75.11,
        max_usia_lunas: 80,
        max_tenor: 60,
        max_plafon: 100000000,
        bank_id: bank.id,
      },
      {
        name: "Platinum Jelajah",
        by_asuransi: 28,
        mg_bunga: 25.5,
        min_age: 76,
        max_age: 79.11,
        max_usia_lunas: 85,
        max_tenor: 60,
        max_plafon: 100000000,
        bank_id: bank.id,
      },
      {
        name: "Platinum Plus",
        by_asuransi: 29,
        mg_bunga: 27.5,
        min_age: 80,
        max_age: 85,
        max_plafon: 100000000,
        max_usia_lunas: 85,
        max_tenor: 36,
        bank_id: bank.id,
      },
      {
        name: "Flash Sisa Gaji",
        by_asuransi: 24,
        mg_bunga: 40,
        min_age: 67,
        max_age: 90,
        max_usia_lunas: 90,
        max_tenor: 24,
        max_plafon: 15000000,
        bank_id: bank.id,
      },
      {
        name: "Flash Sisa Gaji",
        by_asuransi: 24,
        mg_bunga: 40,
        min_age: 67,
        max_age: 90,
        max_usia_lunas: 90,
        max_tenor: 24,
        max_plafon: 15000000,
        bank_id: koperasi.id,
      },
    ],
  });

  const refferal = await prisma.refferal.create({
    data: {
      name: "Koperasi Pemasaran Fadilah",
      kode: "KPF",
      alamat:
        "JL. Perum Pondok Permai Lestari Blok G-4 No.9 RT.003/011 Kec.Panenjoan Kel. Cicalengka Kabupaten Bandung",
      email: "koperasipemasaranfadillah@gmail.com",
      no_telepon: "0881022157439",
    },
  });

  console.log("Seeding succeesfully...");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
