import { Test, TestingModule } from "@nestjs/testing";

import { ChatService, ChatStreamService } from "../service";
import { AuthRequest } from "../type";
import { ChatController } from "./chat.controller";

describe("ChatController", () => {
  let controller: ChatController;

  const mockChatService = {
    createChatSession: jest.fn(),
    userChatSessionList: jest.fn(),
    deleteUserChatSession: jest.fn(),
  };
  const mockChatStreamService = {};
  const req = {
    user: {
      uuid: "user-1",
    },
  } as AuthRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
        {
          provide: ChatStreamService,
          useValue: mockChatStreamService,
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);

    jest.clearAllMocks();
  });

  it("creates a chat session for the current user", async () => {
    const session = { uuid: "cs-1" };
    mockChatService.createChatSession.mockResolvedValue(session);

    const result = await controller.createUserChatSession(req);

    expect(result).toBe(session);
    expect(mockChatService.createChatSession).toHaveBeenCalledWith("user-1");
  });

  it("lists chat sessions for the current user", async () => {
    const sessions = [{ uuid: "cs-1" }];
    mockChatService.userChatSessionList.mockResolvedValue(sessions);

    const result = await controller.userChatSessionList(req);

    expect(result).toBe(sessions);
    expect(mockChatService.userChatSessionList).toHaveBeenCalledWith("user-1");
  });

  it("soft deletes a chat session for the current user", async () => {
    mockChatService.deleteUserChatSession.mockResolvedValue({ ok: true });

    const result = await controller.deleteUserChatSession(req, "cs-1");

    expect(result).toEqual({ ok: true });
    expect(mockChatService.deleteUserChatSession).toHaveBeenCalledWith(
      "user-1",
      "cs-1",
    );
  });
});
