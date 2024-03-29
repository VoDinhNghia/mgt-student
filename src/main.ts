import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Students Management')
    .setDescription('The students management API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  app.enableCors({
    origin: [
      configService.get<string>('ADMIN_FRONTEND'),
      configService.get<string>('FRONTEND'),
      configService.get<string>('LIBRARY_FRONTEND'),
      configService.get<string>('LIBRARY'),
      configService.get<string>('ATTENDANCE'),
      configService.get<string>('BLOG_SERVICE'),
    ],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  });
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
(async () => {
  await bootstrap();
})();
