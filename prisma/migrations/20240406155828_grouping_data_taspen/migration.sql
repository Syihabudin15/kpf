/*
  Warnings:

  - You are about to drop the column `alamat` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `alamat_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `kecamatan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `kecamatan_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `kelurahan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `kelurahan_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `kode_pos` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `kode_pos_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `kota` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `kota_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `masa_ktp_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `nama_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `nik_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `pekerjaan_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `provinsi` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `provinsi_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `rt` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `rt_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `rw` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `rw_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_lahir_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - You are about to drop the column `tempat_lahir_pasangan` on the `datataspen` table. All the data in the column will be lost.
  - Made the column `alamat` on table `datadomisili` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `tunjanganPotonganId` to the `DataTaspen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `datadomisili` ADD COLUMN `alamat_domisili` VARCHAR(191) NULL,
    ADD COLUMN `kecamatan_domisili` VARCHAR(191) NULL,
    ADD COLUMN `kelurahan_domisili` VARCHAR(191) NULL,
    ADD COLUMN `kode_pos_domisili` VARCHAR(191) NULL,
    ADD COLUMN `kota_domisili` VARCHAR(191) NULL,
    ADD COLUMN `provinsi_domisili` VARCHAR(191) NULL,
    ADD COLUMN `rt_domisili` VARCHAR(191) NULL,
    ADD COLUMN `rw_domisili` VARCHAR(191) NULL,
    MODIFY `alamat` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `datataspen` DROP COLUMN `alamat`,
    DROP COLUMN `alamat_pasangan`,
    DROP COLUMN `kecamatan`,
    DROP COLUMN `kecamatan_pasangan`,
    DROP COLUMN `kelurahan`,
    DROP COLUMN `kelurahan_pasangan`,
    DROP COLUMN `kode_pos`,
    DROP COLUMN `kode_pos_pasangan`,
    DROP COLUMN `kota`,
    DROP COLUMN `kota_pasangan`,
    DROP COLUMN `masa_ktp_pasangan`,
    DROP COLUMN `nama_pasangan`,
    DROP COLUMN `nik_pasangan`,
    DROP COLUMN `pekerjaan_pasangan`,
    DROP COLUMN `provinsi`,
    DROP COLUMN `provinsi_pasangan`,
    DROP COLUMN `rt`,
    DROP COLUMN `rt_pasangan`,
    DROP COLUMN `rw`,
    DROP COLUMN `rw_pasangan`,
    DROP COLUMN `tanggal_lahir_pasangan`,
    DROP COLUMN `tempat_lahir_pasangan`,
    ADD COLUMN `akhir_flagging` VARCHAR(191) NULL,
    ADD COLUMN `alamat_cabang` VARCHAR(191) NULL,
    ADD COLUMN `awal_flagging` VARCHAR(191) NULL,
    ADD COLUMN `blth_rincian` VARCHAR(191) NULL,
    ADD COLUMN `cicilan` VARCHAR(191) NULL,
    ADD COLUMN `dataPasanganId` VARCHAR(191) NULL,
    ADD COLUMN `jandadudaypdari` VARCHAR(191) NULL,
    ADD COLUMN `jenis_dapem` VARCHAR(191) NULL,
    ADD COLUMN `jenis_hutang` VARCHAR(191) NULL,
    ADD COLUMN `jumlah_hutang` VARCHAR(191) NULL,
    ADD COLUMN `jumlah_kotor` VARCHAR(191) NULL,
    ADD COLUMN `jumlah_potongan` VARCHAR(191) NULL,
    ADD COLUMN `jumlah_total` VARCHAR(191) NULL,
    ADD COLUMN `kantor_cabang` VARCHAR(191) NULL,
    ADD COLUMN `ktr_bay_dapem` VARCHAR(191) NULL,
    ADD COLUMN `mitra_flagging` VARCHAR(191) NULL,
    ADD COLUMN `no_dosir` VARCHAR(191) NULL,
    ADD COLUMN `no_kk` VARCHAR(191) NULL,
    ADD COLUMN `no_ktp` VARCHAR(191) NULL,
    ADD COLUMN `no_rek` VARCHAR(191) NULL,
    ADD COLUMN `nu_dapem` VARCHAR(191) NULL,
    ADD COLUMN `pembulatan` VARCHAR(191) NULL,
    ADD COLUMN `penpok` VARCHAR(191) NULL,
    ADD COLUMN `status_dapem` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_lahir_jandadudayp` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_sekarang` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_surat` VARCHAR(191) NULL,
    ADD COLUMN `tkd` VARCHAR(191) NULL,
    ADD COLUMN `tmt_stop` VARCHAR(191) NULL,
    ADD COLUMN `tpmtp` VARCHAR(191) NULL,
    ADD COLUMN `tpp` VARCHAR(191) NULL,
    ADD COLUMN `tpph21` VARCHAR(191) NULL,
    ADD COLUMN `tunjanganPotonganId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `TunjanganPotongan` (
    `id` VARCHAR(191) NOT NULL,
    `t_anak` VARCHAR(191) NULL,
    `t_istri` VARCHAR(191) NULL,
    `t_beras` VARCHAR(191) NULL,
    `t_cacat` VARCHAR(191) NULL,
    `t_dahor` VARCHAR(191) NULL,
    `pot_alimentasi` VARCHAR(191) NULL,
    `pot_askes` VARCHAR(191) NULL,
    `pot_assos` VARCHAR(191) NULL,
    `pot_ganti_rugi` VARCHAR(191) NULL,
    `pot_kasda` VARCHAR(191) NULL,
    `pot_kpkn` VARCHAR(191) NULL,
    `pot_pph21` VARCHAR(191) NULL,
    `pot_sewa_rumah` VARCHAR(191) NULL,
    `kpkn` VARCHAR(191) NULL,
    `spn` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataPasangan` (
    `id` VARCHAR(191) NOT NULL,
    `nama_pasangan` VARCHAR(191) NULL,
    `tempat_lahir_pasangan` VARCHAR(191) NULL,
    `tanggal_lahir_pasangan` VARCHAR(191) NULL,
    `nik_pasangan` VARCHAR(191) NULL,
    `masa_ktp_pasangan` VARCHAR(191) NULL,
    `pekerjaan_pasangan` VARCHAR(191) NULL,
    `alamat_pasangan` VARCHAR(191) NULL,
    `rt_pasangan` VARCHAR(191) NULL,
    `rw_pasangan` VARCHAR(191) NULL,
    `kelurahan_pasangan` VARCHAR(191) NULL,
    `kecamatan_pasangan` VARCHAR(191) NULL,
    `kota_pasangan` VARCHAR(191) NULL,
    `provinsi_pasangan` VARCHAR(191) NULL,
    `kode_pos_pasangan` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DataTaspen` ADD CONSTRAINT `DataTaspen_dataPasanganId_fkey` FOREIGN KEY (`dataPasanganId`) REFERENCES `DataPasangan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataTaspen` ADD CONSTRAINT `DataTaspen_tunjanganPotonganId_fkey` FOREIGN KEY (`tunjanganPotonganId`) REFERENCES `TunjanganPotongan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
