import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const skip = (page - 1) * 100;

  const category = await prisma.blogCategory.findMany({
    where: {
      is_active: true,
    },
    skip: skip,
    take: 100,
    include: {
      Blog: true,
    },
  });
  const total = await prisma.blogCategory.count({ where: { is_active: true } });
  return NextResponse.json(
    { data: category, total: total },
    {
      status: 200,
    }
  );
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.blogCategory.findFirst({
      where: {
        slug: data.slug,
      },
    });
    if (find) {
      return NextResponse.json(
        { msg: "Nama kategori sudah digunakan" },
        { status: 401 }
      );
    }
    await prisma.blogCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
      },
    });
    return NextResponse.json(
      { msg: "Kategori berhasil ditambahkan" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.blogCategory.findFirst({
      where: { id: data.id },
    });
    if (!find) {
      return NextResponse.json(
        { msg: "Data tidak ditemukan" },
        { status: 404 }
      );
    }
    await prisma.blogCategory.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name ? data.name : find.name,
        slug: data.slug ? data.slug : find.slug,
        description: data.description ? data.description : find.description,
        image: data.image ? data.image : find.image,
      },
    });
    return NextResponse.json(
      { msg: "Kategori berhasil ditambahkan" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
};
