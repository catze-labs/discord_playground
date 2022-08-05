import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 8080;

  app.enableCors({ origin: '*' });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Catze-CyberGalz-Discord Bot Server')
    .setDescription('Catze-CyberGalz-Discord Bot API Example')
    .setVersion('1.0')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('apiv1', app, swaggerDoc);
  await app.listen(port);

  console.log(`NESTJS Server is Listening on ${port}`);
}
bootstrap();
