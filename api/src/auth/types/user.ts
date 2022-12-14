import {Document} from 'mongoose';
import { Role } from './roles.enum';

export interface User extends Document {
    email: string;
    hash: string;
    profileImage: string;
    hashedRt: string;
    roles: Role[];
    // articles: [],
    createdAt: Date;
}