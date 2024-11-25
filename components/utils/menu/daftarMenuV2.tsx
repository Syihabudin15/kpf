import React from "react";
import {
  ConsoleSqlOutlined,
  DatabaseOutlined,
  MoneyCollectOutlined,
  UserOutlined,
  BookOutlined,
  DeploymentUnitOutlined,
  HddOutlined,
  GoldOutlined,
  HomeOutlined,
  CalculatorOutlined,
  ExperimentOutlined,
  ReadOutlined,
  DiffOutlined,
  FormOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  SnippetsOutlined,
  HeatMapOutlined,
  BankOutlined,
  SettingOutlined,
  HistoryOutlined,
  RadarChartOutlined,
  PieChartOutlined,
  AccountBookOutlined,
} from "@ant-design/icons";

export interface MenuItem {
  label: string;
  url: string;
  icon?: string | React.ReactNode;
  role: string | string[];
}

export interface Menus extends MenuItem {
  child?: MenuItem[];
}

export const menusV2: Menus[] = [
  {
    label: "Dashboard",
    url: "/dashboard",
    icon: <HomeOutlined />,
    role: ["ALL"],
  },
  {
    label: "Simulasi",
    url: "simulasi",
    role: ["MASTER", "ENTRY_DATA", "MARKETING"],
    icon: <CalculatorOutlined />,
    child: [
      {
        label: "Hitung Simulasi",
        url: "/simulasi",
        role: ["MASTER", "ENTRY_DATA", "MARKETING"],
        icon: <ExperimentOutlined />,
      },
      {
        label: "Simulasi Deviasi",
        url: "/simulasi/deviasi",
        role: ["MASTER", "ENTRY_DATA"],
        icon: <ExperimentOutlined />,
      },
      {
        label: "Data Simulasi",
        url: "/data-simulasi",
        role: ["MASTER", "ENTRY_DATA", "MARKETING"],
        icon: <DiffOutlined />,
      },
    ],
  },
  {
    label: "Data Bisnis",
    url: "/data-bisnis",
    role: ["MASTER", "BISNIS"],
    icon: <RadarChartOutlined />,
    child: [
      {
        label: "Area",
        url: "/data-bisnis/area",
        role: ["MASTER", "BISNIS"],
        icon: <PieChartOutlined />,
      },
    ],
  },
  // MASTER
  {
    label: "Monitoring Pembiayaan",
    url: "/monitoring/pusat",
    role: [
      "MASTER",
      "VERIFIKASI",
      "OPERASIONAL",
      "PEMBERKASAN",
      "BISNIS",
      "KEUANGAN",
    ],
    icon: <ReadOutlined />,
  },
  {
    label: "Pengajuan Disimpan",
    url: "/save-pengajuan",
    role: ["OPERASIONAL"],
    icon: <FolderOpenOutlined />,
  },
  // Entry Data
  {
    label: "Monitoring Pembiayaan",
    url: "/monitoring/entry-data",
    role: "ENTRY_DATA",
    icon: <ReadOutlined />,
  },
  // Marketing
  {
    label: "Monitoring Pembiayaan",
    url: "/monitoring/marketing",
    role: "MARKETING",
    icon: <ReadOutlined />,
  },
  // Bank
  {
    label: "Monitoring Pembiayaan",
    url: "/monitoring/bank",
    role: ["BANK", "CHECKER", "MAKER", "APPROVAL"],
    icon: <ReadOutlined />,
  },
  {
    label: "Pengajuan Slik",
    url: "/slik",
    role: ["BANK", "MASTER", "ENTRY_DATA"],
    icon: <DiffOutlined />,
    child: [
      {
        label: "Input Pengajuan Slik",
        url: "/slik/input",
        role: ["ENTRY_DATA", "MASTER"],
        icon: <FormOutlined />,
      },
      {
        label: "Antrian Slik",
        url: "/slik/antrian",
        role: ["BANK", "MASTER"],
        icon: <FormOutlined />,
      },
      {
        label: "Riwayat Slik",
        url: "/slik/riwayat",
        role: ["BANK", "MASTER"],
        icon: <BookOutlined />,
      },
    ],
  },
  {
    label: "Pengajuan SI",
    role: ["BANK"],
    url: "/pencairan-bank",
    icon: <BankOutlined />,
    child: [
      {
        label: "Pengajuan Pencairan",
        role: ["BANK"],
        url: "/slik/pencairan",
        icon: <MoneyCollectOutlined />,
      },
      {
        label: "Riwayat Pencairan Mitra",
        role: ["BANK"],
        url: "/slik/riwayat-pencairan-mitra",
        icon: <BookOutlined />,
      },
      {
        label: "Pencairan Tahap 2",
        url: "/operasional/pencairan-tahap-2",
        role: ["MASTER", "OPERASIONAL", "BANK"],
        icon: <FormOutlined />,
      },
      {
        label: "Dokumen Pengajuan Mitra",
        role: ["BANK"],
        url: "/slik/dokumen-pengajuan-mitra",
        icon: <FolderOpenOutlined />,
      },
    ],
  },
  // Verifikasi
  {
    label: "Pengajuan Pembiayaan",
    url: "/verifikasi/",
    role: ["VERIFIKASI", "MASTER"],
    icon: <DiffOutlined />,
    child: [
      {
        label: "Antrian Verifikasi",
        url: "/verifikasi/antrian",
        role: ["VERIFIKASI", "MASTER"],
        icon: <FormOutlined />,
      },
      {
        label: "Riwayat Verifikasi",
        url: "/verifikasi/riwayat",
        role: ["VERIFIKASI", "MASTER"],
        icon: <BookOutlined />,
      },
    ],
  },
  {
    label: "Pengajuan Komite",
    url: "/pengajuan-komite",
    role: ["CHECKER", "MAKER", "MASTER", "APPROVAL"],
    icon: <DiffOutlined />,
    child: [
      {
        label: "Antrian Pengajuan Komite",
        url: "/pengajuan-komite/approval",
        role: ["APPROVAL", "MASTER"],
        icon: <FormOutlined />,
      },
      {
        label: "Riwayat Pengajuan Komite",
        url: "/pengajuan-komite/riwayat",
        role: ["CHECKER", "MAKER", "MASTER", "APPROVAL"],
        icon: <BookOutlined />,
      },
    ],
  },
  {
    label: "Pengajuan  SI",
    url: "/operasional",
    role: ["MASTER", "OPERASIONAL", "PEMBERKASAN", "ENTRY_DATA"],
    icon: <DiffOutlined />,
    child: [
      {
        label: "Cetak SI Pencairan",
        url: "/operasional/cetak-si",
        role: ["MASTER", "OPERASIONAL"],
        icon: <FormOutlined />,
      },
      {
        label: "Pengajuan Pencairan",
        url: "/operasional/pencairan",
        role: ["MASTER", "OPERASIONAL"],
        icon: <FormOutlined />,
      },
      {
        label: "Pencairan Tahap 2",
        url: "/operasional/pencairan-tahap-2",
        role: ["MASTER", "OPERASIONAL", "BANK"],
        icon: <FormOutlined />,
      },
      {
        label: "Riwayat Pengajuan Bank",
        url: "/operasional/riwayat-pengajuan-bank",
        role: ["MASTER", "OPERASIONAL"],
        icon: <BookOutlined />,
      },
      {
        label: "Dokumen Pengajuan Mitra",
        url: "/operasional/pengajuan-mitra",
        role: ["MASTER", "OPERASIONAL", "PEMBERKASAN", "ENTRY_DATA"],
        icon: <FolderOpenOutlined />,
      },
    ],
  },
  {
    label: "Pemberkasan",
    url: "/pemberkasan",
    role: ["MASTER", "PEMBERKASAN"],
    icon: <DiffOutlined />,
    child: [
      {
        label: "Cari Berkas Pembiayaan",
        url: "/pemberkasan/cari-berkas",
        role: ["MASTER", "PEMBERKASAN"],
        icon: <FileSearchOutlined />,
      },
      {
        label: "Cetak Penyerahan Berkas",
        url: "/pemberkasan/cetak-berkas",
        role: ["MASTER", "PEMBERKASAN"],
        icon: <FormOutlined />,
      },
      {
        label: "Upload Surat Berkas",
        url: "/pemberkasan/upload-surat-berkas",
        role: ["MASTER", "PEMBERKASAN"],
        icon: <FormOutlined />,
      },
      {
        label: "Daftar Penyerahan Jaminan",
        url: "/pemberkasan/cetak-jaminan",
        role: ["MASTER", "PEMBERKASAN"],
        icon: <FormOutlined />,
      },
      {
        label: "Penyerahan Jaminan",
        url: "/pemberkasan/upload-jaminan",
        role: ["MASTER", "PEMBERKASAN"],
        icon: <FormOutlined />,
      },
    ],
  },
  {
    label: "Angsuran",
    url: "angsuran",
    role: ["MASTER", "BISNIS", "OPERASIONAL", "KEUANGAN"],
    icon: <DiffOutlined />,
    child: [
      {
        label:
          "Flash Bulan " +
          new Date().toLocaleString("id-ID", {
            month: "long",
          }),
        url: "/angsuran/flash-bulanan",
        role: ["MASTER", "BISNIS", "OPERASIONAL", "KEUANGAN"],
        icon: <SnippetsOutlined />,
      },
      {
        label: "Tunggakan Flash",
        url: "/angsuran/tunggakan-flash",
        role: ["MASTER", "BISNIS", "OPERASIONAL", "KEUANGAN"],
        icon: <HeatMapOutlined />,
      },
      {
        label:
          "Non-Flash Bulan " +
          new Date().toLocaleString("id-ID", {
            month: "long",
          }),
        url: "/angsuran/reguler-bulanan",
        role: ["MASTER", "BISNIS", "OPERASIONAL", "KEUANGAN"],
        icon: <SnippetsOutlined />,
      },
      {
        label: "Tunggakan Non-Flash",
        url: "/angsuran/tunggakan-reguler",
        role: ["MASTER", "BISNIS", "OPERASIONAL", "KEUANGAN"],
        icon: <HeatMapOutlined />,
      },
    ],
  },
  // ADMP
  // {
  //   label: "ADMP",
  //   url: "/admp",
  //   role: ["MASTER", "BISNIS", "ADMP", "PEMBERKASAN"],
  //   icon: <DiffOutlined />,
  //   child: [
  //     {
  //       label: "ADMP SK",
  //       url: "/admp/sk",
  //       role: ["MASTER", "BISNIS", "ADMP", "PEMBERKASAN"],
  //       icon: <DiffOutlined />,
  //     },
  //     {
  //       label: "ADMP Express",
  //       url: "/admp/express",
  //       role: ["MASTER", "BISNIS", "ADMP", "PEMBERKASAN"],
  //       icon: <DiffOutlined />,
  //     },
  //   ],
  // },
  {
    label: "Laporan Administrasi",
    url: "/laporan-administrasi",
    role: [
      "MASTER",
      "BISNIS",
      "OPERASIONAL",
      "VERIFIKASI",
      "KEUANGAN",
      "BANK",
      "APPROVAL",
    ],
    icon: <DiffOutlined />,
    child: [
      {
        label: "Daftar Nominatif",
        url: "/laporan-administrasi/daftar-nominatif",
        role: [
          "MASTER",
          "BISNIS",
          "KEUANGAN",
          "OPERASIONAL",
          "VERIFIKASI",
          "BANK",
          "APPROVAL",
        ],
        icon: <DiffOutlined />,
      },
      {
        label: "Arus Kas",
        url: "/laporan-administrasi/arus-kas",
        role: ["MASTER", "OPERASIONAL"],
        icon: <DiffOutlined />,
      },
      {
        label: "Daftar Outstanding Aktif",
        url: "/laporan-administrasi/outstanding-aktif",
        role: [
          "BANK",
          "MASTER",
          "BISNIS",
          "KEUANGAN",
          "OPERASIONAL",
          "VERIFIKASI",
        ],
        icon: <DiffOutlined />,
      },
      {
        label: "Laporan Bulanan",
        url: "/laporan-administrasi/laporan-bulanan",
        role: ["MASTER", "BISNIS", "KEUANGAN", "OPERASIONAL"],
        icon: <DiffOutlined />,
      },
      {
        label: "Fixed Cost",
        url: "/laporan-administrasi/fixed-cost",
        role: ["MASTER", "BISNIS", "KEUANGAN", "OPERASIONAL"],
        icon: <DiffOutlined />,
      },
      {
        label: "Alternatif Cost",
        url: "/laporan-administrasi/alternatif-cost",
        role: ["MASTER", "BISNIS", "KEUANGAN", "OPERASIONAL"],
        icon: <DiffOutlined />,
      },
      {
        label: "Pembayaran Asuransi",
        url: "/laporan-administrasi/pembayaran-asuransi",
        role: ["MASTER", "BISNIS", "KEUANGAN", "OPERASIONAL"],
        icon: <DiffOutlined />,
      },
      {
        label: "Pelunasan Debitur",
        url: "/laporan-administrasi/pelunasan",
        role: ["MASTER", "REPAYMENT"],
        icon: <DiffOutlined />,
      },
      {
        label: "Pelunasan Debitur",
        url: "/laporan-administrasi/pelunasan-debitur",
        role: ["BANK", "APPROVAL", "BANK"],
        icon: <DiffOutlined />,
      },
    ],
  },
  {
    label: "Data Karyawan",
    url: "/data-karyawan",
    role: ["MASTER", "BISNIS", "OPERASIONAL", "KEUANGAN"],
    icon: <DiffOutlined />,
  },
  {
    label: "Data Taspen",
    url: "/flagging",
    role: ["MASTER"],
    icon: <DiffOutlined />,
  },
  {
    label: "Ganti Password",
    url: "/setting/ganti-password",
    role: "ALL",
    icon: <SettingOutlined />,
  },
  {
    label: "History",
    url: "/deleted",
    role: ["MASTER", "BISNIS"],
    icon: <HistoryOutlined />,
    child: [
      {
        label: "Pengajuan Dihapus",
        url: "/deleted/pengajuan",
        role: ["MASTER", "BISNIS"],
        icon: <DiffOutlined />,
      },
    ],
  },
  {
    label: "Management",
    url: "/management",
    role: ["MASTER"],
    icon: <DiffOutlined />,
  },
  {
    label: "Master Data",
    url: "/master",
    icon: <DatabaseOutlined />,
    role: ["MASTER"],
    child: [
      {
        label: "Master User",
        url: "/master/user",
        role: "MASTER",
        icon: <UserOutlined />,
      },
      {
        label: "Master Pembiayaan",
        url: "/master/pembiayaan",
        role: "MASTER",
        icon: <MoneyCollectOutlined />,
      },
      {
        label: "Unit Pelayanan",
        url: "/master/unit-pelayanan",
        role: ["MASTER"],
        icon: <DeploymentUnitOutlined />,
      },
      {
        label: "Master Refferal",
        url: "/master/refferal",
        role: ["MASTER"],
        icon: <GoldOutlined />,
      },
      {
        label: "Data Taspen",
        url: "/data-taspen",
        role: ["MASTER"],
        icon: <HddOutlined />,
      },
      {
        label: "Master Maintenance",
        url: "/master/maintenance",
        role: "MASTER",
        icon: <ConsoleSqlOutlined />,
      },
      {
        label: "Master Logging",
        url: "/master/logging",
        role: "MASTER",
        icon: <ConsoleSqlOutlined />,
      },
    ],
  },
  {
    label: "Mutasi & Flagging",
    url: "/mutasi-flagging",
    role: ["MASTER", "BISNIS", "PEMBERKASAN", "OPERASIONAL"],
    icon: <BookOutlined />,
  },
  {
    label: "Artikel",
    url: "/artikel",
    role: "MASTER",
    icon: <BookOutlined />,
  },
  {
    label: "Cek Database",
    url: "/cek-database",
    role: ["MASTER", "VERIFIKASI", "ENTRY_DATA"],
    icon: <DatabaseOutlined />,
  },
  {
    label: "Tagihan",
    url: "/tagihan",
    role: ["MASTER", "OPERASIONAL"],
    icon: <AccountBookOutlined />,
  },
];
