import { IsOptional, IsDate, IsArray, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ChatRoomDto {
  @IsOptional()
  @IsArray()
  participants?: Types.ObjectId[];

  @IsOptional()
  @IsString()
  nameRoom?: string;

  @IsOptional()
  @IsDate()
  lastMessageSentAt?: Date;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
