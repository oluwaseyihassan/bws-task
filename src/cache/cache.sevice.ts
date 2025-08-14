// cache.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCache } from './cache.schema';

@Injectable()
export class CacheService {
  constructor(
    @InjectModel(ApiCache.name) private cacheModel: Model<ApiCache>
  ) {}

  async get(key: string): Promise<any | null> {
    try {
      const record = await this.cacheModel.findOne({ key }).exec();
      
      if (!record) {
        return null;
      }

      // Check if cache has expired
      if (new Date() > record.expiresAt) {
        await this.cacheModel.deleteOne({ key }).exec();
        return null;
      }

      return record.data;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  async set(key: string, data: any, ttlMinutes: number = 60): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + ttlMinutes);

      await this.cacheModel.findOneAndUpdate(
        { key },
        { data, expiresAt },
        { upsert: true, new: true }
      ).exec();
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.cacheModel.deleteOne({ key }).exec();
    } catch (error) {
      console.error('Error deleting cache:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.cacheModel.deleteMany({}).exec();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Helper method to generate cache keys
  generateCacheKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as Record<string, any>);
    
    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }
}
