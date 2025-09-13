import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const areaId: string | null = req.nextUrl.searchParams.get("areaId");
  const sumdanId: string | null = req.nextUrl.searchParams.get("sumdanId");

  const slik = await getNotifField(
    {
      status_verifikasi: "SETUJU",
      OR: [{ status_slik: "ANTRI" }, { status_slik: "PENDING" }],
    },
    sumdanId,
    areaId
  );
  const verif = await getNotifField(
    { OR: [{ status_verifikasi: "ANTRI" }, { status_verifikasi: "PENDING" }] },
    sumdanId,
    areaId
  );
  const approval = await getNotifField(
    {
      status_verifikasi: "SETUJU",
      status_slik: "SETUJU",
      OR: [{ status_approval: "ANTRI" }, { status_approval: "PENDING" }],
    },
    sumdanId,
    areaId
  );
  const akad = await getNotifField(
    {
      status_verifikasi: "SETUJU",
      status_slik: "SETUJU",
      status_approval: "SETUJU",
      is_cetak: false,
      BerkasPengajuan: {
        berkas_akad: null,
      },
    },
    sumdanId,
    areaId
  );
  const cetakSI = await getNotifField(
    {
      status_verifikasi: "SETUJU",
      status_slik: "SETUJU",
      status_approval: "SETUJU",
      is_cetak: false,
    },
    sumdanId,
    areaId
  );
  const si = await prisma.dataPencairan.count({
    where: {
      status: false,
      is_active: true,
      ...(sumdanId && { bankId: sumdanId }),
    },
  });

  return NextResponse.json(
    { verif, slik, approval, akad, cetakSI, si },
    { status: 200 }
  );
};

const getNotifField = async (
  field: object,
  sumdanId: string | null,
  areaId: string | null
) => {
  const find = await prisma.dataPengajuan.count({
    where: {
      is_active: true,
      OR: [{ status_pencairan: { not: "BATAL" } }, { status_pencairan: null }],
      ...field,
      ...(sumdanId && { bankId: sumdanId }),
      ...(areaId && {
        User: {
          UnitCabang: {
            unit_pelayanan_id: areaId,
          },
        },
      }),
    },
  });
  return find;
};
