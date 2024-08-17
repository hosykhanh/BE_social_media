import {
  IsString,
  IsNumber,
  IsObject,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  image: string;

  @IsString()
  description: string;

  @IsNumber()
  favorites: number;

  @IsObject()
  user: object;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  favorites?: number;

  @IsOptional()
  @IsObject()
  user?: object;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
