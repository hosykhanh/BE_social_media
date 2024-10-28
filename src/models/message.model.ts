import mongoose, { Document } from 'mongoose';
import { MessageSchema } from 'src/schema/message.schema';
import { ChatRoom } from './chatRoom.model';
import { User } from './user.model';

export interface Message extends Document {
  chatRoom: ChatRoom;
  sender: User;
  content: string;
  messageType: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const MessageModel = mongoose.model<Message>('Message', MessageSchema);
