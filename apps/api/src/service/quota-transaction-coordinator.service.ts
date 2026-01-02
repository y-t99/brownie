import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../db-provider";
import { TransactionStatus, TransactionType } from "../enum";
import {
  InsufficientBalanceException,
  QuotaNotFoundException,
  TransactionNotFoundException,
} from "../exception";

@Injectable()
export class QuotaTransactionCoordinatorService {
  private readonly logger = new Logger(QuotaTransactionCoordinatorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async preDeduct(userId: string, amount: number, externalId: string) {
    const amountDecimal = new Prisma.Decimal(amount);

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.subscriptionTransaction.findUnique({
        where: { external_id: externalId },
      });
      if (existing) {
        this.logger.log({
          op: "preDeduct",
          user_uuid: userId,
          amount,
          external_id: externalId,
          result: "idempotent-return",
          transaction_uuid: existing.uuid,
          transaction_status: existing.transaction_status,
        });
        return existing;
      }

      const lockedQuotaRows = await tx.$queryRaw<Array<{ id: number }>>`
        SELECT "id"
        FROM "public"."subscription_quota"
        WHERE "created_by" = ${userId} AND "deleted" = false
        FOR UPDATE
      `;
      if (lockedQuotaRows.length === 0) throw new QuotaNotFoundException();

      const quota = await tx.subscriptionQuota.findUnique({
        where: { created_by: userId },
      });
      if (!quota || quota.deleted) throw new QuotaNotFoundException();

      if (quota.balance.lt(amountDecimal)) throw new InsufficientBalanceException();

      const updatedQuota = await tx.subscriptionQuota.update({
        where: { created_by: userId },
        data: {
          balance: { decrement: amountDecimal },
          locked_balance: { increment: amountDecimal },
          updated_by: userId,
        },
      });

      const transaction = await tx.subscriptionTransaction.create({
        data: {
          external_id: externalId,
          parent_uuid: null,
          transaction_type: TransactionType.PRE_DEDUCT,
          transaction_status: TransactionStatus.PENDING,
          change_amount: amountDecimal.mul(-1),
          balance_snapshot: updatedQuota.balance,
          remark: null,
          created_by: userId,
          updated_by: userId,
        },
      });

      this.logger.log({
        op: "preDeduct",
        user_uuid: userId,
        amount,
        external_id: externalId,
        result: "success",
        transaction_uuid: transaction.uuid,
        balance_snapshot: updatedQuota.balance,
      });

      return transaction;
    });
  }

  async settle(externalId: string) {
    return this.prisma.$transaction(async (tx) => {
      const lockedTransactionRows = await tx.$queryRaw<Array<{ id: number }>>`
        SELECT "id"
        FROM "public"."subscription_transaction"
        WHERE "external_id" = ${externalId} AND "deleted" = false
        FOR UPDATE
      `;
      if (lockedTransactionRows.length === 0) throw new TransactionNotFoundException();

      const preDeductTransaction = await tx.subscriptionTransaction.findUnique({
        where: { external_id: externalId },
      });
      if (!preDeductTransaction || preDeductTransaction.deleted)
        throw new TransactionNotFoundException();
      if (preDeductTransaction.transaction_type !== TransactionType.PRE_DEDUCT)
        throw new TransactionNotFoundException();

      const existingSettle = await tx.subscriptionTransaction.findFirst({
        where: {
          parent_uuid: preDeductTransaction.uuid,
          transaction_type: TransactionType.SETTLE,
          deleted: false,
        },
      });
      if (existingSettle) {
        this.logger.log({
          op: "settle",
          external_id: externalId,
          result: "idempotent-return",
          parent_transaction_uuid: preDeductTransaction.uuid,
          settle_transaction_uuid: existingSettle.uuid,
        });
        return existingSettle;
      }

      if (preDeductTransaction.transaction_status !== TransactionStatus.PENDING) {
        this.logger.warn({
          op: "settle",
          external_id: externalId,
          result: "unexpected-status",
          parent_transaction_uuid: preDeductTransaction.uuid,
          transaction_status: preDeductTransaction.transaction_status,
        });
      }

      const amount = preDeductTransaction.change_amount.abs();

      await tx.subscriptionTransaction.update({
        where: { uuid: preDeductTransaction.uuid },
        data: {
          transaction_status: TransactionStatus.SUCCESS,
          updated_by: preDeductTransaction.created_by,
        },
      });

      const lockedQuotaRows = await tx.$queryRaw<Array<{ id: number }>>`
        SELECT "id"
        FROM "public"."subscription_quota"
        WHERE "created_by" = ${preDeductTransaction.created_by} AND "deleted" = false
        FOR UPDATE
      `;
      if (lockedQuotaRows.length === 0) throw new QuotaNotFoundException();

      const quota = await tx.subscriptionQuota.findUnique({
        where: { created_by: preDeductTransaction.created_by },
      });
      if (!quota || quota.deleted) throw new QuotaNotFoundException();

      if (quota.locked_balance.lt(amount)) {
        this.logger.error({
          op: "settle",
          external_id: externalId,
          result: "locked-balance-insufficient",
          user_uuid: preDeductTransaction.created_by,
          locked_balance: quota.locked_balance,
          amount,
        });
        throw new InsufficientBalanceException();
      }

      const updatedQuota = await tx.subscriptionQuota.update({
        where: { created_by: preDeductTransaction.created_by },
        data: {
          locked_balance: { decrement: amount },
          total_spent: { increment: amount },
          updated_by: preDeductTransaction.created_by,
        },
      });

      const settleTransaction = await tx.subscriptionTransaction.create({
        data: {
          external_id: null,
          parent_uuid: preDeductTransaction.uuid,
          transaction_type: TransactionType.SETTLE,
          transaction_status: TransactionStatus.SUCCESS,
          change_amount: preDeductTransaction.change_amount,
          balance_snapshot: updatedQuota.balance,
          remark: null,
          created_by: preDeductTransaction.created_by,
          updated_by: preDeductTransaction.created_by,
        },
      });

      this.logger.log({
        op: "settle",
        external_id: externalId,
        result: "success",
        parent_transaction_uuid: preDeductTransaction.uuid,
        settle_transaction_uuid: settleTransaction.uuid,
      });

      return settleTransaction;
    });
  }

  async rollback(externalId: string, reason?: string) {
    return this.prisma.$transaction(async (tx) => {
      const lockedTransactionRows = await tx.$queryRaw<Array<{ id: number }>>`
        SELECT "id"
        FROM "public"."subscription_transaction"
        WHERE "external_id" = ${externalId} AND "deleted" = false
        FOR UPDATE
      `;
      if (lockedTransactionRows.length === 0) throw new TransactionNotFoundException();

      const preDeductTransaction = await tx.subscriptionTransaction.findUnique({
        where: { external_id: externalId },
      });
      if (!preDeductTransaction || preDeductTransaction.deleted)
        throw new TransactionNotFoundException();
      if (preDeductTransaction.transaction_type !== TransactionType.PRE_DEDUCT)
        throw new TransactionNotFoundException();

      const existingRollback = await tx.subscriptionTransaction.findFirst({
        where: {
          parent_uuid: preDeductTransaction.uuid,
          transaction_type: TransactionType.ROLLBACK,
          deleted: false,
        },
      });
      if (existingRollback) {
        this.logger.log({
          op: "rollback",
          external_id: externalId,
          result: "idempotent-return",
          parent_transaction_uuid: preDeductTransaction.uuid,
          rollback_transaction_uuid: existingRollback.uuid,
        });
        return existingRollback;
      }

      if (preDeductTransaction.transaction_status !== TransactionStatus.PENDING) {
        this.logger.warn({
          op: "rollback",
          external_id: externalId,
          result: "unexpected-status",
          parent_transaction_uuid: preDeductTransaction.uuid,
          transaction_status: preDeductTransaction.transaction_status,
        });
      }

      const amount = preDeductTransaction.change_amount.abs();

      await tx.subscriptionTransaction.update({
        where: { uuid: preDeductTransaction.uuid },
        data: {
          transaction_status: TransactionStatus.SUCCESS,
          updated_by: preDeductTransaction.created_by,
        },
      });

      const lockedQuotaRows = await tx.$queryRaw<Array<{ id: number }>>`
        SELECT "id"
        FROM "public"."subscription_quota"
        WHERE "created_by" = ${preDeductTransaction.created_by} AND "deleted" = false
        FOR UPDATE
      `;
      if (lockedQuotaRows.length === 0) throw new QuotaNotFoundException();

      const quota = await tx.subscriptionQuota.findUnique({
        where: { created_by: preDeductTransaction.created_by },
      });
      if (!quota || quota.deleted) throw new QuotaNotFoundException();

      if (quota.locked_balance.lt(amount)) {
        this.logger.error({
          op: "rollback",
          external_id: externalId,
          result: "locked-balance-insufficient",
          user_uuid: preDeductTransaction.created_by,
          locked_balance: quota.locked_balance,
          amount,
        });
        throw new InsufficientBalanceException();
      }

      const updatedQuota = await tx.subscriptionQuota.update({
        where: { created_by: preDeductTransaction.created_by },
        data: {
          balance: { increment: amount },
          locked_balance: { decrement: amount },
          updated_by: preDeductTransaction.created_by,
        },
      });

      const rollbackTransaction = await tx.subscriptionTransaction.create({
        data: {
          external_id: null,
          parent_uuid: preDeductTransaction.uuid,
          transaction_type: TransactionType.ROLLBACK,
          transaction_status: TransactionStatus.SUCCESS,
          change_amount: amount,
          balance_snapshot: updatedQuota.balance,
          remark: reason ?? null,
          created_by: preDeductTransaction.created_by,
          updated_by: preDeductTransaction.created_by,
        },
      });

      this.logger.log({
        op: "rollback",
        external_id: externalId,
        result: "success",
        parent_transaction_uuid: preDeductTransaction.uuid,
        rollback_transaction_uuid: rollbackTransaction.uuid,
        reason,
      });

      return rollbackTransaction;
    });
  }

  async getQuota(userId: string) {
    const quota = await this.prisma.subscriptionQuota.findFirst({
      where: { created_by: userId, deleted: false },
      select: {
        balance: true,
        locked_balance: true,
        total_spent: true,
        warning_threshold: true,
      },
    });

    if (!quota) throw new QuotaNotFoundException();

    return quota;
  }

  async topUp(userId: string, amount: number, externalId?: string, reason?: string) {
    const amountDecimal = new Prisma.Decimal(amount);

    return this.prisma.$transaction(async (tx) => {
      if (externalId) {
        const existing = await tx.subscriptionTransaction.findUnique({
          where: { external_id: externalId },
        });
        if (existing) {
          this.logger.log({
            op: "topUp",
            user_uuid: userId,
            amount,
            external_id: externalId,
            reason,
            result: "idempotent-return",
            transaction_uuid: existing.uuid,
          });
          return existing;
        }
      }

      const lockedQuotaRows = await tx.$queryRaw<Array<{ id: number }>>`
        SELECT "id"
        FROM "public"."subscription_quota"
        WHERE "created_by" = ${userId} AND "deleted" = false
        FOR UPDATE
      `;
      if (lockedQuotaRows.length === 0) throw new QuotaNotFoundException();

      const updatedQuota = await tx.subscriptionQuota.update({
        where: { created_by: userId },
        data: {
          balance: { increment: amountDecimal },
          updated_by: userId,
        },
      });

      const transaction = await tx.subscriptionTransaction.create({
        data: {
          external_id: externalId ?? null,
          parent_uuid: null,
          transaction_type: TransactionType.TOPUP,
          transaction_status: TransactionStatus.SUCCESS,
          change_amount: amountDecimal,
          balance_snapshot: updatedQuota.balance,
          remark: reason ?? null,
          created_by: userId,
          updated_by: userId,
        },
      });

      this.logger.log({
        op: "topUp",
        user_uuid: userId,
        amount,
        external_id: externalId,
        reason,
        result: "success",
        transaction_uuid: transaction.uuid,
        balance_snapshot: updatedQuota.balance,
      });

      return transaction;
    });
  }
}
