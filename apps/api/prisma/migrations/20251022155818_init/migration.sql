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
