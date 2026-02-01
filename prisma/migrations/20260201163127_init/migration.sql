/*
  Warnings:

  - You are about to drop the column `providerId` on the `meals` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `meals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_providerId_fkey";

-- DropIndex
DROP INDEX "meals_providerId_idx";

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "providerId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "meals_authorId_idx" ON "meals"("authorId");
