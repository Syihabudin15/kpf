import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    return NextResponse.json({data: []}, {status: 200});
}