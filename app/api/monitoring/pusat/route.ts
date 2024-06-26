import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import path from "path";
import { existsSync, promises as fs } from "fs";
import moment from "moment-timezone";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (page - 1) * 20;
  const year =
    req.nextUrl.searchParams.get("year") || moment().format("YYYY-MM");
  const name = req.nextUrl.searchParams.get("name");

  let result: DataDataPengajuan[] = [];

  if (name) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { is_active: true },
          {
            DataPembiayaan: {
              OR: [{ name: { contains: name } }, { nopen: { contains: name } }],
            },
          },
        ],
      },
      include: {
        DataPembiayaan: {
          include: {
            Produk: {
              include: { Bank: true },
            },
            JenisPembiayaan: true,
            Refferal: true,
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
          },
        },
        User: { include: { UnitCabang: { include: { UnitPelayanan: true } } } },
        BerkasPengajuan: true,
        DataTaspen: {
          include: {
            DataKeluarga: true,
            Domisili: true,
            DataPasangan: true,
            TunjanganPotongan: true,
          },
        },
        Bank: true,
        DataPengajuanAlamat: true,
        DataPengajuanPasangan: true,
      },
      skip: skip,
      take: 20,
      orderBy: { DataPembiayaan: { created_at: "desc" } },
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { is_active: true },
          {
            DataPembiayaan: {
              created_at: {
                gte: moment(`${year}-01`).tz("Asia/Jakarta").toISOString(true),
                lte: moment(`${year}-${moment(year).daysInMonth()} 23:59`)
                  .tz("Asia/Jakarta")
                  .toISOString(true),
              },
            },
          },
        ],
      },
      include: {
        DataPembiayaan: {
          include: {
            Produk: {
              include: { Bank: true },
            },
            JenisPembiayaan: true,
            Refferal: true,
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
          },
        },
        User: { include: { UnitCabang: { include: { UnitPelayanan: true } } } },
        BerkasPengajuan: true,
        DataTaspen: {
          include: {
            DataKeluarga: true,
            Domisili: true,
            DataPasangan: true,
            TunjanganPotongan: true,
          },
        },
        Bank: true,
        DataPengajuanAlamat: true,
        DataPengajuanPasangan: true,
      },
      skip: skip,
      take: 20,
      orderBy: { DataPembiayaan: { created_at: "desc" } },
    });
  }

  const total = await prisma.dataPengajuan.count({
    where: {
      AND: [
        { DataPembiayaan: { is_active: true } },
        { is_active: true },
        {
          DataPembiayaan: {
            created_at: {
              gte: moment(`${year}-01`).tz("Asia/Jakarta").toISOString(true),
              lte: moment(`${year}-${moment(year).daysInMonth()} 23:59`)
                .tz("Asia/Jakarta")
                .toISOString(true),
            },
          },
        },
      ],
    },
  });
  return NextResponse.json(
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
};

export const DELETE = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.dataPengajuan.findFirst({
      where: { id: data.id },
      include: { BerkasPengajuan: true },
    });
    if (!find)
      return NextResponse.json(
        { msg: "Data tidak ditemukan!" },
        { status: 404 }
      );

    await prisma.dataPengajuan.update({
      where: { id: data.id },
      data: {
        is_active: false,
      },
    });
    const slik = path.join(
      process.cwd(),
      "/storage" + find.BerkasPengajuan?.berkas_slik
    );
    const pengajuan = path.join(
      process.cwd(),
      "/storage" + find.BerkasPengajuan?.berkas_pengajuan
    );
    const asuransi = path.join(
      process.cwd(),
      "/storage" + find.BerkasPengajuan?.video_asuransi
    );
    const wawancara = path.join(
      process.cwd(),
      "/storage" + find.BerkasPengajuan?.video_wawancara
    );
    if (existsSync(slik)) {
      await fs.unlink(slik);
    }
    if (existsSync(pengajuan)) {
      await fs.unlink(pengajuan);
    }
    if (existsSync(asuransi)) {
      await fs.unlink(asuransi);
    }
    if (existsSync(wawancara)) {
      await fs.unlink(wawancara);
    }
    return NextResponse.json(
      { msg: "Hapus data pengajuan berhasil!" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Hapus pengajuan gagal. Coba lagi nanti!" },
      { status: 500 }
    );
  }
};
