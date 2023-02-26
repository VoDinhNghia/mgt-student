import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { linkAccessService } from './commons/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Students Management')
    .setDescription('The students management API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
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
  await app.listen(3000);
  console.log('Server running on port 3000');
}
bootstrap();
