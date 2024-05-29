/*
  Warnings:

  - You are about to drop the column `surat_berkas` on the `datapencairan` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_surat_berkas` on the `datapencairan` table. All the data in the column will be lost.
  - You are about to drop the column `is_cetak` on the `datapengajuan` table. All the data in the column will be lost.
  - You are about to drop the column `is_hapus` on the `datapengajuan` table. All the data in the column will be lost.
  - Added the required column `max_plafon` to the `Produk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `datapencairan` DROP COLUMN `surat_berkas`,
    DROP COLUMN `tanggal_surat_berkas`;

-- AlterTable
ALTER TABLE `datapengajuan` DROP COLUMN `is_cetak`,
    DROP COLUMN `is_hapus`,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `produk` ADD COLUMN `max_plafon` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `target` INTEGER NOT NULL DEFAULT 200000000;
