import {
  IsString,
  IsNumber,
  IsObject,
  IsOptional,
  IsDate,
} from 'class-validator';

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
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
