import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  try {
    const result = await prisma.unitPelayanan.findMany({
      where: { is_active: true },
    });
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
};
