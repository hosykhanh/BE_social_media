import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, '../server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, '../server.cert')),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.enableCors({
    origin: 'https://localhost:3000', // Địa chỉ của ứng dụng React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(3001);
}
bootstrap();
