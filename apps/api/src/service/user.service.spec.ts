import { Test, TestingModule } from "@nestjs/testing";
import { User } from "@prisma/client";

import { PrismaService } from "../db-provider";
import { UserService } from "./user.service";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "12345678-1234-1234-1234-123456789abc"),
}));

jest.mock("node:crypto", () => ({
  randomBytes: jest.fn(),
  createHmac: jest.fn(),
}));

import * as Crypto from "node:crypto";

describe("UserService", () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create user with password encryption", async () => {
      const mockUser: Partial<User> = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        created_by: "system",
        updated_by: "system",
      };

      const expectedUuid = "usr1234567812341234";
      mockPrismaService.user.create.mockResolvedValue({
        uuid: expectedUuid,
      });

      const mockSalt = "mockedsalt123456";
      const mockEncryptedPassword =
        "mockedencryptedpassword1234567890abcdef";

      const mockRandomBytes = {
        toString: jest.fn().mockReturnValue(mockSalt),
      };
      (Crypto.randomBytes as jest.MockedFunction<typeof Crypto.randomBytes>).mockReturnValue(mockRandomBytes as any);

      const mockHmac = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue(mockEncryptedPassword),
      };
      (Crypto.createHmac as jest.MockedFunction<typeof Crypto.createHmac>).mockReturnValue(mockHmac as any);

      const result = await service.create(mockUser);

      expect(result).toBe(expectedUuid);
      expect(Crypto.randomBytes).toHaveBeenCalledWith(16);
      expect(Crypto.createHmac).toHaveBeenCalledWith("sha512", mockSalt);
      expect(mockHmac.update).toHaveBeenCalledWith("password123");
      expect(mockHmac.digest).toHaveBeenCalledWith("hex");

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          uuid: expect.stringContaining("usr"),
          name: "Test User",
          email: "test@example.com",
          password: mockEncryptedPassword,
          salt: mockSalt,
          created_by: "system",
          updated_by: "system",
        },
        select: {
          uuid: true,
        },
      });
    });
  });
});

