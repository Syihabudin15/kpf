import { Maintenance } from "@prisma/client";
import prisma from "../prisma";

export const getMaintenance = async (path: string) => {
  const result: Maintenance | null = await prisma.maintenance.findFirst({
    where: { route: path },
  });
  return result;
};
