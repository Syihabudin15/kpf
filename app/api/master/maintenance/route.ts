import { Maintenance } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const route = <any>req.nextUrl.searchParams.get("route");
  const skip = (page - 1) * 20;

  let result: Maintenance[] = [];

  if (route) {
    result = await prisma.maintenance.findMany({
      where: {
        route: { contains: route },
      },
      skip,
      take: 20,
    });
  } else {
    result = await prisma.maintenance.findMany({
      skip,
      take: 20,
    });
  }
  const total = await prisma.maintenance.count();
  return NextResponse.json(
    { data: result, total: route ? result.length : total },
    { status: 200 }
  );
};
export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  try {
    await prisma.maintenance.update({
      where: { id: data.id },
      data: {
        is_maintenance: data.is_maintenance,
      },
    });
    return NextResponse.json(
      { msg: "Status Maintenance berhasil diupdate" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
};
