import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import path from "path";
import { promises as fs } from "fs";
import moment from "moment";
export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  try {
    const buff = Buffer.from(data.file.split(",")[1], "base64");
    const find = await prisma.dataPengajuan.findFirst({
      where: {
        berkasPengajuanId: data.id,
      },
      include: { DataPembiayaan: true },
    });
    const fileName = `${
      find?.DataPembiayaan.nopen
    }_${find?.DataPembiayaan.name?.toUpperCase()}_${moment().format(
      "DDMMYYYY"
    )}.${data.ext}`;
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
  try {
    await prisma.berkasPengajuan.update({
      where: {
        id: data.id,
      },
      data: {
        bukti_cair: data.url,
        tanggal_bukti_cair: new Date(),
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
    await fs.unlink(pathUrl);
    await prisma.berkasPengajuan.update({
      where: {
        id: data.id,
      },
      data: {
        bukti_cair: null,
        tanggal_bukti_cair: null,
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
