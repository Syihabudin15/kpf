import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import path from "path";
import { promises as fs } from "fs";
import { DataDataPencairan } from "@/components/utils/Interfaces";

export const GET = async (req: NextRequest) => {
  const year =
    req.nextUrl.searchParams.get("year") ?? new Date().getFullYear().toString();
  const page = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (page - 1) * 20;
  const session = await getServerSession();
  const findUser = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!findUser)
    return NextResponse.json(
      { msg: "User tidak dikenali!. mohon login ulang" },
      { status: 404 }
    );
  let result: DataDataPencairan[] = [];

  if (findUser.role === "MASTER") {
    result = <any>await prisma.dataPencairan.findMany({
      where: { is_active: true },
      include: {
        DataPengajuan: {
          where: {
            AND: [
              {
                DataPembiayaan: {
                  AND: [
                    { is_active: true },
                    { created_at: { gte: new Date(`${year}-01-01`) } },
                    { created_at: { lte: new Date(`${year}-12-30`) } },
                  ],
                },
              },
            ],
          },
          include: {
            User: {
              include: {
                UnitCabang: {
                  include: {
                    UnitPelayanan: true,
                  },
                },
              },
            },
            DataPembiayaan: {
              include: {
                Produk: {
                  include: { Bank: true },
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
            Bank: true,
            BerkasPengajuan: true,
            DataTaspen: {
              include: {
                DataKeluarga: true,
                Domisili: true,
                DataPasangan: true,
                TunjanganPotongan: true,
              },
            },
            DataPengajuanAlamat: true,
            DataPengajuanPasangan: true,
          },
        },
        Bank: true,
      },
      take: 20,
      skip,
    });
  } else {
    result = <any>await prisma.dataPencairan.findMany({
      where: { is_active: true, bankId: findUser.bank_id },
      include: {
        DataPengajuan: {
          where: {
            AND: [
              { bankId: findUser.bank_id },
              {
                DataPembiayaan: {
                  AND: [
                    { created_at: { gte: new Date(`${year}-01-01`) } },
                    { created_at: { lte: new Date(`${year}-12-30`) } },
                  ],
                },
              },
            ],
          },
          include: {
            User: {
              include: {
                UnitCabang: {
                  include: {
                    UnitPelayanan: true,
                  },
                },
              },
            },
            DataPembiayaan: {
              include: {
                Produk: {
                  include: { Bank: true },
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
            Bank: true,
            BerkasPengajuan: true,
            DataTaspen: {
              include: {
                DataKeluarga: true,
                Domisili: true,
                DataPasangan: true,
                TunjanganPotongan: true,
              },
            },
            DataPengajuanAlamat: true,
            DataPengajuanPasangan: true,
          },
        },
        Bank: true,
      },
      take: 20,
      skip,
    });
  }
  const total = await prisma.dataPencairan.count({
    where: {
      is_active: true,
    },
  });
  return NextResponse.json(
    {
      data: result.filter((r) => r.DataPengajuan.length > 0),
      tota: year
        ? result.filter((r) => r.DataPengajuan.length > 0).length
        : total,
    },
    { status: 200 }
  );
};
export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.dataPencairan.findFirst({
      where: { id: data.id },
      include: { DataPengajuan: true },
    });
    if (!find)
      return NextResponse.json(
        { msg: "Data tidak ditemukan!" },
        { status: 404 }
      );

    const buff = Buffer.from(data.file.split(",")[1], "base64");
    const fileName = `BUKTI_CAIR_${data.nomor.split("/").join("_")}.${
      data.ext
    }`;
    const pathUrl = path.join(
      process.cwd(),
      `/storage/${data.dir.toLowerCase()}/${fileName}`
    );
    fs.writeFile(pathUrl, buff);

    const result = await prisma.$transaction(async (tx) => {
      for (let i = 0; i < find.DataPengajuan.length; i++) {
        const findPengajuan = await tx.dataPengajuan.findFirst({
          where: { id: find.DataPengajuan[i].id },
        });
        if (!findPengajuan)
          return NextResponse.json(
            { msg: "Data tidak ditemukan!" },
            { status: 404 }
          );
        await tx.berkasPengajuan.update({
          where: {
            id: findPengajuan.berkasPengajuanId
              ? findPengajuan.berkasPengajuanId
              : "",
          },
          data: {
            bukti_cair: `/${data.dir.toLowerCase()}/${fileName}`,
          },
        });
      }
    });
    return NextResponse.json(
      { msg: "Upload bukti pencairan berhasil" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
};
