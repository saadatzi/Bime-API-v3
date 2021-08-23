import { Module, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SmsModule } from './shared/sms-service/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.production', '.env.development'],
    }),
    MongooseModule.forRoot(
      // `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/BimeDB?authSource=admin&readPreference=primary`,
      `${process.env.DB_URL}`,

      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
    ),
    AuthModule,
    UserModule,
    SmsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
