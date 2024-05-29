-- AlterTable
ALTER TABLE `berkaspengajuan` ADD COLUMN `flagging` VARCHAR(191) NULL,
    ADD COLUMN `jaminan` VARCHAR(191) NULL,
    ADD COLUMN `mutasi` VARCHAR(191) NULL,
    ADD COLUMN `pelunasan` VARCHAR(191) NULL,
    ADD COLUMN `rekening` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_akad` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_flagging` DATETIME(3) NULL,
    ADD COLUMN `tanggal_jaminan` DATETIME(3) NULL,
    ADD COLUMN `tanggal_mutasi` DATETIME(3) NULL,
    ADD COLUMN `tanggal_pelunasan` DATETIME(3) NULL,
    ADD COLUMN `tanggal_rekening` DATETIME(3) NULL,
    ADD COLUMN `tanggal_video_cair` DATETIME(3) NULL,
    ADD COLUMN `video_cair` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `datapencairan` ADD COLUMN `surat_berkas` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_berkas_si` DATETIME(3) NULL,
    ADD COLUMN `tanggal_surat_berkas` DATETIME(3) NULL,
    MODIFY `berkas_si` VARCHAR(191) NULL;
