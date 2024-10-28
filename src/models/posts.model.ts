import mongoose, { Document } from 'mongoose';
import { PostsSchema } from 'src/schema/posts.schema';
import { User } from './user.model';

export interface Posts extends Document {
  image: string;
  description: string;
  favorites: number;
  user: User;
  weight: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const PostsModel = mongoose.model<Posts>('Posts', PostsSchema);
