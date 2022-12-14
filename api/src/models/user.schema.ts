import { Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Role } from 'src/auth/types/roles.enum';
import {ArticleSchema} from "./article.schema";
export const UserSchema = new mongoose.Schema({
    email: String,
    hash: {
        type: String,
        select: false
    },
    hashedRt: {
        type: String,
        select: false
    },
    // articles: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     // ref: 'Article',
    //     ref: ArticleSchema,
    // //
    // }],
    profileImage: String,
    roles: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})
