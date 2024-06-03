import { DataPembiayaan } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { daysInMonth } from "@/components/utils/inputUtils";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const year = req.nextUrl.searchParams.get("year") || new Date().getFullYear();
  const skip = (page - 1) * 20;
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });

  if (!user) return NextResponse.json({ data: [], total: 0 }, { status: 200 });

  let result: DataPembiayaan[] = <any>await prisma.dataPembiayaan.findMany({
    where: {
      AND: [
        { is_simulasi: true },
        { user_id: user.id },
        {
          created_at: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(
              `${year}-12-${daysInMonth(12, parseInt(year.toString()))}`
            ),
          },
        },
      ],
    },
    include: {
      JenisPembiayaan: true,
      Produk: {
        include: {
          Bank: true,
        },
      },
      User: true,
    },
    orderBy: { created_at: "desc" },
    skip: skip,
    take: 20,
  });

  const total = await prisma.dataPembiayaan.count({
    where: {
      AND: [
        {
          is_simulasi: true,
          user_id: user.id,
          created_at: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(
              `${year}-12-${daysInMonth(12, parseInt(year.toString()))}`
            ),
          },
        },
      ],
    },
  });
  return NextResponse.json({ data: result, total: total }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const data: DataPembiayaan = await req.json();
  const session = await getServerSession();
  try {
    const user = await prisma.user.findFirst({
      where: { email: session?.user?.email },
    });
    data.user_id = user?.id as string;
    const result = await prisma.dataPembiayaan.create({ data });

    return NextResponse.json(
      { result, msg: "Simulasi berhasil disimpan" },
      { status: 201, statusText: "Data berhasil disimpan" }
    );
  } catch (err) {
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "Server Error" }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const data = await req.json();

  try {
    await prisma.dataPembiayaan.delete({
      where: { id: data.id },
    });

    return NextResponse.json(
      { msg: "Hapus data simulasi berhasil!" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Gagal hapus data simulasi. Coba lagi nanti!" },
      { status: 500 }
    );
  }
};
