import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { Image } from './types/image.interface';
import { join } from 'path';
import { GetCurrentUser, GetCurrentUserId } from 'src/auth/decorators';
import { CreateArticleDTO } from './dto/create-article.dto';
import { FeedService } from './feed.service';
import { Article } from './types/article';
import { PaginationParams } from './types/paginationParams';
import { ArticleCategory } from './types/article-category.enum';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types/roles.enum';

export const storage = {
    storage: diskStorage({
        destination: './uploads/news-images',
        // destination: '../../../../task1',
        
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })
}

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService){}

    
    @Get('user')
    findMyArticles(
        @GetCurrentUserId() userId: string,
        // @Query() { skip, limit }: PaginationParams
    ): Promise<Article[]>{
        return this.feedService.paginateByUser(userId)
    }
    
    //http://localhost:3000/api/feed/category/sport?skip=0&limit=6
    @Get('category/:category/page/:page')
    findSelected(
        @Param('category') category: ArticleCategory[],
        @Param('page') page: string,
        // @Query() { skip, limit }: PaginationParams 
    ): Promise<Article[]> {
        return this.feedService.findArticlesByCategory(category, Number(page));
    }

    @Get('articles/latest')
    findLatest(
    ): Promise<Article[]> {
        return this.feedService.findLatestTenArticles();
    }
    @Get('articles/all')
    getAll(
    ): Promise<Article[]> {
        return this.feedService.findAllArticles();
    }




    @Get(':id')
     findOneArticle(
        @Param('id') id: string ,
    ): Promise<any> {
        return  this.feedService.findOneArticle(id)
    }


    @Get('image/:imagename')
    findImage(
        @Param('imagename') imagename: string, 
        @Res() res
    ): Promise<Object> {
        return res.sendFile(join(process.cwd(), 'uploads/news-images/' + imagename));
    }

    @Post()
    @UseGuards(AtGuard)
    @UseInterceptors(FileInterceptor('file', storage))
    createPost(
        @GetCurrentUser('sub') userId: string,
        @Body() dto: CreateArticleDTO,
        @UploadedFile() file: Express.Multer.File
    ): Promise <Article>{
        if(userId){
            return this.feedService.createArticle(userId, dto, file)
        } else {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
        }
       
    }


    @Patch('edit-article/:id')
    @UseGuards(AtGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('file', storage))
    async update(
        @GetCurrentUser('sub') userId: string,
        @GetCurrentUser('roles') roles: string,
        @Param('id') id: string,

        @UploadedFile() file: Express.Multer.File,
        @Body('title') title: string,
        @Body('description') description: string,
        @Body('category') category: ArticleCategory,
    ): Promise<Object> {
        const isCreator = await this.feedService.isCreator(id, userId)
        // console.log(isCreator)
        // if(roles == 'admin' || isCreator){
            return this.feedService.updateArticle(id, file, category, title, description)
        // } else {
        //     throw new HttpException('You are not ADMIN or the AUTHOR of this article', HttpStatus.FORBIDDEN)
        // }
    }

    @UseGuards(AtGuard)
    // @Roles(Role.ADMIN)
    @Delete(':id')
    async deleteOne(
        @GetCurrentUser('sub') userId: string,
        @GetCurrentUser('roles') roles: string,
        @Param('id') articleId: string,
    ): Promise<any> {
        const isCreator = await this.feedService.isCreator(articleId, userId)

        if(roles == 'admin' || isCreator){
            return this.feedService.deleteArticle(articleId)
        } else {
            throw new HttpException('You are not the author', HttpStatus.FORBIDDEN)
        }
    }

}
