/*
  Warnings:

  - You are about to alter the column `margin_bank` on the `jadwalangsuran` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `jadwalangsuran` MODIFY `margin_bank` INTEGER NOT NULL;
