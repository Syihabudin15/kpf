import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const result = await prisma.outcomeCategory.findMany({
    where: {
      is_active: true,
    },
  });
  return NextResponse.json({ data: result }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.outcomeCategory.findFirst({
      where: { name: data.name },
    });
    if (find) {
      if (find.is_active === false) {
        await prisma.outcomeCategory.update({
          where: { id: find.id },
          data: {
            description: data.description,
            is_active: true,
          },
        });
        return NextResponse.json(
          { msg: "Berhasil membuat kategori" },
          { status: 201 }
        );
      } else {
        return NextResponse.json(
          { msg: "Data sudah tersedia" },
          { status: 400 }
        );
      }
    }
    await prisma.outcomeCategory.create({
      data: {
        name: data.name,
        description: data.description,
        is_active: true,
      },
    });
    return NextResponse.json(
      { msg: "Berhasil membuat kategori" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
};
