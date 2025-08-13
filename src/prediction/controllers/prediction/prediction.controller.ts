import { Controller, Get, Query } from '@nestjs/common';
import { PredictionService } from 'src/prediction/services/prediction/prediction.service';
import { ValidDate } from 'src/prediction/decorators/valid-date.decorator';

@Controller('prediction')
export class PredictionController {
    constructor(private predictionService: PredictionService) {}

    @Get(":date")
    getPredictions(@ValidDate('date') date: string, @Query("include") include: string, @Query("filters") filters: string, @Query("select") select: string, @Query("page") page: number, @Query("per_page") perPage: number) {
        return this.predictionService.fetchPredictions(date, include, filters, select, page, perPage)
    }
}
