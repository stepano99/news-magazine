import {Document} from 'mongoose';
import { User } from 'src/auth/types/user';
import { ArticleCategory } from './article-category.enum';

export interface Article extends Document {
    title: string;
    description: string;
    image: string;
    // author:  User;
    author:  string;
    type: ArticleCategory[];
    views: number;
    createdAt: Date;
    updatedAt: Date;
}