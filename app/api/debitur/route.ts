import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import {
  Bank,
  BerkasPengajuan,
  DataDomisili,
  DataPembiayaan,
  DataPencairan,
  DataPengajuan,
  DataPengajuanAlamat,
  DataPengajuanKeluarga,
  DataTaspen,
  JenisPembiayaan,
  Produk,
  Role,
  UnitCabang,
  UnitPelayanan,
  User,
} from "@prisma/client";
import moment from "moment";

type INewData<T> = T & {
  newId: string;
};

export const GET = async (req: NextRequest) => {
  const query = await prisma.dataPengajuan.findMany({
    where: { is_active: true },
    include: {
      DataTaspen: {
        include: { DataKeluarga: true, DataPasangan: true, Domisili: true },
      },
      DataPencairan: true,
      DataPengajuanAlamat: true,
      DataPengajuanPasangan: true,
      DataPembiayaan: {
        include: {
          Produk: {
            include: { Bank: true },
          },
          JenisPembiayaan: true,
          User: {
            include: { UnitCabang: { include: { UnitPelayanan: true } } },
          },
        },
      },
      User: { include: { UnitCabang: { include: { UnitPelayanan: true } } } },
    },
  });

  const data = query.map((d) => ({
    ...d,
    spv: d.User?.first_name + " " + d.User?.last_name,
    moc: d.moc,
    spv_cabang: d.User?.UnitCabang?.name,
    spv_area: d.User?.UnitCabang?.UnitPelayanan?.name,
    admin:
      d.DataPembiayaan.User?.first_name +
      " " +
      d.DataPembiayaan.User?.last_name,
  }));

  return NextResponse.json({ data, status: 200 }, { status: 200 });
};

export interface IDapen extends DataTaspen {
  Domisili: DataDomisili;
}

export interface IDapeng extends DataPengajuan {
  BerkasPengajuan: BerkasPengajuan;
  DataPencairan: INewData<DataPencairan> | null;
  DataPengajuanAlamat: DataPengajuanAlamat;
  DataPengajuanPasangan: DataPengajuanKeluarga;
  DataTaspen: IDapen;
}

export interface IDapem extends INewData<DataPembiayaan> {
  DataPengajuan: IDapeng;
  JenisPembiayaan: INewData<JenisPembiayaan>;
}

export interface IProPem extends INewData<Produk> {
  DataPembiayaan: INewData<IDapem>[];
}

export interface IBank extends INewData<Bank> {
  ProdukPembiayaan: IProPem[];
}

interface IUserData extends INewData<User> {
  roleId: string;
  rolename: string;
}

export interface ICabang extends INewData<UnitCabang> {
  User: IUserData[];
}
export interface IArea extends INewData<UnitPelayanan> {
  UnitCabang: INewData<ICabang>[];
}

const gettingName = (role: Role) => {
  if (role === "MASTER") return "RL001";
  if (role === "BISNIS") return "RL002";
  if (role === "ENTRY_DATA") return "RL003";
  if (role === "OPERASIONAL") return "RL004";
  if (role === "VERIFIKASI") return "RL005";
  if (role === "BANK") return "RL006";
  if (role === "APPROVAL") return "RL007";
  if (role === "AUDIT") return "RL008";
  if (role === "MARKETING") return "RL009";
  return "RL010";
};

const genNIP = (aId: string, cId: string, uId: number, join: Date) => {
  return `${moment(join).format("YYYYMM")}${aId.replace("A", "")}${cId.replace(
    "KL",
    "",
  )}${String(uId + 1).padStart(3, "0")}`;
};

export const PATCH = async (req: NextRequest) => {
  const nopen = req.nextUrl.searchParams.get("nopen") || "nopen";
  const find = await prisma.dataTaspen.findFirst({
    where: { nopen },
    include: {
      DataPasangan: true,
      Domisili: true,
    },
  });
  if (!find)
    return NextResponse.json(
      { status: 404, msg: "Nopen tidak ditemukan di database!" },
      { status: 404 },
    );

  return NextResponse.json(
    { status: 200, msg: "Berhasil ditemukan!", data: find },
    { status: 200 },
  );
};
