import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import path from "path";
import { existsSync, promises as fs } from "fs";
import { DataDataPencairan } from "@/components/utils/Interfaces";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const name = req.nextUrl.searchParams.get("name");
  const skip = (page - 1) * 20;

  let result: DataDataPencairan[] = [];
  if (name) {
    result = <any>await prisma.dataPencairan.findMany({
      where: {
        nomor_surat: { contains: name },
        is_active: true,
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
        },
      },
      skip: skip,
      take: 20,
      orderBy: { tanggal_cetak: "desc" },
    });
  } else {
    result = <any>await prisma.dataPencairan.findMany({
      where: {
        is_active: true,
        // status: true,
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
        },
      },
      skip: skip,
      take: 20,
      orderBy: { tanggal_cetak: "desc" },
    });
  }
  const total = await prisma.dataPencairan.count({
    where: {
      is_active: true,
      // status: true,
    },
  });

  return NextResponse.json(
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  try {
    const buff = Buffer.from(data.file.split(",")[1], "base64");
    const fileName = `${data.nomor.replace("/", "_")}.${data.ext}`;
    const pathUrl = path.join(
      process.cwd(),
      `/storage/${data.dir.toLowerCase()}/${fileName}`
    );
    fs.writeFile(pathUrl, buff);

    return NextResponse.json(
      {
        msg: "Upload surat pencairan berhasil",
        url: `/${data.dir.toLowerCase()}/${fileName}`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Gagal upload surat pencairan!" },
      { status: 500 }
    );
  }
};
export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  const pathUrl = path.join(process.cwd(), "/storage" + data.url);
  try {
    if (existsSync(pathUrl)) {
      await fs.unlink(pathUrl);
    }
    await prisma.dataPencairan.update({
      where: {
        id: data.id,
      },
      data: {
        berkas_si: data.url,
        tanggal_berkas_si: new Date(),
      },
    });

    return NextResponse.json(
      {
        msg: "Upload surat pencairan berhasil",
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Gagal upload surat pencairan !",
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const data = await req.json();
  const pathUrl = path.join(process.cwd(), "/storage" + data.url);
  try {
    if (existsSync(pathUrl)) {
      await fs.unlink(pathUrl);
    }
    await prisma.dataPencairan.update({
      where: { id: data.id },
      data: {
        berkas_si: null,
        tanggal_berkas_si: null,
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
