import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { StatusPencairan } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  const areaId: string | null = req.nextUrl.searchParams.get("areaId");
  const sumdanId: string | null = req.nextUrl.searchParams.get("sumdanId");
  const jenisId: string | null = req.nextUrl.searchParams.get("jenisId");
  const status: StatusPencairan | null = <any>(
    req.nextUrl.searchParams.get("status")
  );
  const backdate: string | null = req.nextUrl.searchParams.get("backdate");
  const search: string | undefined = <any>(
    req.nextUrl.searchParams.get("search")
  );
  const page: number = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const skip = (page - 1) * pageSize;

  const find = await prisma.dataPengajuan.findMany({
    where: {
      is_active: true,
      ...(search && {
        OR: [
          { nama: { contains: search } },
          { nama_skep: { contains: search } },
          { nopen: { contains: search } },
        ],
      }),
      ...(jenisId && { DataPembiayaan: { jenis_pembiayaan_id: jenisId } }),
      ...(sumdanId && { bankId: sumdanId }),
      ...(areaId && {
        User: {
          UnitCabang: {
            unit_pelayanan_id: areaId,
          },
        },
      }),
      ...(status && {
        status_pencairan: (status as any) === "null" ? null : status,
      }),
      ...(backdate && {
        DataPembiayaan: {
          tanggal_input: {
            gte: new Date(backdate.split(",")[0]),
            lte: new Date(backdate.split(",")[1]),
          },
        },
      }),
    },
    include: {
      DataPembiayaan: {
        include: {
          Produk: {
            include: { Bank: true },
          },
          JenisPembiayaan: true,
          Refferal: true,
          User: {
            include: { UnitCabang: { include: { UnitPelayanan: true } } },
          },
        },
      },
      User: { include: { UnitCabang: { include: { UnitPelayanan: true } } } },
      BerkasPengajuan: true,
      DataTaspen: {
        include: {
          DataKeluarga: true,
          Domisili: true,
          DataPasangan: true,
          TunjanganPotongan: true,
        },
      },
      Bank: true,
      DataPengajuanAlamat: true,
      DataPengajuanPasangan: true,
    },
    skip: skip,
    take: pageSize,
    orderBy: {
      DataPembiayaan: {
        tanggal_input: "desc",
      },
    },
  });
  const total = await prisma.dataPengajuan.count({
    where: {
      is_active: true,
      ...(search && {
        OR: [
          { nama: { contains: search } },
          { nama_skep: { contains: search } },
          { nopen: { contains: search } },
        ],
      }),
      ...(jenisId && { DataPembiayaan: { jenis_pembiayaan_id: jenisId } }),
      ...(sumdanId && { bankId: sumdanId }),
      ...(areaId && {
        User: {
          UnitCabang: {
            unit_pelayanan_id: areaId,
          },
        },
      }),
      ...(status && {
        status_pencairan: (status as any) === "null" ? null : status,
      }),
      ...(backdate && {
        DataPembiayaan: {
          tanggal_input: {
            gte: new Date(backdate.split(",")[0]),
            lte: new Date(backdate.split(",")[1]),
          },
        },
      }),
    },
  });

  return NextResponse.json({ data: find, total, status: 200 }, { status: 200 });
};
