import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { getServerSession } from "next-auth";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!user)
    return NextResponse.json(
      { verifikasi: 0, slik: 0, checker: 0, maker: 0, approval: 0, si: 0 },
      { status: 401 }
    );

  const verifikasi = await getNotifField("status_verifikasi");
  let slik = 0;
  let checker = 0;
  let maker = 0;
  let approval = 0;
  let si = 0;

  if (
    user.role === "BANK" ||
    user.role === "CHECKER" ||
    user.role === "MAKER" ||
    user.role === "APPROVAL"
  ) {
    slik = await getNotifFieldBank("status_slik", user.bank_id as string);
    checker = await getNotifFieldBank("status_checker", user.bank_id as string);
    maker = await getNotifFieldBank("status_maker", user.bank_id as string);
    approval = await prisma.dataPengajuan.count({
      where: {
        AND: [
          { status_approval: "ANTRI" },
          { status_verifikasi: "SETUJU" },
          { status_slik: "SETUJU" },
          { is_active: true },
          { bankId: user.bank_id },
        ],
      },
    });
    si = await prisma.dataPencairan.count({
      where: { status: false, berkas_si: { not: null }, bankId: user.bank_id },
    });
  } else {
    slik = await getNotifField("status_slik");
    checker = await getNotifField("status_checker");
    maker = await getNotifField("status_maker");
    approval = await prisma.dataPengajuan.count({
      where: {
        AND: [
          { status_approval: "ANTRI" },
          { status_verifikasi: "SETUJU" },
          { status_slik: "SETUJU" },
          { is_active: true },
        ],
      },
    });
    si = await prisma.dataPencairan.count({
      where: { berkas_si: null },
    });
  }
  let cair = await prisma.dataPengajuan.count({
    where: {
      status_approval: "SETUJU",
      is_active: true,
      is_cetak: false,
    },
  });

  return NextResponse.json(
    { verifikasi, slik, checker, maker, approval, si, cair },
    { status: 200 }
  );
};

const getNotifField = async (field: string) => {
  const result = await prisma.dataPengajuan.count({
    where: {
      AND: [{ [field]: "ANTRI" }, { is_active: true }],
    },
  });
  return result;
};
const getNotifFieldBank = async (field: string, id: string) => {
  const result = await prisma.dataPengajuan.count({
    where: {
      AND: [{ [field]: "ANTRI" }, { is_active: true }, { bankId: id }],
    },
  });
  return result;
};
