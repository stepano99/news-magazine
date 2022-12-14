import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, JwtPayloadWithRt } from '../types';

export const GetCurrentUser = createParamDecorator((
    data: keyof JwtPayloadWithRt | undefined, 
    context: ExecutionContext
    ) => {
    const request = context.switchToHttp().getRequest();
    // if(!data) return request.user
    // return request.user[data]
  
    const user = request.user;
    console.log(user.sub);
  
    return data ? user?.[data] : user;
  },
);