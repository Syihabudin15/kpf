/*
  Warnings:

  - You are about to alter the column `tanggal_berkas_lainnya` on the `berkaspengajuan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `berkaspengajuan` MODIFY `tanggal_berkas_lainnya` DATETIME(3) NULL;
