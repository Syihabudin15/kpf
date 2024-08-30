import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { GiroPos } from "@/components/utils/Interfaces";

export const GET = async (req: NextRequest) => {
  const result: GiroPos[] = <any>await prisma.giroBank.findMany({
    include: {
      Transaction: {
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });
  const mapp: GiroPos[] = result.map((e) => {
    let balance = 0;
    e.Transaction.forEach((t) => {
      if (t.type === "MASUK") {
        balance += t.nominal;
      } else {
        balance -= t.nominal;
      }
    });
    return { ...e, balance };
  });
  return NextResponse.json({ data: mapp }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.giroBank.findFirst({
      where: {
        slug: data.slug,
      },
    });
    if (find) {
      return NextResponse.json(
        { msg: "Data sudah terdaftar. Mohon gunakan nama lain!" },
        { status: 400 }
      );
    }
    await prisma.giroBank.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      },
    });
    return NextResponse.json({ msg: "Tambah giro berhasil" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.giroBank.findFirst({
      where: {
        id: data.id,
      },
    });
    if (!find) {
      return NextResponse.json(
        { msg: "Data tidak ditemukan!" },
        { status: 400 }
      );
    }
    await prisma.giroBank.update({
      where: {
        id: find.id,
      },
      data: {
        name: data.name ? data.name : find.name,
        slug: data.name ? data.name.toLowercase() : find.slug,
        description: data.description ? data.description : find.description,
      },
    });
    return NextResponse.json({ msg: "Update giro berhasil" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
};
