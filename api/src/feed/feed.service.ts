import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArticleDTO } from './dto/create-article.dto';
import { Article } from './types/article';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ArticleCategory } from './types/article-category.enum';

@Injectable()
export class FeedService {

    constructor(
        @InjectModel('Article')
        private articleModel: Model<Article>,        
    ){}

    async createArticle(
        userId: string,
        dto: CreateArticleDTO,
        file: Express.Multer.File
    ): Promise<Article> {
        const {title, description, category} = dto

        const article = {
            author: userId,
            title: title,
            description: description,
            category: category,
            image: file.filename,
            views: 0
        }   
        const newArticle = new this.articleModel(article)
        return await newArticle.save()
    }

    async paginateByUser(
        userId: string,
        // toSkip: number,
        // maxLimit: number 
    ): Promise<Article[]>{
        const results = await this.articleModel
            .find({author: userId})
            .sort({createdAt: -1})
            .skip(0)
            .populate('author')
        return results
    }

    async findArticlesByCategory(
        category: ArticleCategory[],
        page: number
    ): Promise<Article[]> {
        let toSkip = (page - 1) * 10
        return await this.articleModel
            .find({category: category})
            .sort({ createdAt: -1 })
            .limit(10)
            .skip(toSkip)
            .populate('author', ['email', 'roles', 'profileImage'])
            // .populate('author', 'roles')
            // .populate({
            //     path: 'author',
            //     populate: { path: 'email'}
            // })
                
    }

    async findLatestTenArticles(): Promise<Article[]>{
        return await this.articleModel
            .find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('author', ['email', 'roles', 'profileImage'])

    }
    async findAllArticles(): Promise<Article[]>{
        const articles = await this.articleModel
            .find()
            .sort({ createdAt: -1 })
            .populate('author', ['email', 'roles', 'profileImage'])

        return articles

    }
    async findAllArticlesAdmin(): Promise<Article[]>{
        const articles = await this.articleModel
            .find()
            .sort({ createdAt: -1 })
            // .populate('author')

        return articles

    }

    async findOneArticle(id: string): Promise<Article> {
        
        const article = await this.articleModel
            .findById(id)
            .populate('author', ['email', 'roles', 'profileImage'])


        const  { views } = article

        const incremented = views + 1
        // console.log(incremented)
        await this.articleModel.findByIdAndUpdate(id, { views: incremented })
        
        return article
    }


    async updateArticle(
        articleId: string,
        file: Express.Multer.File,
        category: ArticleCategory,
        // category: string,
        title: string,
        description: string,
    ): Promise<Object> {

        const existingArticle = await this.articleModel.findById(articleId);
        console.log(existingArticle)
        existingArticle.image = file?.filename ?? existingArticle.image
        // existingArticle.category = category ?? existingArticle.category
        existingArticle.title = title ?? existingArticle.title
        existingArticle.description = description ?? existingArticle.description

        return existingArticle.save()
    }

    async deleteArticle(articleId: string): Promise<Article>{
        return await this.articleModel.findByIdAndDelete(articleId)
    }
    
    
    async findOne(articleId: string): Promise<Article>{
        return await this.articleModel.findById(articleId);
    }

    async isCreator(articleId: string, userId: string): Promise<boolean>{
        const post = await this.articleModel.findById(articleId);
        // console.log(post)
        const {author} = post
        // console.log('isCreator: ', author)
        return  author == userId
    }
}
