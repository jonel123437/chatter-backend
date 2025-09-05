import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS so frontend can call backend
  app.enableCors({
    origin: 'http://localhost:3000', // adjust to your frontend URL
    credentials: true,               // if using cookies or auth headers
  });

  // Serve static files (uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // URL prefix (http://localhost:5000/uploads/...)
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

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📂 Serving static files from /uploads`);
}
bootstrap();
