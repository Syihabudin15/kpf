import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { DataDataTaspen } from "@/components/utils/Interfaces";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const name = req.nextUrl.searchParams.get("name");
  const skip = (page - 1) * 20;
  try {
    const total = await prisma.dataTaspen.count();
    if (name) {
      const result: DataDataTaspen = <any>await prisma.dataTaspen.findMany({
        where: {
          AND: [
            { is_active: true },
            {
              OR: [{ nama: { contains: name } }, { nopen: { contains: name } }],
            },
          ],
        },
        skip: skip,
        take: 20,
        include: {
          DataKeluarga: true,
          Domisili: true,
          DataPasangan: true,
          TunjanganPotongan: true,
        },
        orderBy: { created_at: "desc" },
      });
      return NextResponse.json(
        { data: result, total },
        { status: 200, statusText: "OK" }
      );
    } else {
      const result: DataDataTaspen = <any>await prisma.dataTaspen.findMany({
        where: { is_active: true },
        skip: skip,
        take: 20,
        include: {
          DataKeluarga: true,
          Domisili: true,
          DataPasangan: true,
          TunjanganPotongan: true,
        },
        orderBy: { created_at: "desc" },
      });
      return NextResponse.json(
        { data: result, total },
        { status: 200, statusText: "OK" }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "INTERNAL SERVER ERROR" }
    );
  }
};
