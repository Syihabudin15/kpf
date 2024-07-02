import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import moment from "moment-timezone";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const nama = req.nextUrl.searchParams.get("nama");
  const year: string =
    <any>req.nextUrl.searchParams.get("year") || moment().format("YYYY-MM");
  const skip = (page - 1) * 20;
  const sess = await getServerSession();
  const user = await prisma?.user.findFirst({
    where: { email: sess?.user?.email },
  });

  if (!user) return NextResponse.json({ data: [], total: 0 }, { status: 401 });

  let result: DataDataPengajuan[] = [];
  let total = 0;

  if (user.role === "BANK" || user.role === "APPROVAL") {
    const data = await handleBank(user.bank_id as string, nama, skip, year);
    result = data.result;
    total = data.total;
  } else {
    const data = await handleNonBank(nama, skip, year);
    result = data.result;
    total = data.total;
  }
  return NextResponse.json({ data: result, total }, { status: 200 });
};

const handleBank = async (
  bank_id: string,
  nama: string | null | undefined,
  skip: number,
  year: string
) => {
  let result = [];
  if (nama) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
        bankId: bank_id,
        OR: [
          { nama: { contains: nama } },
          { nopen: { contains: nama } },
          { nama_skep: { contains: nama } },
        ],
        DataPembiayaan: {
          OR: [
            { JenisPembiayaan: { name: "Mutasi" } },
            { JenisPembiayaan: { name: "Mutasi Take Over" } },
            { JenisPembiayaan: { name: "Take Over" } },
          ],
        },
      },
      include: {
        DataPembiayaan: {
          include: {
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            Produk: { include: { Bank: true } },
            JenisPembiayaan: true,
            Refferal: true,
          },
        },
        User: {
          include: { UnitCabang: { include: { UnitPelayanan: true } } },
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
        DataPencairan: true,
      },
      orderBy: { tanggal_pencairan: "desc" },
      skip: skip,
      take: 20,
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
        bankId: bank_id,
        DataPembiayaan: {
          created_at: {
            gte: moment(`${year}-01`).tz("Asia/Jakarta").toISOString(true),
            lte: moment(`${year}-${moment(year).daysInMonth()} 23:59`)
              .tz("Asia/Jakarta")
              .toISOString(true),
          },
          OR: [
            { JenisPembiayaan: { name: "Mutasi" } },
            { JenisPembiayaan: { name: "Mutasi Take Over" } },
            { JenisPembiayaan: { name: "Take Over" } },
          ],
        },
      },
      include: {
        DataPembiayaan: {
          include: {
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            Produk: { include: { Bank: true } },
            JenisPembiayaan: true,
            Refferal: true,
          },
        },
        User: {
          include: { UnitCabang: { include: { UnitPelayanan: true } } },
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
        DataPencairan: true,
      },
      orderBy: { tanggal_pencairan: "desc" },
      skip: skip,
      take: 20,
    });
  }
  let total = await prisma.dataPengajuan.count({
    where: {
      status_pencairan: "TRANSFER",
      bankId: bank_id,
      DataPembiayaan: {
        created_at: {
          gte: moment(`${year}-01`).tz("Asia/Jakarta").toISOString(true),
          lte: moment(`${year}-${moment(year).daysInMonth()} 23:59`)
            .tz("Asia/Jakarta")
            .toISOString(true),
        },
        OR: [
          { JenisPembiayaan: { name: "Mutasi" } },
          { JenisPembiayaan: { name: "Mutasi Take Over" } },
          { JenisPembiayaan: { name: "Take Over" } },
        ],
      },
    },
    orderBy: { tanggal_pencairan: "desc" },
  });
  return { result, total: nama ? result.length : total };
};
const handleNonBank = async (
  nama: string | null | undefined,
  skip: number,
  year: string
) => {
  let result = [];
  if (nama) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
        OR: [
          { nama: { contains: nama } },
          { nopen: { contains: nama } },
          { nama_skep: { contains: nama } },
        ],
        DataPembiayaan: {
          OR: [
            { JenisPembiayaan: { name: "Mutasi" } },
            { JenisPembiayaan: { name: "Mutasi Take Over" } },
            { JenisPembiayaan: { name: "Take Over" } },
          ],
        },
      },
      include: {
        DataPembiayaan: {
          include: {
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            Produk: { include: { Bank: true } },
            JenisPembiayaan: true,
            Refferal: true,
          },
        },
        User: {
          include: { UnitCabang: { include: { UnitPelayanan: true } } },
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
        DataPencairan: true,
      },
      orderBy: { tanggal_pencairan: "desc" },
      skip: skip,
      take: 20,
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
        DataPembiayaan: {
          created_at: {
            gte: moment(`${year}-01`).tz("Asia/Jakarta").toISOString(true),
            lte: moment(`${year}-${moment(year).daysInMonth()} 23:59`)
              .tz("Asia/Jakarta")
              .toISOString(true),
          },
          OR: [
            { JenisPembiayaan: { name: "Mutasi" } },
            { JenisPembiayaan: { name: "Mutasi Take Over" } },
            { JenisPembiayaan: { name: "Take Over" } },
          ],
        },
      },
      include: {
        DataPembiayaan: {
          include: {
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            Produk: { include: { Bank: true } },
            JenisPembiayaan: true,
            Refferal: true,
          },
        },
        User: {
          include: { UnitCabang: { include: { UnitPelayanan: true } } },
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
        DataPencairan: true,
      },
      orderBy: { tanggal_pencairan: "desc" },
      skip: skip,
      take: 20,
    });
  }
  let total = await prisma.dataPengajuan.count({
    where: {
      status_pencairan: "TRANSFER",
      DataPembiayaan: {
        created_at: {
          gte: moment(`${year}-01`).tz("Asia/Jakarta").toISOString(true),
          lte: moment(`${year}-${moment(year).daysInMonth()} 23:59`)
            .tz("Asia/Jakarta")
            .toISOString(true),
        },
        OR: [
          { JenisPembiayaan: { name: "Mutasi" } },
          { JenisPembiayaan: { name: "Mutasi Take Over" } },
          { JenisPembiayaan: { name: "Take Over" } },
        ],
      },
    },
    orderBy: { tanggal_pencairan: "desc" },
  });
  return { result, total: nama ? result.length : total };
};
