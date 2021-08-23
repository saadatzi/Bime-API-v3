import { Module, CacheModule } from '@nestjs/common';
import { SmsService } from './sms.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  ],
  providers: [SmsService],
})
export class SmsModule {}
