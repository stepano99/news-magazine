// import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from 'src/auth/types';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){
  constructor(
  ) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: 'at-secret',
    });
  }

  async validate(payload: JwtPayload){
    // console.log("test", payload)
    return payload;
  }
}