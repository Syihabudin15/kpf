import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const page: number = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "20"
  );
  const skip = (page - 1) * pageSize;
  const name = req.nextUrl.searchParams.get("name");

  let result: DataDataPengajuan[] = [];
  if (name) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        OR: [{ nama: { contains: name } }, { nama_skep: { contains: name } }],
        status_pencairan: "TRANSFER",
      },
      include: {
        DataPembiayaan: {
          include: {
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            Produk: { include: { Bank: true } },
            JenisPembiayaan: true,
            Refferal: true,
          },
        },
        User: {
          include: { UnitCabang: { include: { UnitPelayanan: true } } },
        },
        Bank: true,
        BerkasPengajuan: true,
        DataTaspen: {
          include: {
            DataKeluarga: true,
            Domisili: true,
            DataPasangan: true,
            TunjanganPotongan: true,
          },
        },
        DataPengajuanAlamat: true,
        DataPengajuanPasangan: true,
        DataPencairan: true,
      },
      orderBy: { tanggal_pencairan: "desc" },
      skip: skip,
      take: pageSize,
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
      },
      include: {
        DataPembiayaan: {
          include: {
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            Produk: { include: { Bank: true } },
            JenisPembiayaan: true,
            Refferal: true,
          },
        },
        User: {
          include: { UnitCabang: { include: { UnitPelayanan: true } } },
        },
        Bank: true,
        BerkasPengajuan: true,
        DataTaspen: {
          include: {
            DataKeluarga: true,
            Domisili: true,
            DataPasangan: true,
            TunjanganPotongan: true,
          },
        },
        DataPengajuanAlamat: true,
        DataPengajuanPasangan: true,
        DataPencairan: true,
      },
      orderBy: { tanggal_pencairan: "desc" },
      skip: skip,
      take: pageSize,
    });
  }
  const total = await prisma.dataPengajuan.count({
    where: {
      status_pencairan: "TRANSFER",
      is_active: true,
    },
  });
  return NextResponse.json({ data: result, total: total }, { status: 200 });
};

export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.berkasPengajuan.findFirst({
      where: { id: data.id },
    });
    if (!find) {
      return NextResponse.json(
        { msg: "Data tidak ditemukan!" },
        { status: 404 }
      );
    }
    await prisma.berkasPengajuan.update({
      where: { id: find.id },
      data: {
        flagging: data.flagging ? data.flagging : find.flagging,
        mutasi: data.mutasi ? data.mutasi : find.mutasi,
        status_flagging: data.status_flagging
          ? data.status_flagging
          : find.status_flagging,
        status_mutasi: data.status_mutasi
          ? data.status_mutasi
          : find.status_mutasi,
        tanggal_flagging: data.tanggal_flagging
          ? data.tanggal_flagging
          : find.tanggal_flagging,
        tanggal_mutasi: data.tanggal_mutasi
          ? data.tanggal_mutasi
          : find.tanggal_mutasi,
      },
    });
    return NextResponse.json({ msg: "Berhasil update data" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
};
