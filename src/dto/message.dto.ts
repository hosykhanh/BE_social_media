import { IsString, IsObject, IsOptional, IsDate } from 'class-validator';

export class CreateMessageDto {
  @IsObject()
  chatRoom: object;

  @IsObject()
  sender: object;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  messageType: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}

export class UpdateMessageDto {
  @IsOptional()
  @IsObject()
  chatRoom?: object;

  @IsOptional()
  @IsObject()
  sender?: object;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  messageType?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
