import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(3, { message: 'Le nom doit comporter au moins 3 caractères' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email invalide' })
  email?: string;
}
