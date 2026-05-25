import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import moment from "moment";

export const GET = async (req: NextRequest) => {
  const [gold, plat, lintas, plus, flash, lainnya] = await prisma.$transaction([
    prisma.dataPengajuan.findMany({
      where: {
        DataPembiayaan: {
          Produk: { name: { in: ["Gold", "GOLD", "Gold Ultima"] } },
        },
        tanggal_pencairan: {
          lte: moment().set("month", 3).endOf("month").toDate(),
        },
      },
      include: {
        JadwalAngsuran: {
          where: {
            tanggal_bayar: {
              gte: moment().startOf("month").toDate(),
              lte: moment().endOf("month").toDate(),
            },
          },
        },
        Bank: true,
      },
    }),
    prisma.dataPengajuan.findMany({
      where: {
        DataPembiayaan: {
          Produk: {
            name: {
              in: [
                "Platinum",
                "PLatinum",
                "PLATINUM",
                "Platinum Ultima",
                "PLatinum Ultima",
              ],
            },
          },
        },
        tanggal_pencairan: {
          lte: moment().set("month", 3).endOf("month").toDate(),
        },
      },
      include: {
        JadwalAngsuran: {
          where: {
            tanggal_bayar: {
              gte: moment().startOf("month").toDate(),
              lte: moment().endOf("month").toDate(),
            },
          },
        },
        Bank: true,
      },
    }),
    prisma.dataPengajuan.findMany({
      where: {
        DataPembiayaan: {
          Produk: {
            name: {
              in: [
                "Platinum Lintas",
                "PLatinum Lintas",
                "PLATINUM LINTAS",
                "Platinum Lintas Ultima",
                "PLatinum Lintas Ultima",
              ],
            },
          },
        },
        tanggal_pencairan: {
          lte: moment().set("month", 3).endOf("month").toDate(),
        },
      },
      include: {
        JadwalAngsuran: {
          where: {
            tanggal_bayar: {
              gte: moment().startOf("month").toDate(),
              lte: moment().endOf("month").toDate(),
            },
          },
        },
        Bank: true,
      },
    }),
    prisma.dataPengajuan.findMany({
      where: {
        DataPembiayaan: {
          Produk: {
            name: {
              in: [
                "Platinum Plus",
                "Platinum PLus",
                "PLatinum Plus",
                "PLatinum PLus",
                "PLATINUM PLUS",
                "Platinum Plus Ultima",
                "PLatinum Plus Ultima",
                "PLatinum PLus Ultima",
              ],
            },
          },
        },
        tanggal_pencairan: {
          lte: moment().set("month", 3).endOf("month").toDate(),
        },
      },
      include: {
        JadwalAngsuran: {
          where: {
            tanggal_bayar: {
              gte: moment().startOf("month").toDate(),
              lte: moment().endOf("month").toDate(),
            },
          },
        },
        Bank: true,
      },
    }),
    prisma.dataPengajuan.findMany({
      where: {
        DataPembiayaan: {
          Produk: {
            name: "Flash Sisa Gaji",
          },
        },
        tanggal_pencairan: {
          lte: moment().set("month", 3).endOf("month").toDate(),
        },
      },
      include: {
        JadwalAngsuran: {
          where: {
            tanggal_bayar: {
              gte: moment().startOf("month").toDate(),
              lte: moment().endOf("month").toDate(),
            },
          },
        },
        Bank: true,
      },
    }),
    prisma.dataPengajuan.findMany({
      where: {
        DataPembiayaan: {
          Produk: {
            name: "Ultima",
          },
        },
        tanggal_pencairan: {
          lte: moment().set("month", 3).endOf("month").toDate(),
        },
      },
      include: {
        JadwalAngsuran: {
          where: {
            tanggal_bayar: {
              gte: moment().startOf("month").toDate(),
              lte: moment().endOf("month").toDate(),
            },
          },
        },
        Bank: true,
      },
    }),
  ]);
  const data = {
    gold: gold
      .flatMap((g) => g.JadwalAngsuran)
      // .filter((j) => j.tanggal_pelunasan === null)
      .reduce((acc, curr) => acc + curr.sisa, 0),
    platinum: plat
      .flatMap((g) => g.JadwalAngsuran)
      // .filter((j) => j.tanggal_pelunasan === null)
      .reduce((acc, curr) => acc + curr.sisa, 0),
    lintas: lintas
      .flatMap((g) => g.JadwalAngsuran)
      // .filter((j) => j.tanggal_pelunasan === null)
      .reduce((acc, curr) => acc + curr.sisa, 0),
    plus: plus
      .flatMap((g) => g.JadwalAngsuran)
      // .filter((j) => j.tanggal_pelunasan === null)
      .reduce((acc, curr) => acc + curr.sisa, 0),
    flash: flash
      .flatMap((g) => g.JadwalAngsuran)
      // .filter((j) => j.tanggal_pelunasan === null)
      .reduce((acc, curr) => acc + curr.sisa, 0),
    lainnya: lainnya
      .flatMap((g) => g.JadwalAngsuran)
      // .filter((j) => j.tanggal_pelunasan === null)
      .reduce((acc, curr) => acc + curr.sisa, 0),
  };
  const total =
    data.gold +
    data.platinum +
    data.lintas +
    data.plus +
    data.flash +
    data.lainnya;

  type BankData = {
    bank_name: string;

    gold: number;
    platinum: number;
    lintas: number;
    plus: number;
    flash: number;
    lainnya: number;

    under_50jt: number;
    between_50_100jt: number;
    above_100jt: number;

    under_50jt_count: number;
    between_50_100jt_count: number;
    above_100jt_count: number;

    total_bank: number;
    total_count: number;
  };

  // 2. Gabungkan semua kategori produk ke dalam satu array array terstruktur
  const categories = [
    { key: "gold" as const, rawData: gold },
    { key: "platinum" as const, rawData: plat },
    { key: "lintas" as const, rawData: lintas },
    { key: "plus" as const, rawData: plus },
    { key: "flash" as const, rawData: flash },
    { key: "lainnya" as const, rawData: lainnya },
  ];

  // 3. Kelompokkan data berdasarkan Bank menggunakan reduce
  const bankGrouping = categories.reduce(
    (acc, category) => {
      category.rawData.forEach((pengajuan) => {
        const bankName = pengajuan.Bank?.name || "Tanpa Bank";

        const sisaAngsuran = pengajuan.JadwalAngsuran.reduce(
          (sum, curr) => sum + curr.sisa,
          0,
        );

        if (!acc[bankName]) {
          acc[bankName] = {
            bank_name: bankName,

            gold: 0,
            platinum: 0,
            lintas: 0,
            plus: 0,
            flash: 0,
            lainnya: 0,

            under_50jt: 0,
            between_50_100jt: 0,
            above_100jt: 0,

            under_50jt_count: 0,
            between_50_100jt_count: 0,
            above_100jt_count: 0,

            total_bank: 0,
            total_count: 0,
          };
        }

        // total produk
        acc[bankName][category.key] += sisaAngsuran;

        // range nominal + count
        if (sisaAngsuran < 50_000_000) {
          acc[bankName].under_50jt += sisaAngsuran;

          acc[bankName].under_50jt_count++;
        } else if (sisaAngsuran >= 50_000_000 && sisaAngsuran <= 100_000_000) {
          acc[bankName].between_50_100jt += sisaAngsuran;

          acc[bankName].between_50_100jt_count++;
        } else {
          acc[bankName].above_100jt += sisaAngsuran;

          acc[bankName].above_100jt_count++;
        }

        acc[bankName].total_bank += sisaAngsuran;

        acc[bankName].total_count++;
      });

      return acc;
    },
    {} as Record<string, BankData>,
  );

  // Convert object groupings menjadi array agar mudah dibaca/di-map di frontend
  const dataByBank = Object.values(bankGrouping);

  // 4. Hitung Grand Total keseluruhan bank
  const grandTotal = dataByBank.reduce((sum, bank) => sum + bank.total_bank, 0);

  return NextResponse.json({ data, total, dataByBank, grandTotal });
};
