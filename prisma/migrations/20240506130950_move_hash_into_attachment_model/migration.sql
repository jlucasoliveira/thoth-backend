/*
  Warnings:

  - You are about to drop the column `hash` on the `attachments_sizes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "hash" TEXT;

-- AlterTable
ALTER TABLE "attachments_sizes" DROP COLUMN "hash";
