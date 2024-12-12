import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "20");
  const name = req.nextUrl.searchParams.get("name");

  const result = await prisma.inventaris.findMany();
  return NextResponse.json({ data: result }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  try {
    if (!data.nama || !data.jumlah || !data.harga) {
      return NextResponse.json(
        { msg: "Mohon lengkapi data terlebih dahulu!" },
        { status: 400 }
      );
    }
    await prisma.inventaris.create({
      data: {
        nama: data.nama,
        kode: data.kode ? data.kode : Date.now().toString(),
        harga: parseFloat(data.harga.toString()),
        jumlah: parseInt(data.jumlah.toString()),
        tanggal_pembelian: data.tanggal_pembelian
          ? new Date(data.tanggal_pembelian)
          : new Date(),
      },
    });
    return NextResponse.json(
      { msg: "Berhasil menambahkan data inventaris" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};
