/*
  Warnings:

  - You are about to drop the column `margin_koperasi` on the `bank` table. All the data in the column will be lost.
  - You are about to drop the column `bunga` on the `jadwalangsuran` table. All the data in the column will be lost.
  - You are about to drop the column `direktur` on the `refferal` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `refferal` table. All the data in the column will be lost.
  - You are about to drop the column `manajer_keuangan` on the `refferal` table. All the data in the column will be lost.
  - You are about to drop the column `nama_bank` on the `refferal` table. All the data in the column will be lost.
  - You are about to drop the column `no_rekening` on the `refferal` table. All the data in the column will be lost.
  - You are about to drop the column `up_direktur` on the `refferal` table. All the data in the column will be lost.
  - Added the required column `angsuran` to the `JadwalAngsuran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `margin_bank` to the `JadwalAngsuran` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bank` DROP COLUMN `margin_koperasi`;

-- AlterTable
ALTER TABLE `jadwalangsuran` DROP COLUMN `bunga`,
    ADD COLUMN `angsuran` INTEGER NOT NULL,
    ADD COLUMN `margin_bank` INTEGER NOT NULL,
    MODIFY `tanggal_bayar` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `refferal` DROP COLUMN `direktur`,
    DROP COLUMN `logo`,
    DROP COLUMN `manajer_keuangan`,
    DROP COLUMN `nama_bank`,
    DROP COLUMN `no_rekening`,
    DROP COLUMN `up_direktur`;
