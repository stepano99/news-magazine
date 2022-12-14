import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../types/user';

@Injectable()
export class UserIsUserGuard implements CanActivate {

    constructor(private authService: AuthService){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const user: User = request.user;

    const permission = async ():Promise<boolean> => {
      let promise = new Promise<boolean>((resolve, reject) => {
          this.authService.findOne(user.id).then((user: User) => {
              let hasPermission = false;

              if(user.id === params.id) {
                  hasPermission = true;
              }
              return  hasPermission;
          })
      })
      return promise
    }

    return permission()

  }
}

