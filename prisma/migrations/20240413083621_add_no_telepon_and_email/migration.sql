-- AlterTable
ALTER TABLE `bank` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `no_telepon` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `refferal` ADD COLUMN `direktur` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `no_telepon` VARCHAR(191) NULL,
    ADD COLUMN `up_direktur` VARCHAR(191) NULL;
