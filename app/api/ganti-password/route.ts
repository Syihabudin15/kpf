import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();

  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!user) {
    return NextResponse.json(
      { msg: "Login expired. Mohon login ulang!" },
      { status: 401 }
    );
  }
  return NextResponse.json(user, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.user.findFirst({
      where: { id: data.id },
    });
    if (!find) {
      return NextResponse.json(
        { msg: "Data user tidak ditemukan" },
        { status: 404 }
      );
    }

    const verif = await bcrypt.compare(data.password, find.password);

    if (!verif) {
      return NextResponse.json(
        { msg: "Password saat ini salah!" },
        { status: 400 }
      );
    }
    const newPass = await bcrypt.hash(data.password_baru, 10);
    await prisma.user.update({
      where: {
        id: find.id,
      },
      data: {
        password: newPass,
      },
    });
    return NextResponse.json(
      { msg: "Ganti password berhasil!" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Ganti password gagal!" }, { status: 500 });
  }
};
