import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { getServerSession } from "next-auth";
import { daysInMonth } from "@/components/utils/inputUtils";
import {
  DataDataPengajuan,
  DataTableEntryData,
} from "@/components/utils/Interfaces";
import moment from "moment";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
    include: {
      UnitCabang: {
        include: { UnitPelayanan: true },
      },
    },
  });
  if (!user)
    return NextResponse.json(
      { msg: "Login expired. Mohon login ulang!" },
      { status: 401 }
    );

  const pengajuanHariIni: DataDataPengajuan = <any>(
    await prisma.dataPengajuan.findMany({
      where: {
        DataPembiayaan: {
          tanggal_input: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
          user_id: user.id,
        },
        is_active: true,
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

  const dataTable: DataTableEntryData[] = <any>await prisma.unitCabang.findMany(
    {
      where: {
        unit_pelayanan_id: user.UnitCabang?.unit_pelayanan_id,
      },
      include: {
        User: {
          // where: {
          //   role: "MARKETING",
          // },
          include: {
            DataPengajuan: {
              where: {
                status_pencairan: "TRANSFER",
              },
              include: {
                DataPembiayaan: {
                  include: {
                    Produk: { include: { Bank: true } },
                    JenisPembiayaan: true,
                  },
                },
              },
            },
          },
        },
      },
    }
  );

  return NextResponse.json(
    {
      pengajuanHariIni,
      dataTable,
      namaArea: user.unit_cabang_id
        ? user.UnitCabang?.UnitPelayanan?.name
        : "JABAR",
    },
    { status: 200 }
  );
};

export const PUT = async (req: NextRequest) => {
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
    include: {
      UnitCabang: {
        include: { UnitPelayanan: true },
      },
    },
  });
  if (!user)
    return NextResponse.json(
      { msg: "Login expired. Mohon login ulang!" },
      { status: 401 }
    );

  let data = [];
  let month = [];
  for (let i = 0; i < new Date().getMonth() + 1; i++) {
    let tmp = 0;
    month.push(moment([new Date().getFullYear(), i, 1]).format("MMM"));
    const findPengajuan = await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
        DataPembiayaan: {
          AND: [
            {
              created_at: {
                gte: new Date(`${new Date().getFullYear()}-${i + 1}-1`),
                lte: new Date(
                  `${new Date().getFullYear()}-${i + 1}-${daysInMonth(
                    i,
                    new Date().getFullYear()
                  )}`
                ),
              },
            },
            { user_id: user.id },
            { is_active: true },
            { is_simulasi: false },
          ],
        },
      },
      include: {
        DataPembiayaan: true,
      },
    });
    findPengajuan.forEach((e) => {
      tmp += e.DataPembiayaan.plafond;
    });
    data.push(tmp);
  }

  return NextResponse.json({ data: data, labels: month }, { status: 200 });
};
