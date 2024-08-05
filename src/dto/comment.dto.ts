import { IsString, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsObject()
  user: object;

  @IsObject()
  posts: object;

  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  like?: number;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class UpdateCommentDto {
  @IsOptional()
  @IsObject()
  user?: object;

  @IsOptional()
  @IsObject()
  posts?: object;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  like?: number;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}
