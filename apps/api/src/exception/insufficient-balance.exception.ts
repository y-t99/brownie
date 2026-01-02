import { BadRequestException } from "@nestjs/common";

import { ERROR_MESSAGE } from "./error-message";

export class InsufficientBalanceException extends BadRequestException {
  constructor() {
    super(ERROR_MESSAGE.InsufficientBalance);
  }
}

