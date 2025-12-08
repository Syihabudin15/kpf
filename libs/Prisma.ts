import { PrismaClient } from "@prisma/client";
import moment from "moment";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

export async function generateRoleId() {
  const prefix = "RL";
  const padLength = 2; // jumlah digit angka

  const lastRecord = await prisma.role.count({});

  const newId = `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;

  return newId;
}

export async function generateAreaId() {
  const prefix = "A";
  const padLength = 2; // jumlah digit angka

  const lastRecord = await prisma.area.count({});

  const newId = `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;

  return newId;
}

export async function generateCabangId(areaId: string) {
  const area = await prisma.area.findFirst({ where: { id: areaId } });
  const lastRecord = await prisma.cabang.count({ where: { areaId } });
  const prefix = area ? area.id + "KL" : "AKL";
  const padLength = 3; // jumlah digit angka

  const newId = `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;

  return newId;
}

export async function generateUserId() {
  const prefix = "USR";
  const padLength = 3; // jumlah digit angka

  const lastRecord = await prisma.user.count({});

  // Format ulang dengan leading zero
  const newId = `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;

  return newId;
}

export async function generateUserNIP(cabangId: string) {
  const prefix = `${moment().format("MMYYYY")}`;
  const padLength = 3; // jumlah digit angka

  const lastRecord = await prisma.user.count({});

  const cabang = await prisma.cabang.findFirst({ where: { id: cabangId } });
  const newId = `${cabang ? cabang.id : "AKL001"}${prefix}${String(
    lastRecord
  ).padStart(padLength, "0")}`;

  return newId;
}

export async function generateSumdanId() {
  const prefix = "SMDN";
  const padLength = 3; // jumlah digit angka

  const lastRecord = await prisma.sumdan.count({});

  const newId = `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;

  return newId;
}

export async function generateJenisId() {
  const prefix = "JPM";
  const padLength = 2; // jumlah digit angka

  const lastRecord = await prisma.jePem.count({});

  const newId = `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;

  return newId;
}

export async function generateProdukId(sumdanId: string) {
  const find = await prisma.sumdan.findFirst({ where: { id: sumdanId } });
  const prefix = `${find ? find.code : "BPR"}`;
  const padLength = 2; // jumlah digit angka

  const lastRecord = await prisma.proPem.count({
    where: { sumdanId: sumdanId },
  });

  const newId = `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;

  return newId;
}

export async function generateDapemId() {
  const prefix = `FAS`;
  const padLength = 4; // jumlah digit angka

  const lastRecord = await prisma.dapem.count({});

  const newId = `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;

  return newId;
}
