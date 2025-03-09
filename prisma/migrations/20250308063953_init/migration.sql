-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "status" BOOLEAN NOT NULL,
    "password" TEXT,
    "rememberToken" TEXT,
    "last_sign_in" TIMESTAMPTZ,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_uuid_key" ON "User"("user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
