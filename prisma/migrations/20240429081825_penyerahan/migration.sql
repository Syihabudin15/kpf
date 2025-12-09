-- AlterTable
ALTER TABLE `datapengajuan` ADD COLUMN `penyerahanBerkasId` VARCHAR(191) NULL,
    ADD COLUMN `penyerahanJaminanId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `PenyerahanBerkas` (
    `id` VARCHAR(191) NOT NULL,
    `surat_berkas` VARCHAR(191) NULL,
    `tanggal_surat_berkas` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PenyerahanJaminan` (
    `id` VARCHAR(191) NOT NULL,
    `jaminan` VARCHAR(191) NULL,
    `tanggal_jaminan` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DataPengajuan` ADD CONSTRAINT `DataPengajuan_penyerahanBerkasId_fkey` FOREIGN KEY (`penyerahanBerkasId`) REFERENCES `PenyerahanBerkas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPengajuan` ADD CONSTRAINT `DataPengajuan_penyerahanJaminanId_fkey` FOREIGN KEY (`penyerahanJaminanId`) REFERENCES `PenyerahanJaminan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
