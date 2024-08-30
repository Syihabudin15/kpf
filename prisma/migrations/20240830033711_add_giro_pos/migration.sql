-- CreateTable
CREATE TABLE `GiroBank` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GiroBank_name_key`(`name`),
    UNIQUE INDEX `GiroBank_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('MASUK', 'KELUAR') NOT NULL,
    `nominal` INTEGER NOT NULL DEFAULT 0,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `giroBankId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_giroBankId_fkey` FOREIGN KEY (`giroBankId`) REFERENCES `GiroBank`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
