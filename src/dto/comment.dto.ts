import { IsString, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsString()
  image: string;

  @IsNumber()
  like?: number;

  @IsObject()
  user: object;

  @IsObject()
  posts: object;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  like?: number;

  @IsOptional()
  @IsObject()
  user?: object;

  @IsOptional()
  @IsObject()
  posts?: object;

  @IsOptional()
  @IsString()
  createdAt?: Date;

  @IsOptional()
  @IsString()
  updatedAt?: Date;
}
