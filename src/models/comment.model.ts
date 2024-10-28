import mongoose, { Document } from 'mongoose';
import { CommentSchema } from 'src/schema/comment.schema';
import { User } from './user.model';
import { Posts } from './posts.model';

export interface Comment extends Document {
  content: string;
  like: number;
  image: string;
  user: User;
  posts: Posts;
  parentComment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const CommentModel = mongoose.model<Comment>('Comment', CommentSchema);
