import prisma from "@/components/prisma";
import { Bank } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const name = req.nextUrl.searchParams.get("name");
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (page - 1) * 20;
  if (name) {
    const result: Bank[] = await prisma.bank.findMany({
      where: { AND: [{ is_active: true }, { name: { contains: name } }] },
      include: { products: { where: { is_active: true } } },
      skip: skip,
      take: 20,
    });

    return NextResponse.json(
      { result, total: result.length },
      { status: 200, statusText: "Berhasil" }
    );
  } else {
    const result: Bank[] = await prisma.bank.findMany({
      where: { is_active: true },
      include: { products: { where: { is_active: true } } },
      skip: skip,
      take: 20,
    });
    const total = await prisma.bank.count({ where: { is_active: true } });
    return NextResponse.json(
      { result, total },
      { status: 200, statusText: "Berhasil" }
    );
  }
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.bank.findFirst({
      where: { name: data.name, is_active: true },
    });
    if (find)
      return NextResponse.json(
        { msg: "Data bank sudah tersedia!" },
        { status: 400, statusText: "Data bank sudah tersedia!" }
      );
    const result = await prisma.bank.create({
      data: {
        name: data.name,
        by_admin: parseFloat(data.by_admin.toString()),
        by_tatalaksana: parseInt(data.by_tatalaksana),
        by_materai: parseInt(data.by_materai),
        by_buka_rekening: parseInt(data.by_buka_rekening),
        by_angsuran: parseFloat(data.by_angsuran),
        by_admin_bank: parseFloat(data.by_admin_bank),
        by_lainnya: parseFloat(data.by_lainnya),
        by_provisi: parseInt(data.by_provisi),
        margin_bank: parseFloat(data.margin_bank.toString()),
        by_flagging: parseInt(data.by_flagging),
        by_epotpen: parseInt(data.by_epotpen),
        is_syariah: data.is_syariah,
      },
    });
    return NextResponse.json(
      { result, msg: "Data bank berhasil disimpan" },
      { status: 201, statusText: "Data bank berhasil dibuat" }
    );
  } catch (err) {
    return NextResponse.json(
      { msg: "Server error" },
      { status: 500, statusText: "Server Error" }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const data: Bank = await req.json();
  try {
    const find = await prisma.bank.findFirst({ where: { id: data.id } });
    if (!find)
      return NextResponse.json(
        { msg: "Data bank tidak ditemukan" },
        { status: 404, statusText: "Data bank tidak ditemukan!" }
      );
    await prisma.bank.update({
      where: { id: data.id },
      data: {
        name: data.name ? data.name : find.name,
        by_admin: data.by_admin ? data.by_admin : find.by_admin,
        by_tatalaksana: data.by_tatalaksana
          ? data.by_tatalaksana
          : find.by_tatalaksana,
        by_materai: data.by_materai ? data.by_materai : find.by_materai,
        by_buka_rekening: data.by_buka_rekening
          ? data.by_buka_rekening
          : find.by_buka_rekening,
        by_angsuran: data.by_angsuran ? data.by_angsuran : find.by_angsuran,
        by_admin_bank: data.by_admin_bank
          ? data.by_admin_bank
          : find.by_admin_bank,
        by_lainnya: data.by_lainnya ? data.by_lainnya : find.by_lainnya,
        by_provisi: data.by_provisi
          ? parseInt((data.by_provisi || 0).toString())
          : find.by_provisi,
        margin_bank: data.margin_bank
          ? parseFloat(data.margin_bank.toString())
          : find.margin_bank,
        by_flagging: parseInt(data.by_flagging.toString()),
        by_epotpen: parseInt(data.by_epotpen.toString()),
        is_syariah: data.is_syariah,
      },
    });
    return NextResponse.json(
      { msg: "Data bank berhasil diupdate" },
      { status: 200, statusText: "Update data bank berhasil" }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server error" },
      { status: 500, statusText: "Server Error" }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const { id } = await req.json();
  try {
    const find = await prisma.bank.findFirst({ where: { id: id } });
    if (!find)
      return NextResponse.json(
        { msg: "Data bank tidak ditemukan" },
        { status: 404, statusText: "Data bank tidak ditemukan" }
      );

    await prisma.bank.update({
      where: { id: id },
      data: {
        is_active: false,
      },
    });
    return NextResponse.json(
      { msg: "Data bank berhasil dihapus" },
      { status: 200, statusText: "Data bank berhasil dihapus" }
    );
  } catch (err) {
    return NextResponse.json(
      { msg: "Server error" },
      { status: 500, statusText: "Server Error" }
    );
  }
};
