import prisma from "@/components/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id") as string;
  try {
    const result = await prisma.dataPengajuan.findFirst({
      where: { id: id },
      include: {
        JadwalAngsuran: true,
        DataPembiayaan: {
          include: {
            Produk: true,
            JenisPembiayaan: true,
          },
        },
      },
    });
    if (!result)
      return NextResponse.json({ msg: "Not Found" }, { status: 404 });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ data: {} }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    let mapping: any[] = [];
    for (let i = 0; i < data.data.length; i++) {
      let tanggal_lunas: Date | null = null;

      const find = await prisma.jadwalAngsuran.findFirst({
        where: {
          angsuran_ke: data.data[i].angsuran_ke,
          dataPengajuanId: data.data[i].dataPengajuanId,
        },
      });

      if (find) {
        tanggal_lunas = find.tanggal_pelunasan;
        await prisma.jadwalAngsuran.delete({
          where: {
            id: find.id,
          },
        });
      } else {
        tanggal_lunas =
          data.data[i].angsuran_ke <= data.data[i].blokir ? new Date() : null;
      }

      mapping.push({
        angsuran_ke: data.data[i].angsuran_ke,
        angsuran: parseInt(data.data[i].angsuran),
        pokok: parseInt(data.data[i].pokok),
        margin: parseInt(data.data[i].margin),
        margin_bank: parseInt(data.data[i].margin_bank),
        collfee: parseInt(data.data[i].collfee),
        tanggal_bayar: new Date(data.data[i].tanggal_bayar),
        sisa: parseInt(data.data[i].sisa),
        tanggal_pelunasan: tanggal_lunas,
        dataPengajuanId: data.data[i].dataPengajuanId,
      });
    }
    const result = await prisma.jadwalAngsuran.createMany({
      data: mapping,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error", data: data },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  await prisma.jadwalAngsuran.update({
    where: {
      id: data.id,
    },
    data: {
      tanggal_pelunasan: new Date(),
    },
  });
  return NextResponse.json({ msg: "Update data berhasil" }, { status: 200 });
};

export const DELETE = async (req: NextRequest) => {
  const data = await req.json();
  await prisma.jadwalAngsuran.update({
    where: {
      id: data.id,
    },
    data: {
      tanggal_pelunasan: null,
    },
  });
  return NextResponse.json({ msg: "Update data berhasil" }, { status: 200 });
};
