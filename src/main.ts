import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so frontend can call backend
  app.enableCors({
    origin: 'http://localhost:3000', // adjust to your frontend URL
    credentials: true,               // if using cookies or auth headers
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Chatter API')
    .setDescription('API documentation for Chatter App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Use port from .env or fallback
  const port = process.env.PORT || 5000;
  await app.listen(port);

}
bootstrap();
