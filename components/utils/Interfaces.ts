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
  User: User[];
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
