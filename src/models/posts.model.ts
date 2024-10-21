import mongoose, { Document } from 'mongoose';
import { PostsSchema } from 'src/schema/posts.schema';

export interface Posts extends Document {
  image: string;
  description: string;
  favorites: number;
  user: object;
  weight: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const PostsModel = mongoose.model<Posts>('Posts', PostsSchema);
