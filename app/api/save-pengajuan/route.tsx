import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const result = await prisma.dataPengajuan.findMany({
    where: {
      OR: [{ status_slik: null }, { status_verifikasi: null }],
      is_active: true,
    },
    include: {
      DataPembiayaan: {
        include: {
          Produk: {
            include: {
              Bank: true,
            },
          },
          JenisPembiayaan: true,
          Refferal: true,
          User: {
            include: {
              UnitCabang: {
                include: {
                  UnitPelayanan: true,
                },
              },
            },
          },
        },
      },
      User: {
        include: {
          UnitCabang: {
            include: { UnitPelayanan: true },
          },
        },
      },
      BerkasPengajuan: true,
      Bank: true,
      DataPengajuanAlamat: true,
      DataPengajuanPasangan: true,
      DataTaspen: {
        include: {
          DataKeluarga: true,
          Domisili: true,
          DataPasangan: true,
          TunjanganPotongan: true,
        },
      },
    },
  });
  return NextResponse.json({ data: result }, { status: 200 });
};
