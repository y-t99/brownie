import { NestFactory, Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

import { AppModule } from "./app.module";
import {
  AuthGuard,
  RoleGuard,
  ValidationPipe,
} from "./middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins =
    process.env.CORS_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean) ??
    [];

  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix("api");

  const port = process.env.PORT || 3001;

  await app.listen(port);

  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  app.useGlobalGuards(
    new AuthGuard(reflector, jwtService),
    new RoleGuard(reflector),
  );
  app.useGlobalPipes(new ValidationPipe());

  console.log(`🚀 API is running on: http://localhost:${port}/api`);
}

bootstrap();
