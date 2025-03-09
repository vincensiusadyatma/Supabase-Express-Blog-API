-- CreateTable
CREATE TABLE "Gallery" (
    "id" SERIAL NOT NULL,
    "gallery_uuid" TEXT NOT NULL,
    "image_url" TEXT,
    "caption" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gallery_gallery_uuid_key" ON "Gallery"("gallery_uuid");
