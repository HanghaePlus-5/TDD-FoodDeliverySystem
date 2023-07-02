import './config/alias';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(`/api/${process.env.API_VERSION}`);
  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // dto에서 정의되지 않은 값은 제거
      forbidNonWhitelisted: true, // dto에서 정의되지 않은 값이 있으면 에러
      transform: true, // query나 params로 넘어온 값들의 타입을 자동으로 변환
    }),
  );

  const docs = require('../../swagger.json');
  docs.servers = [
    { url: 'http://localhost:3000' }
  ]
  SwaggerModule.setup('swagger', app, docs);

  await app.listen(3000);
}
bootstrap();
