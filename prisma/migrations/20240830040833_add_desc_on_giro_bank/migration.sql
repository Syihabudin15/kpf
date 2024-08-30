/*
  Warnings:

  - Added the required column `description` to the `GiroBank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `girobank` ADD COLUMN `description` TEXT NOT NULL;
