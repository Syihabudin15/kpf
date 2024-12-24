-- CreateTable
CREATE TABLE `TransaksiKeuangan` (
    `id` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NULL,
    `nama` VARCHAR(191) NOT NULL,
    `harga` VARCHAR(191) NOT NULL,
    `jumlah` DOUBLE NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `type` ENUM('INVENTARIS', 'TRANSPORTASI', 'PEMBELIAN_MOTOR', 'PEMBELIAN_MOBIL', 'ATK', 'PERDIN') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
