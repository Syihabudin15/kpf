-- CreateTable
CREATE TABLE `Produk` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `by_asuransi` DOUBLE NOT NULL,
    `mg_bunga` DOUBLE NOT NULL,
    `min_age` DOUBLE NOT NULL,
    `max_age` DOUBLE NOT NULL,
    `max_usia_lunas` DOUBLE NOT NULL,
    `max_tenor` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bank_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bank` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NULL,
    `by_admin` DOUBLE NOT NULL,
    `by_admin_bank` DOUBLE NULL,
    `by_lainnya` DOUBLE NULL,
    `by_tatalaksana` INTEGER NOT NULL,
    `by_materai` INTEGER NOT NULL,
    `by_buka_rekening` INTEGER NOT NULL,
    `by_angsuran` DOUBLE NOT NULL,
    `by_flagging` INTEGER NOT NULL DEFAULT 20000,
    `by_epotpen` INTEGER NOT NULL DEFAULT 35000,
    `by_provisi` INTEGER NULL DEFAULT 0,
    `margin_bank` DOUBLE NULL DEFAULT 14,
    `margin_koperasi` DOUBLE NULL,
    `is_syariah` BOOLEAN NOT NULL DEFAULT false,
    `logo` VARCHAR(191) NULL,
    `up_direktur` VARCHAR(191) NULL,
    `direktur` VARCHAR(191) NULL,
    `penanggung_jawab` VARCHAR(191) NULL,
    `account_officer` VARCHAR(191) NULL,
    `credit_review` VARCHAR(191) NULL,
    `ketua_credit` VARCHAR(191) NULL,
    `wakil_ketua` VARCHAR(191) NULL,
    `diperiksa_oleh` VARCHAR(191) NULL,
    `jabatan_diperiksa` VARCHAR(191) NULL,
    `otorisasi_oleh` VARCHAR(191) NULL,
    `jabatan_otorisasi` VARCHAR(191) NULL,
    `akad` VARCHAR(191) NULL,
    `sk_akad` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Bank_name_key`(`name`),
    UNIQUE INDEX `Bank_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JenisPembiayaan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `by_mutasi` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `JenisPembiayaan_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Refferal` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Refferal_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataPembiayaan` (
    `id` VARCHAR(191) NOT NULL,
    `nopen` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `tanggal_lahir` VARCHAR(191) NOT NULL,
    `tempat_lahir` VARCHAR(191) NULL,
    `juru_bayar_asal` VARCHAR(191) NULL,
    `juru_bayar_tujuan` VARCHAR(191) NULL,
    `pembiayaan_sebelumnya` VARCHAR(191) NULL,
    `no_rekening` VARCHAR(191) NULL,
    `nama_bank` VARCHAR(191) NULL,
    `tanggal_input` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `gaji_bersih` INTEGER NOT NULL,
    `by_tatalaksana` INTEGER NOT NULL,
    `by_mutasi` INTEGER NOT NULL,
    `by_provisi` INTEGER NOT NULL,
    `mg_bunga` DOUBLE NOT NULL,
    `by_admin` DOUBLE NOT NULL,
    `by_admin_bank` DOUBLE NOT NULL DEFAULT 0,
    `by_lainnya` DOUBLE NOT NULL DEFAULT 0,
    `by_asuransi` DOUBLE NOT NULL,
    `by_buka_rekening` INTEGER NOT NULL,
    `by_materai` INTEGER NOT NULL,
    `by_flagging` INTEGER NOT NULL DEFAULT 20000,
    `by_epotpen` INTEGER NOT NULL DEFAULT 35000,
    `tenor` INTEGER NOT NULL,
    `plafond` INTEGER NOT NULL,
    `retensi` INTEGER NOT NULL DEFAULT 0,
    `blokir` INTEGER NOT NULL DEFAULT 0,
    `bpp` INTEGER NOT NULL DEFAULT 0,
    `pelunasan` INTEGER NOT NULL DEFAULT 0,
    `fee` INTEGER NOT NULL DEFAULT 0,
    `is_simulasi` BOOLEAN NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `produk_id` VARCHAR(191) NULL,
    `jenis_pembiayaan_id` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NULL,
    `refferal_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataPengajuan` (
    `id` VARCHAR(191) NOT NULL,
    `tujuan_penggunaan1` VARCHAR(191) NOT NULL,
    `tujuan_penggunaan2` VARCHAR(191) NULL,
    `geo_location` VARCHAR(191) NULL,
    `agent_fronting` VARCHAR(191) NOT NULL,
    `status_slik` ENUM('ANTRI', 'DITOLAK', 'SETUJU', 'PENDING') NULL,
    `keterangan_slik` VARCHAR(191) NULL,
    `tanggal_slik` DATETIME(3) NULL,
    `nama_pemeriksa_slik` VARCHAR(191) NULL,
    `status_verifikasi` ENUM('ANTRI', 'DITOLAK', 'SETUJU', 'PENDING') NULL,
    `keterangan_verifikasi` VARCHAR(191) NULL,
    `tanggal_verifikasi` DATETIME(3) NULL,
    `nama_pemeriksa_verifikasi` VARCHAR(191) NULL,
    `status_checker` ENUM('ANTRI', 'DITOLAK', 'SETUJU', 'PENDING') NULL,
    `keterangan_checker` VARCHAR(191) NULL,
    `tanggal_checker` DATETIME(3) NULL,
    `nama_pemeriksa_checker` VARCHAR(191) NULL,
    `status_maker` ENUM('ANTRI', 'DITOLAK', 'SETUJU', 'PENDING') NULL,
    `keterangan_maker` VARCHAR(191) NULL,
    `tanggal_maker` DATETIME(3) NULL,
    `nama_pemeriksa_maker` VARCHAR(191) NULL,
    `status_approval` ENUM('ANTRI', 'DITOLAK', 'SETUJU', 'PENDING') NULL,
    `keterangan_approval` VARCHAR(191) NULL,
    `tanggal_approval` DATETIME(3) NULL,
    `nama_pemeriksa_approval` VARCHAR(191) NULL,
    `status_pencairan` ENUM('TRANSFER', 'PROSES', 'BATAL') NULL,
    `tanggal_pencairan` DATETIME(3) NULL,
    `is_hapus` BOOLEAN NOT NULL DEFAULT false,
    `is_cetak` BOOLEAN NOT NULL DEFAULT false,
    `tanggal_cetak_akad` DATETIME(3) NULL,
    `nomor_akad` VARCHAR(191) NULL,
    `nomor_surat` VARCHAR(191) NULL,
    `tanggal_cetak_si` DATETIME(3) NULL,
    `jenis_margin` ENUM('FLAT', 'ANUITAS') NULL,
    `nopen` VARCHAR(191) NULL,
    `nama` VARCHAR(191) NULL,
    `nama_skep` VARCHAR(191) NULL,
    `kode_jiwa` VARCHAR(191) NULL,
    `golongan` VARCHAR(191) NULL,
    `jenis_pensiun` VARCHAR(191) NULL,
    `nik` VARCHAR(191) NULL,
    `masa_ktp` VARCHAR(191) NULL,
    `npwp` VARCHAR(191) NULL,
    `pendidikan` ENUM('SMA', 'D3', 'S1', 'S2', 'S3', 'LAINNYA') NULL,
    `jenis_kelamin` ENUM('LAKI_LAKI', 'PEREMPUAN') NULL,
    `agama` ENUM('ISLAM', 'KATHOLIK', 'KONGHUCU', 'HINDU', 'BUDHA', 'ATHEIS') NULL,
    `masa_kerja` INTEGER NULL,
    `status_rumah` ENUM('SEWA', 'MILIK_SENDIRI', 'MILIK_KELUARGA', 'MILIK_ORANGLAIN', 'NGEKOS', 'TIDAK_PUNYA_RUMAH') NULL,
    `menempati_tahun` VARCHAR(191) NULL,
    `nama_ibu_kandung` VARCHAR(191) NULL,
    `pekerjaan_sekarang` VARCHAR(191) NULL,
    `jenis_usaha` ENUM('WARUNG_KOPI', 'TOKO_KELONTONG', 'JASA_CUCI_MOBIL_DAN_MOTOR', 'KATERING', 'LOUNDRY', 'SALON_KECANTIKAN', 'LAINNYA') NULL,
    `status_kawin` ENUM('BELUM_KAWIN', 'KAWIN', 'JANDA', 'DUDA') NULL,
    `nomor_sk_pensiun` VARCHAR(191) NULL,
    `tmt_pensiun` VARCHAR(191) NULL,
    `penerbit_sk` VARCHAR(191) NULL,
    `berkasPengajuanId` VARCHAR(191) NULL,
    `dataTaspenId` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NULL,
    `data_pembiayaan_id` VARCHAR(191) NOT NULL,
    `bankId` VARCHAR(191) NULL,
    `dataPencairanId` VARCHAR(191) NULL,
    `dataPengajuanKeluargaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataPengajuanAlamat` (
    `id` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NULL,
    `rt` VARCHAR(191) NULL,
    `rw` VARCHAR(191) NULL,
    `kelurahan` VARCHAR(191) NULL,
    `kecamatan` VARCHAR(191) NULL,
    `kota` VARCHAR(191) NULL,
    `provinsi` VARCHAR(191) NULL,
    `kode_pos` VARCHAR(191) NULL,
    `no_telepon` VARCHAR(191) NULL,
    `alamat_domisili` VARCHAR(191) NULL,
    `rt_domisili` VARCHAR(191) NULL,
    `rw_domisili` VARCHAR(191) NULL,
    `kelurahan_domisili` VARCHAR(191) NULL,
    `kecamatan_domisili` VARCHAR(191) NULL,
    `kota_domisili` VARCHAR(191) NULL,
    `provinsi_domisili` VARCHAR(191) NULL,
    `kode_pos_domisili` VARCHAR(191) NULL,
    `dataPengajuanId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataPengajuanKeluarga` (
    `id` VARCHAR(191) NOT NULL,
    `nama_pasangan` VARCHAR(191) NULL,
    `tempat_lahir_pasangan` VARCHAR(191) NULL,
    `alamat_pasangan` VARCHAR(191) NULL,
    `tanggal_lahir_pasangan` VARCHAR(191) NULL,
    `nik_pasangan` VARCHAR(191) NULL,
    `masa_ktp_pasangan` VARCHAR(191) NULL,
    `pekerjaan_pasangan` VARCHAR(191) NULL,
    `nama_keluarga_tidak_serumah` VARCHAR(191) NULL,
    `hubungan` VARCHAR(191) NULL,
    `no_telepon_keluarga` VARCHAR(191) NULL,
    `alamat_keluarga` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BerkasPengajuan` (
    `id` VARCHAR(191) NOT NULL,
    `berkas_slik` VARCHAR(191) NULL,
    `berkas_pengajuan` VARCHAR(191) NULL,
    `video_wawancara` VARCHAR(191) NULL,
    `video_asuransi` VARCHAR(191) NULL,
    `video_penyerahan` VARCHAR(191) NULL,
    `berkas_si` VARCHAR(191) NULL,
    `berkas_akad` VARCHAR(191) NULL,
    `bukti_cair` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataPencairan` (
    `id` VARCHAR(191) NOT NULL,
    `tanggal_cetak` DATETIME(3) NOT NULL,
    `nomor_surat` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `bankId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `no_telepon` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('MASTER', 'ENTRY_DATA', 'BANK', 'VERIFIKASI', 'CHECKER', 'MAKER', 'APPROVAL', 'MARKETING', 'OPERASIONAL', 'BISNIS', 'PEMBERKASAN', 'MONITORING', 'HUMAN_RESOURCE') NOT NULL,
    `posisi` VARCHAR(191) NULL,
    `status_pkwt` VARCHAR(191) NULL,
    `status_active` BOOLEAN NOT NULL,
    `picture` VARCHAR(191) NULL DEFAULT '/profile/profile_default.svg',
    `mulai_kontrak` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `masa_kotrak` INTEGER NOT NULL DEFAULT 6,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unit_cabang_id` VARCHAR(191) NULL,
    `bank_id` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnitPelayanan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `kode_area` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `UnitPelayanan_name_key`(`name`),
    UNIQUE INDEX `UnitPelayanan_kode_area_key`(`kode_area`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnitCabang` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `kode_area` VARCHAR(191) NOT NULL,
    `number_code` VARCHAR(191) NULL,
    `alamat_cabang` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `unit_pelayanan_id` VARCHAR(191) NULL,

    UNIQUE INDEX `UnitCabang_name_key`(`name`),
    UNIQUE INDEX `UnitCabang_kode_area_key`(`kode_area`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataTaspen` (
    `id` VARCHAR(191) NOT NULL,
    `nopen` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nama_skep` VARCHAR(191) NULL,
    `no_skep` VARCHAR(191) NULL,
    `kode_jiwa` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `rt` VARCHAR(191) NULL,
    `rw` VARCHAR(191) NULL,
    `kelurahan` VARCHAR(191) NULL,
    `kecamatan` VARCHAR(191) NULL,
    `kota` VARCHAR(191) NULL,
    `provinsi` VARCHAR(191) NULL,
    `kode_pos` VARCHAR(191) NULL,
    `no_telepon` VARCHAR(191) NULL,
    `nik` VARCHAR(191) NULL,
    `masa_ktp` VARCHAR(191) NULL,
    `npwp` VARCHAR(191) NULL,
    `pendidikan` ENUM('SMA', 'D3', 'S1', 'S2', 'S3', 'LAINNYA') NULL,
    `jenis_kelamin` ENUM('LAKI_LAKI', 'PEREMPUAN') NULL,
    `agama` ENUM('ISLAM', 'KATHOLIK', 'KONGHUCU', 'HINDU', 'BUDHA', 'ATHEIS') NULL,
    `masa_kerja` INTEGER NULL,
    `status_rumah` ENUM('SEWA', 'MILIK_SENDIRI', 'MILIK_KELUARGA', 'MILIK_ORANGLAIN', 'NGEKOS', 'TIDAK_PUNYA_RUMAH') NULL,
    `menempati_tahun` INTEGER NULL,
    `nama_ibu_kandung` VARCHAR(191) NULL,
    `pekerjaan_sekarang` VARCHAR(191) NULL,
    `alamat_pekerjaan` VARCHAR(191) NULL,
    `jenis_usaha` ENUM('WARUNG_KOPI', 'TOKO_KELONTONG', 'JASA_CUCI_MOBIL_DAN_MOTOR', 'KATERING', 'LOUNDRY', 'SALON_KECANTIKAN', 'LAINNYA') NULL,
    `status_kawin` ENUM('BELUM_KAWIN', 'KAWIN', 'JANDA', 'DUDA') NULL,
    `status_peserta` VARCHAR(191) NULL DEFAULT 'PENSIUN',
    `data_tidak_baik` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataDomisiliId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DataTaspen_nopen_key`(`nopen`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataDomisili` (
    `id` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NULL,
    `rt` VARCHAR(191) NULL,
    `rw` VARCHAR(191) NULL,
    `kelurahan` VARCHAR(191) NULL,
    `kecamatan` VARCHAR(191) NULL,
    `kota` VARCHAR(191) NULL,
    `provinsi` VARCHAR(191) NULL,
    `geo_location` VARCHAR(191) NULL,
    `kode_pos` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataKeluarga` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `hubungan` VARCHAR(191) NULL,
    `no_telepon` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `tanggal_lahir` VARCHAR(191) NULL,
    `tanggal_wafat` VARCHAR(191) NULL,
    `tanggal_nikah` VARCHAR(191) NULL,
    `akhir_sks` VARCHAR(191) NULL,
    `no_kk` VARCHAR(191) NULL,
    `no_ktp` VARCHAR(191) NULL,
    `no_skep` VARCHAR(191) NULL,
    `npwp` VARCHAR(191) NULL,
    `kode_tunjang` VARCHAR(191) NULL DEFAULT '1',
    `keterangan` VARCHAR(191) NULL,
    `hak_bagi` DOUBLE NULL,
    `tat_tunjang` VARCHAR(191) NULL,
    `tmt_tunjang` VARCHAR(191) NULL,
    `gelar_depan` VARCHAR(191) NULL,
    `gelar_akhir` VARCHAR(191) NULL,
    `dataTaspenId` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalAngsuran` (
    `id` VARCHAR(191) NOT NULL,
    `angsuran_ke` INTEGER NOT NULL,
    `pokok` INTEGER NOT NULL,
    `collfee` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `tanggal_bayar` DATETIME(3) NULL,
    `dataPengajuanId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Maintenance` (
    `id` VARCHAR(191) NOT NULL,
    `is_maintenance` BOOLEAN NOT NULL,
    `route` VARCHAR(191) NOT NULL,
    `timeInMinutes` VARCHAR(191) NOT NULL,
    `currentTime` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Produk` ADD CONSTRAINT `Produk_bank_id_fkey` FOREIGN KEY (`bank_id`) REFERENCES `Bank`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPembiayaan` ADD CONSTRAINT `DataPembiayaan_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `Produk`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPembiayaan` ADD CONSTRAINT `DataPembiayaan_jenis_pembiayaan_id_fkey` FOREIGN KEY (`jenis_pembiayaan_id`) REFERENCES `JenisPembiayaan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPembiayaan` ADD CONSTRAINT `DataPembiayaan_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPembiayaan` ADD CONSTRAINT `DataPembiayaan_refferal_id_fkey` FOREIGN KEY (`refferal_id`) REFERENCES `Refferal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPengajuan` ADD CONSTRAINT `DataPengajuan_berkasPengajuanId_fkey` FOREIGN KEY (`berkasPengajuanId`) REFERENCES `BerkasPengajuan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPengajuan` ADD CONSTRAINT `DataPengajuan_dataTaspenId_fkey` FOREIGN KEY (`dataTaspenId`) REFERENCES `DataTaspen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPengajuan` ADD CONSTRAINT `DataPengajuan_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPengajuan` ADD CONSTRAINT `DataPengajuan_data_pembiayaan_id_fkey` FOREIGN KEY (`data_pembiayaan_id`) REFERENCES `DataPembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPengajuan` ADD CONSTRAINT `DataPengajuan_bankId_fkey` FOREIGN KEY (`bankId`) REFERENCES `Bank`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPengajuan` ADD CONSTRAINT `DataPengajuan_dataPencairanId_fkey` FOREIGN KEY (`dataPencairanId`) REFERENCES `DataPencairan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPengajuan` ADD CONSTRAINT `DataPengajuan_dataPengajuanKeluargaId_fkey` FOREIGN KEY (`dataPengajuanKeluargaId`) REFERENCES `DataPengajuanKeluarga`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPengajuanAlamat` ADD CONSTRAINT `DataPengajuanAlamat_dataPengajuanId_fkey` FOREIGN KEY (`dataPengajuanId`) REFERENCES `DataPengajuan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPencairan` ADD CONSTRAINT `DataPencairan_bankId_fkey` FOREIGN KEY (`bankId`) REFERENCES `Bank`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_unit_cabang_id_fkey` FOREIGN KEY (`unit_cabang_id`) REFERENCES `UnitCabang`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_bank_id_fkey` FOREIGN KEY (`bank_id`) REFERENCES `Bank`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitCabang` ADD CONSTRAINT `UnitCabang_unit_pelayanan_id_fkey` FOREIGN KEY (`unit_pelayanan_id`) REFERENCES `UnitPelayanan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataTaspen` ADD CONSTRAINT `DataTaspen_dataDomisiliId_fkey` FOREIGN KEY (`dataDomisiliId`) REFERENCES `DataDomisili`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataKeluarga` ADD CONSTRAINT `DataKeluarga_dataTaspenId_fkey` FOREIGN KEY (`dataTaspenId`) REFERENCES `DataTaspen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalAngsuran` ADD CONSTRAINT `JadwalAngsuran_dataPengajuanId_fkey` FOREIGN KEY (`dataPengajuanId`) REFERENCES `DataPengajuan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
