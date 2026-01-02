import { NotFoundException } from "@nestjs/common";

import { ERROR_MESSAGE } from "./error-message";

export class QuotaNotFoundException extends NotFoundException {
  constructor() {
    super(ERROR_MESSAGE.QuotaNotFound);
  }
}

