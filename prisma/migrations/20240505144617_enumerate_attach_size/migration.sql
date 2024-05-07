/*
  Warnings:

  - Changed the type of `size` on the `attachments_sizes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SizeKind" AS ENUM ('XS', 'S', 'MD', 'L', 'XL');

-- AlterTable
ALTER TABLE "attachments_sizes" DROP COLUMN "size",
ADD COLUMN     "size" "SizeKind" NOT NULL;
