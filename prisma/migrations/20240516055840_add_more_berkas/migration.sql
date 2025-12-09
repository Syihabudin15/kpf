/*
  Warnings:

  - The values [MONITORING,HUMAN_RESOURCE] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `berkaspengajuan` ADD COLUMN `tanggal_video_cair2` DATETIME(3) NULL,
    ADD COLUMN `tanggal_video_cair3` DATETIME(3) NULL,
    ADD COLUMN `video_cair2` VARCHAR(191) NULL,
    ADD COLUMN `video_cair3` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('MASTER', 'ENTRY_DATA', 'BANK', 'VERIFIKASI', 'CHECKER', 'MAKER', 'APPROVAL', 'MARKETING', 'OPERASIONAL', 'BISNIS', 'PEMBERKASAN', 'KEUANGAN') NOT NULL;
