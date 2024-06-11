import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { DataDashboardBank } from "@/components/utils/Interfaces";
import { daysInMonth } from "@/components/utils/inputUtils";
import moment from "moment";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email as string },
    include: { Bank: true },
  });
  if (!user)
    return NextResponse.json(
      { msg: "Login expired. Mohon login ulang!" },
      { status: 401 }
    );

  const produk = await prisma.produk.findMany({
    where: {
      bank_id: user.bank_id,
    },
  });
  let allPengajuan = await prisma.dataPengajuan.findMany({
    where: {
      bankId: user.bank_id,
      is_active: true,
    },
    include: {
      DataPembiayaan: true,
    },
  });

  let result: DataDashboardBank[] = [];
  let cair = 0;
  let antri = 0;
  let batal = 0;

  allPengajuan.forEach((p) => {
    if (p.status_pencairan === "TRANSFER") {
      cair += p.DataPembiayaan.plafond;
    } else if (p.status_pencairan === "BATAL") {
      batal += p.DataPembiayaan.plafond;
    } else {
      antri += p.DataPembiayaan.plafond;
    }
  });

  produk.forEach((prod) => {
    const cair = allPengajuan.filter(
      (p) =>
        p.status_pencairan === "TRANSFER" &&
        p.DataPembiayaan.produk_id === prod.id
    );
    result.push({
      ...prod,
      DataPengajuan: cair,
    });
  });

  const date = new Date();
  let line: { name: string; data: number[] } = {
    name: "PENCAIRAN",
    data: [],
  };
  let months = [];

  for (let j = 0; j < date.getMonth() + 1; j++) {
    months.push(moment([date.getFullYear(), j, 1]).format("MMM"));
    const find = await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
        bankId: user.bank_id,
        tanggal_pencairan: {
          gte: moment(`${date.getFullYear()}-${j + 1}-01`).toISOString(true),
          lte: moment(
            `${date.getFullYear()}-${j + 1}-${moment(
              `${date.getFullYear()}-${j + 1}`
            ).daysInMonth()}`
          ).toISOString(true),
        },
      },
      include: {
        DataPembiayaan: true,
      },
    });
    let temp = 0;
    find.forEach((res) => (temp += res.DataPembiayaan.plafond));
    line.data.push(temp);
  }

  return NextResponse.json(
    {
      dataTable: result,
      line,
      months,
      pie: {
        label: ["DROPPING", "ANTRI", "DITOLAK"],
        data: [cair, antri, batal],
      },
    },
    { status: 200 }
  );
};
