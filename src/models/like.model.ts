import mongoose, { Document } from 'mongoose';
import { LikeSchema } from 'src/schema/like.schema';

export interface Like extends Document {
  isLike: boolean;
  user: object;
  posts: object;
  createdAt?: Date;
  updatedAt?: Date;
}

export const LikeModel = mongoose.model<Like>('Like', LikeSchema);
