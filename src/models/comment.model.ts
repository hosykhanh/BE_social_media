import mongoose, { Document } from 'mongoose';
import { CommentSchema } from 'src/schema/comment.schema';

export interface Comment extends Document {
  content: string;
  like: number;
  image: string;
  user: object;
  posts: object;
  parentComment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const CommentModel = mongoose.model<Comment>('Comment', CommentSchema);
