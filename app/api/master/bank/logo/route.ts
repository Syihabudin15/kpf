import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import path from "path";
import { existsSync, promises as fs } from "fs";
export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  try {
    const buff = Buffer.from(data.file.split(",")[1], "base64");
    const fileName = `${Date.now()}.${data.ext}`;
    const pathUrl = path.join(
      process.cwd(),
      `/storage/${data.dir.toLowerCase()}/${fileName}`
    );
    fs.writeFile(pathUrl, buff);

    return NextResponse.json(
      {
        msg: "Upload logo bank berhasil",
        url: `/${data.dir.toLowerCase()}/${fileName}`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Gagal upload logo bank!" },
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
    await prisma.bank.update({
      where: {
        id: data.id,
      },
      data: {
        logo: null,
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
