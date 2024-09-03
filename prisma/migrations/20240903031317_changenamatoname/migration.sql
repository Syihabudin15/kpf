/*
  Warnings:

  - You are about to drop the column `nama` on the `outcomecategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `OutcomeCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `OutcomeCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `OutcomeCategory_nama_key` ON `outcomecategory`;

-- AlterTable
ALTER TABLE `outcomecategory` DROP COLUMN `nama`,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `OutcomeCategory_name_key` ON `OutcomeCategory`(`name`);
