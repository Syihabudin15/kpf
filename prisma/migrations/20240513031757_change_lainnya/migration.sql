/*
  Warnings:

  - You are about to drop the column `tanggal_berkas_lainyya` on the `berkaspengajuan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `berkaspengajuan` DROP COLUMN `tanggal_berkas_lainyya`,
    ADD COLUMN `tanggal_berkas_lainnya` VARCHAR(191) NULL;
