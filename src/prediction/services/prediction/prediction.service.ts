import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { FixturesResponse, SuccessType } from 'src/types/types';
import { successResponse, errorResponse } from 'src/utils/response';

@Injectable()
export class PredictionService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}
    
 async getPredictionsFromProvider(
    date: string,
    include: string = "",
    filters: string = "",
    select: string = "",
    perPage: number = 1000 // max allowed
) {
    try {
        let page = 1;
        let hasMore = true;
        let allData: any[] = [];

        while (hasMore) {
            const { data } = await firstValueFrom(
                this.httpService.get(
                    `/fixtures/date/${date}?include=${include}&filters=${filters}&select=${select}&page=${page}&per_page=${perPage}`
                )
            );

            // Append current page’s data
            if (data?.data?.length) {
                allData.push(...data.data);
            }

            // Check if more pages exist
            if (data?.pagination?.has_more) {
                page++;
            } else {
                hasMore = false;
            }
        }

        return successResponse(
            { data: allData },
            'Predictions fetched successfully'
        );

    } catch (error) {
        console.error('Error fetching predictions:', error.message);
        return errorResponse('Failed to fetch predictions', error.message);
    }
}


async getFixturesByNameFromProvider(
    name: string,
    include: string = "",
    filters: string = "",
    select: string = "",
    perPage: number = 1000 // Max allowed
) {
    try {
        let page = 1;
        let allData = [] as any[];
        let hasMore = true;

        while (hasMore) {
            const { data } = await firstValueFrom(
                this.httpService.get(
                    `/fixtures/search/${name}?include=${include}&filters=${filters}&select=${select}&page=${page}&per_page=${perPage}`
                )
            );
            console.log(data)
            if (data?.data?.length) {
                allData.push(...data.data);
            }

            // Check pagination
            if (data?.pagination?.has_more) {
                page++;
            } else {
                hasMore = false;
            }
        }

        return successResponse(allData, 'All fixtures fetched successfully');
    } catch (error) {
        console.error('Error fetching fixtures by name:', error);
        return errorResponse('Failed to fetch fixtures by name', error.message);
    }
}



    async fetchPredictions(date: string, include: string = "", filters: string = "", select: string = "", filterByPercentage: number = 50) {
        try {
            const predictionsResponse = await this.getPredictionsFromProvider(date, include, filters, select);
            
            // Check if the response was successful
            if (predictionsResponse.status === 'error') {
                return predictionsResponse; // Return the error response as is
            }

            const predictions: FixturesResponse = (predictionsResponse as SuccessType).data;

            // Filter fixtures with predictions - using type assertion to fix TypeScript error
            const filteredFixtures = predictions?.data?.filter(
                (fixture: any) => fixture.predictions && fixture.predictions.length > 0
            ) || [];

            const filteredHomeFixtures = filteredFixtures.filter((fixture: any) => {
                return (fixture.predictions?.find((prediction: any) => prediction.type_id === 237)?.predictions?.home ?? 0) >= filterByPercentage
            });

            console.log("fetched");
            
            // Return success response with filtered fixtures
            return successResponse({
                ...predictions,
                data: filteredHomeFixtures
            }, 'Filtered predictions fetched successfully');

        } catch (error) {
            console.error('Error fetching filtered predictions:', error.message);
            return errorResponse('Failed to fetch filtered predictions', error.message);
        }
    }

    async fetchFixturesByName(name: string, include: string = "", filters: string = "", select: string = "", perPage: number = 50) {
        try {
            const fixturesResponse = await this.getFixturesByNameFromProvider(name, include, filters, select, perPage);
            if (fixturesResponse.status === 'error') {
                return fixturesResponse;
            }

            const fixtures: FixturesResponse = (fixturesResponse as SuccessType).data;

            return successResponse({
                data: fixtures ?? []
            }, 'Fetched fixtures by name successfully');

        } catch (error) {
            console.error('Error fetching fixtures by name:', error.message);
            return errorResponse('Failed to fetch fixtures by name', error.message);
        }
    }
}