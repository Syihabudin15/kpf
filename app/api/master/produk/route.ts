import prisma from "@/components/prisma";
import { Produk } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (page - 1) * 20;
  const name = <any>req.nextUrl.searchParams.get("name");

  if (name) {
    const result: Produk[] = await prisma.produk.findMany({
      where: { AND: [{ is_active: true }, { name: { contains: name } }] },
      include: { Bank: true },
      orderBy: { created_at: "asc" },
      skip,
      take: 20,
    });
    return NextResponse.json(
      { data: result, totalLength: result.length },
      { status: 200, statusText: "Berhasil" }
    );
  } else {
    const result: Produk[] = await prisma.produk.findMany({
      where: { is_active: true },
      include: { Bank: true },
      orderBy: { created_at: "asc" },
      skip,
      take: 20,
    });
    const total = await prisma.produk.count({ where: { is_active: true } });
    return NextResponse.json(
      { data: result, totalLength: total },
      { status: 200, statusText: "Berhasil" }
    );
  }
};

export const POST = async (req: NextRequest) => {
  const data: Produk = await req.json();
  try {
    const find: Produk | null = await prisma.produk.findFirst({
      where: {
        name: data.name,
        is_active: true,
        bank_id: data.bank_id,
      },
    });
    if (find)
      return NextResponse.json(
        { msg: "Data produk telah tersedia" },
        {
          status: 400,
          statusText:
            "Data produk telah tersedia. Mohon masukan data yang berbeda!",
        }
      );
    const result = await prisma.produk.create({
      data: {
        name: data.name,
        by_asuransi: parseFloat(data.by_asuransi.toString()),
        mg_bunga: parseFloat(data.mg_bunga.toString()),
        min_age: parseFloat(data.min_age.toString()),
        max_age: parseFloat(data.max_age.toString()),
        max_usia_lunas: parseFloat(data.max_usia_lunas.toString()),
        max_tenor: parseInt(data.max_tenor.toString()),
        bank_id: data.bank_id,
        max_plafon: data.max_plafon ? data.max_plafon : 100000000,
      },
    });
    return NextResponse.json(
      { result, msg: "Data produk berhasil ditambahkan" },
      { status: 201, statusText: "Data produk berhasil dibuat" }
    );
  } catch (err) {
    return NextResponse.json(
      { msg: "Server error" },
      { status: 500, statusText: "Server Error" }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const data: Produk = await req.json();
  try {
    const find: Produk | null = await prisma.produk.findFirst({
      where: { id: data.id },
    });
    if (!find)
      return NextResponse.json(
        { msg: "Data tidak tersedia!" },
        { status: 404, statusText: "Data produk tidak tersedia!" }
      );
    await prisma.produk.update({
      where: { id: data.id },
      data: {
        name: data.name ? data.name : find.name,
        by_asuransi: data.by_asuransi ? data.by_asuransi : find.by_asuransi,
        mg_bunga: data.mg_bunga ? data.mg_bunga : find.mg_bunga,
        min_age: data.min_age ? data.min_age : find.min_age,
        max_age: data.max_age ? data.max_age : find.max_age,
        max_usia_lunas: data.max_usia_lunas
          ? data.max_usia_lunas
          : find.max_usia_lunas,
        max_tenor: data.max_tenor ? data.max_tenor : find.max_tenor,
        bank_id: data.bank_id ? data.bank_id : find.bank_id,
      },
    });
    return NextResponse.json(
      { msg: "Data produk berhasil diupdate" },
      { status: 200, statusText: "Update data produk berhasil" }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "Server Error" }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const { id } = await req.json();
  try {
    const find = await prisma.produk.findFirst({ where: { id: id } });
    if (!find)
      return NextResponse.json(
        { msg: "Data produk tidak ditemukan!" },
        { status: 404, statusText: "Data produk tidak ditemukan" }
      );
    await prisma.produk.update({
      where: { id: id },
      data: {
        is_active: false,
      },
    });
    return NextResponse.json(
      { msg: "Hapus data produk berhasil" },
      { status: 200, statusText: "Hapus produk berhasil" }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "Server Error" }
    );
  }
};
