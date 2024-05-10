/*
  Warnings:

  - You are about to drop the column `icon` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "product_id" TEXT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "icon",
ADD COLUMN     "icon_id" TEXT;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
