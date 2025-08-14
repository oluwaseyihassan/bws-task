import { Module } from '@nestjs/common';
import { PredictionService } from './services/prediction/prediction.service';
import { PredictionController } from './controllers/prediction/prediction.controller';
import { ExternalApiService } from './services/external-api/external-api.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  providers: [PredictionService, ExternalApiService],
  controllers: [PredictionController],
  imports: [
    CacheModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('BASE_URL'),
        headers: {
          "Authorization": `${configService.get<string>('API_KEY')}`,
        }
      }),
      inject: [ConfigService],
    })
  ]
})
export class PredictionModule {}
