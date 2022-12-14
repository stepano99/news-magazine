import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
// import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/guards';
import { RolesGuard } from './auth/guards/roles.guard';
import { AtStrategy } from './auth/strategies';
import { FeedModule } from './feed/feed.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/news-magazine'),
    PassportModule,
    AuthModule,
    FeedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    
  ],
})
export class AppModule {}
