-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'None');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "gender" "Gender";
