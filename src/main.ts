import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    origin: [config.getOrThrow<string>('ALLOWED_ORIGIN')],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  await app.listen(config.getOrThrow<number>('PORT'));
}

bootstrap();
