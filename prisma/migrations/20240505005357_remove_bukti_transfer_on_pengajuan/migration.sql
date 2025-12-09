/*
  Warnings:

  - You are about to drop the column `bukti_transfer` on the `berkaspengajuan` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_bukti_transfer` on the `berkaspengajuan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `berkaspengajuan` DROP COLUMN `bukti_transfer`,
    DROP COLUMN `tanggal_bukti_transfer`;

-- AlterTable
ALTER TABLE `datapencairan` ADD COLUMN `bukti_transfer` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_bukti_transfer` DATETIME(3) NULL;
