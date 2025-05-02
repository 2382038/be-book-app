import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Simple Social Media API')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  // Serve raw OpenAPI JSON
  app.use('/api/swagger-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });

  // Serve Swagger UI HTML (from CDN)
  app.use('/api/swagger', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>API Docs</title>
          <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
          <script>
            window.onload = function () {
              SwaggerUIBundle({
                url: '/api/swagger-json',
                dom_id: '#swagger-ui',
              });
            };
          </script>
        </body>
      </html>
    `);
  });

  app.useGlobalPipes(new ValidationPipe());
  
  const PORT = 3001;
  try {
    await app.listen(PORT);
    console.log(`Application is running on: http://localhost:${PORT}/api`);
    console.log(`Swagger documentation available at: http://localhost:${PORT}/api/swagger`);
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try these steps:`);
      console.error('1. Kill the process using the port:');
      console.error('   Windows: netstat -ano | findstr :<PORT>');
      console.error('   Then: taskkill /F /PID <PID>');
      console.error('2. Or change the port number in main.ts');
      process.exit(1);
    }
    throw error;
  }
}
bootstrap();
