/*
  Warnings:

  - Added the required column `berkas_si` to the `DataPencairan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `datapencairan` ADD COLUMN `berkas_si` VARCHAR(191) NOT NULL;
