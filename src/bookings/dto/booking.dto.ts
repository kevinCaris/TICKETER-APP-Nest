import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class BookingDto {

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  concertId: string;
}
