-- AlterTable
ALTER TABLE `bank` ADD COLUMN `alamat` VARCHAR(191) NULL,
    MODIFY `sk_akad` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `datapengajuan` MODIFY `agama` ENUM('ISLAM', 'KATHOLIK', 'KONGHUCU', 'HINDU', 'BUDHA', 'ATHEIS', 'LAINNYA') NULL;

-- AlterTable
ALTER TABLE `datataspen` MODIFY `agama` ENUM('ISLAM', 'KATHOLIK', 'KONGHUCU', 'HINDU', 'BUDHA', 'ATHEIS', 'LAINNYA') NULL;

-- AlterTable
ALTER TABLE `refferal` ADD COLUMN `alamat` VARCHAR(191) NULL,
    ADD COLUMN `manajer_keuangan` VARCHAR(191) NULL;
