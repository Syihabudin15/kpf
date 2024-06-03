import { DataDataTaspen } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const nopen = req.nextUrl.searchParams.get("nopen") || "";

  let result: DataDataTaspen[] = <any>await prisma?.dataTaspen.findMany({
    where: {
      nopen: { contains: nopen },
      nama: { contains: nopen },
      is_active: true,
    },
    include: {
      DataKeluarga: true,
      Domisili: true,
      DataPasangan: true,
      TunjanganPotongan: true,
    },
  });

  return NextResponse.json({ data: result });
};
