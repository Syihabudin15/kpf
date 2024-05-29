/*
  Warnings:

  - You are about to drop the column `dataPengajuanId` on the `datapengajuanalamat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `datapengajuanalamat` DROP FOREIGN KEY `DataPengajuanAlamat_dataPengajuanId_fkey`;

-- AlterTable
ALTER TABLE `datapengajuan` ADD COLUMN `dataPengajuanAlamatId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `datapengajuanalamat` DROP COLUMN `dataPengajuanId`;

-- AddForeignKey
ALTER TABLE `DataPengajuan` ADD CONSTRAINT `DataPengajuan_dataPengajuanAlamatId_fkey` FOREIGN KEY (`dataPengajuanAlamatId`) REFERENCES `DataPengajuanAlamat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
