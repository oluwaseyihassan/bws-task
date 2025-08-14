import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheService } from './cache.sevice';
import { ApiCache, ApiCacheSchema } from './cache.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ApiCache.name, schema: ApiCacheSchema }])
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}