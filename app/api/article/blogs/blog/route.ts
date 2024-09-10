import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json(
      { msg: "Tidak ada artikel yang dipilih!" },
      { status: 404 }
    );
  }
  try {
    const result = await prisma.blog.findFirst({
      where: { slug: slug },
      include: { Category: true },
    });
    if (!result) {
      return NextResponse.json(
        { msg: "Data tidak ditemukan" },
        { status: 404 }
      );
    } else {
      await prisma.blog.update({
        where: { id: result.id },
        data: {
          view: result.view + 1,
        },
      });
      result.view = result.view + 1;
    }
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal server error!" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.blog.findFirst({
      where: {
        slug: data.slug,
        is_active: true,
      },
    });
    if (find) {
      return NextResponse.json(
        { msg: "Maaf duplikasi judul!" },
        { status: 400 }
      );
    }
    await prisma.blog.create({
      data: data,
    });
    return NextResponse.json(
      { msg: "Blog berhasil ditambahkan" },
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
    const find = await prisma.blog.findFirst({
      where: {
        id: data.id,
      },
    });
    if (!find) {
      return NextResponse.json(
        { msg: "Maaf data tidak ditemukan!" },
        { status: 404 }
      );
    }
    await prisma.blog.update({
      where: { id: find.id },
      data: {
        title: data.title ? data.title : find.title,
        slug: data.slug ? data.slug : find.slug,
        image: data.image ? data.image : find.image,
        description: data.description ? data.description : find.description,
        body: data.body ? data.body : find.body,
        updated_at: new Date(),
      },
    });
    return NextResponse.json({ msg: "Edit artikel berhasil" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
};
