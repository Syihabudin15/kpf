/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `alamat` VARCHAR(191) NULL,
    ADD COLUMN `nik` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_lahir` DATETIME(3) NULL,
    ADD COLUMN `tempat_lahir` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_nik_key` ON `User`(`nik`);
