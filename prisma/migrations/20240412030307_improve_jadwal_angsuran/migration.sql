/*
  Warnings:

  - You are about to drop the column `tanggal` on the `jadwalangsuran` table. All the data in the column will be lost.
  - Added the required column `bunga` to the `JadwalAngsuran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `margin` to the `JadwalAngsuran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sisa` to the `JadwalAngsuran` table without a default value. This is not possible if the table is not empty.
  - Made the column `tanggal_bayar` on table `jadwalangsuran` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `jadwalangsuran` DROP COLUMN `tanggal`,
    ADD COLUMN `bunga` INTEGER NOT NULL,
    ADD COLUMN `margin` INTEGER NOT NULL,
    ADD COLUMN `sisa` INTEGER NOT NULL,
    ADD COLUMN `tanggal_pelunasan` DATETIME(3) NULL,
    MODIFY `status` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `tanggal_bayar` DATETIME(3) NOT NULL;
