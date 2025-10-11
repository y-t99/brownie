 
 
import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';

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