import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './db-provider';
import { ChatService } from './service';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [AppController],
  providers: [AppService, ChatService],
})
export class AppModule {}