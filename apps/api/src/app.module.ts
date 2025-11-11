import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController, ChatController, InternalController, TaskController, UserController } from './controller';
import { PrismaModule } from './db-provider';
import { AuthGuard } from './middleware';
import { AuthService, ChatService, ChatStreamService, TaskService, UserService } from './service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AppController, AuthController, ChatController, InternalController, TaskController, UserController],
  providers: [
    AppService,
    AuthService,
    ChatService,
    ChatStreamService,
    TaskService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}