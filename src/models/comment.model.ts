import mongoose, { Document } from 'mongoose';
import { CommentSchema } from 'src/schema/comment.schema';

export interface Comment extends Document {
  user: object;
  posts: object;
  content: object;
  like: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const CommentModel = mongoose.model<Comment>('Comment', CommentSchema);
