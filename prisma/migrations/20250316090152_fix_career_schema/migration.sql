/*
  Warnings:

  - You are about to drop the column `carrerId` on the `carrer_creators` table. All the data in the column will be lost.
  - You are about to drop the `Carrer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `careerId` to the `carrer_creators` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "carrer_creators" DROP CONSTRAINT "carrer_creators_carrerId_fkey";

-- AlterTable
ALTER TABLE "carrer_creators" DROP COLUMN "carrerId",
ADD COLUMN     "careerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Carrer";

-- CreateTable
CREATE TABLE "Career" (
    "id" SERIAL NOT NULL,
    "career_uuid" TEXT NOT NULL,
    "image_url" TEXT,
    "description" TEXT,
    "link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Career_career_uuid_key" ON "Career"("career_uuid");

-- AddForeignKey
ALTER TABLE "carrer_creators" ADD CONSTRAINT "carrer_creators_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;
