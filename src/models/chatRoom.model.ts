import mongoose, { Document, Types } from 'mongoose';
import { ChatRoomSchema } from 'src/schema/chatRoom.schema';

export interface ChatRoom extends Document {
  participants: Types.ObjectId[];
  nameRoom: string;
  lastMessageSentAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ChatRoomModel = mongoose.model<ChatRoom>(
  'ChatRoom',
  ChatRoomSchema,
);
