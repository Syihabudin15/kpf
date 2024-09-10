import { Blog, BlogCategory } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export interface DataBlog extends Blog {
  Category: BlogCategory;
}

export const GET = async (req: NextRequest) => {
  const slug = req.nextUrl.searchParams.get("slug");
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "20");
  const skip = (page - 1) * pageSize;

  let data: DataBlog[] = [];
  let length = 0;

  if (slug) {
    data = <any>await prisma.blog.findMany({
      where: {
        Category: {
          slug: slug,
        },
        is_active: true,
      },
      include: { Category: true },
      skip: skip,
      take: pageSize,
      orderBy: {
        created_at: "desc",
      },
    });
    length = await prisma.blog.count({
      where: {
        is_active: true,
        Category: {
          slug: slug,
        },
      },
    });
  } else {
    data = <any>await prisma.blog.findMany({
      where: {
        is_active: true,
      },
      skip: skip,
      take: pageSize,
      include: { Category: true },
      orderBy: {
        created_at: "desc",
      },
    });
    length = await prisma.blog.count({
      where: {
        is_active: true,
      },
    });
  }
  const category = await prisma.blogCategory.findFirst({
    where: { slug: slug || "" },
  });

  return NextResponse.json(
    {
      data: data,
      total: length,
      name: category ? category.name : "No Name",
      desc: category ? category.description : "Data no description",
    },
    { status: 200 }
  );
};
