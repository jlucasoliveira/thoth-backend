/*
  Warnings:

  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Brand";

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profit_rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);
