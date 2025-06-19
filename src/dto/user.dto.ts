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
  password?: string;

  @IsString()
  confirmPassword?: string;

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
  @IsString()
  readonly avatarKey?: string;

  @IsOptional()
  @IsArray()
  friends?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  friendRequests?: {
    from: Types.ObjectId;
    status: string;
  }[];

  @IsOptional()
  @IsString()
  readonly otpSecret?: string;

  @IsOptional()
  @IsString()
  readonly identityKey: string;

  @IsOptional()
  @IsNumber()
  readonly registrationId: number;

  @IsOptional()
  @IsArray()
  readonly preKeys: {
    keyId: number;
    publicKey: string;
  }[];

  @IsOptional()
  @IsArray()
  readonly signedPreKey: {
    keyId: number;
    publicKey: string;
    signature: string;
  };
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
  @IsString()
  readonly avatarKey?: string;

  @IsOptional()
  @IsArray()
  friends?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  friendRequests?: {
    from: Types.ObjectId;
    status: string;
  }[];

  @IsOptional()
  @IsString()
  readonly otpSecret?: string;
}

export class UserSignalPublicDto {
  readonly identityKey: string;
  readonly registrationId: number;
  readonly preKeys: {
    keyId: number;
    publicKey: string;
  }[];
  readonly signedPreKey: {
    keyId: number;
    publicKey: string;
    signature: string;
  };
}
