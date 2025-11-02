import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';
import { Types } from 'mongoose';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsUrl({}, { message: 'image must be a valid URL' })
  image?: string;

  @IsOptional()
  @IsArray()
  concerts?: Types.ObjectId[];
}
