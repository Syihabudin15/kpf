import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { getServerSession } from "next-auth";
import { DataDataPengajuan } from "@/components/utils/Interfaces";

export const GET = async (req: NextRequest) => {
  const name = req.nextUrl.searchParams.get("name");
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const year =
    req.nextUrl.searchParams.get("year") ?? new Date().getFullYear().toString();
  const skip = (page - 1) * 20;
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });

  try {
    let result: DataDataPengajuan[] = [];
    if (name || year) {
      if (name) {
        if (user?.role === "ENTRY_DATA") {
          result = <any>await prisma.dataPengajuan.findMany({
            where: {
              AND: [
                { DataPembiayaan: { user_id: user.id } },
                { is_active: true },
                { status_slik: { not: null } },
                { status_slik: { not: "ANTRI" } },
                {
                  OR: [
                    { DataPembiayaan: { name: { contains: name } } },
                    { DataPembiayaan: { nopen: { contains: name } } },
                  ],
                },
              ],
            },
            include: {
              DataPembiayaan: {
                include: {
                  User: {
                    include: {
                      UnitCabang: { include: { UnitPelayanan: true } },
                    },
                  },
                  JenisPembiayaan: true,
                  Produk: { include: { Bank: true } },
                  Refferal: true,
                },
              },
              User: {
                include: { UnitCabang: { include: { UnitPelayanan: true } } },
              },
              DataTaspen: {
                include: {
                  DataKeluarga: true,
                  Domisili: true,
                  DataPasangan: true,
                  TunjanganPotongan: true,
                },
              },
              BerkasPengajuan: true,
              Bank: true,
              DataPengajuanAlamat: true,
              DataPengajuanPasangan: true,
            },
            orderBy: { DataPembiayaan: { created_at: "desc" } },
          });
        } else {
          result = <any>await prisma.dataPengajuan.findMany({
            where: {
              AND: [
                { status_slik: { not: null } },
                { status_slik: { not: "ANTRI" } },
                { is_active: true },
                {
                  OR: [
                    { DataPembiayaan: { name: { contains: name } } },
                    { DataPembiayaan: { nopen: { contains: name } } },
                  ],
                },
              ],
            },
            include: {
              DataPembiayaan: {
                include: {
                  User: {
                    include: {
                      UnitCabang: { include: { UnitPelayanan: true } },
                    },
                  },
                  JenisPembiayaan: true,
                  Produk: { include: { Bank: true } },
                  Refferal: true,
                },
              },
              User: {
                include: { UnitCabang: { include: { UnitPelayanan: true } } },
              },
              DataTaspen: {
                include: {
                  DataKeluarga: true,
                  Domisili: true,
                  DataPasangan: true,
                  TunjanganPotongan: true,
                },
              },
              BerkasPengajuan: true,
              Bank: true,
              DataPengajuanAlamat: true,
              DataPengajuanPasangan: true,
            },
            orderBy: { DataPembiayaan: { created_at: "desc" } },
          });
        }
      } else {
        if (user?.role === "ENTRY_DATA") {
          result = <any>await prisma.dataPengajuan.findMany({
            where: {
              AND: [
                { DataPembiayaan: { user_id: user.id } },
                { is_active: true },
                { status_slik: { not: null } },
                { status_slik: { not: "ANTRI" } },
                {
                  DataPembiayaan: {
                    created_at: { gte: new Date(`${year}-01-01`) },
                  },
                },
                {
                  DataPembiayaan: {
                    created_at: { lte: new Date(`${year}-12-30`) },
                  },
                },
              ],
            },
            include: {
              DataPembiayaan: {
                include: {
                  User: {
                    include: {
                      UnitCabang: { include: { UnitPelayanan: true } },
                    },
                  },
                  JenisPembiayaan: true,
                  Produk: { include: { Bank: true } },
                  Refferal: true,
                },
              },
              User: {
                include: { UnitCabang: { include: { UnitPelayanan: true } } },
              },
              DataTaspen: {
                include: {
                  DataKeluarga: true,
                  Domisili: true,
                  TunjanganPotongan: true,
                  DataPasangan: true,
                },
              },
              BerkasPengajuan: true,
              Bank: true,
              DataPengajuanAlamat: true,
              DataPengajuanPasangan: true,
            },
            orderBy: { DataPembiayaan: { created_at: "desc" } },
          });
        } else {
          result = <any>await prisma.dataPengajuan.findMany({
            where: {
              AND: [
                {
                  DataPembiayaan: {
                    created_at: { gte: new Date(`${year}-01-01`) },
                  },
                },
                { DataPembiayaan: { is_active: true } },
                { status_slik: { not: null } },
                { status_slik: { not: "ANTRI" } },
                {
                  DataPembiayaan: {
                    created_at: { lte: new Date(`${year}-12-30`) },
                  },
                },
              ],
            },
            include: {
              DataPembiayaan: {
                include: {
                  User: {
                    include: {
                      UnitCabang: { include: { UnitPelayanan: true } },
                    },
                  },
                  JenisPembiayaan: true,
                  Produk: { include: { Bank: true } },
                  Refferal: true,
                },
              },
              User: {
                include: { UnitCabang: { include: { UnitPelayanan: true } } },
              },
              DataTaspen: {
                include: {
                  DataKeluarga: true,
                  Domisili: true,
                  DataPasangan: true,
                  TunjanganPotongan: true,
                },
              },
              BerkasPengajuan: true,
              Bank: true,
              DataPengajuanAlamat: true,
              DataPengajuanPasangan: true,
            },
            orderBy: { DataPembiayaan: { created_at: "desc" } },
          });
        }
      }
    } else {
      result = <any>await prisma.dataPengajuan.findMany({
        where: {
          AND: [
            { DataPembiayaan: { is_active: true } },
            { status_verifikasi: { not: null } },
          ],
        },
        include: {
          DataPembiayaan: {
            include: {
              User: {
                include: { UnitCabang: { include: { UnitPelayanan: true } } },
              },
              JenisPembiayaan: true,
              Produk: { include: { Bank: true } },
              Refferal: true,
            },
          },
          User: {
            include: { UnitCabang: { include: { UnitPelayanan: true } } },
          },
          DataTaspen: {
            include: {
              DataKeluarga: true,
              Domisili: true,
              DataPasangan: true,
              TunjanganPotongan: true,
            },
          },
          BerkasPengajuan: true,
          Bank: true,
          DataPengajuanAlamat: true,
          DataPengajuanPasangan: true,
        },
        skip: skip,
        take: 20,
        orderBy: { DataPembiayaan: { created_at: "desc" } },
      });
    }
    const total = await prisma.dataPengajuan.count({
      where: {
        is_active: true,
      },
    });
    return NextResponse.json({
      result,
      total: name || year ? result.length : total,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "INTERNAL SERVER ERROR" }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const find = await prisma.dataPengajuan.findFirst({
      where: { id: data.id },
    });
    if (!find) {
      return NextResponse.json(
        { msg: "Data tidak ditemukan" },
        { status: 404 }
      );
    }
    await prisma.$transaction(async (tx) => {
      await tx.dataPengajuan.update({
        where: { id: find.id },
        data: {
          is_active: false,
        },
      });
      await tx.dataPembiayaan.update({
        where: { id: find.data_pembiayaan_id },
        data: {
          is_active: false,
        },
      });
    });
    return NextResponse.json({ msg: "Hapus Data Berhasil" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
};
