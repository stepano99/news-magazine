import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'express';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic)  return true;
    const request = context.switchToHttp().getRequest();

    
    return super.canActivate(context);

  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any){
    console.log(user)
    return user;
  }
}