import { IsString, IsObject, IsOptional, IsDate } from 'class-validator';

export class CreateMessageDto {
  @IsObject()
  chatRoom: object;

  @IsObject()
  sender: object;

  @IsObject()
  encryptedContents: {
    receiverId: string;
    content: {
      type: number;
      body: string; // base64 string
      registrationId: number;
    };
  }[];

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
  @IsObject()
  encryptedContents?: {
    receiverId: string;
    content: {
      type: number;
      body: string; // base64 string
      registrationId: number;
    };
  }[];

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
