import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@modules/app.module';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3000);
}
bootstrap();