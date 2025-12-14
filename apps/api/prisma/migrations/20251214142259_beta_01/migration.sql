/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "email" CHAR(191),
ADD COLUMN     "password" CHAR(191),
ADD COLUMN     "salt" CHAR(32);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");
