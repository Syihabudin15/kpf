/*
  Warnings:

  - Added the required column `tanggal_pembelian` to the `Inventaris` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inventaris` ADD COLUMN `tanggal_pembelian` DATETIME(3) NOT NULL;
