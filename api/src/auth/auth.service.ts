import {ForbiddenException, forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { Model } from 'mongoose';
// import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/types/user';
import { RegisterDto, LoginDto } from './dto';
import { Tokens } from 'src/auth/types';
import { Role } from './types/roles.enum';
import {Article} from "../feed/types/article";
import {FeedService} from "../feed/feed.service";


@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        @Inject(forwardRef(() => FeedService))
        private feedService: FeedService,
        @InjectModel('User')
        private userModel: Model<User>,

    ){}

    async register(
        dto: RegisterDto,
        file: Express.Multer.File
    ): Promise<Tokens>{
        let {email, password, roles} = dto

        const user = await this.userModel.findOne({ email })
        if(user){
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
        } 

        const hash = await this.hashData(password)


        let profileImage = '';

        if(file){
            profileImage = file.filename;
        }
        
        const userHash = {
            email,
            roles,
            hash,
            profileImage,
        }

        const newUser = new this.userModel(userHash)
        await newUser.save()

       const tokens = await this.getTokens(newUser.id,  newUser.roles, newUser.email); 
       await this.updateRtHashDB(newUser.id, tokens.refresh_token)
       return tokens;
    }
    
    async login(dto: LoginDto): Promise<Tokens> {
        const {email, password} = dto

        const user = await this.userModel
            .findOne({ email })
            .select('email hash roles')
        if(!user){
            throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED)
        }
        
        const passwordMatches = bcrypt.compare(password, user.hash)

        if(!passwordMatches) throw new ForbiddenException('No valid Credentials')

        const tokens = await this.getTokens(user.id, user.roles,  user.email,)
        await this.updateRtHashDB(user.id, tokens.refresh_token)
        
        return tokens
    }

    async logout(userId: string): Promise<boolean>{
        await this.userModel.findByIdAndUpdate(
            userId,
            // { hashedRt: '' }
            {hashedRt: null}
        ).exec()
        return true
    }

    async updateUser(
        userId: string, 
        file: Express.Multer.File
    ): Promise<Object>{
        // console.log(file.filename)
        // console.log('user', userId)

        let newProfileImage = '';

        let existingUser = await this.userModel.findById(userId)

        console.log(existingUser)

        newProfileImage = file.filename

        existingUser.profileImage = newProfileImage ?? existingUser.profileImage
       
        // const updated = await this.userModel.findByIdAndUpdate(
        //     userId,
        //     { profileImage: file.filename }
        // )
        // return updated
        return existingUser.save()
    }
    async findImageByUserId(userId: string){
        let existingUser = await this.userModel.findById(userId)
        const imageName = existingUser.profileImage;
        return imageName

    }



    async deleteUser(userId: string): Promise<User>{
        
        const deleted = await this.userModel.findByIdAndDelete(userId)
        
        return deleted
    }



    async refreshTokens(userId, rt): Promise<Tokens> {
        const user = await this.userModel.findById(userId)
        
        if( !user || !user.hashedRt) throw new ForbiddenException('Access denied')

        const rtMatches = await bcrypt.compare(user.hashedRt, rt)
        if(!rtMatches) throw new ForbiddenException('Access denied')

        const tokens = await this.getTokens(user.id, user.roles, user.email, )
        await this.updateRtHashDB(user.id, tokens.refresh_token)

        return tokens
    }

    async getTokens(
        userId: string, 
        roles: Role[],
        email: string,
    ) {
        const [at, rt] = await Promise.all([
            this.jwt.signAsync(
                {
                    sub: userId,
                    email,
                    roles
                },
                {
                    secret: 'at-secret',
                    expiresIn: 60*60,
                },
            ),
            this.jwt.signAsync(
                {
                sub: userId,
                email,
                roles
                },
                {
                    secret: 'rt-secret',
                    expiresIn: 60*60*24*7,
                },
            ),
        ])

        return {
            access_token: at,
            refresh_token: rt,
        }
    }

    async updateRtHashDB(userId: string, rt: string){
        const hashedRt = await this.hashData(rt);

        await this.userModel.findOneAndUpdate(
            {
                id: userId
            },
             {
                hashedRt,
            },
        )
    }

    hashData(password: string) {
        return bcrypt.hash(password, 10)
    }

    async findOneByEmail(email: string): Promise<User>{
        return this.userModel.findOne({email})
    }

    async findOne(userId: string):Promise<Object>{
        const user = await this.userModel.findById(userId);
        console.log('user', user);
        return user
    }
    async findAllUsers(): Promise<Object[]>{
        const users = await this.userModel
            .find({})
            // .populate("articles")
            .sort({ createdAt: -1 })

    // // console.log(users)
    //    const newUsers = users.map(u => ({...u, articlesNumber: 0}))
    //     // console.log(newUsers[0])
    //     //
    //
    //     const articles = await this.feedService.findAllArticlesAdmin()
    // // console.log(articles[0])
    //
    //     for(let i = 0; i < newUsers.length - 1; i++){
    //         for(let k = 0; k < articles.length - 1; k++){
    //             // console.log(articles[i].author.valueOf())
    //             // console.log(newUsers[i]['_doc']._id.valueOf())
    //             if(articles[k].author.valueOf() === newUsers[i]['_doc']._id.valueOf()){
    //                 newUsers[i]['articlesNumber'] += 1
    //                 // console.log(articles[0])
    //             }
    //         }
    //     }
    // console.log(newUsers)

        return users
    }
    async findAllUsersWeekAgo(): Promise<number> {
        const users = await this.userModel
            .find({timestamp: {
                $gte: new Date(Date.now() - 7*60*60*24*1000)
            }})
            // .populate("articles")
            .sort({createdAt: -1})

        return users.length
    }
    

}
//     .aggregate([{
//         $project: {
//             item: 1,
//             numberOfPosts: {
//                 $cond : {
//                     if: {
//                         $isArray: "$articles"
//                     },
//                     then: { $size: "$articles"}
//                     }
//                     , else: 0
//             }
//         }
//     }]
//
// )
// console.log(users)