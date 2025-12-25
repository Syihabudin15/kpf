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
  const tempjepems = await prisma.jenisPembiayaan.findMany({
    where: { DataPembiayaan: { some: {} } },
    orderBy: { created_at: "asc" },
  });

  const tempbanks = await prisma.bank.findMany({
    where: {
      is_active: true,
      products: {
        some: {
          DataPembiayaan: { some: { DataPengajuan: { some: {} } } },
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
    include: {
      products: {
        include: {
          DataPembiayaan: {
            include: {
              JenisPembiayaan: true,
              DataPengajuan: {
                include: {
                  BerkasPengajuan: true,
                  DataPencairan: true,
                  DataPengajuanAlamat: true,
                  DataPengajuanPasangan: true,
                  DataTaspen: {
                    include: {
                      Domisili: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const jepems: INewData<JenisPembiayaan>[] = tempjepems.map((j, i) => ({
    ...j,
    newId: `JPM${String(i + 1).padStart(2, "0")}`,
  }));

  const banks: INewData<IBank>[] = tempbanks.map((b, i) => {
    const bId = `SD${String(i + 1).padStart(2, "0")}`;

    const produks: INewData<IProPem>[] = b.products.map((p, pi) => {
      const pId = `${(b.kode || "BPR TEMP")
        .replace("BPR", "")
        .replace(" ", "")}${String(pi + 1).padStart(2, "0")}`;

      const dapems: INewData<IDapem>[] = p.DataPembiayaan.map((d, di) => {
        const jp = jepems.find((j) => j.id === d.jenis_pembiayaan_id);
        const jpDef = jepems.find((j) => j.name === "Flash Sisa Gaji");
        const dpId = `DPID${pi}${String(di + 1).padStart(5, "0")}`;

        const dapengs: IDapeng[] = d.DataPengajuan.map((dpg, dpgi) => {
          const cair: INewData<DataPencairan> = {
            ...dpg.DataPencairan,
            newId: dpg.DataPencairan?.nomor_surat || "",
            berkas_si: `https://earsip.blob.core.windows.net/kpfi${dpg.DataPencairan?.berkas_si}`,
            bankId: bId,
          } as INewData<DataPencairan>;

          const berkas: BerkasPengajuan = {
            ...dpg.BerkasPengajuan,
            berkas_slik: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.berkas_slik}`
              : null,
            berkas_pengajuan: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.berkas_pengajuan}`
              : null,
            video_wawancara: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.video_wawancara}`
              : null,
            video_asuransi: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.video_asuransi}`
              : null,
            berkas_akad: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.berkas_akad}`
              : null,
            video_akad: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.video_akad}`
              : null,
            pelunasan: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.pelunasan}`
              : null,
            berkas_flagging: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.berkas_flagging}`
              : null,
            bukti_cair: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.bukti_cair}`
              : null,
            video_cair: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.video_cair}`
              : null,
            video_cair2: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.video_cair2}`
              : null,
            video_cair3: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.video_cair3}`
              : null,
            mutasi: dpg.BerkasPengajuan
              ? `https://earsip.blob.core.windows.net/kpfi${dpg.BerkasPengajuan?.mutasi}`
              : null,
          } as BerkasPengajuan;

          return {
            ...dpg,
            newId: dpId,
            DataTaspen: dpg.DataTaspen || null,
            DataPengajuanAlamat: dpg.DataPengajuanAlamat || null,
            DataPengajuanPasangan: dpg.DataPengajuanPasangan || null,
            data_pembiayaan_id: dpId,
            bankId: bId,
            DataPencairan: dpg.dataPencairanId ? cair : null,
            BerkasPengajuan: berkas,
          } as INewData<IDapeng>;
        });

        return {
          ...d,
          newId: dpId,
          produk_id: pId,
          jenis_pembiayaan_id: jp?.newId || jpDef?.newId || null,
          DataPengajuan: dapengs ? dapengs[0] : null,
        } as any as INewData<IDapem>;
      });

      const prdk: INewData<IProPem> = {
        ...p,
        bank_id: bId,
        newId: pId,
        DataPembiayaan: dapems,
      };
      return prdk;
    });
    const bank: INewData<IBank> = {
      ...b,
      newId: bId,
      ProdukPembiayaan: produks,
    };
    return bank;
  });

  const temparea = await prisma.unitPelayanan.findMany({
    where: {
      UnitCabang: {
        some: {
          User: { some: {} },
        },
      },
      is_active: true,
    },
    include: {
      UnitCabang: {
        include: {
          User: true,
        },
      },
    },
  });

  const area = temparea.map((a, i) => {
    const areaId = `A${String(i + 1).padStart(2, "0")}`;
    const cabangs = a.UnitCabang.map((c, ci) => {
      const cabangId = `KL${i}${String(ci + 1).padStart(2, "0")}`;
      const user = c.User.map((u, ui) => ({
        ...u,
        roleId: gettingName(u.role),
        rolename: u.role,
        nip: genNIP(areaId, cabangId, ui, u.created_at),
      }));
      return { ...c, newId: cabangId, User: user };
    });
    return { ...a, newId: areaId, UnitCabang: cabangs };
  });

  return NextResponse.json(
    { banks, jepems, area, status: 200 },
    { status: 200 }
  );
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
    ""
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
      { status: 404 }
    );

  return NextResponse.json(
    { status: 200, msg: "Berhasil ditemukan!", data: find },
    { status: 200 }
  );
};
