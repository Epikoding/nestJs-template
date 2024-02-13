import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './domain/global/util/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';




async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Only validate properties that are in the DTO
      forbidNonWhitelisted: true, // Throw an error if any non-whitelisted properties are provided
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );
  await app.listen(3001);
}
bootstrap();

