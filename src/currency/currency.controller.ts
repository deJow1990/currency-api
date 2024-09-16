import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { convertCurrencyDto } from './dto/convert-currency.dto';
import { CurrencyCode } from './dto/currency-code.dto';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('convert')
  @ApiOperation({ summary: 'Convert currency' })
  @ApiQuery({
    name: 'from',
    type: String,
    description: 'Currency to convert from',
  })
  @ApiQuery({ name: 'to', type: String, description: 'Currency to convert to' })
  @ApiQuery({ name: 'amount', type: Number, description: 'Amount to convert' })
  @ApiResponse({
    status: 200,
    description: 'Successful conversion',
    type: Number,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async convertCurrency(@Query() query: convertCurrencyDto) {
    const { from, to, amount } = query;
    const conversionInfo = await this.currencyService.convertCurrency(
      from,
      to,
      amount,
    );
    return { from, to, amount, conversionInfo };
  }

  @Get('details')
  @ApiOperation({ summary: 'Get currency details' })
  @ApiQuery({
    name: 'currencyCode',
    type: String,
    description: 'Code of the currency',
  })
  @ApiResponse({ status: 200, description: 'Currency details', type: Object })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async currentDetails(@Query() query: CurrencyCode) {
    const { currencyCode } = query;
    return this.currencyService.currencyDetails(currencyCode);
  }
}
