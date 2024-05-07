/*
  Warnings:

  - Added the required column `size` to the `attachments_sizes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachments_sizes" ADD COLUMN     "size" TEXT NOT NULL;
