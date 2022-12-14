import {forwardRef, Module} from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { ArticleSchema } from 'src/models/article.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import { AuthModule } from 'src/auth/auth.module';
import { AtGuard } from 'src/auth/guards';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
    MulterModule.register({dest: './uploads'}),
    // AuthModule,
     forwardRef(() => AuthModule),
  ],
  providers: [
    FeedService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
  controllers: [FeedController],
  exports: [FeedService]
})
export class FeedModule {}
