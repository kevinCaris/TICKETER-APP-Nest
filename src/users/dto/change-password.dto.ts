import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(6, {
    message: 'Le nouveau mot de passe doit comporter au moins 6 caractères.',
  })
  newPassword: string;
}
