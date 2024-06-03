import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import path from "path";
import { promises as fs } from "fs";
import moment from "moment";
import { DataPenyerahanJaminan } from "@/components/utils/Interfaces";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const name = req.nextUrl.searchParams.get("name");
  const skip = (page - 1) * 20;

  let result: DataPenyerahanJaminan[] = [];
  if (name) {
    result = <any>await prisma.penyerahanJaminan.findMany({
      where: {
        nomor_jaminan: { contains: name },
      },
      include: {
        Bank: true,
        DataPengajuan: {
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
          },
          orderBy: { DataPembiayaan: { created_at: "desc" } },
        },
      },
      skip: skip,
      take: 20,
      orderBy: { tanggal_cetak: "desc" },
    });
  } else {
    result = <any>await prisma.penyerahanJaminan.findMany({
      include: {
        Bank: true,
        DataPengajuan: {
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
          },
          orderBy: { DataPembiayaan: { created_at: "desc" } },
        },
      },
      skip: skip,
      take: 20,
      orderBy: { tanggal_cetak: "desc" },
    });
  }
  const total = await prisma.penyerahanBerkas.count();
  return NextResponse.json(
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const buff = Buffer.from(data.file.split(",")[1], "base64");
    const fileName = `${data.kode_area}_JAMINAN_${moment().format(
      "DDMMYYYY"
    )}.${data.ext}`;
    const pathUrl = path.join(
      process.cwd(),
      `/storage/${data.dir.toLowerCase()}/${fileName}`
    );
    fs.writeFile(pathUrl, buff);

    return NextResponse.json(
      {
        msg: "Upload surat jaminan berhasil",
        url: `/${data.dir.toLowerCase()}/${fileName}`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Gagal upload surat jaminan!" },
      { status: 500 }
    );
  }
};
export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  try {
    await prisma.penyerahanJaminan.update({
      where: {
        id: data.id,
      },
      data: {
        jaminan: data.surat_berkas,
        tanggal_jaminan: data.tanggal_surat_berkas,
      },
    });
    return NextResponse.json(
      {
        msg: "Upload surat jaminan berhasil",
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Gagal upload surat jaminan !",
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const data = await req.json();
  const pathUrl = path.join(process.cwd(), "/storage" + data.url);
  try {
    await fs.unlink(pathUrl);
    await prisma.penyerahanJaminan.update({
      where: {
        id: data.id,
      },
      data: {
        jaminan: null,
        tanggal_jaminan: null,
      },
    });
    return NextResponse.json(
      { msg: "berhasil mengahapus file" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Gagal hapus file!" }, { status: 500 });
  }
};
