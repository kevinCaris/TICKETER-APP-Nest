import {
  IsString,
  IsBoolean,
  IsNumber,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateConcertDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  totalSeats: number;

  @IsNumber()
  @IsNotEmpty()
  availableSeats: number;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  hour: string;

  @IsMongoId()
  @IsNotEmpty()
  group: any;
}