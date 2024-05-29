import prisma from "@/components/prisma";
import { UnitPelayanan } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const area = req.nextUrl.searchParams.get("area");
  const inactive = req.nextUrl.searchParams.get("inactive");
  const page = req.nextUrl.searchParams.get("page");

  let result: UnitPelayanan[] = [];
  if (inactive && page) {
    const skip = (parseInt(page.toString()) - 1) * 20;
    const find: UnitPelayanan[] = await prisma.unitPelayanan.findMany({
      where: { is_active: false },
      include: { UnitCabang: { include: { User: true } } },
      take: 20,
      skip,
    });
    result = find;
  } else if (!inactive && area && page) {
    const skip = (parseInt(page.toString()) - 1) * 20;
    const find: UnitPelayanan[] = await prisma.unitPelayanan.findMany({
      where: {
        AND: [{ id: area }, { is_active: true }],
      },
      include: {
        UnitCabang: {
          where: { is_active: true },
          include: {
            User: {
              where: { status_active: true },
            },
          },
        },
      },
      take: 20,
      skip,
    });
    result = find;
  } else {
    const find: UnitPelayanan[] = await prisma.unitPelayanan.findMany({
      where: { is_active: true },
      include: {
        UnitCabang: {
          where: { is_active: true },
          include: { User: { where: { status_active: true } } },
        },
      },
    });
    result = find;
  }
  const total = await prisma.unitPelayanan.count({
    where: { is_active: true },
  });

  return NextResponse.json(
    { result, total: page ? total : result.length },
    { status: 200, statusText: "Berhasil" }
  );
};

export const POST = async (req: NextRequest) => {
  const data: UnitPelayanan = await req.json();
  try {
    const find = await prisma.unitPelayanan.findFirst({
      where: {
        OR: [{ name: data.name }, { kode_area: data.kode_area }],
      },
    });
    if (find && find.is_active === true) {
      return NextResponse.json(
        { msg: "Nama atau kode area sudah tersedia" },
        { status: 400, statusText: "BAD REQUEST" }
      );
    }
    if (find && find.is_active === false) {
      await prisma.unitPelayanan.update({
        where: { id: find.id },
        data: {
          name: data.name,
          kode_area: data.kode_area,
          is_active: true,
        },
      });
      return NextResponse.json(
        { msg: "Data unit pelayanan berhasil disimpan" },
        { status: 201, statusText: "OK" }
      );
    }
    const result = await prisma.unitPelayanan.create({ data: data });
    return NextResponse.json(
      { result, msg: "Data unit pelayanan berhasil disimpan" },
      { status: 201, statusText: "OK" }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "INTERNAL SERVER ERROR" }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const data: UnitPelayanan = await req.json();
  try {
    const find = await prisma.unitPelayanan.findFirst({
      where: { id: data.id },
    });
    if (
      find &&
      (find.name !== data.name || find.kode_area !== data.kode_area)
    ) {
      const searchNameOrArea = await prisma.unitPelayanan.findFirst({
        where: { OR: [{ name: data.name }, { kode_area: data.kode_area }] },
      });
      if (searchNameOrArea && searchNameOrArea.id !== data.id) {
        return NextResponse.json(
          { msg: "Nama unit pelayanan atau kode area telah tersedia" },
          { status: 400, statusText: "BAD REQUEST" }
        );
      } else {
        await prisma.unitPelayanan.update({
          where: { id: data.id },
          data: {
            name: data.name,
            kode_area: data.kode_area,
            is_active: true,
          },
        });
        return NextResponse.json(
          { msg: "Update data unit pelayanan berhasil" },
          { status: 200, statusText: "OK" }
        );
      }
    } else {
      return NextResponse.json(
        { msg: "Data unit pelayanan tidak ditemukan" },
        { status: 404, statusText: "NOT FOUND" }
      );
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "INTERNAL SERVER ERROR" }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const { id } = await req.json();
  const find = await prisma.unitPelayanan.findFirst({ where: { id: id } });
  if (!find)
    return NextResponse.json(
      { msg: "Data unit pelayanan tidak ditemukan" },
      { status: 404, statusText: "NOT FOUND" }
    );
  try {
    if (find.is_active === true) {
      await prisma.$transaction(async (tx) => {
        await tx.unitPelayanan.update({
          where: { id: id },
          data: { is_active: false },
        });
        const findCabang = await tx.unitCabang.findMany({
          where: { unit_pelayanan_id: id },
        });
        if (findCabang.length === 0) {
          return NextResponse.json(
            { msg: "Hapus data unit pelayanan berhasil" },
            { status: 200, statusText: "OK" }
          );
        }
        await tx.unitCabang.updateMany({
          where: { id: id },
          data: { is_active: false },
        });
        await tx.user.updateMany({
          where: { UnitCabang: { UnitPelayanan: { id: id } } },
          data: { status_active: false },
        });
      });
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.unitPelayanan.update({
          where: { id: id },
          data: { is_active: true },
        });
        const findCabang = await tx.unitCabang.findMany({
          where: { unit_pelayanan_id: id },
        });
        if (findCabang.length === 0) {
          return NextResponse.json(
            { msg: "Hapus data unit pelayanan berhasil" },
            { status: 200, statusText: "OK" }
          );
        }
        await tx.unitCabang.updateMany({
          where: { id: id },
          data: { is_active: true },
        });
        await tx.user.updateMany({
          where: { UnitCabang: { UnitPelayanan: { id: id } } },
          data: { status_active: true },
        });
      });
    }
    return NextResponse.json(
      { msg: "Hapus data unit pelayanan berhasil" },
      { status: 200, statusText: "OK" }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "INTERNAL SERVER ERROR" }
    );
  }
};
