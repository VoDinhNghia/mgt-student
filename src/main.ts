import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { linkAccessService } from './constants/constant';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
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
      linkAccessService.ADMIN_FRONTEND,
      linkAccessService.FRONTEND,
      linkAccessService.LIBRARY_FRONTEND,
      linkAccessService.COURSE,
      linkAccessService.LIBRARY,
      linkAccessService.ATTENDANCE,
    ],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  });
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
