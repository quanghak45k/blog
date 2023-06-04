import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import AppConfig, { CONFIG_APP } from './configs/app';
// Securing access to swagger with http basic auth nestjs with express
import * as basicAuth from 'express-basic-auth'; 
import SwaggerConfig, { CONFIG_SWAGGER } from './configs/swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthStrategy } from './constants/enums';

async function bootstrap() {
  const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3004;
  const host = process.env.APP_HOST ?? 'localhost';
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService<Record<string, unknown>, false> = app.get(ConfigService);
  const appConfig = configService.get<ConfigType<typeof AppConfig>>(CONFIG_APP);
  const swaggerConfig = configService.get<ConfigType<typeof SwaggerConfig>>(CONFIG_SWAGGER);

  // swagger
  if (swaggerConfig.enable) {
    app.use(
      ['/swagger'],
      basicAuth({
        challenge: true,
        users: {
          dev: '123456aA@',
        },
      }),
    );
    const config = new DocumentBuilder()
      .setTitle(appConfig.name)
      .setVersion(process.env.npm_package_version)
      .setDescription(process.env.npm_package_description)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        AuthStrategy.Jwt, // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(port, host);
  // eslint-disable-next-line no-console
  console.log(`Server running on ${await app.getUrl()}`);
  // await app.listen(3000);
}
bootstrap();
