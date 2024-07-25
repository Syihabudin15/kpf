import { DataPembiayaan, DataPengajuan, Produk } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import moment from "moment-timezone";
import { getServerSession } from "next-auth";
import { DataTableEntryData } from "@/components/utils/Interfaces";

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
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
    include: {
      UnitCabang: {
        include: { UnitPelayanan: true },
      },
    },
  });
  if (!user)
    return NextResponse.json(
      { msg: "Login expired. Mohon login ulang!" },
      { status: 401 }
    );
  const date = new Date();
  const months = [];
  const data = [];
  for (let i = 0; i < date.getMonth() + 1; i++) {
    months.push(moment(`${date.getFullYear()}-${i + 1}-01`).format("MMM"));
    const result = await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
        tanggal_pencairan: {
          gte: moment(`${date.getFullYear()}-${i + 1}-01`)
            .tz("Asia/Jakarta")
            .toISOString(true),
          lte: moment(
            `${date.getFullYear()}-${i + 1}-${moment(
              `${date.getFullYear()}-${i + 1}`
            ).daysInMonth()} 23:59`
          )
            .tz("Asia/Jakarta")
            .toISOString(true),
        },
        is_active: true,
        DataPembiayaan: {
          user_id: user.id,
          is_active: true,
        },
      },
      include: {
        DataPembiayaan: {
          include: { Produk: true },
        },
      },
    });
    let temp = 0;
    result.forEach((d) => {
      temp += d.DataPembiayaan.plafond;
    });
    data.push(temp);
  }
  const dataTable: DataTableEntryData[] = <any>await prisma.unitCabang.findMany(
    {
      where: {
        unit_pelayanan_id: user.UnitCabang?.unit_pelayanan_id,
      },
      include: {
        User: {
          include: {
            DataPengajuan: {
              where: {
                status_pencairan: "TRANSFER",
                is_active: true,
                DataPembiayaan: {
                  is_active: true,
                },
              },
              include: {
                DataPembiayaan: {
                  include: {
                    Produk: { include: { Bank: true } },
                    JenisPembiayaan: true,
                  },
                },
              },
            },
          },
        },
      },
    }
  );
  return NextResponse.json(
    {
      data: [
        {
          name: `${user.first_name} ${user.last_name} ${date.getFullYear()}`,
          data: data,
        },
      ],
      months,
      dataTable,
      namaArea: user.unit_cabang_id
        ? user.UnitCabang?.UnitPelayanan?.name
        : "JABAR",
    },
    { status: 200 }
  );
};
