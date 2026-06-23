import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../db-provider";
import { ChatService } from "./chat.service";

jest.mock("@brownie/task", () => ({
  tasks: {
    trigger: jest.fn(),
  },
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "12345678-1234-1234-1234-123456789abc"),
}));

describe("ChatService", () => {
  let service: ChatService;

  const mockPrismaService = {
    chatSession: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    chatMessage: {
      findMany: jest.fn(),
    },
    chatMessageBlock: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);

    jest.clearAllMocks();
  });

  describe("userChatSessionList", () => {
    it("returns non-deleted sessions for the current user ordered by latest update", async () => {
      const sessions = [
        {
          uuid: "cs-2",
          created_by: "user-1",
          deleted: false,
          updated_at: new Date("2026-01-02T00:00:00.000Z"),
        },
      ];
      mockPrismaService.chatSession.findMany.mockResolvedValue(sessions);

      const result = await service.userChatSessionList("user-1");

      expect(result).toBe(sessions);
      expect(mockPrismaService.chatSession.findMany).toHaveBeenCalledWith({
        where: {
          created_by: "user-1",
          deleted: false,
        },
        orderBy: {
          updated_at: Prisma.SortOrder.desc,
        },
      });
    });
  });

  describe("deleteUserChatSession", () => {
    it("soft deletes a session owned by the current user", async () => {
      const session = {
        uuid: "cs-1",
        created_by: "user-1",
        deleted: false,
      };
      mockPrismaService.chatSession.findUnique.mockResolvedValue(session);
      mockPrismaService.chatSession.update.mockResolvedValue({
        ...session,
        deleted: true,
      });

      const result = await service.deleteUserChatSession("user-1", "cs-1");

      expect(result).toEqual({ ok: true });
      expect(mockPrismaService.chatSession.update).toHaveBeenCalledWith({
        where: {
          uuid: "cs-1",
        },
        data: {
          deleted: true,
          updated_by: "user-1",
        },
      });
    });

    it("throws NotFoundException when the session does not belong to the current user", async () => {
      mockPrismaService.chatSession.findUnique.mockResolvedValue(null);

      await expect(
        service.deleteUserChatSession("user-1", "cs-missing"),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mockPrismaService.chatSession.update).not.toHaveBeenCalled();
    });
  });
});
