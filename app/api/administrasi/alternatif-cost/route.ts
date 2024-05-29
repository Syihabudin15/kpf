import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { DataCost } from "@/components/utils/Interfaces";
import { getServerSession } from "next-auth";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (page - 1) * 20;
  const name = req.nextUrl.searchParams.get("name");

  let result: DataCost[] = [];

  if (name) {
    result = <any>await prisma.cost.findMany({
      where: {
        is_active: true,
        is_fixed: false,
        name: { contains: name },
      },
      include: {
        User: true,
      },
      skip: skip,
      take: 20,
    });
  } else {
    result = <any>await prisma.cost.findMany({
      where: {
        is_active: true,
        is_fixed: false,
      },
      include: {
        User: true,
      },
      skip: skip,
      take: 20,
    });
  }

  let total = await prisma.cost.count({
    where: { is_active: true, is_fixed: false },
  });

  return NextResponse.json(
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!user)
    return NextResponse.json(
      { msg: "Login expired!. Mohon login ulang!" },
      { status: 401 }
    );

  try {
    await prisma.cost.create({
      data: { ...data, userId: user.id, is_fixed: false },
    });

    return NextResponse.json(
      { msg: "Fixed cost berhasil ditambahkan" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const data = await req.json();

  try {
    await prisma.cost.update({
      where: { id: data.id },
      data: { ...data, updated_at: new Date(), is_fixed: false },
    });

    return NextResponse.json(
      { msg: "Update fixed cost berhasil" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
};
