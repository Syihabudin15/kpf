import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  const action = req.nextUrl.searchParams.get("action");
  try {
    const find = await prisma.blog.findFirst({
      where: { id: id || "" },
    });
    if (!find) {
      return NextResponse.json(
        { msg: "Data tidak ditemukan!" },
        {
          status: 404,
        }
      );
    }
    if (action && action === "like") {
      await prisma.blog.update({
        where: { id: find.id },
        data: {
          like: find.like + 1,
        },
      });
    } else {
      await prisma.blog.update({
        where: { id: find.id },
        data: {
          dislike: find.like + 1,
        },
      });
    }
    return NextResponse.json(
      { msg: "Terima kasih telah memberi review kepada kami" },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal server error!" },
      {
        status: 500,
      }
    );
  }
};
