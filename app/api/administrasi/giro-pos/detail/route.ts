import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { inputTextToDecimal } from "@/components/utils/inputUtils";

export const GET = async (req: NextRequest) => {
  const slug = req.nextUrl.searchParams.get("slug") || "";
  const find = await prisma.giroBank.findFirst({
    where: {
      slug: slug,
    },
    include: {
      Transaction: {
        orderBy: { created_at: "desc" },
      },
    },
  });
  if (!find) {
    return NextResponse.json({ msg: "Error not found" }, { status: 404 });
  }

  return NextResponse.json({ data: find }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.giroBank.findFirst({
      where: { slug: data.slug },
    });
    if (!find) {
      return NextResponse.json({ msg: "Giro POS not found!" }, { status: 404 });
    }
    await prisma.transaction.create({
      data: {
        nominal: inputTextToDecimal(data.nominal),
        description: data.description,
        created_at: new Date(data.created_at),
        type: data.type,
        giroBankId: find.id,
      },
    });
    return NextResponse.json(
      { msg: "Transaksi berhasil dibuat" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
};
