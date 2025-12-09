-- AlterTable
ALTER TABLE `datapengajuan` MODIFY `pendidikan` ENUM('SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3', 'LAINNYA') NULL;

-- AlterTable
ALTER TABLE `datataspen` MODIFY `pendidikan` ENUM('SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3', 'LAINNYA') NULL;
