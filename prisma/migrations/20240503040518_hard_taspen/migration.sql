/*
  Warnings:

  - You are about to drop the column `berkas_si` on the `berkaspengajuan` table. All the data in the column will be lost.
  - You are about to drop the column `video_penyerahan` on the `berkaspengajuan` table. All the data in the column will be lost.
  - You are about to drop the column `nomor_surat` on the `datapengajuan` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_cetak_si` on the `datapengajuan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `berkaspengajuan` DROP COLUMN `berkas_si`,
    DROP COLUMN `video_penyerahan`,
    ADD COLUMN `bukti_transfer` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_bukti_transfer` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `datapengajuan` DROP COLUMN `nomor_surat`,
    DROP COLUMN `tanggal_cetak_si`;

-- AlterTable
ALTER TABLE `penyerahanberkas` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `penyerahanjaminan` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `HardTaspen` (
    `id` VARCHAR(191) NOT NULL,
    `AKHIR_FLAGGING` VARCHAR(191) NULL,
    `ALAMATRUMAH` VARCHAR(191) NULL,
    `ALAMAT_CABANG` VARCHAR(191) NULL,
    `AWAL_FLAGGING` VARCHAR(191) NULL,
    `BLTHRINCIAN` VARCHAR(191) NULL,
    `CICILAN` VARCHAR(191) NULL,
    `JANDADUDAYPDARI` VARCHAR(191) NULL,
    `JENISHUTANG` VARCHAR(191) NULL,
    `JMLKOTOR` VARCHAR(191) NULL,
    `JMLPOTONGAN` VARCHAR(191) NULL,
    `JMLTOTAL` VARCHAR(191) NULL,
    `JNSDAPEM` VARCHAR(191) NULL,
    `JNSPENS` VARCHAR(191) NULL,
    `JUMLAH_HUTANG` VARCHAR(191) NULL,
    `KANTOR_CABANG` VARCHAR(191) NULL,
    `KDJIWA` VARCHAR(191) NULL,
    `KELUARGA` VARCHAR(191) NULL,
    `KPKN` VARCHAR(191) NULL,
    `KTRBAYDAPEM` VARCHAR(191) NULL,
    `MITRA_FLAGGING` VARCHAR(191) NULL,
    `NAMA_PENERIMA` VARCHAR(191) NULL,
    `NIPNRP` VARCHAR(191) NULL,
    `NODOSIR` VARCHAR(191) NULL,
    `NOREK` VARCHAR(191) NULL,
    `NOSKEP` VARCHAR(191) NULL,
    `NOTAS` VARCHAR(191) NULL,
    `NUDAPEM` VARCHAR(191) NULL,
    `PANGKAT` VARCHAR(191) NULL,
    `PEMBULATAN` VARCHAR(191) NULL,
    `PENPOK` VARCHAR(191) NULL,
    `POTALIMENTASI` VARCHAR(191) NULL,
    `POTASKES` VARCHAR(191) NULL,
    `POTASSOS` VARCHAR(191) NULL,
    `POTGANTIRUGI` VARCHAR(191) NULL,
    `POTKASDA` VARCHAR(191) NULL,
    `POTKPKN` VARCHAR(191) NULL,
    `POTPPH21` VARCHAR(191) NULL,
    `POTSEWARUMAH` VARCHAR(191) NULL,
    `SPN` VARCHAR(191) NULL,
    `STATUS_PESERTA` VARCHAR(191) NULL,
    `STSDAPEM` VARCHAR(191) NULL,
    `TANAK` VARCHAR(191) NULL,
    `TBERAS` VARCHAR(191) NULL,
    `TCACAT` VARCHAR(191) NULL,
    `TDAHOR` VARCHAR(191) NULL,
    `TGLLAHIR_JANDADUDAYP` VARCHAR(191) NULL,
    `TGLLAHIR_PENERIMA` VARCHAR(191) NULL,
    `TGLSKEP` VARCHAR(191) NULL,
    `TGL_SEKARANG` VARCHAR(191) NULL,
    `TGL_SURAT` VARCHAR(191) NULL,
    `TISTRI` VARCHAR(191) NULL,
    `TKD` VARCHAR(191) NULL,
    `TMTPENS` VARCHAR(191) NULL,
    `TMT_STOP` VARCHAR(191) NULL,
    `TPMTP` VARCHAR(191) NULL,
    `TPP` VARCHAR(191) NULL,
    `TPPH21` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
