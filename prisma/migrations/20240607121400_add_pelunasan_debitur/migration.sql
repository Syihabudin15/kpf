/*
  Warnings:

  - You are about to drop the `hardtaspen` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('MASTER', 'ENTRY_DATA', 'BANK', 'VERIFIKASI', 'CHECKER', 'MAKER', 'APPROVAL', 'MARKETING', 'OPERASIONAL', 'BISNIS', 'PEMBERKASAN', 'KEUANGAN', 'MANAGEMENT') NOT NULL;

-- DropTable
DROP TABLE `hardtaspen`;

-- CreateTable
CREATE TABLE `PelunasanDebitur` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('TOPUP', 'MENINGGAL_DUNIA', 'LEPAS') NOT NULL,
    `by_admin` INTEGER NOT NULL,
    `sisa_pokok` INTEGER NOT NULL,
    `no_rekening` VARCHAR(191) NOT NULL,
    `nama_bank` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NOT NULL,
    `tanggal_pelunasan` DATETIME(3) NOT NULL,
    `berkas_pelunasan` VARCHAR(191) NOT NULL,
    `dataPengajuanId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PelunasanDebitur` ADD CONSTRAINT `PelunasanDebitur_dataPengajuanId_fkey` FOREIGN KEY (`dataPengajuanId`) REFERENCES `DataPengajuan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
