import {
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  readonly maSo?: string;

  @IsEmail()
  readonly career?: string;

  @IsString()
  readonly name?: string;

  @IsEmail()
  readonly email?: string;

  @IsString()
  readonly password?: string;

  @IsString()
  readonly confirmPassword?: string;

  @IsOptional()
  @IsString()
  readonly gender?: string;

  @IsOptional()
  @IsDate()
  readonly dateOfBirth?: Date;

  @IsOptional()
  @IsNumber()
  readonly phone?: number;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsBoolean()
  readonly isAdmin?: boolean;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsOptional()
  @IsArray()
  friends?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  friendRequests?: {
    from: Types.ObjectId;
    status: string;
  }[];
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly maSo?: string;

  @IsOptional()
  @IsEmail()
  readonly career?: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly password?: string;

  @IsOptional()
  @IsString()
  readonly confirmPassword?: string;

  @IsOptional()
  @IsString()
  readonly gender?: string;

  @IsOptional()
  @IsDate()
  readonly dateOfBirth?: Date;

  @IsOptional()
  @IsNumber()
  readonly phone?: number;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsBoolean()
  readonly isAdmin?: boolean;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsOptional()
  @IsArray()
  friends?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  friendRequests?: {
    from: Types.ObjectId;
    status: string;
  }[];
}
