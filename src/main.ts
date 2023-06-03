import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import AppConfig, { CONFIG_APP } from './configs/app';

async function bootstrap() {
  const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3004;
  const host = process.env.APP_HOST ?? 'localhost';
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService<Record<string, unknown>, false> = app.get(ConfigService);
  const appConfig = configService.get<ConfigType<typeof AppConfig>>(CONFIG_APP);

  await app.listen(port, host);
  // eslint-disable-next-line no-console
  console.log(`Server running on ${await app.getUrl()}`);
  // await app.listen(3000);
}
bootstrap();
