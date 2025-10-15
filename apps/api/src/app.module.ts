import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController,ChatController, InternalController, TaskController,UserController  } from './controller';
import { PrismaModule } from './db-provider';
import { ChatService, ChatStreamService, TaskService, UserService } from './service';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, JwtModule.registerAsync({
    global: true,
    useFactory: (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
    }),
  })],
  controllers: [AppController, AuthController, ChatController, InternalController, TaskController, UserController],
  providers: [AppService, ChatService, TaskService, UserService, ChatStreamService],
})
export class AppModule {}