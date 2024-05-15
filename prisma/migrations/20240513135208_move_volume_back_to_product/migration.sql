/*
  Warnings:

  - You are about to drop the column `volume` on the `product_variations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_variations" DROP COLUMN "volume";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "volume" DOUBLE PRECISION,
ALTER COLUMN "weight" DROP NOT NULL;
