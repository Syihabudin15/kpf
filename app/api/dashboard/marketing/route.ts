import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { getServerSession } from "next-auth";
import { daysInMonth } from "@/components/utils/inputUtils";
import {
  DataDataPengajuan,
  DataTypePengajuan,
} from "@/components/utils/Interfaces";
import moment from "moment";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!user)
    return NextResponse.json({ msg: "Login Expired" }, { status: 401 });

  const findPengajuan: DataDataPengajuan[] = <any>(
    await prisma.dataPengajuan.findMany({
      where: {
        user_id: user.id,
        is_active: true,
        status_pencairan: "TRANSFER",
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
    })
  );
  const hariIni = await prisma.dataPengajuan.findMany({
    where: {
      user_id: user.id,
      is_active: true,
      DataPembiayaan: {
        created_at: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      },
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
  return NextResponse.json({ dataTable: findPengajuan, dataHariIni: hariIni });
};

export const PUT = async (req: NextRequest) => {
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!user)
    return NextResponse.json({ msg: "Login Expired" }, { status: 401 });

  let data = [];
  let labels = [];
  const dataTime = new Date();

  for (let i = 0; i < dataTime.getMonth() + 1; i++) {
    labels.push(moment([dataTime.getFullYear(), i, 1]).format("MMM"));
    let tmp = 0;
    const findPengajuan: DataTypePengajuan[] = <any>(
      await prisma.dataPengajuan.findMany({
        where: {
          status_pencairan: "TRANSFER",
          user_id: user.id,
          DataPembiayaan: {
            AND: [
              {
                created_at: {
                  gte: new Date(`${dataTime.getFullYear()}-${i + 1}-1`),
                  lte: new Date(
                    `${dataTime.getFullYear()}-${i + 1}-${daysInMonth(
                      i + 1,
                      dataTime.getFullYear()
                    )}`
                  ),
                },
              },
              { is_active: true },
              { is_simulasi: false },
            ],
          },
        },
        include: {
          DataPembiayaan: true,
        },
      })
    );
    findPengajuan.forEach((e) => {
      tmp += e.DataPembiayaan.plafond;
    });
    data.push(tmp);
  }
  return NextResponse.json({ dataChart: data, labels }, { status: 200 });
};
