import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PredictionService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}
    
    async getPredictionsFromProvider(date: string, include: string = "", filters: string = "", select: string = "") {
        // const baseUrl = this.configService.get<string>('BASE_URL');
        
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`/fixtures/date/${date}?include=${include}&filters=${filters}&select=${select}`)
            )
            return data;
        } catch (error) {
            console.error('Error fetching predictions:', error);
            throw error;
        }
    }

    async fetchPredictions(date: string, include: string = "", filters: string = "", select: string = "") {
        const predictions = await this.getPredictionsFromProvider(date, include, filters, select);

        console.log('Fetched predictions:', predictions);
        return predictions;
    }
}