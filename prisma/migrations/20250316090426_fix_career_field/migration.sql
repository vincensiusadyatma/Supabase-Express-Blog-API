/*
  Warnings:

  - You are about to drop the column `description` on the `Career` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Career" DROP COLUMN "description",
ADD COLUMN     "caption" TEXT;
