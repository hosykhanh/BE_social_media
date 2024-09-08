import mongoose, { Document } from 'mongoose';
import { MessageSchema } from 'src/schema/message.schema';

export interface Message extends Document {
  chatRoom: object;
  sender: object;
  content: string;
  messageType: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const MessageModel = mongoose.model<Message>('Message', MessageSchema);
