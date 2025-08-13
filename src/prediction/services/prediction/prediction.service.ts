import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { FixturesResponse } from 'src/types/types';

@Injectable()
export class PredictionService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}
    
    async getPredictionsFromProvider(date: string, include: string = "", filters: string = "", select: string = "", page: number = 1, perPage: number = 50) {
        // const baseUrl = this.configService.get<string>('BASE_URL');
        
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`/fixtures/date/${date}?include=${include}&filters=${filters}&select=${select}&page=${page}&per_page=${perPage}`)
            )
            return data;
        } catch (error) {
            console.error('Error fetching predictions:', error);
            throw error;
        }
    }

    async fetchPredictions(date: string, include: string = "", filters: string = "", select: string = "", page: number = 1, perPage: number = 50) {
        const predictions: FixturesResponse = await this.getPredictionsFromProvider(date, include, filters, select, page, perPage);

        // Filter fixtures with predictions
        const filteredFixtures = predictions?.data?.filter(
            (fixture) => fixture.predictions && fixture.predictions.length > 0
        ) || [];

        // Return only filtered fixtures
        return {
            ...predictions,
            data: filteredFixtures
        };
    }
}