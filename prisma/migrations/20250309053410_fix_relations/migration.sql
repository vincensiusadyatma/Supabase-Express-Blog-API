-- CreateTable
CREATE TABLE "press_release_contents" (
    "id" SERIAL NOT NULL,
    "pressReleaseId" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "press_release_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrer_creators" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "carrerId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carrer_creators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_creators" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "galleryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_creators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "press_releases_creators" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pressReleaseId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "press_releases_creators_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "press_release_contents" ADD CONSTRAINT "press_release_contents_pressReleaseId_fkey" FOREIGN KEY ("pressReleaseId") REFERENCES "PressRelease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrer_creators" ADD CONSTRAINT "carrer_creators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrer_creators" ADD CONSTRAINT "carrer_creators_carrerId_fkey" FOREIGN KEY ("carrerId") REFERENCES "Carrer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_creators" ADD CONSTRAINT "gallery_creators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_creators" ADD CONSTRAINT "gallery_creators_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "press_releases_creators" ADD CONSTRAINT "press_releases_creators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "press_releases_creators" ADD CONSTRAINT "press_releases_creators_pressReleaseId_fkey" FOREIGN KEY ("pressReleaseId") REFERENCES "PressRelease"("id") ON DELETE CASCADE ON UPDATE CASCADE;
