-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `outcomeCategoryId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `OutcomeCategory` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `OutcomeCategory_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_outcomeCategoryId_fkey` FOREIGN KEY (`outcomeCategoryId`) REFERENCES `OutcomeCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
