-- AlterTable
ALTER TABLE `user` ADD COLUMN `buka_tabungan` DOUBLE NULL,
    ADD COLUMN `bulan_masuk` INTEGER NULL,
    ADD COLUMN `is_anggota` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `simpanan_bulanan` DOUBLE NULL;
