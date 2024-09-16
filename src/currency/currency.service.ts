import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AppConfig } from 'src/config/app.interface';

@Injectable()
export class CurrencyService {
  private baseUrl: string;
  private apiKey: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    const appConfig = this.configService.get<AppConfig>('app');
    this.baseUrl = appConfig.apiUrl;
    this.apiKey = appConfig.apiKey;
  }

  async convertCurrency(from: string, to: string, amount: number) {
    const url = `${this.baseUrl}/${this.apiKey}/pair/${from}/${to}/${amount}`;
    console.log(url);
    try {
      const res = await lastValueFrom(this.httpService.get(url));
      const data = res.data;
      const { conversion_rate: rate, conversion_result: result } = data;

      if (!data) {
        throw new HttpException(
          `Currency details not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return { rate, result };
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            throw new HttpException(`Currency not found`, HttpStatus.NOT_FOUND);
          case 401:
            throw new HttpException(
              'Unauthorized request. Please check your API key.',
              HttpStatus.UNAUTHORIZED,
            );
          default:
            throw new HttpException(
              'Error fetching currency details',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      } else {
        throw new HttpException(
          'Error fetching currency details',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async currencyDetails(currencyCode: string) {
    const url = `${this.baseUrl}/${this.apiKey}/latest/${currencyCode}`;

    try {
      const response = await lastValueFrom(this.httpService.get(url));
      const data = response.data;

      if (!data) {
        throw new HttpException(
          `Currency details for ${currencyCode} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return data;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            throw new HttpException(
              `Currency not found for ${currencyCode}`,
              HttpStatus.NOT_FOUND,
            );
          case 401:
            throw new HttpException(
              'Unauthorized request. Please check your API key.',
              HttpStatus.UNAUTHORIZED,
            );
          default:
            throw new HttpException(
              'Error fetching currency details',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      } else {
        throw new HttpException(
          'Error fetching currency details',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
