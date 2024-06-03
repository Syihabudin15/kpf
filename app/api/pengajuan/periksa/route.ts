import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  const pathname = req.nextUrl.searchParams.get("pathname");
  const data = await req.json();

  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!user)
    return NextResponse.json(
      { msg: "Login Expired. Mohon login ulang!" },
      { status: 401 }
    );

  const findPengajuan = await prisma.dataPengajuan.findFirst({
    where: { id: data.id },
  });
  if (!findPengajuan)
    return NextResponse.json(
      { msg: "Data pengajuan tidak ditemukan!" },
      { status: 404 }
    );

  data[`nama_pemeriksa_${pathname}`] = user.first_name + " " + user.last_name;

  try {
    await prisma.dataPengajuan.update({
      where: { id: data.id },
      data: data,
    });
    return NextResponse.json(
      { msg: "Proses pengajuan berhasil!" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
};
