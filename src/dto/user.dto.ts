import {
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
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
  readonly date?: Date;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsBoolean()
  readonly isAdmin?: boolean;
}
