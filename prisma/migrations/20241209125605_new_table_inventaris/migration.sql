-- CreateTable
CREATE TABLE `Inventaris` (
    `id` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NULL,
    `nama` VARCHAR(191) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `harga` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
