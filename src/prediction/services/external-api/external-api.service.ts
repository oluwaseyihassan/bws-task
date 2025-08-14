import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { successResponse, errorResponse } from 'src/utils/response';

@Injectable()
export class ExternalApiService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}

    async getFixturesByDate(
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

                // Append current page's data
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
                'Fixtures fetched successfully from external API'
            );

        } catch (error) {
            console.error('Error fetching fixtures by date from external API:', error.message);
            return errorResponse('Failed to fetch fixtures by date', error.message);
        }
    }

    async getFixturesByName(
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

            return successResponse(allData, 'Fixtures fetched successfully from external API');
        } catch (error) {
            console.error('Error fetching fixtures by name from external API:', error);
            return errorResponse('Failed to fetch fixtures by name', error.message);
        }
    }



 
}