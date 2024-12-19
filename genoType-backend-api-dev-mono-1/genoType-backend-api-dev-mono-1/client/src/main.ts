import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OPTIONS } from './main.option';
import { Logger } from '@nestjs/common';

const logger = new Logger('Blog');
async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, OPTIONS);
  await app.listen();
}
bootstrap();
