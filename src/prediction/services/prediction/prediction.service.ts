import { Injectable } from '@nestjs/common';
import { FixturesResponse, SuccessType } from 'src/types/types';
import { successResponse, errorResponse } from 'src/utils/response';
import { ExternalApiService } from '../external-api/external-api.service';
import { CacheService } from 'src/cache/cache.sevice';

@Injectable()
export class PredictionService {
    constructor(
        private readonly externalApiService: ExternalApiService,
        private readonly cacheService: CacheService
    ) {}

    async fetchPredictions(date: string, include: string = "", filters: string = "", select: string = "", filterByPercentage: number = 50) {
        try {
            // Generate cache key
            const cacheKey = this.cacheService.generateCacheKey('predictions', {
                date,
                include,
                filters,
                select,
                filterByPercentage
            });

            // Check cache first
            const cachedResult = await this.cacheService.get(cacheKey);
            if (cachedResult) {
                console.log('Returning cached predictions');
                return cachedResult;
            }

            const predictionsResponse = await this.externalApiService.getFixturesByDate(date, include, filters, select);
            
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

            console.log("fetched from API");
            
            // Create success response
            const result = successResponse({
                ...predictions,
                data: filteredHomeFixtures
            }, 'Filtered predictions fetched successfully');

            // Cache the result for 30 minutes
            await this.cacheService.set(cacheKey, result, 30);

            return result;

        } catch (error) {
            console.error('Error fetching filtered predictions:', error.message);
            return errorResponse('Failed to fetch filtered predictions', error.message);
        }
    }

    async fetchFixturesByName(name: string, include: string = "", filters: string = "", select: string = "", perPage: number = 50) {
        try {
            // Generate cache key
            const cacheKey = this.cacheService.generateCacheKey('fixtures-by-name', {
                name,
                include,
                filters,
                select,
                perPage
            });

            // Check cache first
            const cachedResult = await this.cacheService.get(cacheKey);
            if (cachedResult) {
                console.log('Returning cached fixtures by name');
                return cachedResult;
            }

            const fixturesResponse = await this.externalApiService.getFixturesByName(name, include, filters, select, perPage);
            if (fixturesResponse.status === 'error') {
                return fixturesResponse;
            }

            const fixtures: any = (fixturesResponse as SuccessType).data;

            const result = successResponse({
                data: fixtures ?? []
            }, 'Fetched fixtures by name successfully');

            // Cache the result for 60 minutes
            await this.cacheService.set(cacheKey, result, 60);

            return result;

        } catch (error) {
            console.error('Error fetching fixtures by name:', error.message);
            return errorResponse('Failed to fetch fixtures by name', error.message);
        }
    }

    // Method to clear specific cache
    async clearPredictionsCache(date?: string): Promise<void> {
        if (date) {
            const cacheKey = this.cacheService.generateCacheKey('predictions', { date });
            await this.cacheService.delete(cacheKey);
        } else {
            // Clear all prediction-related cache
            await this.cacheService.clear();
        }
    }
}