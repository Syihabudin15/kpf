import { DataPembiayaan, DataPengajuan, Produk } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export interface LineProps {
  options: object;
  series: { name: string; data: any[] }[];
}
interface Pembiayaan extends DataPembiayaan {
  Produk: Produk;
}
interface Pengajuan extends DataPengajuan {
  DataPembiayaan: Pembiayaan;
}

export const GET = async (req: NextRequest) => {
  return NextResponse.json({ data: [] }, { status: 200 });
};
