import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import path from "path";
import { promises as fs } from "fs";
import moment from "moment";

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  try {
    const buff = Buffer.from(data.file.split(",")[1], "base64");

    const fileName = `${moment().format("DDMMYYYY")}${Date.now()}.${data.ext}`;
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
      { msg: "Gagal upload profile picture!" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const data = await req.json();
  const pathUrl = path.join(process.cwd(), "/storage" + data.url);
  try {
    if (data.url !== "/profile/profile_default.svg") {
      await fs.unlink(pathUrl);
    }
    if (data.id && data.id !== "") {
      await prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          picture: null,
        },
      });
    }
    return NextResponse.json(
      { msg: "berhasil mengahapus file" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Gagal hapus file!" }, { status: 500 });
  }
};
