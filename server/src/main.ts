import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<string>('PORT');
  const CORS = configService.getOrThrow<string>('CORS');
  const PREFIX = configService.getOrThrow<string>('PREFIX');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [`http://localhost:${CORS}`, 'https://2leads.app'],
    credentials: true,
  });

  app.setGlobalPrefix(PREFIX);

  await app.listen(PORT);

  console.log(`Server started on PORT - http://localhost:${PORT}/${PREFIX}`);
}

bootstrap();
