/*
  Warnings:

  - Added the required column `status` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."task" ADD COLUMN     "status" CHAR(32) NOT NULL;

-- CreateTable
CREATE TABLE "public"."image" (
    "id" SERIAL NOT NULL,
    "uuid" CHAR(191) NOT NULL,
    "url" CHAR(2048),
    "thumbnail" CHAR(2048),
    "format" CHAR(32),
    "width" INTEGER,
    "height" INTEGER,
    "size" INTEGER,
    "aspect_ratio" CHAR(32),
    "resolution" CHAR(32),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" CHAR(191) NOT NULL,
    "updated_by" CHAR(191) NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "image_uuid_key" ON "public"."image"("uuid");
