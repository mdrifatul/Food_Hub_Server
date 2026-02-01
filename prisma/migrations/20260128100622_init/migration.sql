/*
  Warnings:

  - You are about to drop the column `providerId` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `providerProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_providerId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_providerId_fkey";

-- DropIndex
DROP INDEX "meals_providerId_idx";

-- DropIndex
DROP INDEX "orders_providerId_idx";

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "providerId";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "providerId";

-- DropTable
DROP TABLE "providerProfile";
