import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no estén en el DTO (limpieza)
      forbidNonWhitelisted: true, // Lanza error si envían propiedades extra
      transform: true, // Convierte los tipos automáticamente
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Restaurante API')
    .setDescription('Sistema de gestión de restaurante')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document); 

  await app.listen(3000);
}
bootstrap();