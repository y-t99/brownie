import { Test, TestingModule } from "@nestjs/testing";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../db-provider";
import { TransactionStatus, TransactionType } from "../enum";
import {
  InsufficientBalanceException,
  TransactionNotFoundException,
} from "../exception";
import { QuotaTransactionCoordinatorService } from "./quota-transaction-coordinator.service";

describe("QuotaTransactionCoordinatorService", () => {
  let service: QuotaTransactionCoordinatorService;

  const tx = {
    $queryRaw: jest.fn(),
    subscriptionQuota: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    subscriptionTransaction: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockPrismaService = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $transaction: jest.fn(async (callback: any) => callback(tx)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotaTransactionCoordinatorService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<QuotaTransactionCoordinatorService>(
      QuotaTransactionCoordinatorService,
    );

    jest.clearAllMocks();
  });

  describe("preDeduct", () => {
    it("returns existing transaction (idempotent)", async () => {
      const existing = {
        uuid: "txn-1",
        external_id: "ext-1",
        transaction_type: TransactionType.PRE_DEDUCT,
        transaction_status: TransactionStatus.PENDING,
      };

      tx.subscriptionTransaction.findUnique.mockResolvedValue(existing);

      const result = await service.preDeduct("user-1", 10, "ext-1");

      expect(result).toBe(existing);
      expect(tx.$queryRaw).not.toHaveBeenCalled();
    });

    it("throws InsufficientBalanceException when balance is insufficient", async () => {
      tx.subscriptionTransaction.findUnique.mockResolvedValue(null);
      tx.$queryRaw.mockResolvedValue([{ id: 1 }]);
      tx.subscriptionQuota.findUnique.mockResolvedValue({
        deleted: false,
        balance: new Prisma.Decimal(5),
      });

      await expect(service.preDeduct("user-1", 10, "ext-1")).rejects.toBeInstanceOf(
        InsufficientBalanceException,
      );
      expect(tx.subscriptionQuota.update).not.toHaveBeenCalled();
      expect(tx.subscriptionTransaction.create).not.toHaveBeenCalled();
    });
  });

  describe("settle", () => {
    it("throws TransactionNotFoundException when no transaction exists", async () => {
      tx.$queryRaw.mockResolvedValue([]);

      await expect(service.settle("ext-missing")).rejects.toBeInstanceOf(
        TransactionNotFoundException,
      );
    });

    it("returns existing settle transaction (idempotent)", async () => {
      const preDeductTransaction = {
        uuid: "txn-parent",
        external_id: "ext-1",
        transaction_type: TransactionType.PRE_DEDUCT,
        transaction_status: TransactionStatus.SUCCESS,
        change_amount: new Prisma.Decimal(-10),
        created_by: "user-1",
        deleted: false,
      };
      const settleTransaction = {
        uuid: "txn-settle",
        parent_uuid: "txn-parent",
        transaction_type: TransactionType.SETTLE,
        transaction_status: TransactionStatus.SUCCESS,
      };

      tx.$queryRaw.mockResolvedValue([{ id: 1 }]);
      tx.subscriptionTransaction.findUnique.mockResolvedValue(preDeductTransaction);
      tx.subscriptionTransaction.findFirst.mockResolvedValue(settleTransaction);

      const result = await service.settle("ext-1");

      expect(result).toBe(settleTransaction);
      expect(tx.subscriptionTransaction.update).not.toHaveBeenCalled();
      expect(tx.subscriptionQuota.update).not.toHaveBeenCalled();
    });
  });
});

