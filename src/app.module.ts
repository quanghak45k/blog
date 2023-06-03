import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configs from './configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG_DATABASE } from './configs/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.get(CONFIG_DATABASE),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
