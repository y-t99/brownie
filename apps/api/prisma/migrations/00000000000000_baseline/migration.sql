-- ============================================
-- Baseline Migration (Merged from all previous migrations)
-- Created: 2026-01-02
-- ============================================

-- Migration 1: 20251022155818_init
-- ============================================

-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "uuid" CHAR(191) NOT NULL,
    "name" CHAR(191) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" CHAR(191) NOT NULL,
    "updated_by" CHAR(191) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_session" (
    "id" SERIAL NOT NULL,
    "uuid" CHAR(191) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" CHAR(191) NOT NULL,
    "updated_by" CHAR(191) NOT NULL,

    CONSTRAINT "chat_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_message" (
    "id" SERIAL NOT NULL,
    "uuid" CHAR(191) NOT NULL,
    "session_uuid" CHAR(191) NOT NULL,
    "role" CHAR(32) NOT NULL,
    "status" CHAR(32) NOT NULL,
    "meta" JSONB,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" CHAR(191) NOT NULL,
    "updated_by" CHAR(191) NOT NULL,

    CONSTRAINT "chat_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_message_block" (
    "id" SERIAL NOT NULL,
    "uuid" CHAR(191) NOT NULL,
    "session_uuid" CHAR(191) NOT NULL,
    "message_uuid" CHAR(191) NOT NULL,
    "content" JSON NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" CHAR(191) NOT NULL,
    "updated_by" CHAR(191) NOT NULL,

    CONSTRAINT "chat_message_block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task" (
    "id" SERIAL NOT NULL,
    "uuid" CHAR(191) NOT NULL,
    "title" CHAR(32) NOT NULL,
    "meta" JSON NOT NULL,
    "payload" JSON NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" CHAR(191) NOT NULL,
    "updated_by" CHAR(191) NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task_resource_relation" (
    "id" SERIAL NOT NULL,
    "uuid" CHAR(191) NOT NULL,
    "task_uuid" CHAR(191) NOT NULL,
    "resource_type" CHAR(32) NOT NULL,
    "resource_uuid" CHAR(191) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" CHAR(191) NOT NULL,
    "updated_by" CHAR(191) NOT NULL,

    CONSTRAINT "task_resource_relation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_uuid_key" ON "public"."user"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "chat_session_uuid_key" ON "public"."chat_session"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "chat_message_uuid_key" ON "public"."chat_message"("uuid");

-- CreateIndex
CREATE INDEX "chat_message_session_uuid_idx" ON "public"."chat_message"("session_uuid");

-- CreateIndex
CREATE INDEX "chat_message_created_by_session_uuid_idx" ON "public"."chat_message"("created_by", "session_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "chat_message_block_uuid_key" ON "public"."chat_message_block"("uuid");

-- CreateIndex
CREATE INDEX "chat_message_block_session_uuid_idx" ON "public"."chat_message_block"("session_uuid");

-- CreateIndex
CREATE INDEX "chat_message_block_message_uuid_idx" ON "public"."chat_message_block"("message_uuid");

-- CreateIndex
CREATE INDEX "chat_message_block_created_by_session_uuid_message_uuid_idx" ON "public"."chat_message_block"("created_by", "session_uuid", "message_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "task_uuid_key" ON "public"."task"("uuid");

-- CreateIndex
CREATE INDEX "task_created_by_idx" ON "public"."task"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "task_resource_relation_uuid_key" ON "public"."task_resource_relation"("uuid");

-- CreateIndex
CREATE INDEX "task_resource_relation_task_uuid_idx" ON "public"."task_resource_relation"("task_uuid");

-- CreateIndex
CREATE INDEX "task_resource_relation_resource_uuid_idx" ON "public"."task_resource_relation"("resource_uuid");


-- Migration 2: 20251214142259_beta_01
-- ============================================

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "email" CHAR(191),
ADD COLUMN     "password" CHAR(191),
ADD COLUMN     "salt" CHAR(32);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");


-- Migration 3: 20251224162355_beta_02
-- ============================================

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


-- Migration 4: 20260101120000_add-quota-transaction-coordinator
-- ============================================

-- Ensure UUID generation is available for @default(uuid()) usage
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "public"."subscription_quota" (
    "id" SERIAL NOT NULL,
    "uuid" CHAR(191) NOT NULL DEFAULT (gen_random_uuid())::text,
    "balance" DECIMAL(18, 4) NOT NULL DEFAULT 0,
    "locked_balance" DECIMAL(18, 4) NOT NULL DEFAULT 0,
    "total_spent" DECIMAL(18, 4) NOT NULL DEFAULT 0,
    "warning_threshold" DECIMAL(18, 4) NOT NULL DEFAULT 0,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" CHAR(191) NOT NULL,
    "updated_by" CHAR(191) NOT NULL,

    CONSTRAINT "subscription_quota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscription_transaction" (
    "id" SERIAL NOT NULL,
    "uuid" CHAR(191) NOT NULL DEFAULT (gen_random_uuid())::text,
    "external_id" CHAR(191),
    "parent_uuid" CHAR(191),
    "transaction_type" CHAR(32) NOT NULL,
    "transaction_status" CHAR(32) NOT NULL,
    "change_amount" DECIMAL(18, 4) NOT NULL,
    "balance_snapshot" DECIMAL(18, 4) NOT NULL,
    "remark" CHAR(191),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" CHAR(191) NOT NULL,
    "updated_by" CHAR(191) NOT NULL,

    CONSTRAINT "subscription_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_quota_uuid_key" ON "public"."subscription_quota"("uuid");
CREATE UNIQUE INDEX "subscription_quota_created_by_key" ON "public"."subscription_quota"("created_by");
CREATE INDEX "subscription_quota_created_by_idx" ON "public"."subscription_quota"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_transaction_uuid_key" ON "public"."subscription_transaction"("uuid");
CREATE UNIQUE INDEX "subscription_transaction_external_id_key" ON "public"."subscription_transaction"("external_id");
CREATE INDEX "subscription_transaction_created_by_idx" ON "public"."subscription_transaction"("created_by");
CREATE INDEX "subscription_transaction_external_id_idx" ON "public"."subscription_transaction"("external_id");

-- AlterTable
ALTER TABLE "public"."subscription_quota" ALTER COLUMN "uuid" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."subscription_transaction" ALTER COLUMN "uuid" DROP DEFAULT;
