import { Injectable } from '@nestjs/common';
import { KavenegarApi } from 'kavenegar';

@Injectable()
export class SmsService {
  constructor(private readonly apiKey: string = '552222') {
    const api = KavenegarApi(apiKey);
  }

  async getSms(message: string, sender: string, receptor: string) {}
}
