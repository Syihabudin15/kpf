/*
  Warnings:

  - You are about to drop the column `pembulatan` on the `datapengajuan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nip]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `datapengajuan` DROP COLUMN `pembulatan`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `nip` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_nip_key` ON `User`(`nip`);
