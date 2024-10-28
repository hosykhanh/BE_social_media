import mongoose, { Document } from 'mongoose';
import { LikeSchema } from 'src/schema/like.schema';
import { User } from './user.model';
import { Posts } from './posts.model';

export interface Like extends Document {
  isLike: boolean;
  user: User;
  posts: Posts;
  createdAt?: Date;
  updatedAt?: Date;
}

export const LikeModel = mongoose.model<Like>('Like', LikeSchema);
