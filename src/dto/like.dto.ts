import { IsBoolean, IsDate, IsObject, IsOptional } from 'class-validator';

export class CreateLikeDto {
  @IsBoolean()
  like: boolean;

  @IsObject()
  user: object;

  @IsObject()
  posts: object;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class UpdateLikeDto {
  @IsOptional()
  @IsBoolean()
  like: boolean;

  @IsOptional()
  @IsObject()
  user: object;

  @IsOptional()
  @IsObject()
  posts: object;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
