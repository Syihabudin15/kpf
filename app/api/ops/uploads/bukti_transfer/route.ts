import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import path from "path";
import { existsSync, promises as fs } from "fs";
import moment from "moment";
import { DataDataPencairan } from "@/components/utils/Interfaces";
import { getServerSession } from "next-auth";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const name = req.nextUrl.searchParams.get("name");
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const skip = (page - 1) * 20;
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!user) return NextResponse.json({ data: [], total: 0 }, { status: 200 });

  let result: DataDataPencairan[] = [];
  let total = 0;

  if (user.bank_id) {
    const data = handleBank(user.bank_id, skip, name);
    result = (await data).result;
    total = (await data).total;
  } else {
    const data = handleMaster(skip, name);
    result = (await data).result;
    total = (await data).total;
  }

  return NextResponse.json(
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  try {
    const buff = Buffer.from(data.file.split(",")[1], "base64");
    const find = await prisma.dataPencairan.findFirst({
      where: {
        id: data.id,
      },
      include: {
        DataPengajuan: true,
      },
    });
    if (!find)
      return NextResponse.json(
        { msg: "Data tidak ditemukan" },
        { status: 404 }
      );
    const fileName = `${find.nomor_surat.replaceAll(
      "/",
      "_"
    )}_${moment().format("DDMMYYYY")}.${data.ext}`;
    const pathUrl = path.join(
      process.cwd(),
      `/storage/${data.dir.toLowerCase()}/${fileName}`
    );
    fs.writeFile(pathUrl, buff);

    return NextResponse.json(
      {
        msg: "Upload surat pencairan berhasil",
        url: `/${data.dir.toLowerCase()}/${fileName}`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Gagal upload surat pencairan!" },
      { status: 500 }
    );
  }
};
export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  try {
    await prisma.dataPencairan.update({
      where: {
        id: data.id,
      },
      data: {
        bukti_transfer: data.url,
        tanggal_bukti_transfer: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      {
        msg: "Upload bukti transfer berhasil",
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Gagal upload bukti transfer !",
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const data = await req.json();
  const pathUrl = path.join(process.cwd(), "/storage" + data.url);
  try {
    if (existsSync(pathUrl)) {
      await fs.unlink(pathUrl);
    }
    await prisma.dataPencairan.update({
      where: {
        id: data.id,
      },
      data: {
        bukti_transfer: null,
        tanggal_bukti_transfer: null,
      },
    });
    return NextResponse.json(
      { msg: "berhasil mengahapus file" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Gagal hapus file!" }, { status: 500 });
  }
};

const handleMaster = async (skip: number, name: string | null) => {
  let result: DataDataPencairan[] = [];
  if (name) {
    result = <any>await prisma.dataPencairan.findMany({
      where: {
        nomor_surat: { contains: name },
        is_active: true,
      },
      include: {
        Bank: true,
        DataPengajuan: {
          include: {
            DataPembiayaan: {
              include: {
                Produk: true,
                JenisPembiayaan: true,
                Refferal: true,
                User: {
                  include: {
                    UnitCabang: { include: { UnitPelayanan: true } },
                  },
                },
              },
            },
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
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            BerkasPengajuan: true,
            Bank: true,
          },
        },
      },
      skip: skip,
      take: 20,
    });
  } else {
    result = <any>await prisma.dataPencairan.findMany({
      where: {
        is_active: true,
      },
      include: {
        Bank: true,
        DataPengajuan: {
          include: {
            DataPembiayaan: {
              include: {
                Produk: true,
                JenisPembiayaan: true,
                Refferal: true,
                User: {
                  include: {
                    UnitCabang: { include: { UnitPelayanan: true } },
                  },
                },
              },
            },
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
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            BerkasPengajuan: true,
            Bank: true,
          },
        },
      },
      skip: skip,
      take: 20,
      orderBy: {
        tanggal_cetak: "desc",
      },
    });
  }
  const total = await prisma.dataPencairan.count({
    where: {
      is_active: true,
    },
  });
  return { result, total: name ? result.length : total };
};

const handleBank = async (
  bankId: string,
  skip: number,
  name: string | null
) => {
  let result: DataDataPencairan[] = [];
  if (name) {
    result = <any>await prisma.dataPencairan.findMany({
      where: {
        nomor_surat: { contains: name },
        is_active: true,
        bankId: bankId,
      },
      include: {
        Bank: true,
        DataPengajuan: {
          include: {
            DataPembiayaan: {
              include: {
                Produk: true,
                JenisPembiayaan: true,
                Refferal: true,
                User: {
                  include: {
                    UnitCabang: { include: { UnitPelayanan: true } },
                  },
                },
              },
            },
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
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            BerkasPengajuan: true,
            Bank: true,
          },
        },
      },
      skip: skip,
      take: 20,
    });
  } else {
    result = <any>await prisma.dataPencairan.findMany({
      where: {
        is_active: true,
        bankId: bankId,
      },
      include: {
        Bank: true,
        DataPengajuan: {
          include: {
            DataPembiayaan: {
              include: {
                Produk: true,
                JenisPembiayaan: true,
                Refferal: true,
                User: {
                  include: {
                    UnitCabang: { include: { UnitPelayanan: true } },
                  },
                },
              },
            },
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
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
            BerkasPengajuan: true,
            Bank: true,
          },
        },
      },
      skip: skip,
      take: 20,
      orderBy: {
        tanggal_cetak: "desc",
      },
    });
  }
  const total = await prisma.dataPencairan.count({
    where: {
      is_active: true,
      bankId: bankId,
    },
  });
  return { result, total: name ? result.length : total };
};
