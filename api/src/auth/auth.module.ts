import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UserSchema } from 'src/models/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'; 
import { AtGuard } from './guards';
import { RolesGuard } from './guards/roles.guard';
import { AtStrategy, RtStrategy } from './strategies';
import {FeedModule} from "../feed/feed.module";
import {FeedService} from "../feed/feed.service";


@Module({
  imports: [
      FeedModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({}),
    MulterModule.register({dest: './uploads'}),
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },],
  exports: [AuthService]
})
export class AuthModule {}
