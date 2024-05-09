/*
  Warnings:

  - You are about to drop the column `gender_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `genders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_gender_id_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "gender_id";

-- DropTable
DROP TABLE "genders";
