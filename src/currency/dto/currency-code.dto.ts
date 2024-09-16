import { IsNotEmpty } from 'class-validator';

export class CurrencyCode {
  @IsNotEmpty()
  currencyCode: string;
}
