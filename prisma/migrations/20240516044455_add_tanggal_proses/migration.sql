-- AlterTable
ALTER TABLE `datapencairan` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `tanggal_proses` DATETIME(3) NULL;
