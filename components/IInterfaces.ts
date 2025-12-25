import {
  Bank,
  BerkasPengajuan,
  DataDomisili,
  DataPasangan,
  DataPembiayaan,
  DataPencairan,
  DataPengajuan,
  DataPengajuanAlamat,
  DataPengajuanKeluarga,
  DataTaspen,
  JadwalAngsuran,
  JenisPembiayaan,
  PenyerahanBerkas,
  PenyerahanJaminan,
  Produk,
  Refferal,
  UnitCabang,
  UnitPelayanan,
  User,
} from "@prisma/client";

export interface ICabang extends UnitCabang {
  UnitPelayanan: UnitPelayanan;
}
export interface IUser extends User {
  UnitCabang: ICabang;
}

export interface IProduk extends Produk {
  Bank: Bank;
}
export interface IDataPembiayaan extends DataPembiayaan {
  Produk: IProduk;
  JenisPembiayaan: JenisPembiayaan;
  User: IUser;
  Refferal: Refferal;
}
export interface IDataTaspen extends DataTaspen {
  DataDomisili: DataDomisili;
  DataPasangan: DataPasangan;
}
export interface IDataPengajuan extends DataPengajuan {
  DataPembiayaan: IDataPembiayaan;
  BerkasPengajuan: BerkasPengajuan;
  JadwalAngsuran: JadwalAngsuran[];
  DataPencairan: DataPencairan | null;
  DataPengajuanPasangan: DataPengajuanKeluarga;
  DataPengajuanAlamat: DataPengajuanAlamat;
  User: IUser;
  DataTaspen: IDataTaspen;
  Bank: Bank;
  PenyerahanBerkas: PenyerahanBerkas | null;
  PenyerahanJaminan: PenyerahanJaminan | null;
}
