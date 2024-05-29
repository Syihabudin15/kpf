/*
  Warnings:

  - The primary key for the `hardtaspen` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `hardtaspen` table. All the data in the column will be lost.
  - Made the column `NOTAS` on table `hardtaspen` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `hardtaspen` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `NOTAS` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`NOTAS`);
