import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "50";
  const search = req.nextUrl.searchParams.get("search");
  const sumdanId = req.nextUrl.searchParams.get("sumdanId");
  const jePemId = req.nextUrl.searchParams.get("jePemId");
  const final_status = req.nextUrl.searchParams.get("final_status");

  return NextResponse.json(
    { status: 200, data: [], total: 0 },
    { status: 200 }
  );
};
