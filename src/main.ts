import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v3');
  const options = new DocumentBuilder()
    .setTitle('Bimeh Api Docs V3 Nest.js')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('users')
    .addTag('admin')
    .addTag('superAdmin')
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(`${process.env.PORT}` || 3000);
}
bootstrap().then(() =>
  console.log(
    `App successfully started on ${process.env.HOST}:${process.env.PORT}`,
  ),
);
