import { DataDataUser } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const name = req.nextUrl.searchParams.get("name");
  const skip = (page - 1) * 20;

  let result: DataDataUser[] = [];

  if (name) {
    result = <any>await prisma.user.findMany({
      where: {
        AND: [
          { role: { not: "BANK" } },
          { role: { not: "CHECKER" } },
          { role: { not: "MAKER" } },
          { role: { not: "APPROVAL" } },
          { status_active: true },
          {
            OR: [
              { first_name: { contains: name } },
              { last_name: { contains: name } },
              { nip: { contains: name } },
              { nik: { contains: name } },
              { email: { contains: name } },
              { username: { contains: name } },
              {
                UnitCabang: {
                  name: { contains: name },
                },
              },
              {
                UnitCabang: {
                  kode_area: { contains: name },
                },
              },
              {
                UnitCabang: {
                  UnitPelayanan: {
                    name: { contains: name },
                  },
                },
              },
              {
                UnitCabang: {
                  UnitPelayanan: {
                    kode_area: { contains: name },
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        UnitCabang: { include: { UnitPelayanan: true } },
      },
      skip: skip,
      take: 20,
    });
  } else {
    result = <any>await prisma.user.findMany({
      where: {
        AND: [
          { role: { not: "BANK" } },
          { role: { not: "CHECKER" } },
          { role: { not: "MAKER" } },
          { role: { not: "APPROVAL" } },
          { status_active: true },
        ],
      },
      include: {
        UnitCabang: { include: { UnitPelayanan: true } },
      },
      skip: skip,
      take: 20,
    });
  }

  const total = await prisma.user.count({
    where: {
      AND: [
        { role: { not: "BANK" } },
        { role: { not: "CHECKER" } },
        { role: { not: "MAKER" } },
        { role: { not: "APPROVAL" } },
        { status_active: true },
      ],
    },
  });

  return NextResponse.json(
    { data: result, total: name ? result.length : total, jumlah: total },
    { status: 200 }
  );
};
