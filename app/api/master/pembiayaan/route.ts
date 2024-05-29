import prisma from "@/components/prisma";
import { JenisPembiayaan } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (page - 1) * 20;
  const name: string | null = <any>req.nextUrl.searchParams.get("name");
  if (name) {
    const jenis: JenisPembiayaan[] = await prisma.jenisPembiayaan.findMany({
      where: {
        AND: [{ is_active: true }, { name: { contains: name } }],
      },
      take: 20,
      skip,
    });
    return NextResponse.json(
      { result: jenis, total: jenis.length },
      { status: 200, statusText: "OK" }
    );
  } else {
    const jenis: JenisPembiayaan[] = await prisma.jenisPembiayaan.findMany({
      where: { is_active: true },
      take: 20,
      skip,
    });
    const total = await prisma.jenisPembiayaan.count({
      where: { is_active: true },
    });
    return NextResponse.json(
      { result: jenis, total },
      { status: 200, statusText: "OK" }
    );
  }
};

export const POST = async (req: NextRequest) => {
  const data: JenisPembiayaan = await req.json();
  try {
    const find = await prisma.jenisPembiayaan.findFirst({
      where: {
        name: data.name,
        is_active: true,
      },
    });
    const findAndDelete = await prisma.jenisPembiayaan.findFirst({
      where: {
        name: data.name,
        is_active: false,
      },
    });
    if (find)
      return NextResponse.json(
        { msg: "Data jenis pembiayaan sudah tersedia!" },
        { status: 400, statusText: "Data jenis pembiayaan sudah tersedia!" }
      );
    if (findAndDelete) {
      const result = await prisma.jenisPembiayaan.update({
        where: { name: data.name },
        data: {
          is_active: true,
          by_mutasi: data.by_mutasi,
        },
      });
      return NextResponse.json(
        { result, msg: "Data jenis pembiayaan berhasil disimpan" },
        { status: 201, statusText: "Data jenis pembiayaan berhasil disimpan" }
      );
    } else {
      const result = await prisma.jenisPembiayaan.create({ data: data });
      return NextResponse.json(
        { result, msg: "Data jenis pembiayaan berhasil disimpan" },
        { status: 201, statusText: "Data jenis pembiayaan berhasil disimpan" }
      );
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "Server Error" }
    );
  }
};
export const PUT = async (req: NextRequest) => {
  const data: JenisPembiayaan = await req.json();
  try {
    const find = await prisma.jenisPembiayaan.findFirst({
      where: { id: data.id },
    });
    if (!find)
      return NextResponse.json(
        { msg: "Data jenis pembiayaan tidak ditemukan" },
        { status: 404, statusText: "Data jenis pembiayaan tidak ditemukan" }
      );
    await prisma.jenisPembiayaan.update({
      where: { id: data.id },
      data: {
        name: data.name ? data.name : find.name,
        by_mutasi:
          data.by_mutasi || data.by_mutasi === 0
            ? data.by_mutasi
            : find.by_mutasi,
      },
    });
    return NextResponse.json(
      { msg: "Update data jenis pembiayaan berhasil" },
      { status: 200, statusText: "Update data jenis pembiayaan berhasil" }
    );
  } catch (err) {
    return NextResponse.json(
      { msg: "Server error" },
      { status: 500, statusText: "Server Error" }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const { id } = await req.json();
  try {
    const find = await prisma.jenisPembiayaan.findFirst({ where: { id: id } });
    if (!find)
      return NextResponse.json(
        { msg: "Data jenis pembiayaan tidak ditemukan" },
        { status: 404, statusText: "Data jenis pembiayaan tidak ditemukan" }
      );
    await prisma.jenisPembiayaan.update({
      where: { id: id },
      data: {
        is_active: false,
      },
    });
    return NextResponse.json(
      { msg: "Hapus data jenis pembiayaan berhasil" },
      { status: 200, statusText: "Hapus data jenis pembiayaan berhasil" }
    );
  } catch (err) {
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "Server Error" }
    );
  }
};
