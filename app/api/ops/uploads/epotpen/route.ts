import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import path from "path";
import { existsSync, promises as fs } from "fs";
export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  try {
    const buff = Buffer.from(data.file.split(",")[1], "base64");
    const find = await prisma.dataPengajuan.findFirst({
      where: {
        berkasPengajuanId: data.id,
      },
      include: {
        DataPembiayaan: true,
      },
    });
    const fileName = `${
      find?.DataPembiayaan.nopen
    }_${find?.DataPembiayaan.name?.toUpperCase()}_${Date.now()}.${data.ext}`;
    const pathUrl = path.join(
      process.cwd(),
      `/storage/${data.dir.toLowerCase()}/${fileName}`
    );
    fs.writeFile(pathUrl, buff as any);

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
  try {
    await prisma.berkasPengajuan.update({
      where: {
        id: data.id,
      },
      data: {
        epotpen: data.url,
        tanggal_epotpen: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      {
        msg: "Upload epotpen berhasil",
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Gagal upload epotpen !",
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
    await prisma.berkasPengajuan.update({
      where: {
        id: data.id,
      },
      data: {
        epotpen: null,
        tanggal_epotpen: null,
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
