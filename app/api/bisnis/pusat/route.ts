import { DataTableBisnis } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const dataTable: DataTableBisnis[] = <any>await prisma.unitPelayanan.findMany(
    {
      include: {
        UnitCabang: {
          include: {
            User: {
              include: {
                DataPengajuan: {
                  where: {
                    is_active: true,
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
        },
      },
    }
  );

  return NextResponse.json({ data: dataTable }, { status: 200 });
};
