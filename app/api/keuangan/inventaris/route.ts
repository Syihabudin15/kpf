import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import moment from "moment-timezone";
import { Inventaris } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const pageSize: number = parseInt(
    <any>req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;
  const date = new Date();
  const from =
    req.nextUrl.searchParams.get("from") ||
    moment(`${date.getFullYear()}-${date.getMonth() + 1}-1`).format(
      "YYYY-MM-DD"
    );
  const to =
    req.nextUrl.searchParams.get("to") ||
    moment(
      `${date.getFullYear()}-${date.getMonth() + 1}-${moment(
        date
      ).daysInMonth()}`
    ).format("YYYY-MM-DD");
  const name = req.nextUrl.searchParams.get("name");

  let result: Inventaris[] = [];
  if (name) {
    result = await prisma.inventaris.findMany({
      where: {
        nama: { contains: name },
      },
    });
  } else {
    result = await prisma.inventaris.findMany({
      where: {
        tanggal_pembelian: {
          gte: moment(from).tz("Asia/Jakarta").toISOString(true),
          lte: moment(`${to} 23:59`).tz("Asia/Jakarta").toISOString(true),
        },
      },
      skip: skip,
      take: pageSize,
    });
  }
  const total = await prisma.inventaris.count({
    where: {
      tanggal_pembelian: {
        gte: moment(from).tz("Asia/Jakarta").toISOString(true),
        lte: moment(`${to} 23:59`).tz("Asia/Jakarta").toISOString(true),
      },
    },
  });
  return NextResponse.json(
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
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
