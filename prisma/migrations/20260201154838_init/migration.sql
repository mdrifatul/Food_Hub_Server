/*
  Warnings:

  - You are about to drop the column `authorId` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the `menus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `providerId` to the `meals` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "meals_authorId_idx";

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "authorId",
ADD COLUMN     "providerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "menus";

-- CreateTable
CREATE TABLE "provider_profiles" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "businessPhone" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "meals_providerId_idx" ON "meals"("providerId");

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
