import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import moment from "moment";
import { Bank, DataPembiayaan, DataPengajuan } from "@prisma/client";
import { daysInMonth } from "@/components/utils/inputUtils";

export interface LineProps {
  options: object;
  series: { name: string; data: any[] }[];
}
interface Pengajuan extends DataPengajuan {
  DataPembiayaan: DataPembiayaan;
}
export interface DataMasterDashboard extends Bank {
  DataPengajuan: Pengajuan[];
}

export const GET = async (req: NextRequest) => {
  const banks: DataMasterDashboard[] = await prisma.bank.findMany({
    where: { is_active: true },
    include: {
      DataPengajuan: {
        where: { is_active: true },
        include: {
          DataPembiayaan: true,
        },
      },
    },
  });

  let months: string[] = [];
  let line: { name: string; data: number[] }[] = [];

  const date = new Date();
  for (let i = 0; i < banks.length; i++) {
    let bankName = banks[i].name;
    let series: number[] = [];
    for (let j = 0; j < date.getMonth() + 1; j++) {
      months.push(moment([date.getFullYear(), j, 1]).format("MMM"));
      const find = await prisma.dataPengajuan.findMany({
        where: {
          status_pencairan: "TRANSFER",
          bankId: banks[i].id,
          tanggal_pencairan: {
            gte: moment([date.getFullYear(), j, 1]).toISOString(),
            lte: moment([
              date.getFullYear(),
              j,
              daysInMonth(j + 1, date.getFullYear()),
            ]).toISOString(),
          },
        },
        include: {
          DataPembiayaan: true,
        },
      });
      let temp = 0;
      find.forEach((res) => (temp += res.DataPembiayaan.plafond));
      series.push(temp);
    }
    line.push({ name: bankName, data: series });
  }
  let antri = 0;
  let transfer = 0;
  let batal = 0;

  banks.forEach((bank) => {
    bank.DataPengajuan.forEach((p) => {
      if (p.status_pencairan === "TRANSFER") {
        transfer += p.DataPembiayaan.plafond;
      } else if (p.status_pencairan === "BATAL") {
        batal += p.DataPembiayaan.plafond;
      } else {
        antri += p.DataPembiayaan.plafond;
      }
    });
  });

  return NextResponse.json(
    {
      banks,
      line,
      months,
      pie: {
        label: ["DROPPING", "ANTRI", "DITOLAK"],
        data: [transfer, antri, batal],
      },
    },
    { status: 200 }
  );
};
