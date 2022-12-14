import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
// import { Strategy } from 'passport-local';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {Request} from 'express'
import { JwtPayload } from 'src/auth/types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'rt-secret',
        passReqToCallback: true
    });
  }

  async validate(req: Request, payload: JwtPayload){
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();
    if(!refreshToken) throw new ForbiddenException('refresh token malformed')

    return { 
        ...payload,
        refreshToken
    }
  }
}