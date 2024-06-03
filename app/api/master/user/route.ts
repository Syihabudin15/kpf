import prisma from "@/components/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  data.status_active = true;
  const find = await prisma.user.findFirst({
    where: {
      OR: [
        { username: data.username },
        { email: data.email },
        { nip: data.nip },
        { nik: data.nik },
      ],
    },
  });

  if (find)
    return NextResponse.json(
      { msg: "Username ,email, nip, atau nik telah digunakan" },
      { status: 400, statusText: "Username atau email telah digunakan" }
    );
  if (
    !data.username ||
    !data.first_name ||
    !data.last_name ||
    !data.role ||
    !data.password
  ) {
    return NextResponse.json(
      { msg: "Mohon lengkapi data user terlebih dahulu!" },
      { status: 400, statusText: "Mohon lengkapi data user terlebih dahulu" }
    );
  }

  try {
    const pass = await bcrypt.hash(data.password, 10);
    data.password = pass;
    data.target = data.target ? parseInt(data.target) : 0;
    data.masa_kotrak = data.masa_kontrak ? parseInt(data.masa_kontrak) : 3;
    data.tanggal_lahir = data.tanggal_lahir
      ? new Date(data.tanggal_lahir)
      : null;

    delete data.tanggal_picture;
    delete data.masa_kontrak;
    const save = await prisma.user.create({ data: data });

    return NextResponse.json(
      { msg: "Data user berhasil ditambahkan!" },
      {
        status: 201,
        statusText: "Berhasil membuat user baru",
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Gagal menambahkan user baru. coba lagi!",
      },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const search = <any>req.nextUrl.searchParams.get("search");
  const skip = (page - 1) * 20;

  let result: any[] = [];
  if (search) {
    result = await prisma.user.findMany({
      where: {
        OR: [
          { first_name: { contains: search } },
          { last_name: { contains: search } },
          { no_telepon: { contains: search } },
          { email: { contains: search } },
          { username: { contains: search } },
          { nip: { contains: search } },
          { nik: { contains: search } },
        ],
      },
      skip: skip,
      take: 20,
      include: { UnitCabang: { include: { UnitPelayanan: true } }, Bank: true },
      orderBy: { created_at: "desc" },
    });
  } else {
    result = await prisma.user.findMany({
      include: { UnitCabang: { include: { UnitPelayanan: true } }, Bank: true },
      orderBy: { created_at: "desc" },
      skip: skip,
      take: 20,
    });
  }
  const total = await prisma.user.count();
  return NextResponse.json(
    { data: result, totalLength: search ? result.length : total },
    { status: 200, statusText: "Berhasil" }
  );
};

export const PUT = async (req: NextRequest) => {
  const data: any = await req.json();
  const find = await prisma.user.findFirst({ where: { id: data.id } });
  if (!find)
    return NextResponse.json(
      { msg: "Data tidak ditemukan!" },
      { status: 404, statusText: "Data tidak ditemukan" }
    );

  try {
    await prisma.user.update({
      where: { id: find.id },
      data: {
        first_name: data.first_name ? data.first_name : find.first_name,
        last_name: data.last_name ? data.last_name : find.last_name,
        username: data.username ? data.username : find.username,
        password: data.password
          ? await bcrypt.hash(data.password, 10)
          : find.password,
        role: data.role ? data.role : find.role,
        status_active: data.status_active
          ? data.status_active
          : find.status_active,
        unit_cabang_id: data.unit_cabang_id
          ? data.unit_cabang_id
          : find.unit_cabang_id,
        bank_id: data.bank_id ? data.bank_id : find.bank_id,
        nik: data.nik ? data.nik : find.nik,
        nip: data.nip ? data.nip : find.nip,
        masa_kotrak: parseInt(data.masa_kontrak)
          ? parseInt(data.masa_kontrak)
          : find.masa_kotrak,
        target: data.target ? parseInt(data.target) : find.target,
        alamat: data.alamat ? data.alamat : find.alamat,
        picture: data.picture ? data.picture : find.picture,
        tempat_lahir: data.tempat_lahir ? data.tempat_lahir : find.tempat_lahir,
        tanggal_lahir: data.tanggal_lahir
          ? new Date(data.tanggal_lahir)
          : find.tanggal_lahir,
        no_telepon: data.no_telepon ? data.no_telepon : find.no_telepon,
        posisi: data.posisi ? data.posisi : find.posisi,
      },
    });
    return NextResponse.json(
      { msg: "Update user berhasil" },
      { status: 200, statusText: "Update user berhasil" }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server error" },
      { status: 500, statusText: "Gagal update user. coba lagi nanti!" }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const { id } = await req.json();
  const find = await prisma.user.findFirst({ where: { id: id } });
  if (!find)
    return NextResponse.json(
      { msg: "Data tidal ditemukan!" },
      { status: 404, statusText: "Data user tidak ditemukan" }
    );
  try {
    await prisma.user.update({
      where: { id: find.id },
      data: {
        status_active: !find.status_active,
      },
    });
    return NextResponse.json(
      { msg: "User berhasil dihapus" },
      { status: 200, statusText: "User berhasil dihapus" }
    );
  } catch (err) {
    return NextResponse.json({}, { status: 500, statusText: "Server Error" });
  }
};
