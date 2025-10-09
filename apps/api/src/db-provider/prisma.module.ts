/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export const PrismaProvider: Provider = {
  provide: PrismaService,
  useFactory: async () => {
    return new PrismaService();
  },
};

@Module({
  providers: [PrismaProvider],
  exports: [PrismaProvider],
})
export class PrismaModule {}