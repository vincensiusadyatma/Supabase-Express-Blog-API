-- CreateTable
CREATE TABLE "Carrer" (
    "id" SERIAL NOT NULL,
    "carrer_uuid" TEXT NOT NULL,
    "image_url" TEXT,
    "description" TEXT,
    "link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carrer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Carrer_carrer_uuid_key" ON "Carrer"("carrer_uuid");
