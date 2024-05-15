/*
  Warnings:

  - You are about to drop the column `product_id` on the `attachments` table. All the data in the column will be lost.
  - You are about to drop the column `bar_code` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `external_code` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `icon_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `stocks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[variation_id]` on the table `stocks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_product_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_product_id_fkey";

-- DropIndex
DROP INDEX "stocks_product_id_key";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "product_id",
ADD COLUMN     "variation_id" TEXT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "bar_code",
DROP COLUMN "external_code",
DROP COLUMN "icon_id",
DROP COLUMN "price",
DROP COLUMN "volume";

-- AlterTable
ALTER TABLE "stocks" DROP COLUMN "product_id",
ADD COLUMN     "variation_id" TEXT;

-- CreateTable
CREATE TABLE "product_variations" (
    "id" TEXT NOT NULL,
    "variation" TEXT NOT NULL,
    "external_code" TEXT NOT NULL,
    "bar_code" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "product_id" TEXT NOT NULL,
    "icon_id" TEXT,

    CONSTRAINT "product_variations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stocks_variation_id_key" ON "stocks"("variation_id");

-- AddForeignKey
ALTER TABLE "product_variations" ADD CONSTRAINT "product_variations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variations" ADD CONSTRAINT "product_variations_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "product_variations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "product_variations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
