import { Module } from '@nestjs/common';
import { PredictionService } from './services/prediction/prediction.service';
import { PredictionController } from './controllers/prediction/prediction.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [PredictionService],
  controllers: [PredictionController],
  imports: [
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
