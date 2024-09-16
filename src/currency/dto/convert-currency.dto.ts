import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class convertCurrencyDto {
  @IsString()
  @IsNotEmpty({ message: 'The source currency (from) is required.' })
  from: string;

  @IsString()
  @IsNotEmpty({ message: 'The source currency (to) is required' })
  to: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'The amount must be a valid number.' })
  amount: number;
}
