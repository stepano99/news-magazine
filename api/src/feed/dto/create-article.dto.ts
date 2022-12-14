import {
    Length,
    IsNotEmpty,
    IsString,
    IsUrl,
    MinLength,
  } from 'class-validator';
import { ArticleCategory } from '../types/article-category.enum';

export class CreateArticleDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    description: string;



    @IsString()
    @IsNotEmpty()
    category: ArticleCategory[];
}


