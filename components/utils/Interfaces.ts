import {
  Bank,
  BerkasPengajuan,
  DataPembiayaan,
  DataPengajuan,
  DataPengajuanAlamat,
  DataPengajuanKeluarga,
  JenisPembiayaan,
  Produk,
  Refferal,
  UnitCabang,
  UnitPelayanan,
  User,
  DataDomisili,
  DataKeluarga,
  DataPasangan,
  DataTaspen,
  TunjanganPotongan,
  DataPencairan,
  PenyerahanBerkas,
  PenyerahanJaminan,
  JadwalAngsuran,
  Cost,
  PelunasanDebitur,
  Transaction,
  GiroBank,
  OutcomeCategory,
  BlogCategory,
  Blog,
} from "@prisma/client";

export interface DataDataTaspen extends DataTaspen {
  DataKeluarga: DataKeluarga[];
  Domisili: DataDomisili;
  DataPasangan: DataPasangan;
  TunjanganPotongan: TunjanganPotongan;
}

export interface DataProduk extends Produk {
  Bank: Bank;
}
export interface DataDataCabang extends UnitCabang {
  UnitPelayanan: UnitPelayanan;
}
export interface DataDataUser extends User {
  UnitCabang: DataDataCabang;
}
export interface DataDataPembiayaan extends DataPembiayaan {
  Produk: DataProduk;
  JenisPembiayaan: JenisPembiayaan;
  Refferal: Refferal;
  User: DataDataUser;
}
export interface DataDataPengajuan extends DataPengajuan {
  DataPembiayaan: DataDataPembiayaan;
  BerkasPengajuan: BerkasPengajuan;
  User: DataDataUser;
  DataTaspen: DataDataTaspen;
  Bank: Bank;
  DataPengajuanAlamat: DataPengajuanAlamat;
  DataPengajuanPasangan: DataPengajuanKeluarga;
  DataPencairan: DataPencairan;
  PenyerahanBerkas: PenyerahanBerkas;
  PenyerahanJaminan: PenyerahanJaminan;
  JadwalAngsuran: JadwalAngsuran[];
}

export interface DataDataTaspen extends DataTaspen {
  DataKeluarga: DataKeluarga[];
  Domisili: DataDomisili;
  DataPasangan: DataPasangan;
  TunjanganPotongan: TunjanganPotongan;
}

export interface Cabang extends UnitCabang {
  User: IUser[];
  unit: string;
}
export interface UP extends UnitPelayanan {
  UnitCabang: Cabang[];
}
export interface Options {
  label: string;
  value: string;
  options?: { label: string; value: string }[];
}
export interface BankOpt {
  label: string;
  value: string;
  options: Options[];
}

export interface BankWithDataPengajuan extends Bank {
  DataPengajuan: DataDataPengajuan[];
}
export interface savePencairan {
  id: string;
  tanggal_cetak: Date;
  nomor_surat: string;
  pengajuans: string[];
}
export interface DataDataPencairan extends DataPencairan {
  Bank: Bank;
  DataPengajuan: DataDataPengajuan[];
}

export interface DataPenyerahanBerkas extends PenyerahanBerkas {
  DataPengajuan: DataDataPengajuan[];
  Bank: Bank;
}
export interface DataPenyerahanJaminan extends PenyerahanJaminan {
  DataPengajuan: DataDataPengajuan[];
  Bank: Bank;
}

export interface DataTypePembiayaan extends DataPembiayaan {
  Produk: DataProduk;
  JenisPembiayaan: JenisPembiayaan;
}
export interface DataDashboardEntryData extends DataPengajuan {
  DataPembiayaan: DataPembiayaan;
}

export interface DataTypePengajuan extends DataPengajuan {
  DataPembiayaan: DataTypePembiayaan;
  Bank: Bank;
}

export interface DataUser extends User {
  DataPengajuan: DataTypePengajuan[];
}

export interface DataTableEntryData extends UnitCabang {
  User: DataUser[];
}

export interface DataTableBisnis extends UnitPelayanan {
  UnitCabang: DataTableEntryData[];
}

export interface PengajuanBank extends DataPengajuan {
  DataPembiayaan: DataPembiayaan;
}
export interface DataDashboardBank extends Produk {
  DataPengajuan: PengajuanBank[];
}

export interface DataCost extends Cost {
  User: User;
}

export interface AngsuranPengajuan extends JadwalAngsuran {
  margin_koperasi?: number;
  DataPengajuan: DataTypePengajuan;
}

export interface AngsuranDebitur extends DataPengajuan {
  JadwalAngsuran: JadwalAngsuranDebitur[];
  DataPembiayaan: DataTypePembiayaan;
}

export interface JadwalAngsuranDebitur extends JadwalAngsuran {
  DataPengajuan: DataDataPengajuan;
}

export interface DashboardAntri extends Bank {
  DataPengajuan: DataTypePengajuan;
}

export interface DataPelunasan extends PelunasanDebitur {
  DataPengajuan: DataDataPengajuan;
}

export type UploadType = "image" | "video" | "raw" | "auto" | undefined;

export interface IUser extends User {
  UnitCabang: UnitCabang;
}

export interface GiroPos extends GiroBank {
  balance: number | 0;
  Transaction: ITransaction[];
}

export interface ITransaction extends Transaction {
  OutcomeCategory: OutcomeCategory;
}

export interface DataCategory extends BlogCategory {
  Blog: Blog[];
}

export interface DataBlog extends Blog {
  Category: DataCategory;
}

export interface DataBankWithProduk extends Bank {
  products: Produk[];
}

export interface ITempBank {
  id: string;
  name: string;
  kode: string;
  by_admin: number;
  by_admin_bank: number;
  by_lainnya: number;
  by_tatalaksana: number;
  by_materai: number;
  by_buka_rekening: number;
  by_angsuran: number;
  by_flagging: number;
  by_epotpen: number;
  by_provisi: number;
  margin_bank: number;
  pembulatan: number;
}
export interface ITempProduk {
  id: string;
  name: string;
  by_asuransi: number;
  mg_bunga: number;
  min_age: number;
  max_age: number;
  max_usia_lunas: number;
  max_tenor: number;
  max_plafon: number;
}
export interface InputDapem {
  tanggal_simulasi: Date;
  tanggal_lahir: Date | null;
  tahun: number;
  bulan: number;
  hari: number;
  tanggal_lunas: string;
  usia_lunas: string;
  nama_pemohon: string | null;
  nopen: string | null;
  alamat: string | null;
  gaji: number;
  tenor: number;
  plafond: number;
  blokir: number;
  kotor: number;
  bpp: number;
  pelunasan: number;
  result_plafond: number;
  result_tenor: number;
  angsuran: number;
  bersih: number;
}
