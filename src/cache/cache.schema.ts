// cache.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: true,
})
export class ApiCache extends Document {
  @Prop({ required: true, unique: true })
  key: string; // cache key

  @Prop({ type: MongooseSchema.Types.Mixed })
  data: any; // stored API response

  @Prop({ required: true })
  expiresAt: Date; // when this cache should expire
}

export const ApiCacheSchema = SchemaFactory.createForClass(ApiCache);

// Add index for automatic cleanup of expired documents
ApiCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });