import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { User, User as UserDocument } from './types/user';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from 'src/auth/types/tokens.type';
import { GetCurrentUser, GetCurrentUserId } from 'src/auth/decorators';
import { AtGuard, RtGuard } from './guards';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { FileInterceptor } from '@nestjs/platform-express';


export const storage = {
    storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file', storage))
    signUp(
        @Body() dto: RegisterDto,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Tokens>{
        return this.authService.register(dto, file)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    signIn(
        @Body() dto: LoginDto
    ): Promise<Tokens>{
        return this.authService.login(dto)
    }


    @UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout( 
        @GetCurrentUserId() userId: string,
    ): Promise<boolean>{
        console.log(userId)
        return this.authService.logout(userId)
    }

    @Post('refresh')
    @UseGuards(RtGuard)
    @HttpCode(HttpStatus.OK)
    refreshTokens(
        @GetCurrentUser('refreshToken') refreshToken: string,
        @GetCurrentUser('sub') userId: string,
    ){
        return this.authService.refreshTokens(userId, refreshToken)
    }


    // @Roles(Role.ADMIN)
    @UseGuards(AtGuard)
    @Delete('user-info/:id')
    deleteUser(
        @Param('id') id: string, 
        @Body() user: User
    ): Promise<any> {
        return this.authService.deleteUser(id);
    }

    // @Roles(Role.ADMIN)
    // @UseGuards(AtGuard, RolesGuard)
    // @Put('user-info/:id/role')
    // updateRoleOfUser(
    //     @Param('id') id: string, 
    //     @Body() user: User
    // ): Promise<any> {
    //     return this.authService.updateUser(id, user);
    // }

    @UseGuards(AtGuard)
    @UseInterceptors(FileInterceptor('file', storage))
    @Patch('user-details')
    updateOne(
        @GetCurrentUserId() userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() email: string
    ): Promise<any> {
        if(!file){
            throw new HttpException('PLease upload an image!', HttpStatus.BAD_REQUEST)
        }
        if(userId === undefined){
            throw new HttpException('Here is no user', HttpStatus.BAD_REQUEST)
        }

        return this.authService.updateUser(userId, file);
    }
        
    @UseGuards(AtGuard)
    @Get('user-details')
    findUser(
        @GetCurrentUserId() userId: string,
    ): Promise<Object>{
        if(!userId){
            throw new HttpException('Here is no user', HttpStatus.BAD_REQUEST)
        }
        return this.authService.findOne(userId)
    }
    @Get('all-users')
    findAllUsers(
    ): Promise<Object[]>{
        return this.authService.findAllUsers()
    }
    @Get('all-users-week')
    findAllUsersWeekAgo(
    ): Promise<number>{
        return this.authService.findAllUsersWeekAgo()
    }

    @Get('user-details/image/:imagename')
    findImage(
        @Param('imagename') imagename: string, 
        @Res() res
    ): Promise<Object> {
        return res.sendFile(join(process.cwd(), 'uploads/profile-images/' + imagename));
    }
    @Get('user-details/profile-image/:id')
    findImageByUserId(
        // @GetCurrentUserId() userId: string,
        @Param('id') userId: string,
        @Res() res
    ): Promise<Object> {
        const imagename = this.authService.findImageByUserId(userId)
        return res.sendFile(join(process.cwd(), 'uploads/profile-images/' + imagename));
    }


}

