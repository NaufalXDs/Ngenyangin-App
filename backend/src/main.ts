import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.CORS_ORIGIN
    ?.split(',')
    .map((origin) => origin.trim()) ?? ['http://localhost:5173', 'http://127.0.0.1:5173'];

  app.enableCors({ origin: allowedOrigins });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
