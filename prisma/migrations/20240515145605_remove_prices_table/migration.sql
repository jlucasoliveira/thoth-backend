/*
  Warnings:

  - You are about to drop the column `price_id` on the `stock_entries` table. All the data in the column will be lost.
  - You are about to drop the `prices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "prices" DROP CONSTRAINT "prices_product_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_entries" DROP CONSTRAINT "stock_entries_price_id_fkey";

-- DropIndex
DROP INDEX "stock_entries_price_id_key";

-- AlterTable
ALTER TABLE "stock_entries" DROP COLUMN "price_id";

-- DropTable
DROP TABLE "prices";
