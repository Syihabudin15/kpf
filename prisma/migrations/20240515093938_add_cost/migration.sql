-- AlterTable
ALTER TABLE `datapembiayaan` ADD COLUMN `margin_bank` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `pembulatan` INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE `datapengajuan` ADD COLUMN `pembayaran_asuransi` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `status_lunas` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Cost` (
    `id` VARCHAR(191) NOT NULL,
    `nominal` INTEGER NOT NULL,
    `keterangan` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `userId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cost` ADD CONSTRAINT `Cost_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
