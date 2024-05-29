-- AlterTable
ALTER TABLE `penyerahanberkas` ADD COLUMN `bankId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `penyerahanjaminan` ADD COLUMN `bankId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `PenyerahanBerkas` ADD CONSTRAINT `PenyerahanBerkas_bankId_fkey` FOREIGN KEY (`bankId`) REFERENCES `Bank`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PenyerahanJaminan` ADD CONSTRAINT `PenyerahanJaminan_bankId_fkey` FOREIGN KEY (`bankId`) REFERENCES `Bank`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
