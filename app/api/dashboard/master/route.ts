import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import moment from "moment";
import { Bank, DataPembiayaan, DataPengajuan, Produk } from "@prisma/client";
import { daysInMonth } from "@/components/utils/inputUtils";

export interface LineProps {
  options: object;
  series: { name: string; data: any[] }[];
}
interface Pembiayaan extends DataPembiayaan {
  Produk: Produk;
}
interface Pengajuan extends DataPengajuan {
  DataPembiayaan: Pembiayaan;
}
export interface DataMasterDashboard extends Bank {
  DataPengajuan: Pengajuan[];
}
export interface DashboardMaster {
  nama: string;
  slik: number;
  verifikasi: number;
  approval: number;
  pengajuan_dropping: number[];
  dropping_hari_ini: number;
  total: number[];
}

export const GET = async (req: NextRequest) => {
  const banks: DataMasterDashboard[] = <any>await prisma.bank.findMany({
    where: { is_active: true },
    include: {
      DataPengajuan: {
        where: { is_active: true },
        include: {
          DataPembiayaan: {
            include: {
              Produk: true,
            },
          },
        },
      },
    },
  });

  let months: string[] = [];
  let line: { name: string; data: number[] }[] = [];

  const date = new Date();
  for (let i = 0; i < banks.length; i++) {
    let bankName = banks[i].name;
    let series: number[] = [];
    for (let j = 0; j < date.getMonth() + 1; j++) {
      months.push(moment([date.getFullYear(), j, 1]).format("MMM"));
      const find = await prisma.dataPengajuan.findMany({
        where: {
          status_pencairan: "TRANSFER",
          bankId: banks[i].id,
          tanggal_pencairan: {
            gte: moment([date.getFullYear(), j, 1]).toISOString(),
            lte: moment([
              date.getFullYear(),
              j,
              daysInMonth(j + 1, date.getFullYear()),
            ]).toISOString(),
          },
        },
        include: {
          DataPembiayaan: {
            include: { Produk: true },
          },
        },
      });
      let temp = 0;
      find.forEach((res) => (temp += res.DataPembiayaan.plafond));
      series.push(temp);
    }
    line.push({ name: bankName, data: series });
  }
  let antri = 0;
  let transfer = 0;
  let batal = 0;

  banks.forEach((bank) => {
    bank.DataPengajuan.forEach((p) => {
      if (p.status_pencairan === "TRANSFER") {
        transfer += p.DataPembiayaan.plafond;
      } else if (p.status_pencairan === "BATAL") {
        batal += p.DataPembiayaan.plafond;
      } else {
        antri += p.DataPembiayaan.plafond;
      }
    });
  });

  let data: DashboardMaster[] = [];
  let dataflash: DashboardMaster[] = [];

  for (let i = 0; i < banks.length; i++) {
    let reguller: DashboardMaster = {
      nama: banks[i].kode ? banks[i].kode + " REGULER" : "REGULER",
      slik: await prisma.dataPengajuan.count({
        where: {
          is_active: true,
          status_slik: "ANTRI",
          bankId: banks[i].id,
          DataPembiayaan: { Produk: { name: { not: "Flash Sisa Gaji" } } },
        },
      }),
      verifikasi: await prisma.dataPengajuan.count({
        where: {
          is_active: true,
          status_verifikasi: "ANTRI",
          bankId: banks[i].id,
          DataPembiayaan: { Produk: { name: { not: "Flash Sisa Gaji" } } },
        },
      }),
      approval: await prisma.dataPengajuan.count({
        where: {
          is_active: true,
          status_approval: "ANTRI",
          bankId: banks[i].id,
          DataPembiayaan: { Produk: { name: { not: "Flash Sisa Gaji" } } },
        },
      }),
      pengajuan_dropping: [0, 0],
      dropping_hari_ini: 0,
      total: [0, 0],
    };

    let flash = {
      nama: banks[i].kode ? banks[i].kode + " FLASH" : "FLASH",
      slik: await prisma.dataPengajuan.count({
        where: {
          is_active: true,
          status_slik: "ANTRI",
          bankId: banks[i].id,
          DataPembiayaan: { Produk: { name: "Flash Sisa Gaji" } },
        },
      }),
      verifikasi: await prisma.dataPengajuan.count({
        where: {
          is_active: true,
          status_verifikasi: "ANTRI",
          bankId: banks[i].id,
          DataPembiayaan: { Produk: { name: "Flash Sisa Gaji" } },
        },
      }),
      approval: await prisma.dataPengajuan.count({
        where: {
          is_active: true,
          status_approval: "ANTRI",
          bankId: banks[i].id,
          DataPembiayaan: { Produk: { name: "Flash Sisa Gaji" } },
        },
      }),
      pengajuan_dropping: [
        await prisma.dataPengajuan.count({
          where: {
            is_active: true,
            status_approval: "ANTRI",
            bankId: banks[i].id,
            DataPembiayaan: { Produk: { name: "Flash Sisa Gaji" } },
          },
        }),
        0,
      ],
      dropping_hari_ini: 0,
      total: [0, 0],
    };

    let antrianApproval = await prisma.dataPengajuan.findMany({
      where: {
        is_active: true,
        status_approval: "ANTRI",
        bankId: banks[i].id,
      },
      include: {
        DataPembiayaan: {
          include: { Produk: true },
        },
      },
    });
    let antrianProses = await prisma.dataPengajuan.findMany({
      where: {
        is_active: true,
        status_approval: "SETUJU",
        status_pencairan: "PROSES",
        bankId: banks[i].id,
      },
      include: {
        DataPembiayaan: {
          include: {
            Produk: true,
          },
        },
      },
    });
    antrianApproval.forEach((app) => {
      if (app.DataPembiayaan.Produk?.name === "Flash Sisa Gaji") {
        flash.pengajuan_dropping[0] += app.DataPembiayaan.plafond;
      } else {
        reguller.pengajuan_dropping[0] += app.DataPembiayaan.plafond;
      }
    });
    antrianProses.forEach((app) => {
      if (app.DataPembiayaan.Produk?.name === "Flash Sisa Gaji") {
        flash.pengajuan_dropping[1] += app.DataPembiayaan.plafond;
      } else {
        reguller.pengajuan_dropping[1] += app.DataPembiayaan.plafond;
      }
    });

    let reguller_hari_ini = await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
        bankId: banks[i].id,
        tanggal_pencairan: {
          gte: moment().toISOString(),
          equals: moment().toISOString(),
        },
        DataPembiayaan: { Produk: { name: { not: "Flash Sisa Gaji" } } },
      },
      include: {
        DataPembiayaan: true,
      },
    });
    let flash_hari_ini = await prisma.dataPengajuan.findMany({
      where: {
        status_pencairan: "TRANSFER",
        bankId: banks[i].id,
        tanggal_pencairan: {
          gte: moment().toISOString(),
          equals: moment().toISOString(),
        },
        DataPembiayaan: { Produk: { name: "Flash Sisa Gaji" } },
      },
      include: {
        DataPembiayaan: true,
      },
    });
    banks[i].DataPengajuan.forEach((p) => {
      let admin =
        (p.DataPembiayaan.plafond * p.DataPembiayaan.margin_bank) / 100;
      if (p.DataPembiayaan.Produk.name !== "Flash Sisa Gaji") {
        reguller.total[0] += p.DataPembiayaan.plafond;
        reguller.total[1] +=
          p.DataPembiayaan.plafond -
          (admin + p.DataPembiayaan.by_buka_rekening);
      }
      if (p.DataPembiayaan.Produk.name === "Flash Sisa Gaji") {
        flash.total[0] += p.DataPembiayaan.plafond;
        flash.total[1] +=
          p.DataPembiayaan.plafond -
          (admin + p.DataPembiayaan.by_buka_rekening);
      }
    });
    reguller_hari_ini.forEach((regHari) => {
      reguller.dropping_hari_ini += regHari.DataPembiayaan.plafond;
    });
    flash_hari_ini.forEach((regHari) => {
      flash.dropping_hari_ini += regHari.DataPembiayaan.plafond;
    });
    if (banks[i].is_flash) {
      dataflash.push(flash);
    } else {
      data.push(reguller);
      dataflash.push(flash);
    }
  }

  const area = await prisma.unitPelayanan.findMany({
    where: {
      is_active: true,
    },
    include: {
      UnitCabang: {
        include: {
          User: {
            include: {
              DataPengajuan: {
                where: { is_active: true },
                include: {
                  DataPembiayaan: true,
                },
              },
            },
          },
        },
      },
    },
  });

  let cabang: any = [];

  let dataArea = area.map((a) => {
    let totalMarketing = 0;
    let totalPencairan = 0;
    let totalAntrian = 0;
    let jumlah_antrian = 0;
    let jumlah_pencairan = 0;

    a.UnitCabang.forEach((c) => {
      let tempCabang = {
        nama: c.name,
        area: a.name,
        total_marketing: c.User.length,
        total_antrian: 0,
        jumlah_antrian: 0,
        total_pencairan: 0,
        jumlah_pencairan: 0,
      };
      totalMarketing += c.User.length;
      c.User.forEach((u) => {
        u.DataPengajuan.forEach((p) => {
          if (p.status_pencairan === "TRANSFER") {
            totalPencairan += p.DataPembiayaan.plafond;
            tempCabang.total_pencairan += p.DataPembiayaan.plafond;
            jumlah_pencairan += 1;
            tempCabang.jumlah_pencairan += 1;
          }
          if (
            p.status_pencairan !== "TRANSFER" &&
            p.status_pencairan !== "BATAL"
          ) {
            tempCabang.jumlah_antrian += 1;
            jumlah_antrian += 1;
            totalAntrian += p.DataPembiayaan.plafond;
            tempCabang.total_antrian += p.DataPembiayaan.plafond;
          }
        });
      });
      cabang.push(tempCabang);
    });
    return {
      nama: a.name,
      kode_area: a.kode_area,
      total_up: a.UnitCabang.length,
      total_marketing: totalMarketing,
      total_pencairan: totalPencairan,
      jumlah_antrian,
      total_antrian: totalAntrian,
      jumlah_pencairan,
    };
  });
  const marketing = await prisma.user.findMany({
    where: {
      status_active: true,
      role: "MARKETING",
    },
    include: {
      DataPengajuan: {
        where: {
          is_active: true,
          status_pencairan: "TRANSFER",
        },
        include: {
          DataPembiayaan: true,
        },
      },
      UnitCabang: {
        include: { UnitPelayanan: true },
      },
    },
  });
  let marketingFilter = marketing.map((m) => {
    let total = 0;
    m.DataPengajuan.forEach((p) => {
      total += p.DataPembiayaan.plafond;
    });
    return {
      nama: m.first_name + " " + m.last_name,
      jabatan: m.posisi,
      unit_pelayanan: m.UnitCabang?.name,
      area_pelayanan: m.UnitCabang?.UnitPelayanan?.name,
      total_nasabah: m.DataPengajuan.length,
      total_plafond: total,
    };
  });

  return NextResponse.json(
    {
      banks,
      line,
      months,
      pie: {
        label: ["DROPPING", "ANTRI", "DITOLAK"],
        data: [transfer, antri, batal],
      },
      dataTable: data,
      dataflash,
      dataArea: dataArea.sort((a, b) => b.total_pencairan - a.total_pencairan),
      marketingTerbaik: marketingFilter.sort(
        (a, b) => b.total_plafond - a.total_plafond
      ),
      cabang: cabang.sort(
        (a: any, b: any) => b.total_pencairan - a.total_pencairan
      ),
    },
    { status: 200 }
  );
};
