-- DropForeignKey
ALTER TABLE `datataspen` DROP FOREIGN KEY `DataTaspen_dataDomisiliId_fkey`;

-- DropForeignKey
ALTER TABLE `datataspen` DROP FOREIGN KEY `DataTaspen_tunjanganPotonganId_fkey`;

-- AlterTable
ALTER TABLE `datapengajuan` MODIFY `keterangan_slik` TEXT NULL,
    MODIFY `keterangan_verifikasi` TEXT NULL,
    MODIFY `keterangan_checker` TEXT NULL,
    MODIFY `keterangan_maker` TEXT NULL,
    MODIFY `keterangan_approval` TEXT NULL;

-- AlterTable
ALTER TABLE `datataspen` MODIFY `dataDomisiliId` VARCHAR(191) NULL,
    MODIFY `tunjanganPotonganId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `DataTaspen` ADD CONSTRAINT `DataTaspen_dataDomisiliId_fkey` FOREIGN KEY (`dataDomisiliId`) REFERENCES `DataDomisili`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataTaspen` ADD CONSTRAINT `DataTaspen_tunjanganPotonganId_fkey` FOREIGN KEY (`tunjanganPotonganId`) REFERENCES `TunjanganPotongan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
