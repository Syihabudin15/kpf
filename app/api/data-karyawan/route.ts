import { DataDataUser } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
export const dynamic = "force-dynamic";
import bcrypt from "bcrypt";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const name = req.nextUrl.searchParams.get("name");
  const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "20");
  const skip = (page - 1) * pageSize;

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
              { no_telepon: { contains: name } },
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
      take: pageSize,
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
      take: pageSize,
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

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { nip: data.nip },
          { nik: data.nik },
          { email: data.email },
          { no_telepon: data.no_telepon },
        ],
      },
    });
    if (find) {
      return NextResponse.json(
        { msg: "Username, nip, nik, email atau nomor telepon sudah digunakan" },
        { status: 400 }
      );
    }
    await prisma.user.create({ data: data });
    return NextResponse.json(
      { msg: "Data user berhasil dibuat" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
};
export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.user.findFirst({
      where: {
        id: data.id,
      },
    });
    if (!find) {
      return NextResponse.json(
        { msg: "Data tidak ditemukan!" },
        { status: 404 }
      );
    }
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        nip: data.nip ? data.nip : find.nip,
        nik: data.nik ? data.nik : find.nik,
        first_name: data.first_name ? data.first_name : find.first_name,
        last_name: data.last_name ? data.last_name : find.last_name,
        username: data.username ? data.username : find.username,
        email: data.email ? data.email : find.email,
        tempat_lahir: data.tempat_lahir ? data.tempat_lahir : find.tempat_lahir,
        tanggal_lahir: data.tanggal_lahir
          ? data.tanggal_lahir
          : find.tanggal_lahir,
        alamat: data.alamat ? data.alamat : find.alamat,
        no_telepon: data.no_telepon ? data.no_telepon : find.no_telepon,
        password: data.password
          ? await bcrypt.hash(data.password, 10)
          : find.password,
        role: data.role ? data.role : find.role,
        posisi: data.posisi ? data.posisi : find.posisi,
        status_pkwt: data.status_pkwt ? data.status_pkwt : find.status_pkwt,
        mulai_kontrak: data.mulai_kontrak
          ? data.mulai_kontrak
          : find.mulai_kontrak,
        masa_kotrak: data.masa_kontrak
          ? parseInt(data.masa_kontrak)
          : find.masa_kotrak,
        target: data.target ? parseInt(data.target) : find.target,
        unit_cabang_id: data.unit_cabang_id
          ? data.unit_cabang_id
          : find.unit_cabang_id,
        bank_id: data.bank_id ? data.bank_id : find.bank_id,
      },
    });
    return NextResponse.json(
      { msg: "Data user berhasil diperbarui" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.user.findFirst({
      where: {
        id: data.id,
      },
    });
    if (!find) {
      return NextResponse.json(
        { msg: "Data tidak ditemukan" },
        { status: 404 }
      );
    }
    await prisma.user.update({
      where: { id: data.id },
      data: {
        status_active: false,
      },
    });
    return NextResponse.json({ msg: "Data berhasil dihapus" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
};
